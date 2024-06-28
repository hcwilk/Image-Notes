import { createSignal, createEffect } from 'solid-js';

function SearchAndPaste() {
    const [imageUrl, setImageUrl] = createSignal('');
    const [result, setResult] = createSignal('');

    const askLlava = async (base64Image:any) => {
        const base64Data = base64Image.replace(/^data:image\/[a-z]+;base64,/, '');

        console.log('Asking Llava...');
        const response = await fetch('http://localhost:11434/api/generate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "model": "llava",
                "prompt": "What's in this image?",
                "images": [base64Data],  
                "stream": false
            }),
        });

        if (!response.ok) {
            console.error('API call failed:', await response.text());
            return;
        }

        const data = await response.json(); 
        console.log('Response:', data);
        setResult(data); 
    }

    const handlePaste = (event:any) => {
        event.preventDefault();
        const items = event.clipboardData?.items;
        for (const item of items) {
            if (item.type.startsWith("image")) {
                const blob = item.getAsFile();
                const reader = new FileReader();
                reader.onload = (e:any) => {
                    setImageUrl(e.target.result); 
                    askLlava(e.target.result);    
                };
                reader.readAsDataURL(blob);
            }
        }
    };

    createEffect(() => {
        if (imageUrl()) {
            console.log('Image URL:', imageUrl());
        }
        if (result()) {
            console.log('API Result:', result());
        }
    });

    return (
        <div>
            <div
                onPaste={handlePaste}
                contentEditable={true}
                style={{ border: '1px solid black', height: '200px', cursor: 'text' }}
            >
                {imageUrl() && <img src={imageUrl()} alt="Pasted" />}
            </div>
            {result() && <div>Response: {JSON.stringify(result())}</div>} 
        </div>
    );
}

export default SearchAndPaste;

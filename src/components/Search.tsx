import { createSignal, createEffect } from 'solid-js';

type APIResponse = any
function SearchAndPaste() {
    const [imageUrl, setImageUrl] = createSignal('');
    const [result, setResult] = createSignal<APIResponse>([]);

    const askLlava = async (base64Image: any) => {
        const base64Data = base64Image.replace(/^data:image\/[a-z]+;base64,/, '');
        console.log('Asking Llava...');
        const response: any = await fetch('http://localhost:11434/api/generate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "model": "llava:34b",
                "prompt": "What's in this image?",
                "images": [base64Data],  
                "stream": true
            }),
        });

        if (!response.ok) {
            console.error('API call failed:', await response.text());
            return;
        }

        const reader = response.body.getReader();
        let completeJSON = '';

        while(true) {
            const {done, value} = await reader.read();
            if (done) {
                console.log('Response fully received');
                break;
            }

            let chunkText = new TextDecoder("utf-8").decode(value);

            try {
                let jsonChunk = JSON.parse(chunkText);
                setResult(prev => [...prev, jsonChunk]);  
            } catch (error) {
                console.error('Error parsing JSON from chunk', error);
                completeJSON += chunkText;
            }

        }
    };


    const handlePaste = (event:any) => {
        setResult([]);
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

    return (
        <div>
            <div
                onPaste={handlePaste}
                contentEditable={true}
                style={{ border: '1px solid black', height: 'auto', "min-height": '100px', cursor: 'text' }}
            >
                {imageUrl() && <img src={imageUrl()} alt="Pasted" />}
            </div>
            {result() && <div>{
                result().map((item:any, index:number) => (
                    <span>
                        {item.response}
                    </span>
                ))
}
            </div>} 
        </div>
    );
}

export default SearchAndPaste;

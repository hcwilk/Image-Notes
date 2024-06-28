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

    createEffect(() => {
        console.log('IMAGE URL:', imageUrl())
    }  );

    return (
        <div class='h-fit min-h-[100px] min-w-[25%] max-w-[50%] flex flex-col items-center'>
            <div
                onPaste={handlePaste}
                contentEditable={true}
                class='w-fit min-w-[25%] h-fit min-h-24 mt-8 border-2 border-dashed flex justify-center'
            >
                {imageUrl() && <img src={imageUrl()} alt="Pasted" />}
            </div>
            {result() && <div class='text-start w-fit'>{
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

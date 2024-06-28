import { createSignal, createEffect } from 'solid-js';

function SearchAndPaste() {
    const [imageUrl, setImageUrl] = createSignal('');


    const handlePaste = (event:any) => {
        event.preventDefault();
        const items = event.clipboardData?.items;
        for (const item of items) {
            if (item.type.startsWith("image")) {
                const blob = item.getAsFile();
                const reader = new FileReader();
                reader.onload = (e:any) => setImageUrl(e.target.result);
                reader.readAsDataURL(blob);
            }
        }
    };


    createEffect(() => {
        console.log('Image URL:', imageUrl());
    }
    );


    return (
        <div>
            <div
                onPaste={handlePaste}
                contentEditable={true}
                style={{ border: '1px solid black', height: '200px', cursor: 'text' }}
            >
                {imageUrl() && <img src={imageUrl()} alt="Pasted" />}
            </div>
        </div>
    );
}

export default SearchAndPaste;

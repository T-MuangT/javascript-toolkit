export class Base64Tool {
    static bind(encId, decId, inId, outId, logger = () => {}) {
        document.getElementById(encId).addEventListener('click', () => {
            const result = this.encode(document.getElementById(inId).value);
            const outputEl = document.getElementById(outId);
            outputEl.textContent = result.data;
            outputEl.style.color = result.success ? '#fff' : '#f44747';
            logger(
                result.success ? `Encoded: ${result.data}` : `Encode Error: ${result.data}`,
                result.success ? 'INFO' : 'ERROR'
            );
        });

        document.getElementById(decId).addEventListener('click', () => {
            const result = this.decode(document.getElementById(inId).value);
            const outputEl = document.getElementById(outId);
            outputEl.textContent = result.data;
            outputEl.style.color = result.success ? '#fff' : '#f44747';
            logger(
                result.success ? `Decoded: ${result.data}` : `Decode Error: ${result.data}`,
                result.success ? 'INFO' : 'ERROR'
            );
        });
    }

    static encode(input) {
        try {
            const bytes = new TextEncoder().encode(input);
            let binary = '';
            bytes.forEach(byte => binary += String.fromCodePoint(byte));
            return { success: true, data: btoa(binary) };
        } catch (e) {
            return { success: false, data: e.message };
        }
    }

    static decode(input) {
        try {
            const bytes = Uint8Array.from(atob(input), c => c.codePointAt(0));
            return { success: true, data: new TextDecoder().decode(bytes) };
        } catch (e) {
            return { success: false, data: e.message };
        }
    }
} // base64-tool.js
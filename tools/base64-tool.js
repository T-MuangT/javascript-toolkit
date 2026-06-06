export class Base64Tool {
    static bind(encId, decId, inId, outId, logger = console.log) {
        document.getElementById(encId).addEventListener('click', () => {
            const input = document.getElementById(inId).value;
            const result = this.encode(input);
            document.getElementById(outId).textContent = result.data;
            logger(`Base64 encoded: ${result.data}`, 'INFO');
        });
        document.getElementById(decId).addEventListener('click', () => {
            const input = document.getElementById(inId).value;
            const result = this.decode(input);
            document.getElementById(outId).textContent = result.data;
            logger(`Base64 decoded: ${result.data}`, 'INFO');
        });
    }

    static encode(input) {
        try {
            const bytes = new TextEncoder().encode(input);
            let binary = '';
            bytes.forEach(byte => {
                binary += String.fromCodePoint(byte);
            });
            return {
                success: true,
                data: btoa(binary)
            };
        } catch (e) {
            console.error("Base64 Encode Error:", e.message);
            return {
                success: false,
                data: "Error: " + e.message
            };
        }
    }

    static decode(input) {
        try {
            const binary = atob(input);
            const bytes = Uint8Array.from(
                binary,
                char => char.codePointAt(0)
            );
            return {
                success: true,
                data: new TextDecoder().decode(bytes)
            };
        } catch (e) {
            console.error("Base64 Decode Error:", e.message);
            return {
                success: false,
                data: "Error: " + e.message
            };
        }
    }
} // base64-tool.js
export class JsonTool {
    static bind(btnId, inId, outId, logger = () => {}) {
        document.getElementById(btnId).addEventListener('click', () => {
            const input = document.getElementById(inId).value;
            const result = this.format(input);
            const outputEl = document.getElementById(outId);
            outputEl.textContent = result.data;
            outputEl.style.color = result.success ? '#fff' : '#f44747';
            logger(
                result.success ? 'JSON formatted successfully' : `JSON Error: ${result.data}`,
                result.success ? 'INFO' : 'ERROR'
            );
        });
    }

    static format(input) {
        try {
            return { success: true, data: JSON.stringify(JSON.parse(input), null, 2) };
        } catch (e) {
            return { success: false, data: e.message };
        }
    }
} // json-tool.js
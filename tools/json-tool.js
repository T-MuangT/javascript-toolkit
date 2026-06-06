export class JsonTool {
    static bind(btnId, inId, outId, logger = console.log) {
        document.getElementById(btnId).addEventListener('click', () => {
            const input = document.getElementById(inId).value;
            try {
                const formatted = JSON.stringify(JSON.parse(input), null, 2);
                document.getElementById(outId).textContent = formatted;
                logger(`JSON successfully formatted.`, 'INFO');
            }
            catch (e) {
                logger(`JSON Error: ${e.message}`, 'ERROR');
            }
        });
    }

    static handleFormat(inputId, outputId) {
        const input = document.getElementById(inputId).value;
        const outputEl = document.getElementById(outputId);
        const result = this.format(input);

        outputEl.textContent = result.data;
        outputEl.style.color = result.success ? "#fff" : "#ff5555";
        
        console.log("JSON Formatted via Toolkit");
    }
} // json-tool.js
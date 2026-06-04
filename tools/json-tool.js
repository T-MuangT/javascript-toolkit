export class JsonTool {
    static format(input) {
        try {
            const parsed = JSON.parse(input);
            return { 
                success: true, data: JSON.stringify(parsed, null, 4) 
            };
        } catch (e) {
            console.error("JSON Parse Error:", e.message);
            return { 
                success: false, data: "Error: " + e.message 
            };
        }
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
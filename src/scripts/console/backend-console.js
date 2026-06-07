import { BaseConsole } from './base-console.js';

export class BackendConsole extends BaseConsole {
    constructor(containerId, inputId, apiUrl = '/api/execute') {
        super(containerId, inputId, 'Backend');
        this.apiUrl = apiUrl;
    }

    async execute(code) {
        this.displayCommand(code);
        try {
            const res = await fetch(this.apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ code }),
            });
            const { stdout, stderr } = await res.json();
            if (stdout) this.log(stdout, 'LOG');
            if (stderr) this.log(stderr, 'ERROR');
        } catch (err) {
            this.log(`Backend unreachable: ${err.message}`, 'ERROR');
        }
    }
} // backend-console.js
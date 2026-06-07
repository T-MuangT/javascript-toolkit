import { BaseConsole } from './base-console.js';

export class FrontendConsole extends BaseConsole {
    constructor(containerId, inputId) {
        super(containerId, inputId, 'Frontend');
        this._patchConsoleGlobally();
    }

    _patchConsoleGlobally() {
        ['log', 'warn', 'error', 'info', 'debug'].forEach(method => {
            const original = console[method].bind(console);
            console[method] = (...args) => {
                original(...args);
                this.log(
                    args.map(a => typeof a === 'object' ? JSON.stringify(a, null, 2) : String(a)).join(' '),
                    method.toUpperCase()
                );
            };
        });
    }

    execute(code) {
        this.displayCommand(code);
        try {
            const result = (0, eval)(code);
            if (result !== undefined) this.log(String(result), 'RETURN');
        } catch (err) {
            this.log(err.message, 'ERROR');
        }
    }
}
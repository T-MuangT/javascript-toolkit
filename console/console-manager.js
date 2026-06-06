import { FrontendConsole } from './frontend-console.js';
import { BackendConsole } from './backend-console.js';
import { SerialConsole } from './serial-console.js';

const TERMINAL_TYPES = {
    frontend: FrontendConsole,
    backend: BackendConsole,
    serial: SerialConsole,
};

const PROTECTED_TERMINALS = new Set(['frontend', 'serial-1']);

export class ConsoleManager {
    constructor(container) {
        this.container = container;
        this.terminals = new Map();
        this.terminalCount = 0;
    }

    createTerminal(name, type = 'frontend') {
        const TerminalClass = TERMINAL_TYPES[type];
        if (!TerminalClass) throw new Error(`Unknown terminal type: "${type}"`);

        const id = `term-${++this.terminalCount}`;
        const wrapper = document.createElement('div');
        wrapper.className = 'terminal-wrapper';
        wrapper.dataset.name = name;
        wrapper.innerHTML = `
            <div id="log-${id}" class="console"></div>
            <input type="text" id="in-${id}" class="input" placeholder="Enter command...">
        `;
        this.container.appendChild(wrapper);

        const terminal = new TerminalClass(`log-${id}`, `in-${id}`);
        this.terminals.set(name, terminal);
        return name;
    }

    route(terminalName, message, type = 'LOG') {
        const terminal = this.terminals.get(terminalName);
        if (terminal) terminal.log(message, type);
        else console.warn(`Terminal "${terminalName}" not found.`);
    }

    removeTerminal(name) {
        if (PROTECTED_TERMINALS.has(name)) {
            console.warn(`Terminal "${name}" is protected and cannot be removed.`);
            return;
        }
        if (!this.terminals.has(name)) return;
        this.terminals.delete(name);
        document.querySelector(`[data-name="${name}"]`)?.remove();
    }
} // console-manager.js
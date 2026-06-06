export class BaseConsole {
    constructor(containerId, inputId, role) {
        this.container = document.getElementById(containerId);
        this.input = document.getElementById(inputId);
        this.role = role;
        this.displayHeader();
        this.setupInputListener();
    }

    displayHeader() {
        const header = document.createElement('div');
        header.textContent = `--- Session: ${this.role.toUpperCase()} ---`;
        header.style.color = '#007acc';
        header.style.fontWeight = 'bold';
        this.container.appendChild(header);
    }

    setupInputListener() {
        this.input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                const code = this.input.value.trim();
                if (!code) return;
                this.execute(code);
                this.input.value = '';
            }
        });
    }

    execute(code) {
        throw new Error(`${this.constructor.name} must implement execute()`);
    }

    displayCommand(code) {
        const div = document.createElement('div');
        div.textContent = `> ${code}`;
        div.style.color = '#888';
        div.style.fontWeight = 'bold';
        this.container.appendChild(div);
        this.container.scrollTop = this.container.scrollHeight;
    }

    log(message, type = 'LOG') {
        const div = document.createElement('div');
        div.className = `log-entry ${type.toLowerCase()}`;
        div.textContent = `[${type}] ${message}`;
        this.container.appendChild(div);
        this.container.scrollTop = this.container.scrollHeight;
    }
} // base-console.js
export class WebConsole {
    constructor(containerId, inputId) {
        this.container = document.getElementById(containerId);
        this.input = document.getElementById(inputId);
        this.hookConsole();
        this.setupInputListener();
    }

    setupInputListener() {
        this.input.addEventListener(
            'keydown', (e) => {
                if (e.key === 'Enter') {
                    const code = this.input.value;
                    this.execute(code);
                    this.input.value = '';
                }
            }
        );
    }

    hookConsole() {
        const methods = ['log', 'error', 'warn'];
        methods.forEach(
            method => {
                const original = console[method];
                console[method] = (...args) => {
                    this.log(`[${method.toUpperCase()}] ${args.join(' ')}`);
                    original.apply(console, args);
                };
            }
        );
    }

    execute(code) {
        this.displayCommand(code);
        try {
            new Function(code)();
        } catch (err) {
            console.error(err.message);
        }
    }

    displayCommand(code) {
        const div = document.createElement('div');
        div.textContent = `> ${code}`;
        div.style.color = '#888';
        div.style.fontWeight = 'bold';
        this.container.appendChild(div);
    }

    log(message) {
        const div = document.createElement('div');
        div.textContent = message;
        this.container.appendChild(div);
        this.container.scrollTop = this.container.scrollHeight;
    }
} // web-console.js
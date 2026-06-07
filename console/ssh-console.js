import { BaseConsole } from './base-console.js';

export class SSHConsole extends BaseConsole {
    constructor(containerId, inputId, wsUrl = 'ws://localhost:8080/ssh') {
        super(containerId, inputId, 'SSH');
        this.wsUrl = wsUrl;
        this.ws = null;
        this._setupConnectForm();
    }

    _setupConnectForm() {
        const form = document.createElement('div');
        form.className = 'ssh-connect-form';
        form.innerHTML = `
            <input class="ssh-field" id="ssh-host" placeholder="Host" />
            <input class="ssh-field" id="ssh-port" placeholder="Port" value="22" />
            <input class="ssh-field" id="ssh-user" placeholder="Username" />
            <input class="ssh-field" id="ssh-pass" placeholder="Password" type="password" />
            <button class="ssh-connect-btn">Connect</button>
            <button class="ssh-disconnect-btn">Disconnect</button>
        `;

        form.querySelector('.ssh-connect-btn')
            .addEventListener('click', () => this._connect(form));
        form.querySelector('.ssh-disconnect-btn')
            .addEventListener('click', () => this._disconnect());

        // Insert form above the command input
        this.input.insertAdjacentElement('beforebegin', form);
    }

    _connect(form) {
        if (this.ws) {
            this.log('Already connected — disconnect first', 'WARN');
            return;
        }

        const host = form.querySelector('#ssh-host').value.trim();
        const port = form.querySelector('#ssh-port').value.trim() || '22';
        const user = form.querySelector('#ssh-user').value.trim();
        const pass = form.querySelector('#ssh-pass').value;

        if (!host || !user || !pass) {
            this.log('Host, username and password are required', 'ERROR');
            return;
        }

        this.ws = new WebSocket(this.wsUrl);

        this.ws.onopen = () => {
            // Send credentials to relay — relay opens SSH session
            this.ws.send(JSON.stringify({ type: 'connect', host, port, user, pass }));
            this.log(`Connecting to ${user}@${host}:${port}...`, 'INFO');
        };

        this.ws.onmessage = ({ data }) => {
            const { type, value } = JSON.parse(data);
            if (type === 'data')   this._printRaw(value);
            if (type === 'error')  this.log(value, 'ERROR');
            if (type === 'closed') this.log('Session closed by remote', 'WARN');
        };

        this.ws.onclose = () => {
            this.log('WebSocket closed', 'WARN');
            this.ws = null;
        };

        this.ws.onerror = () => {
            this.log('WebSocket error — is the relay running?', 'ERROR');
        };
    }

    _disconnect() {
        if (!this.ws) { this.log('Not connected', 'WARN'); return; }
        this.ws.send(JSON.stringify({ type: 'disconnect' }));
        this.ws.close();
        this.ws = null;
        this.log('Disconnected', 'INFO');
    }

    // SSH output is raw terminal text — strip ANSI escape codes for clean display
    _printRaw(text) {
        const clean = text.replace(/\x1b\[[0-9;]*[a-zA-Z]/g, '');
        if (clean.trim()) this.log(clean, 'LOG');
    }

    execute(code) {
        if (this.ws?.readyState !== WebSocket.OPEN) {
            this.log('Not connected', 'ERROR');
            return;
        }
        this.displayCommand(code);
        this.ws.send(JSON.stringify({ type: 'data', value: code + '\n' }));
    }
} // ssh-console.js
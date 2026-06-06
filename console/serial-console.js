// serial-console.js
import { BaseConsole } from './base-console.js';

export class SerialConsole extends BaseConsole {
    constructor(containerId, inputId) {
        super(containerId, inputId, 'Serial');
        this.port = null;
        this.writer = null;
        this._setupControls();
    }

    _setupControls() {
        // Baud rate selector — different devices need different rates
        const select = document.createElement('select');
        [9600, 19200, 38400, 57600, 115200].forEach(rate => {
            const opt = document.createElement('option');
            opt.value = rate;
            opt.textContent = `${rate} baud`;
            select.appendChild(opt);
        });
        select.value = 115200;

        const btn = document.createElement('button');
        btn.textContent = 'Connect';
        btn.addEventListener('click', () => this._connect(Number(select.value)));

        const disconnectBtn = document.createElement('button');
        disconnectBtn.textContent = 'Disconnect';
        disconnectBtn.addEventListener('click', () => this._disconnect());

        this.input.insertAdjacentElement('beforebegin', disconnectBtn);
        this.input.insertAdjacentElement('beforebegin', btn);
        this.input.insertAdjacentElement('beforebegin', select);
    }

    async _connect() {
        this.ws = new WebSocket('ws://localhost:8080');
        this.ws.onmessage = ({ data }) => {
            const { type, value } = JSON.parse(data);
            if (type === 'data') this.log(value.trim(), 'LOG');
        };
        this.ws.onopen = () => this.log('Connected via relay', 'INFO');
        this.ws.onclose = () => this.log('Relay disconnected', 'WARN');
        this.ws.onerror = (err) => this.log(`WebSocket error: ${err.message}`, 'ERROR');
    }

    async _startReading() {
        const decoder = new TextDecoderStream();
        this.port.readable.pipeTo(decoder.writable);
        this.reader = decoder.readable.getReader();

        try {
            while (true) {
                const { value, done } = await this.reader.read();
                if (done) break;
                if (value) this.log(value.trim(), 'LOG'); // Incoming device data
            }
        } catch (err) {
            this.log(`Stream closed: ${err.message}`, 'WARN');
        }
    }

    async _disconnect() {
        try {
            await this.reader?.cancel();
            await this.port?.close();
            this.port = null;
            this.writer = null;
            this.log('Disconnected', 'INFO');
        } catch (err) {
            this.log(`Disconnect error: ${err.message}`, 'ERROR');
        }
    }

    async execute(code) {
        if (!this.ws) { this.log('Not connected', 'ERROR'); return; }
        this.displayCommand(code);
        this.ws.send(JSON.stringify({ code }));
    }
}
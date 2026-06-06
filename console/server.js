import { SerialPort } from 'serialport';
import { WebSocketServer } from 'ws';

const wss = new WebSocketServer({ port: 8080 });

wss.on('connection', ws => {
    const port = new SerialPort({ path: '/dev/ttyUSB0', baudRate: 115200 });

    port.on('data', data => ws.send(JSON.stringify({
        type: 'data',
        value: data.toString()
    })));

    ws.on('message', msg => {
        const { code } = JSON.parse(msg);
        port.write(code + '\r\n');
    });

    ws.on('close', () => port.close());
}); // server.js
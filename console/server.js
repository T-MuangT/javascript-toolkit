import { WebSocketServer } from 'ws';
import { Client } from 'ssh2';

const wss = new WebSocketServer({ port: 8080 });

wss.on('connection', ws => {
    let sshClient = null;
    let shellStream = null;

    ws.on('message', raw => {
        const msg = JSON.parse(raw);

        if (msg.type === 'connect') {
            sshClient = new Client();

            sshClient.on('ready', () => {
                sshClient.shell((err, stream) => {
                    if (err) {
                        ws.send(JSON.stringify({ type: 'error', value: err.message }));
                        return;
                    }
                    shellStream = stream;

                    stream.on('data', data => {
                        ws.send(JSON.stringify({ type: 'data', value: data.toString() }));
                    });

                    stream.stderr.on('data', data => {
                        ws.send(JSON.stringify({ type: 'error', value: data.toString() }));
                    });

                    stream.on('close', () => {
                        ws.send(JSON.stringify({ type: 'closed' }));
                        sshClient.end();
                    });
                });
            });

            sshClient.on('error', err => {
                ws.send(JSON.stringify({ type: 'error', value: err.message }));
            });

            sshClient.connect({
                host: msg.host,
                port: Number(msg.port) || 22,
                username: msg.user,
                password: msg.pass,
                readyTimeout: 10000,
            });
        }

        if (msg.type === 'data' && shellStream) {
            shellStream.write(msg.value);
        }

        if (msg.type === 'disconnect') {
            shellStream?.close();
            sshClient?.end();
        }
    });

    ws.on('close', () => {
        shellStream?.close();
        sshClient?.end();
    });
});

console.log('SSH relay running on ws://localhost:8080');
// server.js
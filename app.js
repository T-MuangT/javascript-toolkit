import { ConsoleManager } from './console/console-manager.js';
import { ToolManager } from './tools/tool-manager.js';

const sshSocket = new WebSocket('ws://localhost:8080');

document.addEventListener('DOMContentLoaded', () => {
    const consoleContainer = document.getElementById('terminal-container');
    if (!consoleContainer) {
        console.error('terminal-container not found in DOM');
        return;
    }

    const manager = new ConsoleManager(consoleContainer);
    manager.createTerminal('frontend', 'frontend');
    manager.createTerminal('ssh-1', 'ssh');

    const frontendLogger = (msg, type) => manager.route('frontend', msg, type);
    const sshLogger = (msg, type) => manager.route('ssh-1', msg, type);

    new ToolManager(frontendLogger);
    setupTabs();
    setupTerminalPicker(manager);
});

function setupTerminalPicker(manager) {
    const btn = document.getElementById('add-term-btn');
    const picker = document.getElementById('terminal-type-picker'); // <select> in your HTML

    btn.addEventListener('click', () => {
        const type = picker.value;
        const name = `${type}-${Date.now()}`;
        try {
            manager.createTerminal(name, type);
        } catch (err) {
            console.error(err.message);
        }
    });
}

function setupTabs() {
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(t => {
                t.classList.remove('active');
                t.querySelectorAll('.tool-input').forEach(el => el.value = '');
                t.querySelectorAll('.tool-output').forEach(el => {
                    el.textContent = 'Result will appear here...';
                });
            });
            btn.classList.add('active');
            document.getElementById(`${btn.dataset.tab}-tab`).classList.add('active');
        });
    });
} // app.js
import { WebConsole } from './console/web-console.js';
import { JsonTool } from './tools/json-tool.js';
import { Base64Tool } from './tools/base64-tool.js';

new WebConsole('console', 'user-input');

document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {

        document
            .querySelectorAll('.tab-btn')
            .forEach(b => b.classList.remove('active'));

        document
            .querySelectorAll('.tab-content')
            .forEach(t => t.classList.remove('active'));

        btn.classList.add('active');

        document
            .getElementById(
                btn.dataset.tab + '-tab'
            )
            .classList.add('active');
    });
});

document
    .getElementById('format-btn')
    .addEventListener('click', () => {

        JsonTool.handleFormat(
            'json-input',
            'json-output'
        );
    });

document
    .getElementById('encode-btn')
    .addEventListener('click', () => {

        const input =
            document.getElementById('base64-input').value;

        const result =
            Base64Tool.encode(input);

        document.getElementById(
            'base64-output'
        ).textContent = result.data;
    });

document
    .getElementById('decode-btn')
    .addEventListener('click', () => {

        const input =
            document.getElementById('base64-input').value;

        const result =
            Base64Tool.decode(input);

        document.getElementById(
            'base64-output'
        ).textContent = result.data;
    });
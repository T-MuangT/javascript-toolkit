import { JsonTool } from './json-tool.js';
import { Base64Tool } from './base64-tool.js';

export class ToolManager {
    constructor(logger = () => {}) {
        this.logger = logger;
        this.tools = new Map();
        this._registerDefaults();
    }

    _registerDefaults() {
        this.register('json',   JsonTool,   ['format-btn', 'json-input', 'json-output']);
        this.register('base64', Base64Tool, ['encode-btn', 'decode-btn', 'base64-input', 'base64-output']);
    }

    register(name, ToolClass, bindArgs) {
        if (this.tools.has(name)) {
            console.warn(`Tool "${name}" is already registered`);
            return;
        }
        try {
            ToolClass.bind(...bindArgs, this.logger);
            this.tools.set(name, ToolClass);
        } catch (err) {
            console.error(`Failed to bind tool "${name}": ${err.message}`);
        }
    }

    has(name) {
        return this.tools.has(name);
    }
} // tool-manager.js
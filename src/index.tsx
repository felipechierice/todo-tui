import React from 'react';
import { render } from 'ink';
import { App } from './App.js';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import { DEFAULT_TEMPLATE } from './utils/template.js';

const args = process.argv.slice(2);

// Default config directory and file
const CONFIG_DIR = path.join(os.homedir(), '.config', 'todo-tui');
const DEFAULT_FILE = path.join(CONFIG_DIR, 'TODO.md');

// Get file path from args or use default
let filePath = args[0] || DEFAULT_FILE;

// Resolve to absolute path if relative
if (!path.isAbsolute(filePath)) {
  filePath = path.resolve(process.cwd(), filePath);
}

// Ensure config directory exists
function ensureConfigDir(): void {
  if (!fs.existsSync(CONFIG_DIR)) {
    fs.mkdirSync(CONFIG_DIR, { recursive: true });
    console.log(`📁 Directory created: ${CONFIG_DIR}`);
  }
}

// Create default file if it doesn't exist
function ensureDefaultFile(): void {
  if (!fs.existsSync(filePath)) {
    // Only auto-create if using the default path
    if (filePath === DEFAULT_FILE) {
      ensureConfigDir();
      fs.writeFileSync(filePath, DEFAULT_TEMPLATE, 'utf-8');
      console.log(`📄 File created: ${filePath}`);
      console.log('');
    } else {
      // Custom path specified but doesn't exist
      console.error(`❌ File not found: ${filePath}`);
      console.log('\nUsage: todo [file.md]');
      console.log('Example: todo ~/my-todo.md');
      console.log(`\nIf no file is specified, uses: ${DEFAULT_FILE}`);
      process.exit(1);
    }
  }
}

// Setup and run
ensureDefaultFile();

// Clear screen and render
console.clear();
render(<App filePath={filePath} />);

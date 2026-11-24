const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const statusScript = fs.readFileSync(path.join(root, 'server-status.vbs'), 'utf8');
const deployScript = fs.readFileSync(path.join(root, 'scripts', 'deploy.ps1'), 'utf8');

assert.ok(statusScript.includes('vbYesNoCancel'), 'The active-server dialog exposes open, restart and cancel choices');
assert.ok(statusScript.includes('restart-server.ps1'), 'The status dialog invokes the dedicated restart script');
assert.ok(statusScript.includes('PostgreSQL et les donnees ne seront pas arretes'), 'The restart confirmation explains that data services stay online');
assert.ok(fs.existsSync(path.join(root, 'restart-server.ps1')), 'The dedicated restart script exists');
assert.ok(deployScript.includes('"restart-server.ps1"'), 'The restart script is part of the deployed runtime package');

console.log('Server status shortcut: open, restart and deployment wiring passed.');

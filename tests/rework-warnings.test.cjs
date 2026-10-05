const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const context = {
  React: {createElement: () => ({})},
  ReactDOM: {createRoot: () => ({render: () => {}})},
  document: {documentElement: {style: {}}, body: {style: {}}, getElementById: () => ({})},
  localStorage: {getItem: () => null},
  Blob, TextEncoder,
};
vm.createContext(context);
vm.runInContext(fs.readFileSync(path.join(__dirname, '../src/App.runtime.js'), 'utf8') +
  ';globalThis.check=computeReworkWarnings;globalThis.pdf=buildDirectReportPdf;globalThis.canCtrl=canActionReceiveCtrl;globalThis.missingCtrl=computeMissingReworkControls;', context);

const units = [{id: 'u1', sn: 'SN1'}, {id: 'u2', sn: 'SN2'}];
const row = (id, action1, valeur = '10K', extra = {}) => ({
  id, repere: 'R96', action1, valeur, validated: true,
  createdDT: `17/09/2026 10:${String(id).padStart(2, '0')}`, ...extra,
});
const check = (rows, filter = 'all') => context.check(rows, units, filter);

assert.equal(context.canCtrl('S'), true);
assert.equal(context.canCtrl('R'), true);
assert.equal(context.canCtrl('P'), true);
assert.equal(context.canCtrl('D'), false);
assert.equal(context.canCtrl('M'), false);
assert.deepEqual(Array.from(context.missingCtrl([
  row(1, 'S'), row(2, 'R'), row(3, 'P'), row(4, 'D'), row(5, 'M'),
  row(6, 'S', '10K', {visaCtrl: 'JGR'}),
]).map(r => r.id)), [1, 2]);

assert.equal(check([row(1, 'D'), row(2, 'S')]).mismatch.length, 0);
assert.equal(check([row(1, 'D'), row(2, 'S', '20K')]).mismatch.length, 2);
assert.equal(check([row(1, 'D'), row(2, 'S', '20K', {isAdjust: true})]).mismatch.length, 0);
assert.equal(check([row(1, 'D', '10K', {isAdjust: true}), row(2, 'S', '20K')]).mismatch.length, 0);
for (const action of ['D', 'S', 'P']) {
  assert.equal(check([row(1, action), row(2, action)]).sequence.length, 2);
  assert.equal(check([row(1, action), row(2, action, '10K', {isAdjust: true})]).sequence.length, 2);
}
assert.equal(check([row(1, 'S'), row(2, 'D'), row(3, 'S'), row(4, 'D')]).sequence.length, 0);
assert.equal(check([row(1, 'S', '20K', {isAdjust: true}), row(2, 'D')]).mismatch.length, 0);
assert.equal(check([row(1, 'D'), row(2, 'S', '10 k')]).mismatch.length, 0);
assert.equal(check([row(1, 'S'), row(2, 'S', '10K', {deleted: true}), row(3, 'D')]).sequence.length, 0);
assert.equal(check([row(1, 'D'), row(2, 'D', '10K', {repere: 'R97'})]).sequence.length, 0);
assert.equal(check([row(1, 'S', '10K', {snScope: 'custom', snIds: ['u1']}),
  row(2, 'S', '10K', {snScope: 'custom', snIds: ['u2']})]).sequence.length, 0);
assert.equal(check([row(1, 'D', '10K', {snExcludeIds: ['u1', 'u2']}), row(2, 'S', '20K')]).mismatch.length, 0);
assert.equal(check([row(1, 'D', '10K', {snScope: 'custom', snIds: ['removed']}), row(2, 'S', '20K')]).mismatch.length, 0);
assert.equal(check([row(2, 'S', '20K'), row(1, 'D')], 'u1').mismatch.length, 1);
assert.equal(check([row(1, 'D'), row(2, 'M'), row(3, 'D')]).sequence.length, 2);
assert.equal(check([row(1, 'D')]).first.length, 2);
assert.equal(check([row(1, 'D', '10K', {isAdjust:true})]).first.length, 2);
assert.equal(check([row(1, 'D'), row(2, 'S')]).first.length, 0);
assert.equal(check([row(1, 'P')]).pointed.length,2);
assert.equal(check([row(1, 'P'),row(2, 'S')]).pointed.length,0);
assert.equal(check([row(1, 'P'),row(2, 'D')]).pointed.length,0);
assert.equal(check([row(1, 'P'),row(2, 'S')]).sequence.length,0);
assert.equal(check([row(1, 'P'),row(2, 'D')]).sequence.length,0);
assert.equal(check([row(1, 'S'),row(2, 'P')]).sequence.length,2);
assert.equal(check([row(1, 'P','10K'),row(2,'S','20K')]).mismatch.length,2);
assert.equal(check([row(1, 'P','10K'),row(2,'S','20K',{isAdjust:true})]).mismatch.length,0);

(async () => {
  const pdf = await context.pdf({
    ofData: {header: {of: 'TEST'}, units: {rows: units}, rework: {rows: [row(1, 'D'), row(2, 'D'),row(3,'P','10K',{repere:'R97'})]}},
    lists: {}, exportedAt: '17/09/2026', exportedBy: 'TEST', selectedSections: ['rework'],
  }).text();
  assert.ok(pdf.includes('alternance soudage / dessoudage est attendue'));
  assert.ok(pdf.includes('un soudage final est requis'));
  console.log('Rework warnings: all tests passed.');
})().catch(error => {console.error(error); process.exitCode = 1;});

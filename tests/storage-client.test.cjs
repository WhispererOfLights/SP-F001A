const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const code = fs.readFileSync(require('node:path').join(__dirname, '..', 'src', 'clients.js'), 'utf8');
const records = new Map([['of:test', {value:'{"x":1}', revision:1}]]);
function client() {
  const alerts = [];
  const local = new Map();
  const ctx = {window:{alert: text => alerts.push(text), localStorage:{setItem:(k,v)=>local.set(k,v), getItem:k=>local.get(k)??null}},
    location:{protocol:'http:'}, fetch: async (url, options={}) => {
      const key = decodeURIComponent(url.split('/').pop());
      let row = records.get(key);
      let status = row ? 200 : 404;
      if (options.method === 'PUT') {
        const expected = options.headers['If-Match'] || (options.headers['If-None-Match']==='*' ? '"0"' : null);
        status = expected === `"${row?.revision||0}"` ? 200 : 409;
        if(status===200) {row={value:options.body, revision:(row?.revision||0)+1};records.set(key,row);}
      }
      return {status, ok: status===200, headers:{get:()=>row?`"${row.revision}"`:null}, text:async()=>row?.value};
    }};
  vm.runInNewContext(code, ctx);
  return {storage:ctx.window.storage, alerts, local};
}
(async()=>{
  const a=client(), b=client();
  await a.storage.get('of:test'); await b.storage.get('of:test');
  assert.equal(a.storage.relational,true);
  await a.storage.set('of:test','{"x":2}');
  await assert.rejects(b.storage.set('of:test','{"x":3}'));
  assert.equal(records.get('of:test').value,'{"x":2}');
  assert.equal(b.alerts.length,1);
  assert.equal(b.local.size,0);
  await a.storage.set('of:new','[]');
  await Promise.all([a.storage.set('of:new','[1]'),a.storage.set('of:new','[2]')]);
  assert.equal(records.get('of:new').value,'[2]');
  assert.equal(records.get('of:new').revision,3);
  console.log('Storage client: revisions, conflict warning, no local fallback and queued writes OK');
})().catch(err=>{console.error(err);process.exitCode=1;});

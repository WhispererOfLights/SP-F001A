const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const net = require('node:net');
const {spawn, spawnSync} = require('node:child_process');
const {once} = require('node:events');
const {chromium} = require(process.env.PLAYWRIGHT_PATH || 'playwright');
const root = path.join(__dirname, '..');
const pause = ms => new Promise(resolve=>setTimeout(resolve,ms));

async function waitFor(check) {
  for(let i=0;i<100;i++) { if(await check()) return; await pause(100); }
  throw new Error('SQL server or persistence timeout');
}

(async()=>{
  const folder=fs.mkdtempSync(path.join(os.tmpdir(),'sp-f001-sql-ui-'));
  const db=path.join(folder,'sp-f001a.sqlite');
  const user={trigram:'JGR',prenom:'Julien',nom:'Test',service:'Production',role:'Manager',pwd:'test-hash'};
  const units=[{id:'u1',sn:'SN1',status:'en_cours',deleted:false},{id:'u2',sn:'SN2',status:'en_cours',deleted:false}];
  const entry={id:'sql-of',of:'100TEST',codeArticle:'250001163',description:'SQL test',otp:'7400-TEST',status:'en_cours',createdBy:'JGR',_snRows:units};
  const data={header:entry,units:{mode:'multi',rows:units},rework:{rows:[]},consommables:{ops:[]},testequip:{rows:[]},faits:{rows:[]},etuvage:{rows:[]},openwork:{rows:[]},demating:{connectors:[]}};
  const setup=spawnSync('python',['-c',
    "import sys,json,sqlite3; c=sqlite3.connect(sys.argv[1]); c.execute('CREATE TABLE storage(key TEXT PRIMARY KEY,value TEXT NOT NULL,updated_at REAL NOT NULL)'); c.executemany('INSERT INTO storage VALUES(?,?,1)', [(k,json.dumps(v)) for k,v in json.load(sys.stdin).items()]); c.commit(); c.close()",db],
    {input:JSON.stringify({'user:JGR':user,'users-list':['JGR'],'of-list':[entry],'of:sql-of':data,'consommables-list':[]}),encoding:'utf8'});
  assert.equal(setup.status,0,setup.stderr);
  const socket=net.createServer();
  socket.listen(0,'127.0.0.1'); await once(socket,'listening');
  const port=socket.address().port; await new Promise(resolve=>socket.close(resolve));
  const base=`http://127.0.0.1:${port}`;
  const process=spawn('python',['-u','server.py','--host','127.0.0.1','--port',String(port),'--data-dir',folder,'--disable-auth'],{cwd:root,stdio:'pipe'});
  let logs=''; process.stdout.on('data',chunk=>logs+=chunk); process.stderr.on('data',chunk=>logs+=chunk);
  let browser, page;
  try {
    await waitFor(async()=>{try{return (await (await fetch(base+'/api/health')).json()).schemaVersion===3;}catch{return false;}});
    browser=await chromium.launch({headless:true,channel:'msedge'});
    page=await browser.newPage({viewport:{width:1920,height:1080}});
    const errors=[];
    page.on('pageerror',error=>errors.push(error.message));
    page.on('dialog',async dialog=>{
      if(dialog.type()==='prompt') await dialog.accept('J20');
      else if(dialog.message().includes('connecteur indépendant par SN')) await dialog.dismiss();
      else await dialog.accept();
    });
    await page.addInitScript(user=>{
      sessionStorage.setItem('s:session',JSON.stringify(user));
      localStorage.setItem('sp-f001-last-activity',String(Date.now()));
    },user);
    await page.goto(base);
    await page.getByRole('cell',{name:'SN1',exact:true}).first().click();
    await page.getByRole('button',{name:'Mating',exact:true}).click();
    await page.getByRole('button',{name:'+ Connecteur',exact:true}).click();
    await page.getByRole('button',{name:'Demating J20',exact:true}).click();
    await waitFor(async()=>{
      const record=await (await fetch(base+'/api/storage/of%3Asql-of')).json();
      return record.demating.connectors.some(c=>c.nConect==='J20'&&c.events.at(-1)?.action==='Demating');
    });
    await page.reload();
    await page.getByRole('cell',{name:'SN1',exact:true}).first().click();
    await page.getByRole('button',{name:'Mating',exact:true}).click();
    assert.ok(await page.getByRole('button',{name:'Mating J20',exact:true}).isEnabled());
    assert.ok(await page.getByRole('button',{name:'Demating J20',exact:true}).isDisabled());
    await page.getByRole('button',{name:'Adjust/Rework',exact:true}).click();
    await page.getByRole('button',{name:'+ Ligne',exact:true}).click();
    await page.locator('[data-entry-field="repere"]:focus').fill('SQL-R77');
    const rework=page.locator('tr[data-rework-row]').filter({has:page.locator('[data-entry-field="repere"][value="SQL-R77"]')});
    await rework.locator('[data-entry-field="action1"]').selectOption('S');
    await rework.locator('[data-entry-field="codeERP"]').fill('123');
    await rework.locator('[data-entry-field="valeur"]').fill('10K');
    await rework.locator('[data-entry-field="fiche"]').fill('DOC');
    await rework.locator('[data-entry-field="etape"]').fill('10');
    await rework.locator('[data-entry-field="etape"]').press('Tab');
    assert.equal(await page.evaluate(()=>document.activeElement.title),'Valider');
    await page.keyboard.press('Enter');
    await waitFor(async()=>{
      const record=await (await fetch(base+'/api/storage/of%3Asql-of')).json();
      return record.rework.rows.some(r=>r.repere==='SQL-R77'&&r.validated&&!r.lot&&!r.dc);
    });
    const lotBorder=await rework.locator('[data-entry-field="lot"]').evaluate(el=>getComputedStyle(el).borderColor);
    const dcBorder=await rework.locator('[data-entry-field="dc"]').evaluate(el=>getComputedStyle(el).borderColor);
    assert.match(lotBorder,/218, 54, 51/);
    assert.match(dcBorder,/218, 54, 51/);
    assert.deepEqual(errors,[]);
    const result=spawnSync('python',['-c',
      "import sqlite3,sys; c=sqlite3.connect(sys.argv[1]); assert c.execute('PRAGMA user_version').fetchone()[0]==3; assert c.execute('SELECT field_action FROM connector_events').fetchone()[0]=='Demating'; assert c.execute(\"SELECT field_validated,field_lot,field_dc FROM rework_operations WHERE field_repere='SQL-R77'\").fetchone()==(1,'',''); assert c.execute('PRAGMA foreign_key_check').fetchall()==[]; assert c.execute(\"SELECT count(*) FROM sqlite_master WHERE name='storage'\").fetchone()[0]==0; c.close()",db],{encoding:'utf8'});
    assert.equal(result.status,0,result.stderr);
    console.log('Real browser + HTTP server + SQLite v3: connector creation, first Demating and reload persistence OK');
  } catch(error) {
    if(page) console.error((await page.locator('body').innerText()).slice(0,2500));
    console.error(logs.slice(-3500));
    error.message+='\n'+logs; throw error;
  } finally {
    if(browser) await browser.close();
    if(process.exitCode===null) {const exited=once(process,'exit'); process.kill(); await exited;}
    const resolved=path.resolve(folder);
    assert.ok(resolved.startsWith(path.resolve(os.tmpdir())+path.sep));
    fs.rmSync(resolved,{recursive:true,force:true});
  }
})().catch(error=>{console.error(error);global.process.exitCode=1;});

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const {chromium} = require(process.env.PLAYWRIGHT_PATH || 'playwright');

const root = path.join(__dirname, '..');
const entry = {id:'new-technical-id',of:'100TEST',status:'en_cours',codeArticle:'250001163',description:'Article test'};
const units = [{id:'new-unit-id',sn:'SN2',status:'en_cours'}];
const data = {header:entry,units:{rows:units},rework:{},consommables:{},testequip:{},faits:{},etuvage:{},demating:{}};
const user = {trigram:'JGR',prenom:'Julien',role:'Manager'};

(async()=>{
  const browser=await chromium.launch({headless:true,channel:'msedge'});
  try{
    const page=await browser.newPage();
    const errors=[];
    page.on('pageerror',error=>errors.push(error.message));
    await page.route('**/*',route=>route.fulfill({contentType:'text/html',body:'<html><body><div id="root"></div></body></html>'}));
    await page.goto('http://sp-f001-test.local/?dossier=old-id&piece=old-unit&of=100TEST&sn=SN2&onglet=faits');
    await page.addScriptTag({path:path.join(root,'vendor/react.development.js')});
    await page.addScriptTag({path:path.join(root,'vendor/react-dom.development.js')});
    await page.evaluate(({entry,data,user})=>{
      localStorage.setItem('sp-f001-last-activity',String(Date.now()));
      const records={'session':user,'of-list':[entry],'of:new-technical-id':data};
      window.storage={
        get:async key=>{if(!(key in records)) throw new Error('Not found');return {value:JSON.stringify(records[key])};},
        set:async(key,value)=>{records[key]=JSON.parse(value);},
        delete:async key=>{delete records[key];},
        list:async()=>Object.keys(records)
      };
      window.authApi={session:async()=>user};
      window.SP_F001A_PUBLIC_URL='http://sp-f001a/';
      Object.defineProperty(navigator,'clipboard',{configurable:true,value:{writeText:async value=>{window.copiedFolderLink=value;}}});
    },{entry,data,user});
    await page.addScriptTag({path:path.join(root,'src/App.runtime.js')});
    await page.waitForFunction(()=>document.getElementById('active-work-sn')?.value==='new-unit-id');
    await page.getByText('Aucun suivi technique enregistré',{exact:true}).waitFor();
    await page.getByRole('button',{name:'Copier le lien vers ce dossier',exact:true}).click();
    const copied=await page.evaluate(()=>window.copiedFolderLink);
    assert.ok(copied.startsWith('http://sp-f001a/'));
    assert.ok(copied.includes('dossier=new-technical-id'));
    assert.ok(copied.includes('piece=new-unit-id'));
    assert.ok(copied.includes('of=100TEST'));
    assert.ok(copied.includes('sn=SN2'));
    assert.ok(copied.includes('onglet=faits'));
    assert.deepEqual(errors,[]);
    console.log('Deep links: technical IDs, OF/SN fallback and requested tab passed.');
  }finally{await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});

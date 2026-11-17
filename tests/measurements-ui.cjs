const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const {chromium} = require(process.env.PLAYWRIGHT_PATH || 'playwright');

const root = path.join(__dirname, '..');
const units = [
  {id:'unit-1',sn:'SN-M01',unitKind:'sn',status:'en_cours'},
  {id:'unit-2',sn:'SN-M02',unitKind:'sn',status:'en_cours'},
];
const entry = {id:'measure-of',of:'OF-MESURE',status:'en_cours',codeArticle:'250000001',description:'Article mesure',otp:'OTP-M',_snRows:units};
const document = {header:entry,units:{rows:units},rework:{rows:[]},consommables:{ops:[]},testequip:{rows:[]},faits:{rows:[]},etuvage:{rows:[]},demating:{connectors:[]},mesures:{rows:[]}};

(async()=>{
  const browser=await chromium.launch({headless:true,channel:'msedge'});
  try{
    const page=await browser.newPage({viewport:{width:1800,height:1000}});
    const errors=[];
    page.on('pageerror',error=>errors.push(error.message));
    await page.route('**/*',route=>route.fulfill(route.request().url().endsWith('/assets/logo.png')
      ? {contentType:'image/png',body:fs.readFileSync(path.join(root,'assets/logo.png'))}
      : {contentType:'text/html',body:'<html><head><style>body{margin:0}*{box-sizing:border-box}</style></head><body><div id="root"></div></body></html>'}));
    await page.goto('http://sp-f001-measurements.local/');
    await page.addScriptTag({path:path.join(root,'vendor/react.production.min.js')});
    await page.addScriptTag({path:path.join(root,'vendor/react-dom.production.min.js')});
    await page.evaluate(({entry,document})=>{
      localStorage.setItem('sp-f001-theme','light');
      localStorage.setItem('sp-f001-last-activity',String(Date.now()));
      window.testRecords={session:{trigram:'JGR',prenom:'Julien',role:'Manager'},'of-list':[entry],'of:measure-of':document,'users-list':['JGR'],'user:JGR':{trigram:'JGR',role:'Manager'}};
      window.storage={
        get:async key=>{if(!(key in window.testRecords)) throw new Error('Not found');return {value:JSON.stringify(window.testRecords[key])};},
        set:async(key,value)=>{window.testRecords[key]=JSON.parse(value);},
        delete:async key=>{delete window.testRecords[key];},
        list:async()=>Object.keys(window.testRecords),
      };
    },{entry,document});
    await page.addScriptTag({path:path.join(root,'src/App.runtime.js')});
    await page.getByText('OF-MESURE',{exact:true}).first().click();
    await page.locator('#active-work-sn').selectOption('all');
    await page.getByText('Mesures',{exact:true}).first().click();
    await page.getByRole('button',{name:'+ Ajouter la première mesure',exact:true}).click();
    await page.getByPlaceholder('DOC-0013405_1',{exact:true}).fill('DOC-TEST_1');
    await page.getByPlaceholder('DOC-0013405_1',{exact:true}).blur();
    await page.getByPlaceholder('40',{exact:true}).fill('50');
    await page.getByPlaceholder('40',{exact:true}).blur();
    await page.getByPlaceholder('Tension TP1',{exact:true}).fill('Tension TP1');
    await page.getByPlaceholder('Tension TP1',{exact:true}).blur();
    await page.getByPlaceholder('V',{exact:true}).fill('V');
    await page.getByPlaceholder('V',{exact:true}).blur();
    await page.getByPlaceholder('Min',{exact:true}).fill('4,8');
    await page.getByPlaceholder('Min',{exact:true}).blur();
    await page.getByPlaceholder('Max',{exact:true}).fill('5,2');
    await page.getByPlaceholder('Max',{exact:true}).blur();
    await page.getByLabel('Tension TP1 - SN-M01').fill('5,01');
    await page.getByLabel('Tension TP1 - SN-M01').blur();
    await page.getByLabel('Tension TP1 - SN-M02').fill('6,2');
    await page.getByLabel('Tension TP1 - SN-M02').blur();
    await page.getByText('Conforme',{exact:true}).waitFor();
    await page.getByText('Non conforme',{exact:true}).waitFor();
    assert.ok((await page.getByText(/Min 5,01 · Moy\. 5,605 · Max 6,2/).count())>0);
    const downloadPromise=page.waitForEvent('download');
    await page.getByRole('button',{name:'↓ Excel mesures',exact:true}).click();
    const download=await downloadPromise;
    assert.ok(download.suggestedFilename().endsWith('.xlsx'));
    await download.saveAs(path.join(os.tmpdir(),`sp-f001a-measures-${process.pid}.xlsx`));
    const stored=await page.evaluate(()=>window.testRecords['of:measure-of'].mesures);
    assert.equal(stored.rows.length,1);
    assert.equal(stored.rows[0].results.length,2);
    assert.deepEqual(stored.rows[0].results.map(result=>result.unitId),['unit-1','unit-2']);
    assert.deepEqual(errors,[]);
    console.log('Measurements UI, status calculation and Excel export verified.');
  } finally {
    await browser.close();
  }
})().catch(error=>{console.error(error);process.exit(1);});

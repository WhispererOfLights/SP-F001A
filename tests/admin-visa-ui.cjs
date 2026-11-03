const assert = require('node:assert/strict');
const path = require('node:path');
const {chromium} = require(process.env.PLAYWRIGHT_PATH || 'playwright');

const root = path.join(__dirname, '..');
const entry = {id:'visa-test',of:'100VISA',status:'en_cours',codeArticle:'250001163',description:'Article test'};
const user = {trigram:'MGR',prenom:'Marie',nom:'Manager',role:'Manager'};
const data = {
  header:entry,
  units:{rows:[{id:'unit-1',sn:'SN-VISA',status:'en_cours'}]},
  rework:{rows:[{id:'rw-1',repere:'R101',action1:'S',valeur:'10 kOhm',codeERP:'250009999',validated:true,createdVisa:'JGR',createdDT:'03/11/2026 08:15',visaCtrl:'CTL',dateCtrl:'03/11/2026 09:20'}]},
  consommables:{ops:[]},testequip:{rows:[]},faits:{rows:[]},etuvage:{rows:[]},demating:{connectors:[]}
};
const accounts = [
  {trigram:'JGR',prenom:'Julien',nom:'Grosjean',role:'Opérateur',active:true},
  {trigram:'CTL',prenom:'Claire',nom:'Test',role:'Contrôleur',active:true},
  {trigram:'OLD',prenom:'Compte',nom:'Désactivé',role:'Opérateur',active:false},
  user,
];

(async()=>{
  const browser=await chromium.launch({headless:true,channel:'msedge'});
  try{
    const page=await browser.newPage();
    const errors=[];
    page.on('pageerror',error=>errors.push(error.message));
    await page.route('**/*',route=>route.fulfill({contentType:'text/html',body:'<html><body><div id="root"></div></body></html>'}));
    await page.goto('http://sp-f001-test.local/?dossier=visa-test&piece=unit-1&onglet=rework');
    await page.addScriptTag({path:path.join(root,'vendor/react.production.min.js')});
    await page.addScriptTag({path:path.join(root,'vendor/react-dom.production.min.js')});
    await page.evaluate(({entry,data,user,accounts})=>{
      localStorage.setItem('sp-f001-last-activity',String(Date.now()));
      const records={'of-list':[entry],'of:visa-test':data};
      window.storage={
        get:async key=>{if(!(key in records)) throw new Error('Not found');return {value:JSON.stringify(records[key])};},
        set:async(key,value)=>{records[key]=JSON.parse(value);window.savedVisaDocument=records[key];},
        updateWorkOrderSections:async(key,sections)=>{records[key]={...records[key],...sections};window.savedVisaDocument=records[key];return records[key];},
        delete:async key=>{delete records[key];},list:async()=>Object.keys(records)
      };
      window.authApi={session:async()=>user,users:async()=>accounts};
    },{entry,data,user,accounts});
    await page.addScriptTag({path:path.join(root,'src/App.runtime.js')});
    await page.getByRole('button',{name:'Corriger visa',exact:true}).click();
    await page.getByText('Soudé · Repère R101',{exact:true}).first().waitFor();
    await page.getByText('10 kOhm · Article 250009999',{exact:true}).first().waitFor();
    await page.getByText('03/11/2026 08:15',{exact:true}).first().waitFor();
    await page.getByText('Contrôle : CTL',{exact:true}).waitFor();
    await page.getByText('Claire Test · Contrôleur',{exact:true}).waitFor();
    await page.getByText('Soudé · Repère R101',{exact:true}).first().click();
    await page.getByText('Soudé · Repère R101',{exact:true}).nth(1).click();
    await page.getByText('2 traces sélectionnées',{exact:true}).waitFor();

    const select=page.getByRole('combobox',{name:'Nouveau visa'});
    const optionTexts=await select.locator('option').allTextContents();
    assert.ok(optionTexts.some(text=>text.includes('MGR')&&text.includes('Marie Manager')));
    assert.ok(optionTexts.some(text=>text.includes('CTL')&&text.includes('Contrôleur')));
    assert.ok(!optionTexts.some(text=>text.includes('OLD')),'Un compte désactivé ne doit pas être proposé');
    assert.ok(optionTexts.some(text=>text.startsWith('JGR')),'Un visa actuel peut rester une cible lors d’une correction multiple');

    await select.selectOption('MGR');
    await page.getByText("Modifier aussi la date et l'heure",{exact:true}).click();
    await page.getByLabel('Nouvelle date et heure avec le visa').fill('2026-11-03T10:00');
    await page.getByPlaceholder('Motif obligatoire de la correction').fill('Correction après vérification');
    await page.getByRole('button',{name:'Corriger 2 visas',exact:true}).click();
    await page.waitForFunction(()=>window.savedVisaDocument?.rework?.rows?.[0]?.createdVisa==='MGR'&&window.savedVisaDocument?.rework?.rows?.[0]?.visaCtrl==='MGR');
    const saved=await page.evaluate(()=>window.savedVisaDocument.rework.rows[0]);
    assert.deepEqual(saved.visaCorrections.map(item=>item.from).sort(),['CTL','JGR']);
    assert.ok(saved.visaCorrections.every(item=>item.to==='MGR'));
    assert.equal(saved.createdDT,'03/11/2026 10:00');
    assert.equal(saved.dateCtrl,'03/11/2026 10:00');
    assert.ok(saved.visaCorrections.every(item=>item.toDate==='03/11/2026 10:00'));
    assert.equal(new Set(saved.visaCorrections.map(item=>item.batchId)).size,1);
    let firstHistoryMessage='';
    page.once('dialog',async dialog=>{firstHistoryMessage=dialog.message();await dialog.dismiss();});
    await page.getByTitle('Historique des modifications').first().click();
    assert.ok(firstHistoryMessage.includes('Visa création "JGR" → "MGR"'));
    assert.ok(firstHistoryMessage.includes('Visa contrôle "CTL" → "MGR"'));
    assert.ok(firstHistoryMessage.includes('Motif : Correction après vérification'));

    await page.getByRole('button',{name:'Corriger visa',exact:true}).click();
    await page.getByRole('button',{name:'Corriger la date',exact:true}).click();
    await page.getByText('Auteur : MGR',{exact:true}).click();
    await page.getByLabel('Nouvelle date et heure').fill('2026-11-02T07:30');
    await page.getByPlaceholder('Motif obligatoire de la correction').fill('Correction de la date uniquement');
    await page.getByRole('button',{name:'Corriger 1 date',exact:true}).click();
    await page.waitForFunction(()=>window.savedVisaDocument?.rework?.rows?.[0]?.createdDT==='02/11/2026 07:30');
    const dateCorrected=await page.evaluate(()=>window.savedVisaDocument.rework.rows[0]);
    assert.equal(dateCorrected.createdVisa,'MGR','La correction de date ne doit pas modifier le visa');
    const dateHistory=dateCorrected.visaCorrections.at(-1);
    assert.equal(dateHistory.type,'date');
    assert.equal(dateHistory.visa,'MGR');
    assert.equal(dateHistory.fromDate,'03/11/2026 10:00');
    assert.equal(dateHistory.toDate,'02/11/2026 07:30');
    let dateHistoryMessage='';
    page.once('dialog',async dialog=>{dateHistoryMessage=dialog.message();await dialog.dismiss();});
    await page.getByTitle('Historique des modifications').first().click();
    assert.ok(dateHistoryMessage.includes('Date création "03/11/2026 10:00" → "02/11/2026 07:30" (visa MGR conservé)'));
    assert.deepEqual(errors,[]);
    console.log('Admin/Manager visa correction: visual action context and existing active users passed.');
  }finally{await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});

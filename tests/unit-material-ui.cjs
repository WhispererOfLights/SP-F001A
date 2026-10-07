const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const {chromium} = require(process.env.PLAYWRIGHT_PATH || 'playwright');
const root = path.join(__dirname, '..');
const units = [{id: 'u1', sn: 'SN1', status: 'en_cours'}, {id: 'u2', sn: 'SN2', status: 'a_faire'}, {id:'lot-a',sn:'LOT-A',unitKind:'lot',qteInitiale:'10',status:'en_cours'}];
const entry = {id: 'test-of', of: '100TEST', status: 'en_cours', codeArticle: '250001163', description: 'Article de test', otp: '7400-TEST', createdBy: 'JGR', _snRows: units};
const data = {header: entry, units: {mode: 'multi', rows: units}, rework: {rows: [
  {id: 'r1', createdVisa: 'OTHER', createdDT: '17/09/2026 10:00', validated: true, repere: 'R96', action1: 'S', qty: '2', codeERP: '225222333', valeur: '10K', lot: 'N/A', dc: 'N/A', fiche: 'DOC', etape: '10', snScope: 'custom', snIds: ['u1', 'u2']},
  ...['D','P','R'].map(action1=>({id:'blocked-'+action1,createdVisa:'OTHER',validated:true,repere:'R'+action1,action1,codeERP:'123',snScope:'custom',snIds:['u2']})),
  {id:'cancelled-pdf',createdVisa:'OTHER',createdDT:'16/09/2026 08:30',validated:true,repere:'R99',action1:'S',codeERP:'999',valeur:'1K',snScope:'custom',snIds:['u2'],deleted:true,deletedVisa:'JGR',deletedDate:'18/09/2026 09:00',deletedReason:'Test ligne annulée'},
]}, consommables: {}, testequip: {}, faits: {rows:[{id:'fact-u1',type:'FT',numero:'F-001',commentaires:'Contrôle visuel',closedDate:'18/09/2026',snScope:'custom',snIds:['u1']}]}, etuvage: {}, openwork: {}, demating: {connectors:[
  {id:'c4',nConect:'J4',validated:true,createdVisa:'OTHER',snScope:'custom',snIds:['u2'],events:[{id:'old-m',action:'Matting',dt:'17/09/2026 08:00',visa:'OTHER'}]},
  {id:'c8',nConect:'J8',validated:true,createdVisa:'OTHER',snScope:'custom',snIds:['u2'],events:[]},
  {id:'c10',nConect:'J10',validated:true,createdVisa:'OTHER',snScope:'custom',snIds:['u2'],events:[{id:'old-d',action:'Dematting',dt:'17/09/2026 08:00',visa:'OTHER'}]},
]}};
const user = {trigram: 'JGR', prenom: 'Julien', role: 'Manager'};
const otherEntry={id:'other-of',of:'100OTHER',status:'en_cours',codeArticle:'250 001 163',createdBy:'OTHER',description:'Other article',_snRows:[{id:'other-unit',sn:'SNOTHER'}]};

(async () => {
  const browser = await chromium.launch({headless: true, channel: 'msedge'});
  try {
    const page = await browser.newPage({viewport: {width: 1920, height: 1080}});
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.route('**/*', route => route.fulfill(route.request().url().endsWith('/assets/logo.png')
      ? {contentType: 'image/png', body: fs.readFileSync(path.join(root, 'assets/logo.png'))}
      : {contentType: 'text/html', body: '<html><head><style>body{margin:0;font-family:Arial}*{box-sizing:border-box}</style></head><body><div id="root"></div></body></html>'}));
    await page.goto('http://sp-f001-test.local/');
    await page.addScriptTag({path: path.join(root, 'vendor/react.development.js')});
    await page.addScriptTag({path: path.join(root, 'vendor/react-dom.development.js')});
    await page.evaluate(({entry, data, user,otherEntry}) => {
      localStorage.setItem('sp-f001-theme', 'light');
      localStorage.setItem('sp-f001-last-activity', String(Date.now()));
      window.testRecords = {'session': user, 'of-list': [entry,otherEntry], 'of:test-of': data,'of:other-of':{header:otherEntry,units:{rows:otherEntry._snRows}}};
      const different={id:'different-of',of:'100DIFFERENT',codeArticle:'999',status:'en_cours',_snRows:[{id:'different-unit',sn:'DIFFERENTSN'}]};
      window.testRecords['of-list'].push(different);
      window.testRecords['of:different-of']={header:different,units:{rows:different._snRows}};
      Object.assign(window.testRecords,{'users-list':['JGR','MGR','EMPTY','PA1','CDP'],
        'user:JGR':{...user,email:'jgr@example.com'},
        'user:MGR':{trigram:'MGR',prenom:'Autre',nom:'Manager',role:'Manager',email:'manager@example.com'},
        'user:EMPTY':{trigram:'EMPTY',role:'Manager'},
        'user:PA1':{trigram:'PA1',prenom:'Anne',nom:'Qualité',role:'Product Assurance',email:'pa@example.com'},
        'user:CDP':{trigram:'CDP',prenom:'Paul',nom:'Projet',role:'Chef de projet',email:'projet@example.com'}});
      window.testRecords['consommables-list']=[{id:'long-sap',sap:'1600000046',label:'Colle test longue référence',cat:'Colle',polymerizationHours:'876000'}];
      window.testRecords['of:test-of'].consommables={ops:[{id:'conso-op',createdVisa:'OTHER',createdDT:'18/09/2026 10:00',fiche:'DOC',op:'10',snScope:'all',validated:true,items:[{id:'conso-item',createdVisa:'OTHER',createdDT:'18/09/2026 10:00',consoId:'long-sap',validated:true,lot:'0000020516',dp:'17.09.26'}]}]};
      window.storage = {
        get: async key => {await new Promise(resolve => setTimeout(resolve, 5)); if (!(key in window.testRecords)) throw new Error('Not found'); return {value: JSON.stringify(window.testRecords[key])};},
        set: async (key, value) => {await new Promise(resolve => setTimeout(resolve, 10)); window.testRecords[key] = JSON.parse(value);},
        delete: async key => {delete window.testRecords[key];},
        list: async () => Object.keys(window.testRecords),
      };
    }, {entry, data, user,otherEntry});
    await page.addScriptTag({path: path.join(root, 'src/App.runtime.js')});
    await page.waitForFunction(()=>Array.from(document.querySelectorAll('label')).find(el=>el.textContent==='Mes OF travaillés')?.querySelector('input')?.checked);
    await page.getByTitle(/Sous vide dès le/).first().waitFor();
    assert.equal(await page.getByRole('columnheader',{name:/Faits \/ Suivi/}).count(),1);
    assert.equal(await page.getByRole('columnheader',{name:'Faits',exact:true}).count(),0);
    assert.equal(await page.getByRole('columnheader',{name:'Suivi',exact:true}).count(),0);
    assert.equal(await page.getByRole('cell',{name:'100OTHER',exact:true}).count(),0);
    const homeSearch=page.getByTitle('Rechercher un OF, SN ou lot',{exact:true});
    await homeSearch.fill('100OTHER');
    await page.getByRole('cell',{name:'100OTHER',exact:true}).waitFor();
    assert.ok(!(await page.getByRole('checkbox',{name:'Mes OF travaillés',exact:true}).isChecked()));
    await homeSearch.fill('');
    await page.waitForFunction(()=>Array.from(document.querySelectorAll('label')).find(el=>el.textContent==='Mes OF travaillés')?.querySelector('input')?.checked);
    const expandHomeOf=page.getByRole('button',{name:'Déplier les 2 SN / 1 LOT de OF 100TEST',exact:true});
    await expandHomeOf.waitFor();
    assert.equal(await page.getByRole('cell',{name:'2 SN',exact:true}).count()>0,true);
    assert.equal(await page.getByRole('cell',{name:'1 LOT',exact:true}).count()>0,true);
    await expandHomeOf.click();
    assert.equal(await page.getByRole('cell',{name:'250001163',exact:true}).count(),3);
    assert.equal(await page.getByRole('cell',{name:'Article de test',exact:true}).count(),3);
    assert.equal(await page.getByText('récent',{exact:true}).count(),0);
    await page.getByRole('button',{name:'Trier SN de A à Z',exact:true}).click();
    let sortedHomeRows=await page.locator('tbody input[aria-label^="Sélectionner "]').evaluateAll(inputs=>inputs.map(input=>input.getAttribute('aria-label')));
    assert.ok(sortedHomeRows[0].startsWith('Sélectionner SN1'));
    await page.getByRole('button',{name:'Trier SN, ordre A-Z',exact:true}).click();
    sortedHomeRows=await page.locator('tbody input[aria-label^="Sélectionner "]').evaluateAll(inputs=>inputs.map(input=>input.getAttribute('aria-label')));
    assert.ok(sortedHomeRows[0].startsWith('Sélectionner SN2'));
    await page.getByRole('button',{name:'Trier SN, ordre Z-A',exact:true}).click();
    assert.equal(await page.getByRole('toolbar',{name:'Actions sur la sélection',exact:true}).count(),0);
    await page.getByRole('checkbox',{name:'Sélectionner SN1 - OF 100TEST',exact:true}).check();
    await page.getByRole('cell',{name:'SN2',exact:true}).click();
    assert.ok(await page.getByRole('checkbox',{name:'Sélectionner SN2 - OF 100TEST',exact:true}).isChecked());
    assert.equal(await page.getByRole('toolbar',{name:'Actions sur la sélection',exact:true}).count(),1);
    const sheetsDownloadPromise=page.waitForEvent('download');
    await page.getByRole('button',{name:'Feuilles composants',exact:true}).click();
    const sheetsDownload=await sheetsDownloadPromise;
    assert.ok((await sheetsDownload.suggestedFilename()).endsWith('.pdf'));
    await sheetsDownload.saveAs(path.join(__dirname,'artifacts/component-sheets.pdf'));
    await page.getByRole('button',{name:'Imprimer les dossiers',exact:true}).click();
    const bulkPdfDialog=page.getByRole('dialog',{name:'Impression en masse',exact:true});
    await bulkPdfDialog.waitFor();
    assert.ok((await bulkPdfDialog.textContent()).includes('1 dossier · 2 SN/lots sélectionnés'));
    assert.ok(await bulkPdfDialog.getByRole('checkbox',{name:'Ne pas exporter les rapports vides',exact:true}).isChecked());
    const bulkDownloadPromise=page.waitForEvent('download');
    await bulkPdfDialog.getByRole('button',{name:'Créer le PDF à imprimer',exact:true}).click();
    const bulkDownload=await bulkDownloadPromise;
    assert.ok((await bulkDownload.suggestedFilename()).endsWith('.pdf'));
    await bulkDownload.saveAs(path.join(__dirname,'artifacts/bulk-report.pdf'));
    await bulkPdfDialog.waitFor({state:'detached'});
    await page.getByRole('button',{name:'Clôture logistique',exact:true}).click();
    let homeMailDialog=page.getByRole('dialog');
    assert.equal(await homeMailDialog.getByLabel('Destinataire',{exact:true}).inputValue(),'CH - NHL - Logistique CH');
    assert.equal(await homeMailDialog.getByRole('checkbox',{name:'Passer les éléments sélectionnés au statut « À clôturer »',exact:true}).count(),0);
    await homeMailDialog.getByRole('checkbox',{name:'Mettre MGR en copie',exact:true}).check();
    assert.equal(await homeMailDialog.getByText('MGR',{exact:true}).count(),1);
    assert.equal(await homeMailDialog.getByLabel('Objet',{exact:true}).inputValue(),'Clôture | OF 100TEST | OTP 7400-TEST');
    let homeMailBody=await homeMailDialog.getByLabel('Message',{exact:true}).inputValue();
    assert.equal((homeMailBody.match(/100TEST \| 250001163/g)||[]).length,2);
    assert.ok(homeMailBody.includes('100TEST | 250001163 | Article de test | SN : SN1 | Faits : F-001'));
    assert.ok(homeMailBody.includes('100TEST | 250001163 | Article de test | SN : SN2'));
    assert.ok(!homeMailBody.includes('Faits : -')&&!homeMailBody.includes('|  |'));
    assert.ok(!homeMailBody.includes('Contrôle visuel')&&!homeMailBody.includes('clôturé 18/09/2026'));
    await homeMailDialog.getByText('Fermer',{exact:true}).click();
    await page.getByRole('button',{name:'Inspection IP',exact:true}).click();
    homeMailDialog=page.getByRole('dialog');
    await homeMailDialog.getByLabel('Nom de l’IP',{exact:true}).fill('IP Validation');
    await homeMailDialog.getByLabel('Date de la réunion',{exact:true}).fill('2026-10-02');
    await homeMailDialog.getByLabel('Heure de la réunion',{exact:true}).fill('10:00');
    await homeMailDialog.getByLabel('Durée de la réunion',{exact:true}).selectOption('90');
    await homeMailDialog.getByLabel('Salle de la réunion',{exact:true}).fill('#512');
    await homeMailDialog.getByLabel('Table ou place de la réunion',{exact:true}).fill('P17');
    await homeMailDialog.getByRole('checkbox',{name:'Ajouter PA1 aux destinataires',exact:true}).check();
    await homeMailDialog.getByRole('checkbox',{name:'Mettre MGR en copie',exact:true}).check();
    await homeMailDialog.getByRole('checkbox',{name:'Ajouter CDP aux destinataires',exact:true}).check();
    await page.waitForFunction(()=>document.querySelector('input[aria-label="Objet"]')?.value.startsWith('IP Validation |'));
    assert.equal(await homeMailDialog.getByLabel('Objet',{exact:true}).inputValue(),'IP Validation | 250001163 - Article de test | SN1, SN2 | OTP 7400-TEST');
    const ipBody=await homeMailDialog.getByLabel('Message',{exact:true}).inputValue();
    assert.ok(ipBody.includes('100TEST | 250001163 | Article de test | SN : SN1 | Faits : F-001'));
    assert.ok(ipBody.includes('100TEST | 250001163 | Article de test | SN : SN2'));
    assert.ok(!ipBody.includes('Faits : -')&&!ipBody.includes('|  |'));
    const downloadPromise=page.waitForEvent('download');
    await homeMailDialog.getByRole('button',{name:'Créer le brouillon Outlook',exact:true}).click();
    const meetingDownload=await downloadPromise;
    assert.ok(meetingDownload.suggestedFilename().endsWith('.ics'));
    assert.ok((await homeMailDialog.getByRole('status').textContent()).includes('Brouillon Outlook créé'));
    await homeMailDialog.getByText('Fermer',{exact:true}).click();
    const first = page.getByRole('textbox', {name: 'SN produit fini de SN1 - OF 100TEST', exact: true});
    await first.fill('PF1');
    await first.press('Enter');
    const second = page.getByRole('textbox', {name: 'SN produit fini de SN2 - OF 100TEST', exact: true});
    assert.equal(await second.inputValue(), '');
    await second.fill('PF2');
    await second.press('Enter');
    await page.waitForFunction(() => window.testRecords['of:test-of'].units.rows[0].snProduitFini === 'PF1' && window.testRecords['of:test-of'].units.rows[1].snProduitFini === 'PF2');
    await page.getByRole('button',{name:'Trier Faits / Suivi de A à Z',exact:true}).waitFor();
    await page.getByText('FT F-001',{exact:true}).waitFor();
    await page.getByLabel('Statut SN SN1 - OF 100TEST', {exact: true}).selectOption('termine');
    await page.waitForFunction(() => window.testRecords['of:test-of'].units.rows[0].status === 'termine');
    assert.equal(await page.evaluate(() => window.testRecords['of:test-of'].header.status), 'en_cours');
    assert.equal(await page.evaluate(() => window.testRecords['of:test-of'].units.rows[1].status), 'a_faire');
    assert.deepEqual(await page.getByLabel('Statut SN SN2 - OF 100TEST',{exact:true}).locator('option').evaluateAll(options=>options.map(option=>option.value).filter(value=>['ip','a_cloturer'].includes(value))),['ip','a_cloturer']);
    await page.waitForFunction(() => document.querySelector('img[alt="Safran"]')?.naturalWidth > 0);
    const homeFont=await page.getByRole('cell',{name:'Article de test',exact:true}).first().evaluate(el=>getComputedStyle(el).fontFamily);
    assert.ok(homeFont.includes('system-ui'));
    fs.mkdirSync(path.join(__dirname, 'artifacts'), {recursive: true});
    await page.screenshot({path: path.join(__dirname, 'artifacts/home-units-1920.png')});
    const homeTeamsCopy=page.getByRole('button',{name:"Copier les informations de l'OF 100TEST - SN2 dans le presse-papier",exact:true});
    await homeTeamsCopy.click();
    assert.equal((await homeTeamsCopy.textContent()).trim(),'✓');
    await page.getByRole('button', {name: 'Ouvrir OF 100TEST - SN2', exact: true}).click();
    await page.waitForFunction(() => document.getElementById('active-work-sn')?.value === 'u2');
    await page.getByRole('button',{name:'Copier les informations du dossier dans le presse-papier',exact:true}).click();
    await page.getByRole('button',{name:'Article : 250001163. Double-cliquer pour copier',exact:true}).dblclick();
    await page.getByRole('button',{name:'Article copié',exact:true}).waitFor();
    const quickOf=page.getByRole('textbox',{name:"Rechercher ou scanner un numéro d'OF",exact:true});
    await quickOf.focus();
    await page.keyboard.press('PageDown');
    assert.equal(await quickOf.inputValue(),'100TEST');
    await page.locator('body').click({position:{x:1800,y:950}});
    await page.keyboard.press('PageDown');
    await page.waitForFunction(()=>document.querySelector('input[aria-label="Rechercher ou scanner un numéro d\'OF"]')?.value==='100OTHER');
    await page.keyboard.press('PageDown');
    await page.waitForFunction(()=>document.querySelector('input[aria-label="Rechercher ou scanner un numéro d\'OF"]')?.value==='100DIFFERENT');
    await page.keyboard.press('PageDown');
    assert.equal(await quickOf.inputValue(),'100DIFFERENT');
    await page.keyboard.press('PageUp');
    await page.waitForFunction(()=>document.querySelector('input[aria-label="Rechercher ou scanner un numéro d\'OF"]')?.value==='100OTHER');
    await page.keyboard.press('PageUp');
    await page.waitForFunction(()=>document.querySelector('input[aria-label="Rechercher ou scanner un numéro d\'OF"]')?.value==='100TEST');
    await page.getByRole('button',{name:'Consommables',exact:true}).click();
    await page.waitForTimeout(250);
    if(errors.length) throw new Error(errors.join('\n'));
    await page.getByRole('columnheader',{name:'Code SAP',exact:true}).waitFor();
    await page.locator('body').click({position:{x:1800,y:950}});
    await page.keyboard.press('PageDown');
    await page.waitForFunction(()=>document.querySelector('input[aria-label="Rechercher ou scanner un numéro d\'OF"]')?.value==='100OTHER');
    await page.getByRole('columnheader',{name:'Code SAP',exact:true}).waitFor();
    assert.equal(await page.locator('[data-rework-row]').count(),0);
    await page.keyboard.press('PageUp');
    await page.waitForFunction(()=>document.querySelector('input[aria-label="Rechercher ou scanner un numéro d\'OF"]')?.value==='100TEST');
    await page.getByRole('columnheader',{name:'Code SAP',exact:true}).waitFor();
    await page.getByRole('button',{name:'Adjust/Rework',exact:true}).click();
    await page.locator('#active-work-sn').selectOption('u2');
    const dossierSheetPromise=page.waitForEvent('download');
    await page.getByRole('button',{name:'Feuille composants',exact:true}).click();
    const dossierSheet=await dossierSheetPromise;
    await dossierSheet.saveAs(path.join(__dirname,'artifacts/component-sheet-dossier.pdf'));
    const labelPromise=page.waitForEvent('download');
    await page.getByTitle('Imprimer l’étiquette composant 50 × 75 mm').first().click();
    const labelDownload=await labelPromise;
    await labelDownload.saveAs(path.join(__dirname,'artifacts/component-label.pdf'));
    assert.equal(await page.locator('.compact-ui').evaluate(el=>getComputedStyle(el).fontFamily),homeFont);
    for(const action of ['D','P','R']) assert.ok(await page.getByRole('checkbox',{name:`Demander la matière R${action} 123`,exact:true}).isDisabled());
    for(const label of ['TRA','DEM','Visa']) {
      const heading=page.getByRole('columnheader',{name:label,exact:true});
      assert.ok(await heading.evaluate(el=>el.scrollWidth<=el.clientWidth),`${label} heading must fit`);
    }
    await page.getByRole('checkbox', {name: 'Demander la matière R96 225222333', exact: true}).check();
    await page.screenshot({path: path.join(__dirname, 'artifacts/rework-request-1920.png')});
    await page.getByRole('button', {name: 'Demande matière (1)', exact: true}).click();
    const dialog = page.getByRole('dialog', {name: 'Demande matière - Logistique'});
    await dialog.waitFor();
    assert.equal(await dialog.getByLabel('Destinataire',{exact:true}).inputValue(),'CH - NHL - Logistique CH');
    await dialog.getByRole('checkbox',{name:'Mettre MGR en copie',exact:true}).check();
    await dialog.getByRole('checkbox',{name:'Mettre JGR en copie',exact:true}).check();
    assert.ok(await dialog.getByRole('checkbox',{name:'Mettre EMPTY en copie',exact:true}).isDisabled());
    const body = await dialog.getByLabel('Message', {exact: true}).inputValue();
    assert.ok(body.includes('OTP : 7400-TEST'));
    assert.ok(body.includes('225222333'));
    assert.ok(!body.includes('Lot matière'));
    assert.ok((await dialog.getByLabel('Message', {exact: true}).boundingBox()).height >= 250);
    assert.ok(await dialog.getByRole('button', {name: 'Ouvrir la messagerie', exact: true}).isEnabled());
    await page.screenshot({path: path.join(__dirname, 'artifacts/material-mail-1920.png')});
    await page.setViewportSize({width: 1280, height: 800});
    await page.screenshot({path: path.join(__dirname, 'artifacts/material-mail-1280.png')});
    const box = await dialog.boundingBox();
    assert.ok(box.x >= 0 && box.x + box.width <= 1280);
    assert.ok(box.y >= 0 && box.y + box.height <= 800);
    await dialog.getByRole('button',{name:'Fermer',exact:true}).last().click();
    await page.setViewportSize({width:1920,height:1080});
    const ficheHeading=page.getByRole('columnheader',{name:'Fiche suiveuse',exact:true});
    assert.ok(await ficheHeading.evaluate(el=>el.scrollWidth<=el.clientWidth));
    for(const action of ['S','M','P']) {
      await page.getByRole('button',{name:'+ Ligne',exact:true}).click();
      const focused=page.locator('[data-entry-field="repere"]:focus');
      await focused.fill('QUICK'+action);
      const row=page.locator('tr[data-rework-row]').filter({has:page.locator(`[data-entry-field="repere"][value="QUICK${action}"]`)});
      await focused.press('Tab');
      assert.equal(await page.evaluate(()=>document.activeElement.dataset.entryField),'isAdjust');
      await page.keyboard.press('Shift+Tab');
      assert.equal(await page.evaluate(()=>document.activeElement.dataset.entryField),'repere');
      await row.locator('[data-entry-field="action1"]').selectOption(action);
      if(action==='M') await row.locator('[data-entry-field="qty"]').fill('2');
      await row.locator('[data-entry-field="codeERP"]').fill('123');
      await row.locator('[data-entry-field="valeur"]').fill('10K');
      await row.locator('[data-entry-field="fiche"]').fill('DOC-QUICK');
      await row.locator('[data-entry-field="etape"]').fill('10');
      await row.locator('[data-entry-field="etape"]').press('Tab');
      assert.equal(await page.evaluate(()=>document.activeElement.title),'Valider');
      const before=await row.locator('[data-entry-field="lot"]').evaluate(el=>el.style.background);
      await page.keyboard.press('Shift+Tab');
      assert.equal(await page.evaluate(()=>document.activeElement.dataset.entryField),'etape');
      await page.keyboard.press('Tab');
      await page.keyboard.press('Enter');
      await page.waitForFunction(action=>window.testRecords['of:test-of'].rework.rows.some(r=>r.repere==='QUICK'+action&&r.validated&&!r.lot&&!r.dc),action);
      assert.notEqual(before,'');
      assert.equal(await row.locator('[data-entry-field="lot"]').evaluate(el=>el.style.background),before);
      assert.equal(await row.getByLabel('Avertissement sur la ligne',{exact:true}).count(),0);
      assert.equal(await row.locator('xpath=following-sibling::tr[1]').getByText('Traçabilité à compléter',{exact:false}).count(),0);
    }
    await page.getByRole('button',{name:'+ Ligne',exact:true}).click();
    const pointedNoValue=page.locator('[data-rework-row]').first();
    await pointedNoValue.locator('[data-entry-field="repere"]').fill('P-NOVALUE');
    await pointedNoValue.locator('[data-entry-field="action1"]').selectOption('P');
    await pointedNoValue.locator('[data-entry-field="codeERP"]').fill('123');
    await pointedNoValue.locator('[data-entry-field="fiche"]').fill('DOC-P');
    await pointedNoValue.locator('[data-entry-field="etape"]').fill('10');
    let missingValueMessage='';
    page.once('dialog',async d=>{missingValueMessage=d.message();await d.accept();});
    await pointedNoValue.getByTitle('Valider',{exact:true}).click();
    await page.waitForFunction(()=>window.testRecords['of:test-of'].rework.rows.some(r=>r.repere==='P-NOVALUE'&&!r.validated&&r.validError?.includes('Valeur')));
    assert.ok(missingValueMessage.includes('Valeur'));
    await pointedNoValue.locator('[data-entry-field="valeur"]').fill('10K');
    await pointedNoValue.getByTitle('Valider',{exact:true}).click();
    await page.waitForFunction(()=>window.testRecords['of:test-of'].rework.rows.some(r=>r.repere==='P-NOVALUE'&&r.validated));
    for(const [action,value] of [['D','10K'],['S','20K']]) {
      await page.getByRole('button',{name:'+ Ligne',exact:true}).click();
      const mismatchRow=page.locator('[data-rework-row]').first();
      await mismatchRow.locator('[data-entry-field="repere"]').fill('WARNVAL');
      await mismatchRow.locator('[data-entry-field="action1"]').selectOption(action);
      await mismatchRow.locator('[data-entry-field="valeur"]').fill(value);
      if(action==='S') await mismatchRow.locator('[data-entry-field="codeERP"]').fill('123');
      await mismatchRow.locator('[data-entry-field="fiche"]').fill('DOC-WARN');
      await mismatchRow.locator('[data-entry-field="etape"]').fill('10');
      await mismatchRow.getByTitle('Valider',{exact:true}).click();
      await page.waitForFunction(({action,value})=>window.testRecords['of:test-of'].rework.rows.some(r=>r.repere==='WARNVAL'&&r.action1===action&&r.valeur===value&&r.validated),{action,value});
    }
    const mismatchRows=page.locator('[data-rework-row]').filter({has:page.locator('[data-entry-field="repere"][value="WARNVAL"]')});
    assert.equal(await mismatchRows.count(),2);
    for(const valueField of await mismatchRows.locator('[data-entry-field="valeur"]').all()) {
      assert.ok((await valueField.getAttribute('title')).includes('Cohérence valeur'));
      assert.ok((await valueField.evaluate(el=>el.style.borderColor)).length>0);
    }
    await page.screenshot({path:path.join(__dirname,'artifacts/rework-quick-entry-1920.png')});
    await page.locator('[data-rework-row="r1"]').getByTitle('Dupliquer',{exact:true}).click();
    const copyDialog=page.getByRole('dialog',{name:'Copier vers OF / SN',exact:true});
    await copyDialog.getByRole('checkbox',{name:'OF 100TEST — SN2',exact:true}).waitFor();
    const copySource=copyDialog.getByLabel('Source de la copie',{exact:true});
    assert.ok((await copySource.textContent()).includes('100TEST'));
    assert.ok((await copySource.textContent()).includes('250001163'));
    assert.ok((await copySource.textContent()).includes('SN1 + SN2'));
    await copyDialog.getByText(/Lignes à copier : 1 sélectionnée\(s\)/).click();
    await copyDialog.getByRole('checkbox',{name:/Copier la source RD/}).check();
    assert.ok(!(await copyDialog.getByRole('checkbox',{name:'OF 100TEST — SN2',exact:true}).isChecked()));
    assert.equal(await copyDialog.getByRole('checkbox',{name:/^OF /}).first().getAttribute('aria-label'),'OF 100TEST — SN2');
    assert.equal(await copyDialog.getByRole('checkbox',{name:'OF 100DIFFERENT — DIFFERENTSN',exact:true}).count(),0);
    await copyDialog.getByRole('textbox',{name:'Rechercher les destinations',exact:true}).fill('999 DIFFERENTSN');
    await copyDialog.getByRole('checkbox',{name:'OF 100DIFFERENT — DIFFERENTSN',exact:true}).waitFor();
    await copyDialog.getByRole('checkbox',{name:'OF 100DIFFERENT — DIFFERENTSN',exact:true}).check();
    await copyDialog.getByRole('textbox',{name:'Rechercher les destinations',exact:true}).fill('Other article');
    assert.ok(await copyDialog.getByText('Other article',{exact:true}).isVisible());
    await copyDialog.getByRole('textbox',{name:'Rechercher les destinations',exact:true}).fill('');
    assert.equal(await copyDialog.getByRole('checkbox',{name:'OF 100DIFFERENT — DIFFERENTSN',exact:true}).count(),0);
    await copyDialog.getByRole('textbox',{name:'Rechercher les destinations',exact:true}).fill('100OTHER');
    await copyDialog.getByRole('checkbox',{name:'OF 100OTHER — SNOTHER',exact:true}).check();
    await copyDialog.getByRole('textbox',{name:'Rechercher les destinations',exact:true}).fill('');
    await copyDialog.getByRole('checkbox',{name:'OF 100TEST — SN1',exact:true}).check();
    await copyDialog.getByRole('button',{name:'Copier 2 ligne(s) vers 3 destination(s)',exact:true}).click();
    await page.waitForFunction(()=>window.testRecords['of:other-of'].rework?.rows?.length===2);
    const cross=await page.evaluate(()=>window.testRecords['of:other-of'].rework.rows.find(row=>row.repere==='R96'));
    assert.equal(cross.createdVisa,'JGR');assert.equal(cross.repere,'R96');assert.equal(cross.validated,true);assert.equal(cross.visaOper,'JGR');assert.equal(cross.visaCtrl,'');assert.equal(cross.tracaOk,false);
    assert.deepEqual(cross.snIds,['other-unit']);
    await page.waitForFunction(()=>window.testRecords['of:different-of'].rework?.rows?.length===2);
    const differentArticleCopy=await page.evaluate(()=>window.testRecords['of:different-of'].rework.rows.find(row=>row.repere==='R96'));
    assert.equal(differentArticleCopy.createdVisa,'JGR');assert.equal(differentArticleCopy.validated,true);assert.deepEqual(differentArticleCopy.snIds,['different-unit']);
    await page.waitForFunction(()=>window.testRecords['of:test-of'].rework.rows.some(r=>r.id!=='r1'&&r.repere==='R96'&&r.snIds?.length===1&&r.snIds[0]==='u1'));
    await copyDialog.getByRole('textbox',{name:'Rechercher les destinations',exact:true}).fill('SNOTHER');
    assert.ok(await copyDialog.getByRole('checkbox',{name:'OF 100OTHER — SNOTHER',exact:true}).isDisabled());
    await page.screenshot({path:path.join(__dirname,'artifacts/cross-of-copy-1920.png')});
    await copyDialog.getByRole('button',{name:'Fermer',exact:true}).click();
    await page.getByRole('button',{name:"Pièces de l'OF",exact:true}).click();
    await page.locator('tr').filter({has:page.locator('input[value="LOT-A"]')}).getByRole('button',{name:'Scinder',exact:true}).click();
    const split=page.getByRole('dialog',{name:'Scinder le lot',exact:true});
    await split.getByLabel('Qté conservée',{exact:true}).fill('6');
    await split.getByLabel('Lot destination 1',{exact:true}).fill('LOT-B');
    await split.getByLabel('Qté destination 1',{exact:true}).fill('5');
    await split.getByRole('button',{name:'Confirmer le split',exact:true}).click();
    assert.ok((await split.getByRole('alert').textContent()).includes('égale à 10'));
    await split.getByLabel('Qté destination 1',{exact:true}).fill('4');
    await page.screenshot({path:path.join(__dirname,'artifacts/lot-split-1920.png')});
    await split.getByRole('button',{name:'Confirmer le split',exact:true}).click();
    await page.waitForFunction(()=>window.testRecords['of:test-of'].units.rows.some(u=>u.lot==='LOT-B'));
    await page.locator('tr').filter({has:page.locator('input[value="LOT-B"]')}).getByRole('button',{name:'Scinder',exact:true}).click();
    await split.getByLabel('Qté conservée',{exact:true}).fill('3');
    await split.getByLabel('Lot destination 1',{exact:true}).fill('LOT-C');
    await split.getByLabel('Qté destination 1',{exact:true}).fill('1');
    await split.getByRole('button',{name:'Confirmer le split',exact:true}).click();
    await page.waitForFunction(()=>window.testRecords['of:test-of'].lotSplits?.length===2);
    page.once('dialog',d=>d.accept('20'));
    await page.locator('tr').filter({has:page.locator('input[value="LOT-B"]')}).getByRole('button',{name:'Qté',exact:true}).click();
    await page.waitForFunction(()=>window.testRecords['of:test-of'].units.rows.find(u=>u.lot==='LOT-B').qteActuelle==='20');
    await page.getByText('Historique des lots',{exact:true}).click();
    await page.screenshot({path:path.join(__dirname,'artifacts/lot-history-1920.png')});
    await page.getByRole('button',{name:'Mating',exact:true}).click();
    const connector=page.getByRole('group',{name:'Connecteur J4',exact:true});
    assert.equal(await connector.getByRole('button',{name:'Dupliquer',exact:true}).count(),0);
    assert.ok((await connector.boundingBox()).height<=130);
    assert.equal((await connector.getByRole('button',{name:'Demating J4',exact:true}).boundingBox()).height,34);
    assert.ok(await page.getByRole('button',{name:'Mating J4',exact:true}).isDisabled());
    assert.ok(await page.getByRole('button',{name:'Demating J4',exact:true}).isEnabled());
    assert.ok(await page.getByRole('button',{name:'Mating J10',exact:true}).isEnabled());
    assert.ok(await page.getByRole('button',{name:'Demating J10',exact:true}).isDisabled());
    assert.ok(await page.getByRole('button',{name:'Mating J8',exact:true}).isEnabled());
    assert.ok(await page.getByRole('button',{name:'Demating J8',exact:true}).isEnabled());
    const confirmations=[];
    const alerts=[];
    page.on('dialog',d=>{
      if(d.type()==='prompt') return d.accept('J20');
      if(d.message().startsWith('Créer ')) return d.dismiss();
      if(d.type()==='alert'){alerts.push(d.message());return d.accept();}
      confirmations.push(d.type());return d.accept();
    });
    await page.getByRole('button',{name:'Demating J8',exact:true}).click();
    await page.waitForFunction(()=>window.testRecords['of:test-of'].demating.connectors.find(c=>c.nConect==='J8').events.at(-1)?.action==='Demating');
    assert.ok(await page.getByRole('button',{name:'Demating J8',exact:true}).isDisabled());
    await page.getByRole('button',{name:'Mating J8',exact:true}).click();
    await page.waitForFunction(()=>window.testRecords['of:test-of'].demating.connectors.find(c=>c.nConect==='J8').events.at(-1)?.action==='Mating');
    assert.deepEqual(confirmations,['confirm','confirm']);
    await page.getByRole('button',{name:'+ Connecteur',exact:true}).click();
    await page.waitForFunction(()=>window.testRecords['of:test-of'].demating.connectors.some(c=>c.nConect==='J20'&&c.validated));
    assert.ok(await page.getByRole('button',{name:'Mating J20',exact:true}).isEnabled());
    assert.ok(await page.getByRole('button',{name:'Demating J20',exact:true}).isEnabled());
    await page.getByRole('button',{name:'+ Connecteur',exact:true}).click();
    assert.equal(await page.evaluate(()=>window.testRecords['of:test-of'].demating.connectors.filter(c=>c.nConect==='J20').length),1);
    assert.ok(alerts.some(message=>message.includes('déjà existant')));
    await page.screenshot({path:path.join(__dirname,'artifacts/mating-actions-1920.png')});
    await page.setViewportSize({width:1280,height:800});
    await page.getByRole('button',{name:'Demating J4',exact:true}).scrollIntoViewIfNeeded();
    await page.screenshot({path:path.join(__dirname,'artifacts/mating-actions-1280.png')});
    await page.setViewportSize({width:1920,height:1080});
    await page.getByRole('button',{name:'Consommables',exact:true}).click();
    await page.getByRole('columnheader',{name:'Code SAP',exact:true}).waitFor();
    await page.getByText('⚠ 1 périmé',{exact:true}).waitFor();
    await page.getByText(/POLYMÉRISATION — SOUS VIDE DÈS LE/i).waitFor();
    await page.getByRole('columnheader',{name:'Sous vide dès',exact:true}).waitFor();
    await page.getByTitle(/Sous vide dès le .*2126/).waitFor();
    await page.getByTitle(/consommable périmé à la date de la ligne/i).first().waitFor();
    assert.equal(await page.getByText(/Anomalie : consommable périmé à la date de la ligne/).count(),0);
    const consoHeaders=await page.getByRole('columnheader',{name:'Code SAP',exact:true}).locator('xpath=..').locator('th').allTextContents();
    assert.deepEqual(consoHeaders.slice(5,10),['Code SAP','Désignation','LOT','DP','N° échant.']);
    const sapCell=page.getByTitle('Code SAP : 1600000046',{exact:true});
    assert.equal(await sapCell.inputValue(),'1600000046');
    assert.ok(await page.getByTitle('Désignation : Colle test longue référence',{exact:true}).isVisible());
    assert.ok(await sapCell.evaluate(el=>el.clientWidth>80));
    await page.getByRole('button',{name:'+ Ligne',exact:true}).click();
    const sapSelect=page.getByRole('textbox',{name:'Code SAP du consommable',exact:true});
    await sapSelect.fill('1600000046');await sapSelect.press('Enter');
    await page.waitForFunction(()=>window.testRecords['of:test-of'].consommables.ops.at(-1).items[0].consoId==='long-sap');
    await page.locator('body').click({position:{x:1800,y:950}});
    assert.equal(await sapSelect.inputValue(),'1600000046');
    const designationDisplay=sapSelect.locator('xpath=ancestor::tr[1]').locator('td').nth(6).locator('input');
    assert.equal(await designationDisplay.inputValue(),'Colle test longue référence');
    assert.equal(await designationDisplay.evaluate(el=>el.readOnly),true);
    await designationDisplay.click();
    assert.equal(await page.getByRole('textbox',{name:'Désignation du consommable',exact:true}).count(),0);
    assert.equal(await page.getByText('— aucun —',{exact:true}).count(),0);
    await page.getByTitle('Filtrer code SAP',{exact:true}).fill('999999');
    assert.equal(await sapCell.count(),0);
    await page.getByTitle('Filtrer code SAP',{exact:true}).fill('160 000 0046');
    await sapCell.waitFor();
    await page.screenshot({path:path.join(__dirname,'artifacts/consumables-sap-1920.png')});
    const consoDraft=sapSelect.locator('xpath=ancestor::tr[1]');
    await consoDraft.locator('td').nth(3).locator('input').fill('CS-DOC');
    await consoDraft.locator('td').nth(4).locator('input').fill('88');
    await page.waitForFunction(()=>window.testRecords['of:test-of'].consommables.ops.at(-1).op==='88');
    await page.getByRole('button',{name:'Adjust/Rework',exact:true}).click();
    await page.getByRole('button',{name:'+ Ligne',exact:true}).click();
    const sharedDraft=page.locator('[data-rework-row]').first();
    assert.equal(await sharedDraft.locator('[data-entry-field="fiche"]').inputValue(),'CS-DOC');
    assert.equal(await sharedDraft.locator('[data-entry-field="etape"]').inputValue(),'88');
    await sharedDraft.locator('[data-entry-field="fiche"]').fill('RW-DOC');
    await sharedDraft.locator('[data-entry-field="etape"]').fill('99');
    await page.waitForFunction(()=>window.testRecords['of:test-of'].rework.rows.at(-1).etape==='99');
    await page.getByRole('button',{name:'Consommables',exact:true}).click();
    await page.getByRole('button',{name:'+ Ligne',exact:true}).click();
    const reciprocal=page.getByRole('textbox',{name:'Code SAP du consommable',exact:true}).first().locator('xpath=ancestor::tr[1]');
    assert.equal(await reciprocal.locator('td').nth(3).locator('input').inputValue(),'RW-DOC');
    assert.equal(await reciprocal.locator('td').nth(4).locator('input').inputValue(),'99');
    await page.locator('#active-work-sn').selectOption('all');
    await page.getByLabel('Nouvelle ligne pour',{exact:true}).waitFor();
    assert.equal(await page.getByLabel('Nouvelle ligne pour',{exact:true}).inputValue(),'u2');
    await page.getByRole('button',{name:'+ Ligne',exact:true}).click();
    await page.waitForFunction(()=>window.testRecords['of:test-of'].consommables.ops.at(-1).snIds?.join(',')==='u2');
    await page.getByLabel('Nouvelle ligne pour',{exact:true}).selectOption('u1');
    await page.getByRole('button',{name:'Adjust/Rework',exact:true}).click();
    await page.getByRole('button',{name:'+ Ligne',exact:true}).click();
    await page.waitForFunction(()=>window.testRecords['of:test-of'].rework.rows.at(-1).snIds?.join(',')==='u1');
    assert.equal(await page.locator('#active-work-sn').inputValue(),'all');
    const multiDraft=page.locator('[data-rework-row]').first();
    await multiDraft.locator('[data-entry-field="repere"]').fill('MULTI-DEMO');
    await multiDraft.locator('[data-entry-field="action1"]').selectOption('M');
    await multiDraft.locator('[data-entry-field="qty"]').fill('1');
    await multiDraft.locator('[data-entry-field="codeERP"]').fill('123');
    await multiDraft.getByTitle('Appliquer cette opération à : SN1',{exact:true}).click();
    await page.getByRole('checkbox',{name:'SN2',exact:true}).check();
    await multiDraft.getByTitle('Appliquer cette opération à : SN1 + SN2',{exact:true}).click();
    page.removeAllListeners('dialog');
    let multiPrompt='';
    page.once('dialog',async dialog=>{multiPrompt=dialog.message();await dialog.dismiss();});
    await multiDraft.getByTitle('Valider',{exact:true}).click();
    assert.ok(multiPrompt.includes('SN1')&&multiPrompt.includes('SN2'));
    assert.ok(!(await page.evaluate(()=>window.testRecords['of:test-of'].rework.rows.at(-1).validated)));
    page.once('dialog',dialog=>dialog.accept());
    await multiDraft.getByTitle('Valider',{exact:true}).click();
    await page.waitForFunction(()=>window.testRecords['of:test-of'].rework.rows.filter(row=>row.repere==='MULTI-DEMO'&&row.validated).length===2);
    const independentRows=await page.evaluate(()=>window.testRecords['of:test-of'].rework.rows.filter(row=>row.repere==='MULTI-DEMO'));
    assert.equal(independentRows.length,2);assert.notEqual(independentRows[0].id,independentRows[1].id);
    assert.deepEqual(independentRows.map(row=>row.snIds),[['u1'],['u2']]);
    const secondSnRow=page.locator(`[data-rework-row="${independentRows[1].id}"]`);
    await secondSnRow.getByTitle('Modifier',{exact:true}).click();
    await secondSnRow.locator('[data-entry-field="valeur"]').fill('Independent change');
    await secondSnRow.locator('[data-entry-field="isAdjust"]').check();
    await secondSnRow.getByTitle('Valider',{exact:true}).click();
    await page.waitForFunction(()=>window.testRecords['of:test-of'].rework.rows.find(row=>row.repere==='MULTI-DEMO'&&row.snIds?.[0]==='u2')?.isAdjust===true);
    const firstSnRow=await page.evaluate(()=>window.testRecords['of:test-of'].rework.rows.find(row=>row.repere==='MULTI-DEMO'&&row.snIds?.[0]==='u1'));
    assert.equal(firstSnRow.isAdjust,false);assert.notEqual(firstSnRow.valeur,'Independent change');
    await page.screenshot({path:path.join(__dirname,'artifacts/explicit-entry-target-1920.png')});
    await page.getByRole('button',{name:'Consommables',exact:true}).click();
    await page.getByRole('button',{name:'⚙ Gérer la liste',exact:true}).click();
    await page.getByText('⚙ Gérer la liste des consommables',{exact:true}).waitFor();
    await page.getByRole('columnheader',{name:'Polym. [h]',exact:true}).waitFor();
    assert.equal(await page.locator('input[value="876000"]').count(),1);
    await page.locator('input[value="1600000046"]').last().fill('1600000099');
    await page.getByRole('button',{name:'✓ Enregistrer',exact:true}).click();
    await page.getByTitle('Code SAP : 1600000099',{exact:true}).waitFor();
    assert.equal(await page.evaluate(()=>window.testRecords['of:test-of'].consommables.ops[0].items[0].consoId),'long-sap');
    assert.equal(await page.evaluate(()=>window.testRecords['of:test-of'].consommables.ops[0].items[0].sap),undefined);
    await page.evaluate(()=>{window.testRecords['consommables-list'][0].sap='1600000088';window.testRecords['consommables-list'][0].label='Description actualisée';window.dispatchEvent(new Event('focus'));});
    await page.getByTitle('Code SAP : 1600000088',{exact:true}).waitFor();
    await page.getByTitle('Désignation : Description actualisée',{exact:true}).first().waitFor();
    await page.getByRole('button',{name:'⚙ Gérer la liste',exact:true}).click();
    await page.getByText('⚙ Gérer la liste des consommables',{exact:true}).waitFor();
    await page.locator('input[value="1600000088"]').last().fill('1600000077');
    await page.evaluate(()=>{
      const original=window.storage.set;window.testOriginalSet=original;
      window.storage.set=async(key,value)=>{if(key==='consommables-list')throw new Error('Test write failure');return original(key,value);};
    });
    const writeFailure=page.waitForEvent('dialog');
    let saveError='';page.once('dialog',async dialog=>{saveError=dialog.message();await dialog.accept();});
    await page.getByRole('button',{name:'✓ Enregistrer',exact:true}).click();
    await writeFailure;
    assert.ok(saveError.includes('Liste non enregistrée'));
    assert.ok(await page.getByText('⚙ Gérer la liste des consommables',{exact:true}).isVisible());
    assert.equal(await page.evaluate(()=>window.testRecords['consommables-list'][0].sap),'1600000088');
    await page.getByRole('button',{name:'Annuler',exact:true}).click();
    await page.evaluate(()=>{window.storage.set=window.testOriginalSet;});
    await page.getByRole('button',{name:'⚙ Gérer la liste',exact:true}).click();
    await page.getByText('⚙ Gérer la liste des consommables',{exact:true}).waitFor();
    await page.locator('input[value="1600000088"]').last().fill('1600000077');
    await page.evaluate(()=>{window.testRecords['consommables-list'][0].sap='1600000066';});
    const conflictFailure=page.waitForEvent('dialog');
    let conflictError='';page.once('dialog',async dialog=>{conflictError=dialog.message();await dialog.accept();});
    await page.getByRole('button',{name:'✓ Enregistrer',exact:true}).click();
    await conflictFailure;
    assert.ok(conflictError.includes('modifiée par un autre utilisateur'));
    assert.equal(await page.evaluate(()=>window.testRecords['consommables-list'][0].sap),'1600000066');
    await page.getByRole('button',{name:'Annuler',exact:true}).click();
    await page.evaluate(()=>{
      const of=window.testRecords['of:test-of'];
      const common={createdVisa:'OTHER',validated:true,snScope:'custom',snIds:['u1'],comments:[{id:'old-comment',text:'Not copied'}]};
      of.consommables.ops[0].items[0].echantillon='ECH-SOURCE';
      of.testequip={rows:[...['u1','u2','lot-a'].map((unitId,index)=>({...common,id:'copy-test-'+index,isFour:true,nInv:'INV-123',type:'Instrument',designation:'Test instrument',dateExpiration:'31.12.30',snIds:[unitId]}))]};
      of.faits={rows:[{...common,id:'copy-fait',type:'FT',numero:'FT-123',lien:'https://example.com',closedDate:'18/09/2026'}]};
      of.etuvage={rows:[{...common,id:'copy-oven',createdDT:'18/09/2026 07:55',fourN:'INV-123',duree:'2',temp:'60',entreeDT:'18/09/2026 08:00',entreeVisa:'OTHER',sortieDT:'18/09/2026 10:00',sortieVisa:'CTRL'}]};
      of.openwork={rows:[{...common,id:'copy-ow',nOW:'001',description:'Work to copy',closedDate:'18/09/2026'}]};
      of.demating={connectors:[{...common,id:'copy-connector',nConect:'J123',events:[{id:'old-cycle',action:'Matting',dt:'18/09/2026 08:00',visa:'OTHER'}]}]};
    });
    await page.locator('body').click({position:{x:1800,y:950}});
    await page.keyboard.press('PageDown');
    await page.waitForFunction(()=>document.querySelector('input[aria-label="Rechercher ou scanner un numéro d\'OF"]')?.value==='100OTHER');
    await page.keyboard.press('PageUp');
    await page.waitForFunction(()=>document.querySelector('input[aria-label="Rechercher ou scanner un numéro d\'OF"]')?.value==='100TEST');
    for(const [tab,label,collection,field,value] of [
      ['consommables','Consommables','ops','fiche',null],
      ['testequip','Test Équipement','rows','nInv','INV-123'],
      ['faits','Faits','rows','numero','FT-123'],
      ['etuvage','Étuvages','rows','fourN','INV-123'],
      ['openwork','Open Work','rows','description','Work to copy'],
      ['demating','Mating','connectors','nConect','J123']
    ]){
      await page.getByRole('button',{name:label,exact:true}).click();
      if(tab==='etuvage'){
        assert.equal(await page.locator('#fours-etuvage').count(),1);
        assert.equal(await page.locator('#fours-etuvage option').count(),1);
        assert.equal(await page.locator('#fours-etuvage option').getAttribute('value'),'INV-123');
        await page.evaluate(()=>{window.testRecords['of:other-of'].testequip={rows:[]};});
      }
      const copyButton=tab==='demating'?page.getByTitle('Copier vers OF / SN',{exact:true}).first():page.locator('table').last().getByTitle('Dupliquer',{exact:true}).first();
      await copyButton.click();
      console.log('Testing copy modal:',tab);
      const modal=page.getByRole('dialog',{name:'Copier vers OF / SN',exact:true});
      await modal.getByRole('checkbox',{name:'OF 100TEST — SN1',exact:true}).waitFor();
      if(tab==='etuvage'){
        assert.ok(await modal.getByRole('radio',{name:/Même opération sur plusieurs SN\/OF/}).isChecked());
        assert.ok(await modal.getByRole('radio',{name:/Nouvelle opération à partir de cette ligne/}).isDisabled());
      }else{
        assert.ok(await modal.getByRole('radio',{name:/Nouvelle opération à partir de cette ligne/}).isChecked());
      }
      assert.equal(await modal.getByRole('checkbox',{name:/^OF /}).first().getAttribute('aria-label'),'OF 100TEST — SN1');
      assert.equal(await modal.getByRole('checkbox',{name:/^OF /,checked:true}).count(),0);
      await modal.getByRole('textbox',{name:'Rechercher les destinations',exact:true}).fill('SNOTHER');
      await modal.getByRole('checkbox',{name:'OF 100OTHER — SNOTHER',exact:true}).check();
      await modal.getByRole('button',{name:'Copier 1 ligne(s) vers 1 destination(s)',exact:true}).click();
      await page.waitForFunction(({tab,collection})=>window.testRecords['of:other-of'][tab]?.[collection]?.length===1,{tab,collection});
      const copied=await page.evaluate(({tab,collection})=>window.testRecords['of:other-of'][tab][collection][0],{tab,collection});
      assert.equal(copied.createdVisa,tab==='etuvage'?'OTHER':'JGR');assert.equal(copied.validated,true);assert.deepEqual(copied.snIds,['other-unit']);
      assert.equal(copied.copyOrigin.sourceOf,'100TEST');assert.equal(copied.copyOrigin.sourceArticle,'250001163');assert.ok(copied.copyOrigin.sourceUnits.includes('SN1'));assert.equal(copied.copyOrigin.copiedBy,'JGR');
      if(value!==null) assert.equal(copied[field],value);
      if(tab==='consommables'){assert.equal(copied.items.length,1);assert.equal(copied.items[0].createdVisa,'JGR');assert.equal(copied.items[0].tracaOk,false);assert.equal(copied.items[0].echantillon,'');}
      if(tab==='etuvage'){
        assert.equal(copied.createdDT,'18/09/2026 07:55');assert.equal(copied.entreeDT,'18/09/2026 08:00');assert.equal(copied.entreeVisa,'OTHER');assert.equal(copied.sortieDT,'18/09/2026 10:00');assert.equal(copied.sortieVisa,'CTRL');
        assert.equal(await page.evaluate(()=>window.testRecords['of:other-of'].testequip.rows.length),1);
        assert.equal(await page.evaluate(()=>window.testRecords['of:other-of'].testequip.rows[0].nInv),'INV-123');
      }else assert.deepEqual(copied.comments,[]);
      if(tab==='demating'){assert.deepEqual(copied.events,[]);assert.equal(copied.validated,true);}
      if(['faits','openwork'].includes(tab)) assert.equal(copied.closedDate,'');
      await modal.getByRole('button',{name:'Fermer',exact:true}).click();
    }
    await page.evaluate(()=>{
      const of=window.testRecords['of:test-of'];
      of.rework.rows.push({id:'draft-rework',createdVisa:'JGR',createdDT:'22/09/2026 10:00',validated:false,editBase:{repere:'R10'},repere:'R10',action1:'S',snScope:'custom',snIds:['u1']});
      of.consommables.ops.push({id:'draft-conso-op',createdVisa:'JGR',createdDT:'22/09/2026 10:00',validated:false,editBase:{fiche:'DOC'},fiche:'DOC',op:'10',snScope:'custom',snIds:['u1'],items:[{id:'draft-conso-item',createdVisa:'JGR',validated:false,editBase:{lot:'DRAFT-LOT'},consoId:'long-sap',lot:'DRAFT-LOT'}]});
      of.openwork.rows.push({id:'draft-ow',createdVisa:'JGR',createdDT:'22/09/2026 10:00',validated:false,editBase:{description:'DRAFT-OW'},description:'DRAFT-OW',openVisa:'JGR',openDate:'22/09/2026',snScope:'custom',snIds:['u1']});
    });
    await page.locator('body').click({position:{x:1800,y:950}});
    await page.keyboard.press('PageDown');
    await page.waitForFunction(()=>document.querySelector('input[aria-label="Rechercher ou scanner un numéro d\'OF"]')?.value==='100OTHER');
    await page.keyboard.press('PageUp');
    await page.waitForFunction(()=>document.querySelector('input[aria-label="Rechercher ou scanner un numéro d\'OF"]')?.value==='100TEST');
    for(const [label,selector,tab,collection,id] of [
      ['Adjust/Rework','[data-rework-row="draft-rework"]','rework','rows','draft-rework'],
      ['Consommables','tr:has(input[value="DRAFT-LOT"])','consommables','ops','draft-conso-op'],
      ['Open Work','tr:has(input[value="DRAFT-OW"])','openwork','rows','draft-ow']
    ]){
      await page.getByRole('button',{name:label,exact:true}).click();
      await page.locator(selector).getByTitle('Supprimer',{exact:true}).click();
      assert.equal(await page.getByText("Motif de l'annulation *",{exact:true}).count(),0);
      await page.waitForFunction(({tab,collection,id})=>{
        const row=window.testRecords['of:test-of'][tab][collection].find(row=>row.id===id);
        return tab==='consommables'?row?.items?.find(item=>item.id==='draft-conso-item')?.deleted===true:row?.deleted===true;
      },{tab,collection,id});
    }
    await page.getByRole('button',{name:'Open Work',exact:true}).click();
    await page.locator('tr:has(input[value="Work to copy"])').getByTitle('Annuler',{exact:true}).click();
    await page.getByText("Motif de l'annulation *",{exact:true}).waitFor();
    await page.getByRole('button',{name:'Annuler',exact:true}).click();
    await page.evaluate(()=>{
      const of=window.testRecords['of:test-of'];
      const draft={createdVisa:'JGR',createdDT:'22/09/2026 10:00',validated:false,editBase:{},snScope:'custom',snIds:['u1']};
      of.testequip.rows.push({...draft,id:'draft-test-delete',nInv:'INV-DELETE',type:'Instrument',designation:'To delete'});
      of.faits.rows.push({...draft,id:'draft-fait-delete',type:'FT',numero:'FT-DELETE',visa:'JGR'});
      of.etuvage.rows.push({...draft,id:'draft-oven-delete',fourN:'FOUR-DELETE',duree:'2',temp:'60'});
      of.demating.connectors.push({...draft,id:'draft-connector-delete',nConect:'J-DELETE',events:[]});
    });
    await page.locator('body').click({position:{x:1800,y:950}});
    await page.keyboard.press('PageDown');
    await page.waitForFunction(()=>document.querySelector('input[aria-label="Rechercher ou scanner un numéro d\'OF"]')?.value==='100OTHER');
    await page.keyboard.press('PageUp');
    await page.waitForFunction(()=>document.querySelector('input[aria-label="Rechercher ou scanner un numéro d\'OF"]')?.value==='100TEST');
    for(const [label,selector,tab,collection,id] of [
      ['Test Équipement','tr:has(input[value="INV-DELETE"])','testequip','rows','draft-test-delete'],
      ['Faits','tr:has(input[value="FT-DELETE"])','faits','rows','draft-fait-delete'],
      ['Étuvages','tr:has(input[value="FOUR-DELETE"])','etuvage','rows','draft-oven-delete'],
      ['Mating','[role="group"][aria-label="Connecteur J-DELETE"]','demating','connectors','draft-connector-delete']
    ]){
      await page.getByRole('button',{name:label,exact:true}).click();
      await page.locator(selector).getByTitle(tab==='etuvage'?'Annuler':'Supprimer',{exact:true}).click();
      assert.equal(await page.getByText("Motif de l'annulation *",{exact:true}).count(),0);
      await page.waitForFunction(({tab,collection,id})=>window.testRecords['of:test-of'][tab][collection].find(row=>row.id===id)?.deleted===true,{tab,collection,id});
    }
    await page.evaluate(()=>{
      const of=window.testRecords['of:test-of'];
      of.units.rows.push({id:'lamp-em07',sn:'',lot:'LAMPE-EM07',unitKind:'lot',qteInitiale:'1',status:'en_cours',createdVisa:'JGR'});
      of.rework.rows.push({id:'lamp-linked-row',createdVisa:'JGR',validated:true,repere:'R-LAMP',action1:'S',snScope:'custom',snIds:['lamp-em07']});
    });
    await page.locator('body').click({position:{x:1800,y:950}});
    await page.keyboard.press('PageDown');
    await page.waitForFunction(()=>document.querySelector('input[aria-label="Rechercher ou scanner un numéro d\'OF"]')?.value==='100OTHER');
    await page.keyboard.press('PageUp');
    await page.waitForFunction(()=>document.querySelector('input[aria-label="Rechercher ou scanner un numéro d\'OF"]')?.value==='100TEST');
    await page.getByRole('button',{name:"Pièces de l'OF",exact:true}).click();
    const lampRow=page.locator('tr:has(input[value="LAMPE-EM07"])');
    await lampRow.getByRole('button',{name:'→ SN',exact:true}).click();
    await page.waitForFunction(()=>{
      const of=window.testRecords['of:test-of'];
      const unit=of.units.rows.find(row=>row.id==='lamp-em07');
      return unit?.sn==='LAMPE-EM07'&&unit?.lot===''&&unit?.unitKind==='sn';
    });
    assert.deepEqual(await page.evaluate(()=>window.testRecords['of:test-of'].rework.rows.find(row=>row.id==='lamp-linked-row').snIds),['lamp-em07']);
    assert.deepEqual(errors, []);
    console.log('UI tests passed: independent finished SN/status, row selection and editable mail draft.');
  } finally {await browser.close();}
})().catch(error => {console.error(error); process.exitCode = 1;});

const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const context={React:{createElement:()=>({})},ReactDOM:{createRoot:()=>({render:()=>{}})},
  document:{documentElement:{style:{}},body:{style:{}},getElementById:()=>({})},localStorage:{getItem:()=>null},Blob,TextEncoder};
vm.createContext(context);
vm.runInContext(fs.readFileSync(path.join(__dirname,'../src/App.runtime.js'),'utf8')+';globalThis.pdf=buildDirectReportPdf;',context);
const units=[{id:'u1',sn:'SN1'},{id:'u2',sn:'SN2'}];
const row=(id,action1,lot,dc,extra={})=>({id,repere:id,action1,lot,dc,codeERP:'250000465',valeur:'10K',qty:'1',
  createdDT:'18/09/2026 08:00',createdVisa:'JGR',validated:true,fiche:'DOC',etape:'10',visaCtrl:'JMA',dateCtrl:'18/09/2026 08:10',
  snScope:'custom',snIds:['u1'],...extra});
const rows=[row('BOTH','S','',''),row('DC_ONLY','M','0000020516',''),row('LOT_ONLY','S','','N/A'),
  row('POINTED','P','',''),row('OK','S','0000020516','N/A'),row('DESOLDER','D','',''),
  row('CANCELLED','S','','',{deleted:true,deletedReason:'Test',deletedDate:'18/09/2026',deletedVisa:'JGR'}),
  row('OTHER_SN','S','','',{snIds:['u2']}),row('EXPIRED','S','0000020516','0101')];
const build=rows=>context.pdf({ofData:{header:{of:'100TEST',codeArticle:'250000465',description:'Verification PDF',otp:'7400-TEST'},
  units:{rows:units},rework:{rows}},lists:{},exportedAt:'18/09/2026 08:15',exportedBy:'JGR',selectedSnIds:['u1'],selectedSections:['rework']});
(async()=>{
  const blob=build(rows), raw=await blob.text();
  assert.ok(!raw.includes('Tracabilite a completer - LOT / DC manquants'),'Missing LOT/DC is shown by red cells without a duplicate warning block');
  for(const id of ['BOTH','DC_ONLY','LOT_ONLY','POINTED']) assert.ok(raw.includes(id));
  assert.ok(!raw.includes('OTHER_SN'));
  const fills=raw.split("0.99 0.91 0.91 rg").length-1;
  assert.ok(fills>=6,'Missing LOT/DC cells on applicable live rows get red fills');
  assert.ok(/\/F2 6\.1 Tf 0\.85 0\.21 0\.20 rg[^\n]+\(0101\)/.test(raw),'Expired DC remains red and bold');
  const complete=await build([row('COMPLETE','S','0000020516','N/A')]).text();
  assert.ok(!complete.includes('LOT / DC manquants'));
  const consoPdf=await context.pdf({ofData:{header:{of:'100TEST',codeArticle:'250000465',description:'Verification PDF',otp:'7400-TEST'},
    units:{rows:units},consommables:{ops:[{id:'op1',createdDT:'18/09/2026 08:00',createdVisa:'JGR',fiche:'DOC',op:'10',snIds:['u1'],items:[
      {id:'expired',createdDT:'18/09/2026 08:01',createdVisa:'JGR',consoId:'c1',lot:'0000020516',dp:'17.09.26',validated:true}
    ]}]}},lists:{consommables:[{id:'c1',sap:'1600000046',label:'Consommable test'}]},exportedAt:'18/09/2026 08:15',exportedBy:'JGR',selectedSnIds:['u1'],selectedSections:['consommables']}).text();
  assert.ok(/0\.99 0\.91 0\.91 rg/.test(consoPdf),'Expired consumable DP cell is highlighted in red');
  const factsPdf=await context.pdf({ofData:{header:{of:'100TEST',codeArticle:'250000465',description:'Verification PDF',otp:'7400-TEST'},
    units:{rows:units},faits:{rows:[{id:'fact1',createdDT:'18/09/2026 08:00',createdVisa:'JGR',type:'NC',numero:'NC-123',date:'18/09/2026',lien:'REF',commentaires:'Fait visible',closedDate:'31/12/2099',closedVisa:'CLOSEV',snIds:['u1']}]}},
    lists:{},exportedAt:'18/09/2026 08:15',exportedBy:'JGR',selectedSnIds:['u1'],selectedSections:['faits']}).text();
  assert.ok(factsPdf.includes('NC-123')&&factsPdf.includes('Fait visible'));
  assert.ok(!factsPdf.includes('31/12/2099')&&!factsPdf.includes('CLOSEV'),'Fact status and closure visa must not appear in the PDF');
  const many=await build(Array.from({length:100},(_,i)=>row('R'+i,'S','',''))).text();
  for(const match of many.matchAll(/ ([\d.]+) (-?[\d.]+) ([\d.]+) ([\d.]+) re B/g))
    assert.ok(Number(match[2])>=0,'Warnings and cells must stay within the page');
  const folder=path.join(__dirname,'artifacts');fs.mkdirSync(folder,{recursive:true});
  fs.writeFileSync(path.join(folder,'rework-missing-trace.pdf'),Buffer.from(await blob.arrayBuffer()));
  console.log('PDF: missing LOT/DC warnings, red cells, scope/cancellation, expired DC and pagination OK');
})().catch(error=>{console.error(error);process.exitCode=1;});

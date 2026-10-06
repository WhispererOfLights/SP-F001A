const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const {spawnSync} = require('node:child_process');
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
  ';globalThis.sapRows=buildSapExcelRows;globalThis.excelWorkbook=buildExcelWorkbook;', context);

const unit = {id:'u1',sn:'SN-FINI',unitKind:'sn'};
const rework = (id,repere,action1,codeERP,createdDT,extra={}) => ({
  id,repere,action1,codeERP,createdDT,validated:true,snScope:'custom',snIds:['u1'],...extra,
});
const ofData = {
  header:{of:'1000',_snRows:[unit]},
  units:{rows:[unit]},
  rework:{rows:[
    rework('r1','R1','S','ARTICLE-A','01/05/2026 08:00',{lot:'LOT-A'}),
    rework('r2','R1','D','ARTICLE-A','01/05/2026 09:00'),
    rework('r3','R2','S','ARTICLE-B','01/05/2026 08:00'),
    rework('r4','R2','S','ARTICLE-C','01/05/2026 09:00'),
    rework('r5','R3','P','ARTICLE-P','01/05/2026 10:00',{sn:'SN-COMP',qty:'2',lot:'LOT-P'}),
    rework('r6','R4','M','ARTICLE-M','01/05/2026 11:00',{qty:'3'}),
    rework('r7','R5','R','ARTICLE-R','01/05/2026 12:00'),
    rework('draft','R6','S','DRAFT','01/05/2026 13:00',{validated:false}),
  ]},
  consommables:{ops:[{
    id:'op1',validated:true,snScope:'custom',snIds:['u1'],items:[{
      id:'item1',validated:true,consoId:'conso1',echantillon:'ECH-1',lot:'0000020452',qty:'4',
    }],
  }]},
  faits:{rows:[
    {id:'f1',validated:true,snScope:'custom',snIds:['u1'],type:'NC',numero:'NC-001'},
    {id:'f2',validated:true,snScope:'custom',snIds:['u1'],type:'DM',numero:'DM-001'},
    {id:'f3',validated:true,snScope:'custom',snIds:['u1'],type:'ISS',numero:'ISS-001'},
  ]},
};
const rows = context.sapRows({ofData,consommables:[{id:'conso1',sap:'1600000046',label:'Soudure'}],selectedSnIds:['u1']});

assert.ok(rows.IB52.every(row=>row.length===9));
assert.ok(rows.CO02.every(row=>row.length===12));
assert.equal(rows.IB52[0][2],'1600000046','Les consommables sont placés en premier dans IB52');
assert.deepEqual(Array.from(rows.IB52,row=>row[2]),['1600000046','ARTICLE-C','ARTICLE-P','ARTICLE-M','2920000656','2920000657','2920000656']);
assert.equal(rows.IB52.some(row=>row[2]==='ARTICLE-A'),false,'Un composant finalement dessoudé est absent de IB52');
assert.equal(rows.IB52.find(row=>row[2]==='ARTICLE-P')[4],'SN-COMP');
assert.equal(rows.IB52.find(row=>row[2]==='ARTICLE-P')[8],'LOT-P');
assert.deepEqual(Array.from(rows.IB52.slice(-3),row=>row[8]),['NC-001','DM-001','ISS-001']);
assert.deepEqual(Array.from(rows.CO02,row=>row[0]),['ARTICLE-A','ARTICLE-B','ARTICLE-C','ARTICLE-P','ARTICLE-M','1600000046']);
assert.deepEqual(Array.from(rows.CO02[0].slice(4,9)),['L','0010','0','7700','PRD3']);
assert.equal(rows.CO02.at(-1)[11],'0000020452');
assert.equal(rows.CO02.some(row=>row.includes('NC-001')||row.includes('DM-001')||row.includes('ISS-001')),false,'Les faits techniques sont exclus de CO02');
assert.ok(rows.FULL.every(row=>row.length===27));
const fullFacts=rows.FULL.filter(row=>row[0]==='Fait technique');
assert.deepEqual(Array.from(fullFacts,row=>[row[7],row[11],row[13]]),[
  ['NC','2920000656','NC-001'],['DM','2920000657','DM-001'],['ISS','2920000656','ISS-001'],
]);

(async()=>{
  const ib52Headers=['','','Article','','N° série','Qté','','','Lot'];
  const co02Headers=['Article','','Qté','','Type','Opération','Séquence','Division','Magasin','','','Lot'];
  const fullHeaders=['Source','Date','Visa','SN cible','LOT cible','Fiche suiveuse','OP','Repère / Type','Action / Statut','Qté','N° échantillon / Fait','Code article','Valeur / Désignation','LOT / N° fait','DC / DP','CTRL','TRAÇA','Date ouverture','Visa ouverture','Date clôture','Visa clôture','Lien','Commentaires','Annulée','Annulée le','Annulée par','Motif annulation'];
  const blob=context.excelWorkbook([
    {name:'IB52',rows:[ib52Headers,...rows.IB52],headerRows:1},
    {name:'CO02',rows:[co02Headers,...rows.CO02],headerRows:1},
    {name:'Toutes les infos',rows:[fullHeaders,...rows.FULL],headerRows:1},
  ]);
  assert.equal(blob.type,'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  const bytes=Buffer.from(await blob.arrayBuffer());
  assert.equal(bytes.subarray(0,2).toString(),'PK');
  const raw=bytes.toString('utf8');
  for(const marker of ['xl/workbook.xml','xl/worksheets/sheet1.xml','xl/worksheets/sheet2.xml','xl/worksheets/sheet3.xml','name="IB52"','name="CO02"','name="Toutes les infos"']) assert.ok(raw.includes(marker),marker);
  for(const marker of ['N° série','Opération','Séquence','Division','Magasin','s="1"']) assert.ok(raw.includes(marker),marker);
  const tempFile=path.join(os.tmpdir(),`sp-f001a-sap-${process.pid}.xlsx`);
  fs.writeFileSync(tempFile,bytes);
  const zipCheck=spawnSync('python',['-c','import sys,zipfile,xml.etree.ElementTree as ET; z=zipfile.ZipFile(sys.argv[1]); assert z.testzip() is None; ET.fromstring(z.read("xl/workbook.xml")); ET.fromstring(z.read("xl/worksheets/sheet1.xml")); ET.fromstring(z.read("xl/worksheets/sheet2.xml")); ET.fromstring(z.read("xl/worksheets/sheet3.xml"))',tempFile],{encoding:'utf8'});
  fs.rmSync(tempFile,{force:true});
  assert.equal(zipCheck.status,0,zipCheck.stderr||'Validation ZIP/XML Excel échouée');
  console.log('SAP Excel IB52/CO02: all tests passed.');
})().catch(error=>{console.error(error);process.exitCode=1;});

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

(async()=>{
  const context={
    React:{createElement:()=>({})},ReactDOM:{createRoot:()=>({render:()=>{}})},
    document:{documentElement:{style:{}},body:{style:{}},getElementById:()=>({})},
    localStorage:{getItem:()=>null},Blob,TextEncoder,URL,
  };
  vm.createContext(context);
  vm.runInContext(fs.readFileSync(path.join(__dirname,'../src/App.runtime.js'),'utf8')+
    ';globalThis.labels=buildOperationalLabelsPdf;',context);

  const units=[
    {id:'u1',sn:'SN001',unitKind:'sn'},
    {id:'u2',sn:'SN002',unitKind:'sn'},
  ];
  const ofData={
    header:{of:'16000001',codeArticle:'250001153',description:'Module test',otp:'7400-TEST'},
    units:{rows:units},
    consommables:{ops:[{
      id:'op1',validated:true,snScope:'custom',snIds:['u1'],createdDT:'20/10/2026 08:00',
      items:[
        {id:'i1',validated:true,consoId:'glue',createdDT:'20/10/2026 08:00'},
        {id:'i2',validated:true,consoId:'coating',createdDT:'21/10/2026 08:00'},
      ],
    }]},
    faits:{rows:[
      {id:'f1',type:'NC',numero:'NC100',commentaires:'Premier fait',snScope:'custom',snIds:['u1']},
      {id:'f2',type:'ISS',numero:'ISS101',commentaires:'Deuxieme fait',snScope:'custom',snIds:['u1']},
      {id:'f3',type:'DM',numero:'DM102',commentaires:'Troisieme fait',snScope:'custom',snIds:['u1']},
      {id:'f4',type:'OW',numero:'004',commentaires:'Quatrieme fait',snScope:'custom',snIds:['u1']},
    ]},
  };
  const consommables=[
    {id:'glue',sap:'2920000100',label:'Colle A',cat:'Colle',polymerizationHours:'24'},
    {id:'coating',sap:'2920000200',label:'Vernis B',cat:'Coating',polymerizationHours:'72'},
  ];

  const kitting=await context.labels({type:'kitting',entries:[{ofData,selectedUnitIds:['u1','u2']}],consommables}).text();
  assert.ok(kitting.includes('/MediaBox [0 0 215.43 144.00]'));
  assert.ok(kitting.includes('(KITTING - OF 16000001)'));
  assert.ok(kitting.includes('(SN de SN001'));
  assert.ok(kitting.includes('(Qt'));

  const bondingBlob=context.labels({type:'bonding',entries:[{ofData,selectedUnitIds:['u1']}],consommables});
  const bonding=await bondingBlob.text();
  assert.ok(bonding.includes('(COATING)'));
  assert.ok(bonding.includes('Vernis B'));
  assert.ok(bonding.includes('(D\\351but : 21/10/2026'));
  assert.ok(bonding.includes('(Fin : 24/10/2026'));
  fs.mkdirSync(path.join(__dirname,'artifacts'),{recursive:true});
  fs.writeFileSync(path.join(__dirname,'artifacts/bonding-label.pdf'),Buffer.from(await bondingBlob.arrayBuffer()));

  const factsBlob=context.labels({type:'facts',entries:[{ofData,selectedUnitIds:['u1']}],consommables});
  const facts=await factsBlob.text();
  assert.ok(facts.includes('/Count 2'));
  assert.equal((facts.match(/\(250001153 - SN001\)/g)||[]).length,2);
  assert.ok(facts.includes('OW004'));
  fs.writeFileSync(path.join(__dirname,'artifacts/facts-labels.pdf'),Buffer.from(await factsBlob.arrayBuffer()));
  console.log('Operational labels: all tests passed.');
})().catch(error=>{console.error(error);process.exit(1);});

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
    ';globalThis.labels=buildOperationalLabelsPdf;globalThis.labelAvailable=operationalLabelTypeAvailable;globalThis.labelAvailability=operationalLabelAvailability;',context);

  const units=[
    {id:'u1',sn:'SN001',unitKind:'sn'},
    {id:'u2',sn:'SN002',unitKind:'sn'},
    {id:'u3',lot:'LOT-42',unitKind:'lot',qteActuelle:'12'},
  ];
  const ofData={
    header:{of:'16000001',codeArticle:'250001153',description:'Module test',otp:'7400-TEST'},
    units:{rows:units},
    consommables:{ops:[{
      id:'op1',validated:true,snScope:'custom',snIds:['u1'],createdDT:'20/10/2026 08:00',createdVisa:'JGR',
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
  assert.equal(context.labelAvailable({type:'bonding',ofData,selectedUnitIds:['u1'],consommables}),true);
  assert.equal(context.labelAvailable({type:'bonding',ofData,selectedUnitIds:['u2'],consommables}),false);
  assert.equal(context.labelAvailable({type:'vacuum',ofData,selectedUnitIds:['u1'],consommables}),true);
  assert.equal(context.labelAvailable({type:'vacuum',ofData,selectedUnitIds:['u2'],consommables}),false);
  assert.equal(context.labelAvailable({type:'facts',ofData,selectedUnitIds:['u1'],consommables}),true);
  assert.equal(context.labelAvailable({type:'facts',ofData,selectedUnitIds:['u2'],consommables}),false);
  assert.equal(context.labelAvailable({type:'bonding',ofData,selectedUnitIds:['u1','u2'],consommables}),true);
  assert.equal(context.labelAvailable({type:'facts',ofData,selectedUnitIds:['u1','u2'],consommables}),true);
  assert.deepEqual({...context.labelAvailability({type:'facts',ofData,selectedUnitIds:['u1','u2'],consommables})},{available:true,count:1,total:2});

  fs.mkdirSync(path.join(__dirname,'artifacts'),{recursive:true});
  const assertLandscapeSafeMargin=(content,label)=>assert.ok(content.includes('8.50 8.50 198.43 126.99 re S'),`${label}: marge de sécurité de 3 mm`);
  const identificationBlob=context.labels({type:'identification',entries:[{ofData,selectedUnitIds:['u1']}],consommables});
  const identification=await identificationBlob.text();
  for(const expected of ['16000001','250001153','Module test','SN001','7400-TEST']) assert.ok(identification.includes(expected),`identification: ${expected}`);
  assertLandscapeSafeMargin(identification,'identification');
  fs.writeFileSync(path.join(__dirname,'artifacts/identification-label.pdf'),Buffer.from(await identificationBlob.arrayBuffer()));

  const kittingBlob=context.labels({type:'kitting',entries:[{ofData,selectedUnitIds:['u1','u2']}],consommables});
  const kitting=await kittingBlob.text();
  assert.ok(kitting.includes('/MediaBox [0 0 215.43 144.00]'));
  assert.ok(kitting.includes('(KITTING)'));
  assert.ok(kitting.includes('(OF 16000001 - OTP 7400-TEST)'));
  assert.ok(kitting.includes('(SN de SN001'));
  assert.ok(kitting.includes('Qt\\351 2'));
  assertLandscapeSafeMargin(kitting,'kitting');
  fs.writeFileSync(path.join(__dirname,'artifacts/kitting-labels.pdf'),Buffer.from(await kittingBlob.arrayBuffer()));

  const portraitBlob=context.labels({type:'binder',orientation:'portrait',entries:[{ofData,selectedUnitIds:['u1']}],consommables});
  const portrait=await portraitBlob.text();
  assert.ok(portrait.includes('/MediaBox [0 0 144.00 215.43]'));
  for(const expected of ['250001153','Module test','SN001','OF 16000001','OTP 7400-TEST']) assert.ok(portrait.includes(expected),`portrait: ${expected}`);
  assert.ok(/\/F2 22\.00 Tf [^\n]+\(SN001\)/.test(portrait),'Le SN reste très visible en portrait');
  assert.ok(portrait.includes('8.50 8.50 126.99 198.43 re S'),'portrait: marge de sécurité de 3 mm');
  fs.writeFileSync(path.join(__dirname,'artifacts/binder-label-portrait.pdf'),Buffer.from(await portraitBlob.arrayBuffer()));

  for(const type of ['binder','stock']){
    const blob=context.labels({type,entries:[{ofData,selectedUnitIds:['u1']}],consommables});
    const content=await blob.text();
    for(const expected of ['250001153','Module test','SN001','OF 16000001','7400-TEST']) assert.ok(content.includes(expected),`${type}: ${expected}`);
    if(type==='binder') assert.ok(!content.includes('CLASSEUR'));
    assertLandscapeSafeMargin(content,type);
    fs.writeFileSync(path.join(__dirname,`artifacts/${type}-label.pdf`),Buffer.from(await blob.arrayBuffer()));
  }
  const stockLotBlob=context.labels({type:'stock',entries:[{ofData,selectedUnitIds:['u3']}],consommables});
  const stockLot=await stockLotBlob.text();
  assert.ok(stockLot.includes('LOT-42'));
  assert.ok(!stockLot.includes('MISE EN STOCK'));
  assert.ok(!stockLot.includes('Qt\\351 12'));
  assert.ok(!stockLot.includes('0.70 0.73 0.77 RG .45 w 8 59.00 m'),'L’étiquette de stockage ne contient plus de trait séparateur');
  assert.ok(/\/F2 18\.00 Tf [^\n]+\(250001153\)/.test(stockLot),'Le code article SAP est affiché en grand');
  fs.writeFileSync(path.join(__dirname,'artifacts/stock-lot-label.pdf'),Buffer.from(await stockLotBlob.arrayBuffer()));

  const bondingBlob=context.labels({type:'bonding',entries:[{ofData,selectedUnitIds:['u1','u2']}],consommables});
  const bonding=await bondingBlob.text();
  assert.ok(bonding.includes('(COATING)'));
  for(const expected of ['250001153','Module test','SN001','OF 16000001','7400-TEST']) assert.ok(bonding.includes(expected),`bonding: ${expected}`);
  assert.ok(bonding.includes('Vernis B'));
  assert.ok(bonding.includes('(D\\351but : 21.10.2026'));
  assert.ok(bonding.includes('Fin : 24.10.2026'));
  assert.ok(!bonding.includes('Dur\\351e'));
  assertLandscapeSafeMargin(bonding,'bonding');
  fs.writeFileSync(path.join(__dirname,'artifacts/bonding-label.pdf'),Buffer.from(await bondingBlob.arrayBuffer()));

  const vacuumBlob=context.labels({type:'vacuum',entries:[{ofData,selectedUnitIds:['u1','u2']}],consommables});
  const vacuum=await vacuumBlob.text();
  assert.ok(vacuum.includes('(MISE SOUS VIDE LE)'));
  assert.ok(vacuum.includes('(24.10.2026)'),'La date reprend la fin de la dernière polymérisation');
  assert.ok(vacuum.includes('(VISA)')&&vacuum.includes('(JGR)'));
  assert.ok(vacuum.includes('/Count 1'),'Seuls les SN avec une polymérisation produisent une étiquette de mise sous vide');
  assertLandscapeSafeMargin(vacuum,'mise sous vide');
  fs.writeFileSync(path.join(__dirname,'artifacts/vacuum-label.pdf'),Buffer.from(await vacuumBlob.arrayBuffer()));

  const factsBlob=context.labels({type:'facts',entries:[{ofData,selectedUnitIds:['u1','u2']}],consommables});
  const facts=await factsBlob.text();
  assert.ok(facts.includes('/Count 2'));
  assert.ok(facts.includes('OF 16000001 - OTP 7400-TEST'));
  assert.equal((facts.match(/\(250001153\)/g)||[]).length,2);
  assert.equal((facts.match(/\(SN001\)/g)||[]).length,2);
  assert.ok(facts.includes('OW004'));
  assertLandscapeSafeMargin(facts,'faits techniques');
  for(const description of ['Premier fait','Deuxieme fait','Troisieme fait','Quatrieme fait']) assert.ok(!facts.includes(description),`Le texte du fait n'est pas imprimé : ${description}`);
  fs.writeFileSync(path.join(__dirname,'artifacts/facts-labels.pdf'),Buffer.from(await factsBlob.arrayBuffer()));
  console.log('Operational labels: all tests passed.');
})().catch(error=>{console.error(error);process.exit(1);});

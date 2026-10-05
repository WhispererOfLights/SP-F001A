const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const context = {
  React: {createElement: () => ({})}, ReactDOM: {createRoot: () => ({render: () => {}})},
  document: {documentElement: {style: {}}, body: {style: {}}, getElementById: () => ({})},
  localStorage: {getItem: () => null}, Blob, TextEncoder,
};
vm.createContext(context);
vm.runInContext(fs.readFileSync(path.join(__dirname, '../src/App.runtime.js'), 'utf8') +
  ';globalThis.normalize=withUnitMetadata;globalThis.patch=patchTrackedUnit;globalThis.home=homeRowsForOf;globalThis.teamsText=buildTeamsOfText;globalThis.mail=buildMaterialRequest;globalThis.parseUnits=parseOfImportPaste;globalThis.convertUnit=convertTrackedUnitKind;globalThis.dpStatus=dpStatus;globalThis.isValidDMY=isValidDMY;globalThis.dcCheck=dcCheck;globalThis.ofWarnings=ofWarnings;globalThis.polymerizationStatus=polymerizationStatus;globalThis.closureMail=buildClosureRequest;globalThis.ipMail=buildIpInvitation;globalThis.ofRanges=compactOfRanges;globalThis.ccRequired=materialCcRequired;globalThis.ccEmails=selectedManagerEmails;globalThis.icsMeeting=buildOutlookMeetingIcs;globalThis.meetingRecipients=parseMeetingRecipients;globalThis.singleMeetingOtp=hasSingleMeetingOtp;globalThis.role=normalizeRole;globalThis.componentLabelPdf=buildComponentLabelPdf;globalThis.componentSheetsPdf=buildComponentRetentionSheetsPdf;globalThis.normalizeStatuses=normalizeStatusTypes;globalThis.applyStatuses=applyStatusTypes;globalThis.statuses=STATUTS;globalThis.unitStatuses=UNIT_STATUTS;', context);

const customStatuses=context.applyStatuses([
  {id:'en_cours',label:'En fabrication',color:'#123456',closed:false},
  {id:'archive',label:'Archivé',color:'#654321',closed:true}
]);
assert.equal(customStatuses.length,2);
assert.equal(context.statuses.en_cours.label,'En fabrication');
assert.equal(context.unitStatuses.archive.label,'Archivé');
assert.equal(context.statuses.archive.closed,true);
assert.strictEqual(context.statuses,context.unitStatuses);
context.applyStatuses();

assert.equal(context.teamsText({codeArticle:'250001163',description:'RX-S355C'},[{sn:'SN0012'},{sn:'SN0013'},{lot:'SP-J123'}]),'250001163 - RX-S355C - SN0012\n250001163 - RX-S355C - SN0013\n250001163 - RX-S355C - LOT SP-J123');

assert.equal(context.isValidDMY('29.02.24'),true);
assert.equal(context.isValidDMY('31.02.24'),false);
assert.equal(context.dpStatus('18.09.26','18/09/2026 23:59').label,'OK');
assert.equal(context.dpStatus('19.09.26','18/09/2026 23:59').label,'BIENTÔT');
assert.equal(context.dpStatus('17.09.26','18/09/2026 00:01').label,'PÉRIMÉ');
assert.equal(context.dpStatus('31.12.26','18/09/2026 08:00').label,'OK');
assert.equal(context.dcCheck('1801','02/01/2025 08:00').ok,true);
assert.equal(context.dcCheck('1801','01/02/2025 08:00').ok,false);
const warningData={header:{status:'en_cours'},consommables:{ops:[{createdDT:'18/09/2026 08:00',items:[{dp:'17.09.26'}]}]}};
assert.ok(Array.from(context.ofWarnings(warningData)).includes("Consommable périmé à la date d'utilisation"));
const polymerization=context.polymerizationStatus({cat:'Colle',polymerizationHours:'24'},'25/09/2026 08:00','25/09/2026 12:00');
assert.equal(polymerization.done,false);
assert.equal(polymerization.readyAt.getTime(),new Date(2026,8,26,8,0).getTime());
assert.equal(context.polymerizationStatus({cat:'Coating',polymerizationHours:'24'},'25/09/2026 08:00','26/09/2026 08:00').done,true);
assert.equal(context.polymerizationStatus({cat:'Silicone',polymerizationHours:'12'},'25/09/2026 08:00','25/09/2026 12:00').done,false);
assert.equal(context.polymerizationStatus({cat:'Kapton',polymerizationHours:'12'},'25/09/2026 08:00','25/09/2026 20:00').done,true);
assert.equal(context.polymerizationStatus({cat:'Flux',polymerizationHours:'24'},'25/09/2026 08:00'),null);
assert.equal(context.polymerizationStatus({cat:'Soudure',polymerizationHours:'24'},'25/09/2026 08:00'),null);
assert.equal(context.ccRequired({role:'Opérateur'}),true);
assert.equal(context.ccRequired({role:'Contrôleur'}),true);
assert.equal(context.ccRequired({role:'Manager'}),false);
assert.equal(context.ccRequired({role:'Admin'}),false);
assert.equal(context.role({role:'Product Assurance'}),'Product Assurance');
assert.equal(context.role({role:'Chef de projet'}),'Chef de projet');
assert.deepEqual(Array.from(context.ccEmails([{trigram:'JGR',email:'jgr@example.com'},{trigram:'NPR',email:'npr@example.com'}],['JGR'])),['jgr@example.com']);
assert.deepEqual(Array.from(context.meetingRecipients('one@example.com; two@example.com, one@example.com')),['one@example.com','two@example.com']);
const meetingIcs=context.icsMeeting({subject:'Invitation | IP Validation',body:'Résumé\nOF 1001',date:'2026-10-02',time:'10:00',duration:90,location:'#512 P17',requiredRecipients:['projet@example.com','pa@example.com'],optionalRecipients:['manager@example.com'],organizer:{prenom:'Julien',nom:'Grosjean',email:'jgr@example.com'}});
for(const value of ['METHOD:PUBLISH','DTSTART:20261002T100000','DTEND:20261002T113000','SUMMARY:Invitation | IP Validation','DESCRIPTION:Résumé\\nOF 1001','CATEGORIES:IP','COLOR:#FFD966','LOCATION:#512 P17','ORGANIZER;CN=Julien Grosjean:mailto:jgr@example.com','ATTENDEE;ROLE=REQ-PARTICIPANT;RSVP=TRUE:mailto:projet@example.com','ATTENDEE;ROLE=REQ-PARTICIPANT;RSVP=TRUE:mailto:pa@example.com','ATTENDEE;ROLE=OPT-PARTICIPANT;RSVP=TRUE:mailto:manager@example.com']) assert.ok(meetingIcs.includes(value));
assert.ok(!meetingIcs.includes('CATEGORIES:IP,Jaune'));
const polymerizationData={header:{status:'en_cours'},consommables:{ops:[{validated:true,createdDT:'25/09/2026 08:00',items:[{validated:true,consoId:'glue'}]}]}};
assert.ok(Array.from(context.ofWarnings(polymerizationData,[{id:'glue',cat:'Colle',polymerizationHours:'876000'}]))
  .some(message=>message.includes('Polymérisation en cours')&&message.includes('sous vide dès le')));
const homeMailRows=[
  {id:'of-a',_homeUnitId:'u1',_homeUnitKind:'sn',of:'1001',otp:'OTP-A',codeArticle:'250 001 163',description:'Carte A',sn:'SN001',_homeFacts:[{type:'FT',numero:'F-01',commentaires:'Contrôle visuel',closedDate:'25/09/2026'}]},
  {id:'of-a',_homeUnitId:'u2',_homeUnitKind:'sn',of:'1001',otp:'OTP-A',codeArticle:'250 001 163',description:'Carte A',sn:'SN002'},
  {id:'of-a',_homeUnitId:'lot1',_homeUnitKind:'lot',of:'1001',otp:'OTP-A',codeArticle:'250 001 163',description:'Carte A',lot:'LOT-A',_homeQty:'10'},
  {id:'of-b',_homeUnitId:'u3',_homeUnitKind:'sn',of:'1002',otp:'OTP-B',codeArticle:'250 002 000',description:'Carte B',sn:'SN003'}
];
const closure=context.closureMail({rows:homeMailRows,user:{trigram:'JGR'}});
assert.equal(context.ofRanges(['1001','1002','1004','1005','1007','A-12']),'1001-1002; 1004-1005; 1007; A-12');
assert.equal(closure.subject,'Clôture | OF 1001-1002 | OTP OTP-A; OTP-B');
assert.equal((closure.body.match(/1001 \| 250001163/g)||[]).length,3);
assert.ok(closure.body.includes('1001 | 250001163 | Carte A | SN : SN001 | Faits : F-01'));
assert.ok(closure.body.includes('1001 | 250001163 | Carte A | SN : SN002'));
assert.ok(closure.body.includes('1001 | 250001163 | Carte A | LOT : LOT-A | 10x'));
assert.ok(closure.body.includes('1001 | 250001163 | Carte A | LOT : LOT-A | 10x\n\n1002 | 250002000 | Carte B | SN : SN003'));
assert.ok(!closure.body.includes('Faits : -')&&!closure.body.includes('|  |'));
assert.ok(!closure.body.includes('Contrôle visuel')&&!closure.body.includes('clôturé 25/09/2026'));
const invitation=context.ipMail({rows:homeMailRows.slice(0,2),user:{trigram:'JGR'},ipName:'IP Validation'});
assert.equal(invitation.subject,'IP Validation | 250001163 - Carte A | SN001, SN002 | OTP OTP-A');
const invitationWithFinished=context.ipMail({rows:homeMailRows.slice(0,2).map(row=>({...row,snProduitFini:'PF-900'})),user:{trigram:'JGR'},ipName:'RX-IP-800'});
assert.equal(invitationWithFinished.subject,'RX-IP-800 | 250001163 - Carte A | SN001, SN002 | OTP OTP-A | SN produit fini PF-900');
assert.ok(invitationWithFinished.body.includes('1001 | 250001163 | Carte A | SN : SN001 | SN produit fini : PF-900 | Faits : F-01'));
assert.ok(invitationWithFinished.body.includes('1001 | 250001163 | Carte A | SN : SN002 | SN produit fini : PF-900'));
assert.equal(context.singleMeetingOtp(homeMailRows.slice(0,2)),true);
assert.equal(context.singleMeetingOtp([homeMailRows[0],homeMailRows[3]]),false);
assert.ok(invitation.body.includes('inspection IP Validation'));
assert.ok(!invitation.body.includes('séance IP Validation'));
assert.ok(invitation.body.includes('1001 | 250001163 | Carte A | SN : SN001 | Faits : F-01'));
assert.ok(invitation.body.includes('1001 | 250001163 | Carte A | SN : SN002'));
assert.ok(!invitation.body.includes('Article :')&&!invitation.body.includes('Faits : -')&&!invitation.body.includes('|  |'));

const data = {header: {of: '1000564', status: 'en_cours', codeArticle: '250 001 163', description: 'Article OF', otp: 'PROJECT', snProduitFini: 'LEGACY'},
  units: {rows: [{id: 'u1', sn: 'SN1', status: 'en_cours'}, {id: 'u2', sn: 'SN2', status: 'a_faire'}]}};
const labelData={...data,rework:{rows:[{id:'d1',validated:true,action1:'D',repere:'R96',valeur:'10K',codeERP:'',createdDT:'30/09/2026 10:00',createdVisa:'JGR',snScope:'custom',snIds:['u1']}]}};
const labelPdf=context.componentLabelPdf({ofData:labelData,row:labelData.rework.rows[0],selectedUnitIds:['u1']});
assert.equal(labelPdf.type,'application/pdf');
assert.ok(labelPdf.size>500);
const sheetPdf=context.componentSheetsPdf({ofData:labelData,selectedUnitIds:['u1']});
assert.equal(sheetPdf.type,'application/pdf');
assert.ok(sheetPdf.size>500);
const normalized = context.normalize(data);
assert.equal(normalized.units.rows[0].snProduitFini, '');
assert.equal(normalized.units.rows[1].snProduitFini, '');
assert.equal(normalized.header.snProduitFini, 'LEGACY');
const updated = context.patch(normalized, 'u1', {snProduitFini: 'PF1', status: 'termine'});
assert.equal(updated.units.rows[0].snProduitFini, 'PF1');
assert.equal(updated.units.rows[1].snProduitFini, '');
assert.equal(updated.units.rows[1].status, 'a_faire');
assert.equal(updated.header.status, 'en_cours');
assert.equal(updated.header._snRows[0].status, 'termine');
assert.equal(data.units.rows[0].snProduitFini, undefined);
assert.equal(context.home(data.header, updated)[0].unitStatus, 'termine');
assert.equal(context.home(data.header, updated)[0].status, 'en_cours');
const single = context.normalize({...data, units: {rows: [data.units.rows[0]]}});
assert.equal(single.units.rows[0].snProduitFini, 'LEGACY');
assert.equal(context.patch(single, 'u1', {snProduitFini: ''}).units.rows[0].snProduitFini, '');
assert.equal(context.normalize({...data, units: {rows: []}}).units.rows.length, 0);
assert.throws(() => context.patch(data, 'unknown', {status: 'termine'}));
assert.throws(() => context.patch(data, 'u1', {status: 'unknown'}));

const importedUnits=context.parseUnits([
  '1;7400-SPA-QZSS-MAI;R10A-S200A;250 000 748;Lampe eRAFS EM;LAMPE-EM07;1000595;x',
  '1;PRODGAHM;P5-P100B;206 001 102;REWORK BULB;N/A;1000044;',
  '3;7400-SPA-RAFS-MAI;RX-S035B;250 000 948;Bobine LAMPE;SP-J15097;1000598;x'
].join('\n'));
assert.equal(importedUnits[0].items[0].unitKind,'sn');
assert.equal(importedUnits[0].items[0].sn,'LAMPE-EM07');
assert.equal(importedUnits[1].items[0].unitKind,'lot');
assert.equal(importedUnits[2].items[0].unitKind,'lot');
const duplicateImport=context.parseUnits([
  '1;PROJET;ARTICLE;250 000 748;Lampe;SN-001;1000595;x',
  '1;PROJET;ARTICLE;250 000 748;Lampe;SN-001;1000595;x',
  '1;PROJET;ARTICLE;250 000 748;Lampe;SN-001;1000596;x',
].join('\n'));
assert.equal(duplicateImport.length,2,'Le même SN reste autorisé dans deux OF différents');
assert.equal(duplicateImport[0].items.length,1,'Une ligne OF + SN identique est ignorée');
assert.equal(duplicateImport[0].duplicateItems,1,'Le doublon ignoré est comptabilisé pour le message d’import');
assert.equal(duplicateImport[1].items.length,1);
assert.equal(duplicateImport[1].duplicateItems,0);
const converted=context.convertUnit({header:data.header,units:{rows:[{id:'lamp',sn:'',lot:'LAMPE-EM07',unitKind:'lot',qteInitiale:'1'}]},rework:{rows:[{id:'rw',snIds:['lamp']}]}},'lamp','sn',{trigram:'JGR'});
assert.equal(converted.units.rows[0].sn,'LAMPE-EM07');
assert.equal(converted.units.rows[0].lot,'');
assert.equal(converted.units.rows[0].unitKind,'sn');
assert.equal(converted.units.rows[0].qteInitiale,'');
assert.deepEqual(Array.from(converted.rework.rows[0].snIds),['lamp']);
assert.equal(converted.units.rows[0].kindHistory[0].visa,'JGR');

const header = {...data.header, _snRows: data.units.rows};
const rows = [{id: 'r1', action1:'S', repere: 'R96', codeERP: '225 222 333', valeur: '10K', qty: '2', lot: 'N/A', snScope: 'custom', snIds: ['u1']},
  {id: 'r2', action1:'M', repere: 'R97', codeERP: '123', valeur: '20K', qty: '1', lot: '0000020516', snScope: 'custom', snIds: ['u2']},
  {id: 'deleted', repere: 'DELETED', deleted: true},
  {id: 'excluded', repere: 'EXCLUDED', snExcludeIds: ['u1', 'u2']}];
const mail = context.mail({header, rows, user: {trigram: 'JGR', prenom: 'Julien'}});
const restricted=context.mail({header,rows:[...rows,...['D','P','R',''].map(action1=>({id:action1,action1,repere:'FORBIDDEN'}))],user:{trigram:'JGR'}});
assert.ok(!restricted.body.includes('FORBIDDEN'));
assert.ok(mail.subject.includes('1000564'));
for (const text of ['OTP : PROJECT', 'Demande pour SN / LOT : SN1', 'Demande pour SN / LOT : SN2', '225222333', 'Qté : 2', 'Lot préférentiel : 0000020516']) assert.ok(mail.body.includes(text));
const sections=mail.body.split('Demande pour SN / LOT :');
assert.ok(sections[1].includes('R96')&&!sections[1].includes('R97'));
assert.ok(sections[2].includes('R97')&&!sections[2].includes('R96'));
const shared=context.mail({header,rows:[{...rows[0],snScope:'all',snIds:[]}],user:{trigram:'JGR'}});
assert.equal(shared.body.split('Repère TOPO : R96').length-1,2);
for (const text of ['N/A', 'DELETED', 'EXCLUDED']) assert.ok(!mail.body.includes(text));
const one = context.mail({header, rows: [rows[0]], user: {trigram: 'JGR'}});
assert.ok(!one.body.includes('SN2'));
assert.ok(!one.body.includes('Lot préférentiel'));
assert.ok(one.body.includes('LOT / DC : Selon disponibilité'));
const dcOnly=context.mail({header,rows:[{...rows[0],dc:'2525'}],user:{trigram:'JGR'}});
assert.ok(dcOnly.body.includes('DC min : 2525'));
assert.ok(dcOnly.body.includes('Lot selon disponibilité'));
assert.ok(dcOnly.body.includes('Repère TOPO : R96 | Qté : 2 | Code article : 225222333 | Valeur : 10K | Lot selon disponibilité | DC min : 2525'));
const lotAndDc=context.mail({header,rows:[{...rows[0],lot:'0000020516',dc:'2525'}],user:{trigram:'JGR'}});
assert.ok(lotAndDc.body.includes('Lot préférentiel : 0000020516'));
assert.ok(lotAndDc.body.includes('Repère TOPO : R96 | Qté : 2 | Code article : 225222333 | Valeur : 10K | Lot préférentiel : 0000020516'));
assert.ok(!lotAndDc.body.includes('DC min'));
assert.ok(!lotAndDc.body.includes('Selon disponibilité'));
assert.ok(!dcOnly.body.includes('Selon disponibilité'));
assert.ok(!sections[2].includes('Selon disponibilité'));
console.log('Unit metadata and material requests: all tests passed.');
vm.runInContext(';globalThis.parseUsers=parseUserImportPaste;globalThis.compareUsers=comparableUser;',context);
const imported=context.parseUsers('Trigramme;Prénom;Nom;Service;Rôle;E-mail\nJGR;Julien;Grosjean;Opération Spatiale;Manager;jgr@example.com');
assert.equal(imported[0].email,'jgr@example.com');
const legacy=context.parseUsers('Trigramme;Prénom;Nom;Service;Rôle\nJGR;Julien;Grosjean;Opération Spatiale;Manager');
assert.equal(Object.hasOwn(legacy[0],'email'),false);
assert.equal({...imported[0],...legacy[0]}.email,'jgr@example.com');
assert.notEqual(context.compareUsers(imported[0]),context.compareUsers({...imported[0],email:'other@example.com'}));
console.log('User email imports: all tests passed.');
vm.runInContext(';globalThis.copyUnit=copyReworkToUnit;globalThis.copyAny=copyTableLineToUnit;globalThis.sortOperations=sortByNewestOperation;',context);
const source={...rows[0],id:'source',createdVisa:'OTHER',validated:true,visaCtrl:'CTL',dateCtrl:'18/09/2026 10:00',tracaOk:true,visaTraca:'LOG',dateTraca:'18/09/2026 11:00',snExcludeIds:['old'],editHistory:[{}],comments:[{id:'old-comment'}]};
const writer={trigram:'JGR',role:'Opérateur'};
const copy=context.copyUnit(source,writer,{id:'destination'});
assert.equal(copy.createdVisa,'JGR');assert.notEqual(copy.id,'source');assert.equal(copy.validated,true);assert.equal(copy.visaOper,'JGR');
assert.equal(copy.snIds.join(','),'destination');assert.equal(copy.snExcludeIds.length,0);
assert.equal(copy.comments.length,0);assert.equal(copy.editHistory.length,0);
assert.equal(copy.visaCtrl,'');assert.equal(copy.tracaOk,false);
assert.throws(()=>context.copyUnit(source,writer,{id:'destination'},true));
const all=context.copyUnit(source,{trigram:'JGR',role:'Manager'},{id:'destination'},true);
assert.equal(all.createdVisa,'JGR');assert.equal(all.visaCtrl,'CTL');assert.equal(all.dateCtrl,source.dateCtrl);assert.equal(all.tracaOk,true);assert.equal(all.visaTraca,'LOG');
const propagated=context.copyUnit(source,writer,{id:'destination'},false,'same',{sourceOf:'1000'});
assert.equal(propagated.createdVisa,'OTHER');assert.equal(propagated.visaCtrl,'CTL');assert.equal(propagated.tracaOk,true);assert.equal(propagated.copyOrigin.sourceOf,'1000');
const consoSource={id:'op',createdVisa:'OTHER',createdDT:'01/05/2026 08:00',validated:true,fiche:'DOC',op:'10',items:[{id:'item',createdVisa:'OTHER',createdDT:'01/05/2026 08:00',validated:true,consoId:'GLUE',echantillon:'ECH-1',lot:'LOT-1',dp:'31.12.26'}]};
const consoNew=context.copyAny('consommables',consoSource,writer,{id:'destination'},false,'new',false,{sourceOf:'1000'});
assert.equal(consoNew.createdVisa,'JGR');assert.equal(consoNew.items[0].echantillon,'');assert.equal(consoNew.items[0].lot,'LOT-1');
const consoReuse=context.copyAny('consommables',consoSource,writer,{id:'destination'},false,'new',true,{sourceOf:'1000'});
assert.equal(consoReuse.items[0].echantillon,'ECH-1');
const chronological=context.sortOperations([
  {id:'newer',createdDT:'05/05/2026 08:00',validated:true},
  {id:'copied-old',createdDT:'01/05/2026 08:00',validated:true},
  {id:'draft',createdDT:'30/04/2026 08:00',validated:false}
]);
assert.deepEqual(Array.from(chronological,item=>item.id),['draft','newer','copied-old']);
assert.equal(source.createdVisa,'OTHER');
assert.throws(()=>context.copyUnit(source,{trigram:'READ',role:'Consultation'},{id:'destination'}));
console.log('Cross-OF rework copies: all tests passed.');
vm.runInContext(';globalThis.sapFormat=fmtSAP;',context);
assert.equal(context.sapFormat('1600000046'),'1600000046');
assert.equal(context.sapFormat('160 000 0046'),'1600000046');
assert.equal(context.sapFormat('0000000046'),'0000000046');
assert.equal(context.sapFormat('123456789012'),'123456789012');
vm.runInContext(';globalThis.lastFicheOp=latestSharedFicheOp;',context);
const scopedHeader={...header,_defaultSnIds:['u1']};
const sharedContext={rework:{rows:[{fiche:'RW-DOC',etape:'40',createdDT:'18/09/2026 09:00',snScope:'custom',snIds:['u1']}]},consommables:{ops:[
  {fiche:'CS-DOC',op:'20',createdDT:'18/09/2026 10:00',snScope:'custom',snIds:['u1'],items:[{}]},
  {fiche:'OTHER-SN',op:'99',createdDT:'18/09/2026 11:00',snScope:'custom',snIds:['u2'],items:[{}]},
  {fiche:'DELETED',op:'99',createdDT:'18/09/2026 12:00',snScope:'custom',snIds:['u1'],items:[{deleted:true}]}]}};
assert.equal(context.lastFicheOp(sharedContext,scopedHeader).fiche,'CS-DOC');
assert.equal(context.lastFicheOp(sharedContext,scopedHeader).op,'20');
sharedContext.rework.rows[0].ficheOpUpdatedAt=new Date(2026,8,18,13).getTime();
assert.equal(context.lastFicheOp(sharedContext,scopedHeader).fiche,'RW-DOC');
assert.equal(context.lastFicheOp(sharedContext,scopedHeader).op,'40');
sharedContext.rework.rows[0].deleted=true;
assert.equal(context.lastFicheOp(sharedContext,scopedHeader).fiche,'CS-DOC');
assert.equal(context.lastFicheOp(sharedContext,{...header,_defaultSnIds:['missing']}).fiche,'OTHER-SN');
assert.equal(context.lastFicheOp({},scopedHeader).fiche,'');
console.log('Shared scoped fiche/OP prefilling: passed.');
vm.runInContext(';globalThis.defaultScope=defaultSnScope;globalThis.patchScope=scopedRowsPatch;globalThis.viewScope=workSnFilter;',context);
const viewAll={...header,_defaultSnIds:[],_entrySnIds:['u2'],_confirmMultiSn:true};
assert.equal(context.viewScope(viewAll),'all');
assert.equal(context.defaultScope(viewAll).snIds.join(','),'u2');
const multi={id:'multi',snScope:'custom',snIds:['u1','u2'],validated:false};
let confirmation='';context.window={confirm:text=>{confirmation=text;return false;}};
assert.equal(context.patchScope([multi],'multi',viewAll,{validated:true})[0].validated,false);
assert.ok(confirmation.includes('SN1')&&confirmation.includes('SN2'));
context.window.confirm=()=>true;
const separated=context.patchScope([{...multi,createdVisa:'JGR',createdDT:'18/09/2026 10:00',comments:[{id:'comment',text:'Original',visa:'JGR'}]}],'multi',viewAll,{validated:true});
assert.equal(separated.length,2);
assert.equal(separated[0].validated,true);
assert.equal(separated[0].snIds.join(','),'u1');assert.equal(separated[1].snIds.join(','),'u2');
assert.notEqual(separated[0].id,separated[1].id);
assert.notEqual(separated[0].comments[0].id,separated[1].comments[0].id);
separated[1].comments[0].text='Other';assert.equal(separated[0].comments[0].text,'Original');
assert.equal(separated[1].createdVisa,'JGR');
for(const section of ['rework','consommables','testequip','faits','etuvage','demating','openwork']){
  const original={...multi,comments:[],items:section==='consommables'?[{id:'item',validated:false,lot:'0000020516'}]:undefined,events:section==='demating'?[{id:'event',action:'Mating',visa:'JGR'}]:undefined};
  const clones=context.patchScope([original],'multi',viewAll,{validated:true,...(original.items?{items:[{...original.items[0],validated:true}]}:{})});
  assert.equal(clones.length,2,section);
  assert.notEqual(clones[0].id,clones[1].id,section);
  if(original.items){assert.notEqual(clones[0].items[0].id,clones[1].items[0].id);clones[1].items[0].lot='CHANGED';assert.equal(clones[0].items[0].lot,'0000020516');}
  if(original.events)assert.notEqual(clones[0].events[0].id,clones[1].events[0].id);
}
context.window.confirm=()=>{throw new Error('Unexpected confirmation for one SN');};
assert.equal(context.patchScope([{...multi,snIds:['u2']}],'multi',viewAll,{validated:true})[0].validated,true);
console.log('Separate view/entry targets and multi-SN confirmation: passed.');

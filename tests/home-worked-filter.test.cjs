const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const ctx={React:{createElement:()=>({})},ReactDOM:{createRoot:()=>({render:()=>{}})},document:{documentElement:{style:{}},body:{style:{}},getElementById:()=>({})},localStorage:{getItem:()=>null},Blob,TextEncoder};
vm.createContext(ctx);
vm.runInContext(fs.readFileSync('src/App.runtime.js','utf8')+';globalThis.filterHome=homeWorkedFilter;globalThis.activityVisas=activityVisasOf;globalThis.searchHome=homeSearchMatches;globalThis.ovenAlertTiming=homeOvenAlertTiming;globalThis.groupOvens=groupHomeOvenAlerts;',ctx);
const rows=[{id:'mine'},{id:'other'}];
assert.equal(ctx.filterHome(rows,[],true,false).rows.length,2);
assert.equal(ctx.filterHome(rows,[],true,false).active,false);
assert.equal(ctx.filterHome(rows,['mine'],true,false).rows.length,1);
assert.equal(ctx.filterHome(rows,['mine'],true,false).active,true);
assert.equal(ctx.filterHome(rows,['mine'],true,true).rows.length,2);
assert.equal(ctx.filterHome(rows,['mine'],true,true).active,false);
assert.equal(ctx.filterHome([{id:'other'}],['mine'],true,false).rows.length,1);
assert.equal(ctx.filterHome(rows,['mine'],false,false).rows.length,2);
assert.equal(ctx.filterHome([],['mine'],true,false).rows.length,0);
assert.deepEqual([...ctx.activityVisas({header:{createdBy:'ABC'},rework:{rows:[{visaOper:'JGR',visaCtrl:'CTL'}]},comments:[{visa:'JGR'}],openHistory:['VIEWER']})],['ABC','CTL','JGR']);
assert.equal(ctx.searchHome({of:'1000'},'jgr',['ABC','JGR']),true);
assert.equal(ctx.searchHome({of:'1000'},'viewer',['ABC','JGR']),false);
const friday=new Date(2026,9,30,8,0);
const saturday={count:1,nextAt:new Date(2026,9,31,10,0).getTime(),label:'sam 31/10/26 10:00'};
const sunday={count:1,nextAt:new Date(2026,10,1,18,0).getTime(),label:'dim 01/11/26 18:00'};
const monday={count:1,nextAt:new Date(2026,10,2,8,0).getTime(),label:'lun 02/11/26 08:00'};
assert.deepEqual({...ctx.ovenAlertTiming(saturday,friday)},{due:true,anticipated:true,daysWithoutOven:0,text:'échéance ce week-end',title:'Échéance prévue le sam 31/10/26 10:00 — étuvage anticipé au vendredi soir'});
assert.equal(ctx.ovenAlertTiming(sunday,friday).anticipated,true);
assert.equal(ctx.ovenAlertTiming(monday,friday).due,false);
assert.equal(ctx.ovenAlertTiming(saturday,new Date(2026,9,29,8,0)).due,false);
const dueTonight=ctx.ovenAlertTiming({count:1,nextAt:new Date(2026,10,4,20,0).getTime(),label:'mer 04/11/26 20:00'},new Date(2026,10,4,9,0));
assert.deepEqual({...dueTonight},{due:true,anticipated:false,today:true,daysWithoutOven:0,text:'échéance à 20:00',title:"Échéance prévue aujourd'hui le mer 04/11/26 20:00"});
const grouped=[...ctx.groupOvens([
  {id:'of-1',unitId:'sn-1',of:'1000',unit:'SN001',nextAt:20,label:'20:00',timing:{today:true}},
  {id:'of-1',unitId:'sn-2',of:'1000',unit:'SN002',nextAt:18,label:'18:00',timing:{today:true}},
  {id:'of-2',unitId:'sn-3',of:'2000',unit:'SN003',nextAt:19,label:'19:00',timing:{today:true}},
])];
assert.equal(grouped.length,2);
assert.equal(grouped[0].id,'of-1');
assert.equal(grouped[0].unitId,'all');
assert.equal(grouped[0].unitCount,2);
assert.equal(grouped[0].unit,'SN001 · SN002');
assert.equal(grouped[0].nextAt,18);
assert.equal(grouped[0].unitTitle,'SN002 : 18:00\nSN001 : 20:00');
const overdue=ctx.ovenAlertTiming({count:1,nextAt:new Date(2026,9,29,8,0).getTime(),label:'jeu 29/10/26 08:00'},friday);
assert.equal(overdue.due,true);
assert.equal(overdue.anticipated,false);
assert.equal(overdue.daysWithoutOven,1);
console.log('Home worked filter: all tests passed.');

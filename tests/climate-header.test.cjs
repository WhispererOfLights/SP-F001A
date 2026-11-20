const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const ctx={React:{createElement:()=>({})},ReactDOM:{createRoot:()=>({render:()=>{}})},document:{documentElement:{style:{}},body:{style:{}},getElementById:()=>({})},localStorage:{getItem:()=>null},Blob,TextEncoder};
vm.createContext(ctx);
vm.runInContext(fs.readFileSync('src/App.runtime.js','utf8')+';globalThis.climateState=climateHeaderState;globalThis.climateMetric=formatClimateMetric;globalThis.climateZones=CLIMATE_ZONE_FALLBACKS;',ctx);

assert.deepEqual([...ctx.climateZones].map(zone=>`${zone.code} ${zone.label}`),[
  '#512 Salle blanche',
  '#512a SAS',
  '#510 Stock MA12',
]);
assert.equal(ctx.climateState(null).key,'unavailable');
assert.equal(ctx.climateState({ok:true,stale:false,alarmActive:false,outOfRange:false}).label,'Alarme inactive');
assert.equal(ctx.climateState({ok:true,stale:false,alarmActive:true,outOfRange:true}).key,'alarm');
assert.equal(ctx.climateState({ok:true,stale:false,alarmActive:false,outOfRange:true}).key,'out_of_range');
assert.equal(ctx.climateState({ok:true,stale:true,alarmActive:false,outOfRange:false}).key,'stale');
assert.equal(ctx.climateMetric(21.84),'21,8');
assert.equal(ctx.climateMetric(undefined),'—');
console.log('Climate header: all tests passed.');

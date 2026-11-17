const measurementNumber = value => {
  const text=String(value??"").trim().replace(/\s+/g,"").replace(",",".");
  if(!text) return null;
  const number=Number(text);
  return Number.isFinite(number)?number:null;
};

const measurementResultForUnit = (row,unitId) => (row?.results||[])
  .find(result=>!result.deleted&&result.unitId===unitId);

const measurementStatus = (row,result) => {
  const raw=String(result?.value??"").trim();
  if(!raw) return {id:"missing",label:"À mesurer",color:C.yellow,background:C.yellow+"18"};
  const value=measurementNumber(raw);
  if(value===null) return {id:"invalid",label:"Valeur invalide",color:C.red,background:C.red+"18"};
  const min=measurementNumber(row?.min),max=measurementNumber(row?.max);
  if(min!==null&&value<min || max!==null&&value>max)
    return {id:"nonconforming",label:"Non conforme",color:C.red,background:C.red+"18"};
  if(min===null&&max===null)
    return {id:"information",label:"Informatif",color:C.muted,background:C.border+"28"};
  return {id:"conforming",label:"Conforme",color:C.green,background:C.green+"18"};
};

const measurementStats = (row,units=[]) => {
  const values=units.map(unit=>{
    const result=measurementResultForUnit(row,unit.id);
    return {unit,result,value:measurementNumber(result?.value)};
  }).filter(item=>item.value!==null);
  if(!values.length) return {count:0,min:null,max:null,average:null,minUnits:[],maxUnits:[]};
  const numbers=values.map(item=>item.value);
  const min=Math.min(...numbers),max=Math.max(...numbers);
  return {
    count:values.length,min,max,average:numbers.reduce((sum,value)=>sum+value,0)/numbers.length,
    minUnits:values.filter(item=>item.value===min).map(item=>snTitle(item.unit)),
    maxUnits:values.filter(item=>item.value===max).map(item=>snTitle(item.unit)),
  };
};

const measurementDisplayNumber = value => value===null||value===undefined?"-":Number(value.toFixed(6)).toLocaleString("fr-FR",{maximumFractionDigits:6});

const downloadMeasurementsBlob = (blob,name) => {
  const url=URL.createObjectURL(blob);
  const link=document.createElement("a");
  link.href=url;link.download=name;document.body.appendChild(link);link.click();link.remove();
  URL.revokeObjectURL(url);
};

const buildMeasurementsExcel = ({data,units,selectedUnitIds=null,header={}}) => {
  const selected=selectedUnitIds?.length?units.filter(unit=>selectedUnitIds.includes(unit.id)):units;
  const rows=(data?.rows||[]).filter(row=>!row.deleted);
  const identity=unit=>snTitle(unit);
  const plan=rows.map((row,index)=>[
    index+1,row.fiche||"",row.etape||"",row.mesure||"",row.unite||"",row.min||"",row.max||"",
  ]);
  const details=rows.flatMap(row=>selected.map(unit=>{
    const result=measurementResultForUnit(row,unit.id);
    const status=measurementStatus(row,result);
    return [header.of||"",identity(unit),row.fiche||"",row.etape||"",row.mesure||"",row.unite||"",
      row.min||"",result?.value||"",row.max||"",status.label,result?.visa||"",result?.dt||""];
  }));
  const summary=rows.map(row=>{
    const stats=measurementStats(row,selected);
    return [row.fiche||"",row.etape||"",row.mesure||"",row.unite||"",row.min||"",row.max||"",
      stats.count,measurementDisplayNumber(stats.min),measurementDisplayNumber(stats.average),measurementDisplayNumber(stats.max),
      stats.minUnits.join(" ; "),stats.maxUnits.join(" ; ")];
  });
  return buildExcelWorkbook([
    {name:"Résumé OF",headerRows:1,rows:[["Fiche suiveuse","Étape / OP","Mesure","Unité","Min attendu","Max attendu","Nb mesuré","Min observé","Moyenne","Max observé","SN au min","SN au max"],...summary]},
    {name:"Valeurs par SN",headerRows:1,rows:[["N° OF","SN / LOT","Fiche suiveuse","Étape / OP","Mesure","Unité","Min attendu","Valeur","Max attendu","Statut","Visa","Date / heure"],...details]},
    {name:"Plan de mesures",headerRows:1,rows:[["Ligne","Fiche suiveuse","Étape / OP","Mesure","Unité","Min attendu","Max attendu"],...plan]},
  ]);
};

const MeasurementField = ({value,onCommit,placeholder,style={},readOnly=false}) => {
  const [draft,setDraft]=useState(value||"");
  useEffect(()=>setDraft(value||""),[value]);
  return <Input value={draft} onChange={setDraft} onBlur={()=>!readOnly&&draft!==String(value||"")&&onCommit(draft.trim())}
    readOnly={readOnly} displayPlaceholder={placeholder} title={placeholder?`Attendu : ${placeholder}`:undefined} small style={style}/>;
};

const MeasurementValue = ({row,unit,user,canWrite,onCommit}) => {
  const result=measurementResultForUnit(row,unit.id);
  const [draft,setDraft]=useState(result?.value||"");
  useEffect(()=>setDraft(result?.value||""),[result?.value]);
  const status=measurementStatus(row,{...result,value:draft});
  const commit=()=>{
    if(!canWrite||draft===String(result?.value||"")) return;
    onCommit(draft.trim(),result);
  };
  return <div style={{minWidth:112,display:"flex",flexDirection:"column",gap:3}}>
    <Input ariaLabel={`${row.mesure||"Mesure"} - ${snTitle(unit)}`} value={draft} onChange={setDraft} onBlur={commit}
      onKeyDown={event=>{if(event.key==="Enter") event.currentTarget.blur();}}
      readOnly={!canWrite} small style={{textAlign:"center",fontWeight:800,borderColor:status.color,background:status.background}}/>
    <span style={{fontSize:9,fontWeight:800,color:status.color,textAlign:"center",whiteSpace:"nowrap"}}>{status.label}</span>
    {result?.visa&&<span title={result.dt||""} style={{fontSize:8,color:C.muted,textAlign:"center"}}>{result.visa} · {result.dt||""}</span>}
  </div>;
};

const TabMeasurements = ({data={},onChange,user,perms,units=[],activeUnitId="all",header={},forceShowDeleted=false}) => {
  const [showDeleted,setShowDeleted]=useState(false);
  const [excelScope,setExcelScope]=useState(activeUnitId==="all"?"all":"current");
  const canWrite=!!perms?.canWrite;
  const activeUnits=units.filter(unit=>!unit.deleted&&hasUnitIdentity(unit));
  const displayedUnits=activeUnitId!=="all"&&activeUnits.some(unit=>unit.id===activeUnitId)
    ? activeUnits.filter(unit=>unit.id===activeUnitId)
    : activeUnits;
  const rows=data.rows||[];
  const visibleRows=rows.filter(row=>forceShowDeleted||showDeleted||!row.deleted);
  const updateRow=(id,patch)=>onChange({...data,rows:rows.map(row=>row.id===id?{...row,...patch}:row)});
  const updatePlanField=(row,field,value,label)=>{
    const previous=String(row[field]||"");
    if(previous===value) return;
    updateRow(row.id,{[field]:value,editHistory:[...(row.editHistory||[]),{
      id:uid(),dt:nowDT(),visa:user?.trigram||"?",changes:[{label,from:previous,to:value}],
    }]});
  };
  const addRow=()=>onChange({...data,rows:[...rows,{
    id:uid(),lineNo:rows.length+1,fiche:"",etape:"",mesure:"",unite:"",min:"",max:"",results:[],comments:[],
    validated:true,deleted:false,createdVisa:user?.trigram||"",createdDT:nowDT(),
  }]});
  const saveResult=(row,unit,value,existing)=>{
    const stamp={dt:nowDT(),visa:user?.trigram||"?",changes:[{label:"Valeur",from:existing?.value||"",to:value}]};
    const next=existing
      ? (row.results||[]).map(result=>result.id===existing.id?{...result,value,visa:user?.trigram||"",dt:nowDT(),validated:!!value,
          editHistory:[...(result.editHistory||[]),stamp]}:result)
      : [...(row.results||[]),{id:uid(),unitId:unit.id,value,visa:user?.trigram||"",dt:nowDT(),validated:!!value,
          deleted:false,createdVisa:user?.trigram||"",createdDT:nowDT(),comments:[]}];
    updateRow(row.id,{results:next});
  };
  const removeRow=row=>{
    const reason=window.prompt("Motif obligatoire de l'annulation de cette mesure :","");
    if(!reason?.trim()) return;
    updateRow(row.id,{deleted:true,deletedReason:reason.trim(),deletedVisa:user?.trigram||"",deletedDate:nowDT()});
  };
  const restoreRow=row=>{
    const reason=window.prompt("Motif obligatoire de la restauration :","");
    if(!reason?.trim()) return;
    updateRow(row.id,{deleted:false,restoredReason:reason.trim(),restoredVisa:user?.trigram||"",restoredDate:nowDT()});
  };
  const exportExcel=()=>{
    const selectedIds=excelScope==="current"&&activeUnitId!=="all"?[activeUnitId]:null;
    const workbook=buildMeasurementsExcel({data,units:activeUnits,selectedUnitIds:selectedIds,header});
    const scope=selectedIds?.length?` - ${snTitle(activeUnits.find(unit=>unit.id===activeUnitId))}`:"";
    downloadMeasurementsBlob(workbook,fileSafeName(`Mesures OF ${header.of||"OF"}${scope}`)+".xlsx");
  };

  return <div>
    <div className="no-print" style={{display:"flex",gap:8,alignItems:"center",justifyContent:"space-between",marginBottom:10,flexWrap:"wrap"}}>
      <div style={{display:"flex",gap:8,alignItems:"center",flexWrap:"wrap"}}>
        {canWrite&&<Btn onClick={addRow} color={C.accent}>+ Mesure</Btn>}
        <label style={{fontSize:11,color:C.muted,display:"flex",alignItems:"center",gap:5}}>
          <input type="checkbox" checked={showDeleted} onChange={event=>setShowDeleted(event.target.checked)}/> Afficher les mesures annulées
        </label>
      </div>
      <div style={{display:"flex",gap:6,alignItems:"center"}}>
        {activeUnitId!=="all"&&<select value={excelScope} onChange={event=>setExcelScope(event.target.value)} style={{fontSize:11,padding:"4px 6px",background:C.input,color:C.text,border:`1px solid ${C.border}`,borderRadius:4}}>
          <option value="current">Excel du SN affiché</option><option value="all">Excel de tout l'OF</option>
        </select>}
        <Btn onClick={exportExcel} disabled={!rows.some(row=>!row.deleted)} color={C.green} small>↓ Excel mesures</Btn>
      </div>
    </div>
    <div style={{fontSize:11,color:C.muted,marginBottom:8}}>Le plan est commun à l'OF. Une mesure ajoutée ici apparaît automatiquement pour chaque SN / lot.</div>
    <div style={{overflowX:"auto",border:`1px solid ${C.border}`,borderRadius:5}}>
      <table style={{borderCollapse:"collapse",width:"100%",minWidth:Math.max(920,650+displayedUnits.length*126)}}>
        <thead><tr>
          <TH w={125}>Fiche suiveuse</TH><TH w={82}>Étape / OP</TH><TH w={190}>Mesure</TH><TH w={70}>Unité</TH><TH w={78}>Min attendu</TH><TH w={78}>Max attendu</TH>
          {displayedUnits.map(unit=><TH key={unit.id} w={126}>{snTitle(unit)}</TH>)}
          <TH w={170}>Observé OF</TH><TH w={60}>💬</TH><TH w={80}>Action</TH>
        </tr></thead>
        <tbody>
          {visibleRows.map((row,index)=>{
            const stats=measurementStats(row,activeUnits);
            const editable=canWrite&&!row.deleted;
            return <tr key={row.id} style={{opacity:row.deleted?.55:1,background:row.deleted?C.red+"0b":index%2?C.raised+"55":"transparent"}}>
              <TD><MeasurementField value={row.fiche} readOnly={!editable} onCommit={value=>updatePlanField(row,"fiche",value,"Fiche suiveuse")} placeholder="DOC-0013405_1" style={{minWidth:110}}/></TD>
              <TD><MeasurementField value={row.etape} readOnly={!editable} onCommit={value=>updatePlanField(row,"etape",value,"Étape / OP")} placeholder="40" style={{minWidth:65}}/></TD>
              <TD><MeasurementField value={row.mesure} readOnly={!editable} onCommit={value=>updatePlanField(row,"mesure",value,"Mesure")} placeholder="Tension TP1" style={{minWidth:170}}/></TD>
              <TD><MeasurementField value={row.unite} readOnly={!editable} onCommit={value=>updatePlanField(row,"unite",value,"Unité")} placeholder="V" style={{minWidth:55}}/></TD>
              <TD><MeasurementField value={row.min} readOnly={!editable} onCommit={value=>updatePlanField(row,"min",value,"Minimum attendu")} placeholder="Min" style={{minWidth:65,textAlign:"center"}}/></TD>
              <TD><MeasurementField value={row.max} readOnly={!editable} onCommit={value=>updatePlanField(row,"max",value,"Maximum attendu")} placeholder="Max" style={{minWidth:65,textAlign:"center"}}/></TD>
              {displayedUnits.map(unit=><TD key={unit.id} center><MeasurementValue row={row} unit={unit} user={user} canWrite={editable} onCommit={(value,existing)=>saveResult(row,unit,value,existing)}/></TD>)}
              <TD><div style={{fontSize:10,lineHeight:1.5,minWidth:155}}>
                <div><strong>{stats.count}</strong> / {activeUnits.length} mesuré{stats.count>1?"s":""}</div>
                <div>Min {measurementDisplayNumber(stats.min)} · Moy. {measurementDisplayNumber(stats.average)} · Max {measurementDisplayNumber(stats.max)}</div>
                {!!stats.minUnits.length&&<div title={stats.minUnits.join(" ; ")} style={{color:C.muted,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>Min : {stats.minUnits.join(" · ")}</div>}
                {!!stats.maxUnits.length&&<div title={stats.maxUnits.join(" ; ")} style={{color:C.muted,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>Max : {stats.maxUnits.join(" · ")}</div>}
              </div></TD>
              <TD center><CommentBtn comments={row.comments||[]} onChange={comments=>updateRow(row.id,{comments})} user={user} disabled={!perms?.canComment}/></TD>
              <TD center>{row.deleted
                ? isAdminManager(user)&&<Btn small color={C.green} onClick={()=>restoreRow(row)}>↶</Btn>
                : canWrite&&<Btn small color={C.red} onClick={()=>removeRow(row)}>×</Btn>}</TD>
            </tr>;
          })}
        </tbody>
      </table>
      {!visibleRows.length&&<EmptyTableAction message="Aucune mesure définie pour cet OF" actionLabel="+ Ajouter la première mesure" onAction={addRow} canAdd={canWrite}/>} 
    </div>
  </div>;
};

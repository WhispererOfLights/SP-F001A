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
  const min=measurementNumber(row?.min),max=measurementNumber(row?.max);
  const value=measurementNumber(raw);
  if(value===null) return min===null&&max===null
    ? {id:"information",label:"Informatif",color:C.muted,background:C.border+"28"}
    : {id:"invalid",label:"Résultat non numérique",color:C.red,background:C.red+"18"};
  if(min!==null&&value<min || max!==null&&value>max)
    return {id:"nonconforming",label:"Non conforme",color:C.red,background:C.red+"18"};
  if(min===null&&max===null)
    return {id:"information",label:"Informatif",color:C.muted,background:C.border+"28"};
  return {id:"conforming",label:"Conforme",color:C.green,background:C.green+"18"};
};

const measurementStats = (row,units=[]) => {
  const measured=units.map(unit=>{
    const result=measurementResultForUnit(row,unit.id);
    return {unit,result,value:measurementNumber(result?.value)};
  }).filter(item=>String(item.result?.value??"").trim());
  const values=measured.filter(item=>item.value!==null);
  if(!values.length) return {count:measured.length,numericCount:0,min:null,max:null,average:null,minUnits:[],maxUnits:[]};
  const numbers=values.map(item=>item.value);
  const min=Math.min(...numbers),max=Math.max(...numbers);
  return {
    count:measured.length,numericCount:values.length,min,max,average:numbers.reduce((sum,value)=>sum+value,0)/numbers.length,
    minUnits:values.filter(item=>item.value===min).map(item=>snTitle(item.unit)),
    maxUnits:values.filter(item=>item.value===max).map(item=>snTitle(item.unit)),
  };
};

const measurementDisplayNumber = value => value===null||value===undefined?"-":Number(value.toFixed(6)).toLocaleString("fr-FR",{maximumFractionDigits:6});
const measurementDisplayAverage = value => value===null||value===undefined?"-":value.toLocaleString("fr-FR",{minimumFractionDigits:2,maximumFractionDigits:2});

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
  const measurementHeader=row=>`${row.mesure||"Mesure"}${row.unite?` [${row.unite}]`:""}`;
  const gridHeader=["SN / LOT",...rows.map(measurementHeader)];
  const gridValues=selected.map(unit=>[
    identity(unit),
    ...rows.map(row=>measurementResultForUnit(row,unit.id)?.value||""),
  ]);
  const gridStats=rows.map(row=>measurementStats(row,selected));
  const article=[header.codeArticle,header.description].filter(Boolean).join(" - ");
  const grid=[
    ["N° OF",header.of||"","Article",article,"OTP",header.otp||""],
    [],
    gridHeader,
    ["Min attendu",...rows.map(row=>row.min||"")],
    ["Max attendu",...rows.map(row=>row.max||"")],
    ...gridValues,
    [],
    ["OF min",...gridStats.map(stats=>measurementDisplayNumber(stats.min))],
    ["OF moyenne",...gridStats.map(stats=>measurementDisplayAverage(stats.average))],
    ["OF max",...gridStats.map(stats=>measurementDisplayNumber(stats.max))],
  ];
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
      stats.count,measurementDisplayNumber(stats.min),measurementDisplayAverage(stats.average),measurementDisplayNumber(stats.max),
      stats.minUnits.join(" ; "),stats.maxUnits.join(" ; ")];
  });
  const gridSummaryStart=6+selected.length;
  return buildExcelWorkbook([
    {name:"Grille mesures",headerRows:[0,2,gridSummaryStart,gridSummaryStart+1,gridSummaryStart+2],rows:grid,
      freezeRows:5,freezeColumns:1,columnWidths:[18,...rows.map(row=>Math.max(14,Math.min(28,measurementHeader(row).length+3)))]},
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

const MeasurementGridCell = ({row,unit,rowIndex,columnIndex,canWrite,onCommit}) => {
  const result=measurementResultForUnit(row,unit.id);
  const [draft,setDraft]=useState(result?.value||"");
  const [editing,setEditing]=useState(!String(result?.value||"").trim());
  const inputRef=React.useRef(null);
  useEffect(()=>{
    setDraft(result?.value||"");
    setEditing(!String(result?.value||"").trim());
  },[result?.value]);
  const status=measurementStatus(row,{...result,value:draft});
  const changed=draft!==String(result?.value||"");
  const locked=canWrite&&!!String(result?.value||"").trim()&&!editing;
  const commit=()=>{
    if(!changed){if(result?.value) setEditing(false);return true;}
    const saved=onCommit(draft.trim(),result);
    if(saved===false){setDraft(result?.value||"");setEditing(false);return false;}
    setEditing(false);
    return true;
  };
  const moveDown=event=>{
    event.preventDefault();
    if(commit()===false) return;
    const selector=`[data-measure-cell="${rowIndex+1}-${columnIndex}"]`;
    requestAnimationFrame(()=>{const next=document.querySelector(selector);next?.focus();next?.select?.();});
  };
  const audit=result?.lastEditedDT
    ? `Mesuré ${result.dt||""} par ${result.visa||"?"} · modifié ${result.lastEditedDT} par ${result.lastEditedVisa||"?"}${result.lastEditedReason?` · motif : ${result.lastEditedReason}`:""}`
    : result?.visa?`Mesuré ${result.dt||""} par ${result.visa}`:status.label;
  return <div title={`${status.label} · ${audit}`} style={{position:"relative",minWidth:118}}>
    <input ref={inputRef} data-measure-cell={`${rowIndex}-${columnIndex}`} aria-label={`${row.mesure||"Mesure"} - ${snTitle(unit)}`}
      value={draft} readOnly={!canWrite||locked} onChange={event=>setDraft(event.target.value)} onBlur={()=>editing&&commit()}
      onKeyDown={event=>{if(event.key==="Enter") moveDown(event);if(event.key==="Escape"){setDraft(result?.value||"");setEditing(false);}}}
      style={{width:"100%",height:28,padding:`3px ${locked?25:7}px 3px 7px`,fontFamily:"monospace",fontSize:12,fontWeight:800,textAlign:"center",
        cursor:locked?"default":"text",color:C.text,background:status.background,border:`1px solid ${status.color}`,borderRadius:2,outline:"none"}}/>
    {locked&&<button type="button" title="Modifier cette valeur mesurée" aria-label={`Modifier ${row.mesure||"mesure"} - ${snTitle(unit)}`}
      onMouseDown={event=>event.preventDefault()} onClick={()=>{setEditing(true);requestAnimationFrame(()=>{inputRef.current?.focus();inputRef.current?.select();});}}
      style={{position:"absolute",right:2,top:3,width:21,height:21,padding:0,border:0,borderRadius:2,background:C.blue,color:"white",fontSize:11,cursor:"pointer"}}>✎</button>}
    <span aria-hidden="true" style={{position:"absolute",right:4,bottom:2,fontSize:7,fontWeight:900,color:status.color,pointerEvents:"none"}}>
      {status.id==="conforming"?"✓":status.id==="nonconforming"||status.id==="invalid"?"×":status.id==="missing"?"○":"i"}
    </span>
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
  const gridMeasures=visibleRows.filter(row=>!row.deleted);
  const updateRow=(id,patch)=>onChange({...data,rows:rows.map(row=>row.id===id?{...row,...patch}:row)});
  const updatePlanField=(row,field,value,label)=>{
    const previous=String(row[field]||"");
    if(previous===value) return;
    updateRow(row.id,{[field]:value,editHistory:[...(row.editHistory||[]),{
      id:uid(),dt:nowDT(),visa:user?.trigram||"?",changes:[{label,from:previous,to:value}],
    }]});
  };
  const addRow=()=>{
    const previous=[...rows].reverse().find(row=>!row.deleted);
    onChange({...data,rows:[...rows,{
      id:uid(),lineNo:rows.length+1,fiche:previous?.fiche||"",etape:previous?.etape||"",mesure:"",unite:"",min:"",max:"",results:[],comments:[],
      validated:true,deleted:false,createdVisa:user?.trigram||"",createdDT:nowDT(),
    }]});
  };
  const saveResult=(row,unit,value,existing)=>{
    let reason="";
    if(existing&&value!==String(existing.value||"")){
      reason=window.prompt(`Motif obligatoire de la modification (${existing.value||"vide"} → ${value||"vide"}) :`,"")?.trim()||"";
      if(!reason) return false;
    }
    const stamp={dt:nowDT(),visa:user?.trigram||"?",reason,changes:[{label:"Valeur",from:existing?.value||"",to:value}]};
    const next=existing
      ? (row.results||[]).map(result=>result.id===existing.id?{...result,value,validated:!!value,
          lastEditedVisa:user?.trigram||"",lastEditedDT:nowDT(),lastEditedReason:reason,
          editHistory:[...(result.editHistory||[]),stamp]}:result)
      : [...(row.results||[]),{id:uid(),unitId:unit.id,value,visa:user?.trigram||"",dt:nowDT(),validated:!!value,
          deleted:false,createdVisa:user?.trigram||"",createdDT:nowDT(),comments:[]}];
    updateRow(row.id,{results:next});
    return true;
  };
  const removeRow=row=>{
    if(perms?.godMode){
      updateRow(row.id,{deleted:true});
      return;
    }
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
    <div style={{display:"grid",gap:12}}>
      <div style={{border:`1px solid ${C.border}`,borderRadius:5,overflowX:"auto"}}>
        <table style={{borderCollapse:"collapse",width:"100%",minWidth:1030}}>
          <thead><tr>
            <TH w={125}>Fiche suiveuse</TH><TH w={82}>Étape / OP</TH><TH w={190}>Mesure</TH><TH w={70}>Unité</TH><TH w={78}>Min attendu</TH><TH w={78}>Max attendu</TH>
            <TH w={160}>Avancement</TH><TH w={190}>Résultats OF</TH><TH w={45}>💬</TH><TH w={55}></TH>
          </tr></thead>
          <tbody>{visibleRows.map((row,index)=>{
            const stats=measurementStats(row,activeUnits);
            const statuses=activeUnits.map(unit=>measurementStatus(row,measurementResultForUnit(row,unit.id)));
            const conforming=statuses.filter(status=>status.id==="conforming"||status.id==="information").length;
            const nonconforming=statuses.filter(status=>status.id==="nonconforming"||status.id==="invalid").length;
            const missing=statuses.filter(status=>status.id==="missing").length;
            const editable=canWrite&&!row.deleted;
            return <tr key={row.id} style={{opacity:row.deleted?.55:1,background:row.deleted?C.red+"0b":index%2?C.raised+"55":"transparent"}}>
              <TD><MeasurementField value={row.fiche} readOnly={!editable} onCommit={value=>updatePlanField(row,"fiche",value,"Fiche suiveuse")} placeholder="DOC-0013405_1" style={{minWidth:110}}/></TD>
              <TD><MeasurementField value={row.etape} readOnly={!editable} onCommit={value=>updatePlanField(row,"etape",value,"Étape / OP")} placeholder="40" style={{minWidth:65}}/></TD>
              <TD><MeasurementField value={row.mesure} readOnly={!editable} onCommit={value=>updatePlanField(row,"mesure",value,"Mesure")} placeholder="Tension TP1" style={{minWidth:165}}/></TD>
              <TD><MeasurementField value={row.unite} readOnly={!editable} onCommit={value=>updatePlanField(row,"unite",value,"Unité")} placeholder="V" style={{minWidth:55}}/></TD>
              <TD><MeasurementField value={row.min} readOnly={!editable} onCommit={value=>updatePlanField(row,"min",value,"Minimum attendu")} placeholder="Min" style={{minWidth:65,textAlign:"center"}}/></TD>
              <TD><MeasurementField value={row.max} readOnly={!editable} onCommit={value=>updatePlanField(row,"max",value,"Maximum attendu")} placeholder="Max" style={{minWidth:65,textAlign:"center"}}/></TD>
              <TD><div style={{fontSize:10,lineHeight:1.55,minWidth:145}}>
                <div style={{height:5,borderRadius:3,overflow:"hidden",background:C.border,marginBottom:4}}><div style={{height:"100%",width:`${activeUnits.length?stats.count/activeUnits.length*100:0}%`,background:stats.count===activeUnits.length?C.green:C.blue}}/></div>
                <strong>{stats.count} / {activeUnits.length}</strong> mesuré{stats.count>1?"s":""}
                <div><span style={{color:C.green}}>✓ {conforming}</span> · <span style={{color:C.red}}>× {nonconforming}</span> · <span style={{color:C.yellow}}>○ {missing}</span></div>
              </div></TD>
              <TD><div style={{fontSize:10,lineHeight:1.5,minWidth:175}}>
                <div>Min <strong>{measurementDisplayNumber(stats.min)}</strong> · Moy. <strong>{measurementDisplayAverage(stats.average)}</strong> · Max <strong>{measurementDisplayNumber(stats.max)}</strong></div>
                {!!stats.minUnits.length&&<div title={stats.minUnits.join(" ; ")} style={{color:C.muted,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>Min : {stats.minUnits.join(" · ")}</div>}
                {!!stats.maxUnits.length&&<div title={stats.maxUnits.join(" ; ")} style={{color:C.muted,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>Max : {stats.maxUnits.join(" · ")}</div>}
              </div></TD>
              <TD center><CommentBtn comments={row.comments||[]} onChange={comments=>updateRow(row.id,{comments})} user={user} disabled={!perms?.canComment}/></TD>
              <TD center>{row.deleted
                ? isAdminManager(user)&&<IconBtn title="Restaurer cette mesure" color={C.green} onClick={()=>restoreRow(row)}>↶</IconBtn>
                : canWrite&&<IconBtn title={perms?.godMode?"Effacer définitivement cette mesure":"Annuler cette mesure"} color={C.red} onClick={()=>removeRow(row)}>×</IconBtn>}</TD>
            </tr>;
          })}</tbody>
        </table>
        {!visibleRows.length&&<EmptyTableAction message="Aucune mesure définie pour cet OF" actionLabel="+ Ajouter la première mesure" onAction={addRow} canAdd={canWrite}/>}
      </div>
      {!!gridMeasures.length&&<section aria-label="Grille de saisie des mesures" style={{border:`1px solid ${C.blue}`,borderRadius:5,overflow:"hidden"}}>
        <div style={{padding:"7px 10px",background:C.blue+"12",borderBottom:`1px solid ${C.border}`,fontSize:11,color:C.muted}}>
          Saisie {activeUnitId==="all"?"OF":snTitle(displayedUnits[0])} · <strong style={{color:C.text}}>Tab</strong> : cellule suivante · <strong style={{color:C.text}}>Entrée</strong> : SN suivant dans la même mesure
        </div>
        <div style={{overflowX:"auto",maxHeight:"55vh",overflowY:"auto"}}>
          <table style={{borderCollapse:"separate",borderSpacing:0,width:"100%",minWidth:180+gridMeasures.length*145}}>
            <thead style={{position:"sticky",top:0,zIndex:3}}><tr>
              <th style={{position:"sticky",left:0,zIndex:4,minWidth:145,background:C.raised,borderRight:`1px solid ${C.border}`,borderBottom:`1px solid ${C.border}`,padding:"7px 8px",fontSize:10,textAlign:"left",color:C.muted}}>SN / LOT</th>
              {gridMeasures.map(row=><th key={row.id} style={{minWidth:145,maxWidth:180,background:C.raised,borderRight:`1px solid ${C.border}`,borderBottom:`1px solid ${C.border}`,padding:"5px 7px",textAlign:"center"}}>
                <div title={[row.mesure,row.unite&&`[${row.unite}]`].filter(Boolean).join(" ")||"Mesure"} style={{fontSize:11,fontWeight:800,color:C.text,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>
                  {row.mesure||"Mesure"}{row.unite?` [${row.unite}]`:""}
                </div>
                <div style={{fontSize:9,color:C.muted,marginTop:2}}>Attendu : {row.min||"-"} à {row.max||"-"}</div>
              </th>)}
            </tr></thead>
            <tbody>{displayedUnits.map((unit,rowIndex)=><tr key={unit.id} style={{background:rowIndex%2?C.raised+"40":C.surface}}>
              <th title={snTitle(unit)} style={{position:"sticky",left:0,zIndex:2,background:rowIndex%2?C.raised:C.surface,borderRight:`1px solid ${C.border}`,borderBottom:`1px solid ${C.border}`,padding:"5px 8px",fontSize:11,fontFamily:"monospace",fontWeight:800,textAlign:"left",whiteSpace:"nowrap"}}>{snTitle(unit)}</th>
              {gridMeasures.map((row,columnIndex)=><td key={row.id} style={{padding:4,borderRight:`1px solid ${C.border}55`,borderBottom:`1px solid ${C.border}`,background:measurementStatus(row,measurementResultForUnit(row,unit.id)).background}}>
                <MeasurementGridCell row={row} unit={unit} rowIndex={rowIndex} columnIndex={columnIndex} canWrite={canWrite} onCommit={(value,existing)=>saveResult(row,unit,value,existing)}/>
              </td>)}
            </tr>)}</tbody>
            <tfoot><tr>
              <th style={{position:"sticky",left:0,background:C.raised,borderRight:`1px solid ${C.border}`,padding:"6px 8px",fontSize:10,textAlign:"left"}}>OF min / moy. / max</th>
              {gridMeasures.map(row=>{const stats=measurementStats(row,activeUnits);return <td key={row.id} style={{padding:"6px 5px",background:C.raised,borderRight:`1px solid ${C.border}`,fontSize:9,textAlign:"center",whiteSpace:"nowrap"}}>
                {measurementDisplayNumber(stats.min)} / <strong>{measurementDisplayAverage(stats.average)}</strong> / {measurementDisplayNumber(stats.max)}
              </td>;})}
            </tr></tfoot>
          </table>
        </div>
      </section>}
    </div>
  </div>;
};

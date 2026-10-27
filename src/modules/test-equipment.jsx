// ─── 4. Test Equipment — format AAAA-MM + détection hors calibration ───────
const normCalib = s => {
  if(!s) return s;
  if(["N/A","NA"].includes(String(s).trim().toUpperCase().replace(/\s+/g,""))) return "N/A";
  const d=s.replace(/\D/g,"");
  // AAMM "2506" → "2025-06"
  if(d.length===4) return "20"+d.slice(0,2)+"-"+d.slice(2,4);
  return s;
};
const parseCalibDate = s => {
  if(!s)return null;
  s=normCalib(s);
  if(!s.includes("-"))return null;
  const [yyyy,mm]=s.split("-");
  if(!yyyy||!mm)return null;
  // fin du mois indiqué
  return new Date(parseInt(yyyy),parseInt(mm),0); // jour 0 du mois suivant = dernier jour du mois
};
const isValidCalibDate = s => {
  if(!s) return true;
  const n=normCalib(s);
  if(n==="N/A") return true;
  if(!/^\d{4}-(0[1-9]|1[0-2])$/.test(n)) return false;
  return true;
};
const calibStatus = s => {
  if(normCalib(s)==="N/A") return{label:"N/A",color:C.blue,bg:C.blue+"12"};
  const d=parseCalibDate(normCalib(s));
  if(!d)return null;
  const diff=(d-new Date())/86400000;
  if(diff<0)return{label:"HORS CALIBRATION",color:C.red,bg:"#da363322"};
  if(diff<=30)return{label:"EXPIRE BIENTÔT",color:C.yellow,bg:"#d2992222"};
  return{label:"OK",color:C.green,bg:"#23863622"};
};

const TEST_EQUIP_EDIT_FIELDS = [
  {key:"createdDT",label:"Date de l'opération"},
  {key:"snScope",label:"Mode SN"},
  {key:"snIds",label:"N° SN"},
  {key:"isFour",label:"Four"},
  {key:"nInv",label:"N° INV"},
  {key:"type",label:"Type"},
  {key:"designation",label:"Désignation"},
  {key:"dateExpiration",label:"Date calibration"},
  {key:"checkDate",label:"Date contrôle"},
];

const TabTestEquip = ({data,onChange,user,perms={},header,forceShowDeleted=false,onCopyAcross}) => {
  const rows=data.rows||[];
  const canEdit = row => canEditLine(user,row);
  const add=()=>{ if(!perms.canWrite) return; onChange({rows:[...rows,{
    id:uid(),...defaultSnScope(header),nInv:"",type:"",designation:"",
    dateExpiration:"",
    isFour:false,
    visa:user.trigram,
    checkDate:now(),
    createdVisa:user.trigram,
    createdDT:nowDT(),
    commentaires:""
  }]}); };
  const [deleteTarget,setDeleteTarget] = useState(null);
  const [restoreTarget,setRestoreTarget] = useState(null);
  const [showDeleted,setShowDeleted]   = useState(false);
  const snFilter=workSnFilter(header);
  const upd=(id,f,v)=>{ const r=rows.find(x=>x.id===id); if(f==="comments" ? !perms.canComment : !canEdit(r)) return; onChange({rows:scopedRowsPatch(rows,id,header,{[f]:v})}); };
  const patchRow=(id,fields)=>{ const r=rows.find(x=>x.id===id); if(canEdit(r)) onChange({rows:scopedRowsPatch(rows,id,header,fields)}); };
  const dup=id=>{ const r=rows.find(x=>x.id===id); if(!r||!perms.canWrite) return; if(onCopyAcross&&!r.deleted){onCopyAcross(r);return;} onChange({rows:[...rows,duplicateRow(r,user,{
    visa:user.trigram,checkDate:now()
  })]}); };
  const del=id=>{
    const r=rows.find(x=>x.id===id);
    if(!canEdit(r)) return;
    if(!r.validated&&!r.editBase) onChange({rows:rows.filter(x=>x.id!==id)});
    else if(!r.validated) onChange({rows:scopedRowsDelete(rows,id,header,{deleted:true,deletedReason:"",deletedVisa:user.trigram,deletedDate:nowDT()})});
    else setDeleteTarget(id);
  };
  const restore=reason=>{ onChange({rows:rows.map(r=>r.id===restoreTarget?{...r,deleted:false,restoredReason:reason,restoredVisa:user.trigram,restoredDate:nowDT()}:r)}); setRestoreTarget(null); };
  const confirmDel=reason=>{ onChange({rows:scopedRowsDelete(rows,deleteTarget,header,{deleted:true,deletedReason:reason,deletedVisa:user.trigram,deletedDate:nowDT()})}); setDeleteTarget(null); };
  const deletedCount=rows.filter(r=>r.deleted).length;

  const REQUIRED = [
    {key:"nInv",          label:"N° INV"},
    {key:"type",          label:"Type"},
    {key:"designation",   label:"Désignation"},
    {key:"dateExpiration",label:"Date calibration"},
  ];
  const validateRow=id=>{ const r=rows.find(x=>x.id===id); if(!canEdit(r)) return; const miss=checkRequired(r,REQUIRED); if(miss.length) { upd(id,"validError","Champs requis : "+miss.join(", ")); } else { onChange({rows:scopedRowsPatch(rows,id,header,x=>withEditHistory(x,user,TEST_EQUIP_EDIT_FIELDS))}); } };
  const unlockRow=id=>{ const r=rows.find(x=>x.id===id); if(canEdit(r)) onChange({rows:rows.map(r=>r.id===id?{...r,validated:false,_scopeEditConfirmed:false,editBase:snapshotFields(r,TEST_EQUIP_EDIT_FIELDS)}:r)}); };
  const horsCalib=effectiveScopedRows({header,testequip:{rows}},"testequip").filter(r=>rowMatchesSnFilter(r,snFilter,header)&&calibStatus(r.dateExpiration)?.color===C.red);
  const visibleRows=sortByNewestOperation(rows).filter(r=>
    (!r.deleted||showDeleted||forceShowDeleted) && rowMatchesSnFilter(r,snFilter,header)
  );
  return (
    <div style={{maxWidth:1450}}>
      {horsCalib.length>0&&(
        <div style={{background:"#da363322",border:`1px solid ${C.red}`,borderRadius:6,padding:"10px 14px",marginBottom:14,display:"flex",gap:10,alignItems:"center"}}>
          <span style={{color:C.red,fontSize:16}}>⚠</span>
          <span style={{color:C.red,fontWeight:700,fontSize:13}}>
            {horsCalib.length} appareil{horsCalib.length>1?"s":""} hors calibration :&nbsp;
            {horsCalib.map(r=>r.designation||r.nInv||"?").join(", ")}
          </span>
        </div>
      )}
      <div style={{display:"flex",justifyContent:"flex-end",gap:8,marginBottom:12}}>
        {perms.canWrite&&<div style={{marginRight:"auto"}}><Btn onClick={add} small>+ Équipement</Btn></div>}
        <span style={{fontSize:10,color:C.muted,fontFamily:"monospace"}}>Filtre SN : {snFilter==="all"?"TRAVAIL = Tous":snScopeLabel({snScope:"custom",snIds:[snFilter]},snRowsFromHeader(header))}</span>
        {deletedCount>0&&<Btn onClick={()=>setShowDeleted(s=>!s)} color={showDeleted?"#da3633":C.border} small>
          {showDeleted?"▲ Masquer annulées":"▼ Voir annulées ("+deletedCount+")"}
        </Btn>}
      </div>
      <div style={{overflowX:"auto"}}>
        <table style={{width:"100%",borderCollapse:"collapse",tableLayout:"fixed"}}>
          <thead>
            <tr>
              <TH w={118}>Date / Heure</TH><TH w={46} color={C.accent}>Visa</TH>
              <TH w={78}>N° SN</TH>
              <TH w={48}>Four</TH>
              <TH>N° INV</TH>
              <TH>TYPE</TH>
              <TH>DÉSIGNATION</TH>
              <TH w={105}>Date calib</TH>
              <TH w={95}>Statut</TH>
              <TH w={96}>Date contrôle</TH>
              <TH w={36}>💬</TH>
              <TH w={104}></TH>
            </tr>
          </thead>
          <tbody>
            {visibleRows.flatMap((r,i)=>{
              const st=calibStatus(r.dateExpiration);
              const invalid=r.dateExpiration&&!isValidCalibDate(r.dateExpiration);
              const editable = canEdit(r);
              const locked = !!r.validated || !editable;
              return [
                <tr key={r.id} style={{background:r.deleted?"#da363318":st?.bg||(i%2===0?"transparent":C.stripe),
                  textDecoration:r.deleted?"line-through":undefined,opacity:r.deleted?.6:1,
                  pointerEvents:r.deleted?"none":undefined,
                  borderLeft:r.validated?`3px solid ${C.green}`:r.validError?`3px solid ${C.red}`:`3px solid ${C.border}`}}>
                  <TD><OperationDateCell value={r.createdDT} editing={!!r.editBase&&editable&&!r.deleted} onChange={value=>upd(r.id,"createdDT",value)}/></TD>
                  <TD><span style={{fontFamily:"monospace",fontWeight:700,fontSize:12,color:C.accent}}>{r.createdVisa||"—"}</span><CopyOriginMark origin={r.copyOrigin}/></TD>
                  <TD style={{pointerEvents:r.deleted?"none":"all"}}><SnScopePicker row={r} header={header} onChange={fields=>patchRow(r.id,fields)} disabled={locked}/></TD>
                  <TD center style={{pointerEvents:r.deleted?"none":"all"}}>
                    <input type="checkbox" checked={!!r.isFour} disabled={locked}
                      onChange={e=>upd(r.id,"isFour",e.target.checked)}
                      title="Définir cet équipement comme four pour le proposer dans l'onglet Étuvages"
                      style={{width:16,height:16,accentColor:C.accent,cursor:locked?"default":"pointer"}}/>
                  </TD>
                  <TD><Input value={r.nInv} onChange={v=>upd(r.id,"nInv",v)} small readOnly={locked} style={locked?LOCKED_INPUT_STYLE:{}}/></TD>
                  <TD><Input value={r.type}        onChange={v=>upd(r.id,"type",v)}        small readOnly={locked} style={locked?LOCKED_INPUT_STYLE:{}}/></TD>
                  <TD><Input value={r.designation} onChange={v=>upd(r.id,"designation",v)} small readOnly={locked} style={locked?LOCKED_INPUT_STYLE:{}}/></TD>
                  <TD>
                    <Input value={r.dateExpiration} onChange={v=>upd(r.id,"dateExpiration",v)}
                      placeholder="2026-06, AAMM ou N/A" small readOnly={locked}
                      onBlur={e=>!locked&&upd(r.id,"dateExpiration",normCalib(e.target.value))}
                      style={{...(locked?LOCKED_INPUT_STYLE:{borderColor:invalid?C.red:undefined,color:invalid?C.red:undefined})}}/>
                    {invalid&&!locked&&<div style={{color:C.red,fontSize:9,marginTop:2}}>Format AAAA-MM, mois 01-12, ou N/A</div>}
                  </TD>
                  <TD center>
                    {st
                      ? <Badge label={st.label} color={st.color}/>
                      : <span style={{color:C.muted,fontSize:10}}>—</span>
                    }
                  </TD>

                  <TD>
                    <Input value={r.checkDate} onChange={v=>upd(r.id,"checkDate",v)} small readOnly={locked} style={locked?LOCKED_INPUT_STYLE:{}}/>
                  </TD>
                  <TD center><CommentBtn comments={r.comments||[]} onChange={v=>upd(r.id,"comments",v)} user={user} disabled={!perms.canComment}/></TD>
                  <TD center style={{pointerEvents:"all"}}>
                    {!r.deleted&&!r.validated&&editable&&(
                      <ActionGroup>
                        <IconBtn onClick={()=>validateRow(r.id)} color={C.green} title="Valider">✓</IconBtn>
                        <IconBtn onClick={()=>dup(r.id)} color={C.blue} title="Dupliquer">⧉</IconBtn>
                        <HistoryBtn row={r}/>
                        <IconBtn onClick={()=>del(r.id)} color={C.border} title="Supprimer">×</IconBtn>
                      </ActionGroup>
                    )}
                  {!r.deleted&&r.validated&&editable&&(
                    <ActionGroup>
                      <IconBtn onClick={()=>unlockRow(r.id)} color={C.yellow} title="Modifier">✎</IconBtn>
                      <IconBtn onClick={()=>dup(r.id)} color={C.blue} title="Dupliquer">⧉</IconBtn>
                      <HistoryBtn row={r}/>
                      <IconBtn onClick={()=>setDeleteTarget(r.id)} color={C.red} title="Annuler">×</IconBtn>
                    </ActionGroup>
                  )}
                  {!r.deleted&&!editable&&perms.canWrite&&(
                    <ActionGroup>
                      <IconBtn onClick={()=>dup(r.id)} color={C.blue} title="Dupliquer">⧉</IconBtn>
                      <HistoryBtn row={r}/>
                    </ActionGroup>
                  )}
                  </TD>
                </tr>,
              <HistoryTrail key={r.id+"_hist"} row={r} open={forceShowDeleted}/>,
              r.deleted&&(
                <tr key={r.id+"_ann"}>
                  <td colSpan={99} style={{padding:"3px 10px 6px",background:"#da363325",borderBottom:`2px solid #da363355`}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                      <span style={{color:"#da3633",fontSize:10,fontFamily:"monospace",letterSpacing:.3}}>
                        ✕ Annulé le <strong>{r.deletedDate}</strong> par <strong>{r.deletedVisa}</strong>
                        &nbsp;—&nbsp;Motif : {r.deletedReason}
                      </span>
                      <PurgeLineButton user={user} data={data} onChange={onChange} id={r.id}/>
                      <span onClick={e=>{e.stopPropagation();setRestoreTarget(r.id);}}
                        style={{color:"#d29922",fontSize:11,cursor:"pointer",fontWeight:700,
                          pointerEvents:"all",textDecoration:"none",marginLeft:16,flexShrink:0}}>
                        ↩ Réactiver
                      </span>
                    </div>
                  </td>
                </tr>
              )
              ];
            })}
          </tbody>
        </table>
      </div>
      {rows.length===0&&<div style={{textAlign:"center",color:C.muted,padding:24}}>Aucun équipement</div>}
      <div style={{marginTop:8,fontSize:11,color:C.muted}}>
        ✦ Visa pré-rempli · × annule et barre la ligne · Date calibration : AAAA-MM (ex: 2026-06) ou N/A
      </div>
      {deleteTarget&&<DeleteModal godMode={perms.godMode} onConfirm={confirmDel} onCancel={()=>setDeleteTarget(null)}/>}
      {restoreTarget&&<RestoreModal onConfirm={restore} onCancel={()=>setRestoreTarget(null)}/>}
    </div>
  );
};

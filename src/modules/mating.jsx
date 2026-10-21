// ─── 8. Mating / Demating ────────────────────────────────────────────────
// Modèle : journal d'actions par connecteur
// events = [{id, dt, visa, action:"Mating"|"Demating", remarque:"", comments:[]}]
// Cycles = events.length / 2  (décimal : 0.5, 1, 1.5, 2…)
// Alternance stricte après la première action (libre)
// Suppression avec motif sur chaque événement
const CONNECTOR_EDIT_FIELDS = [
  {key:"snScope",label:"Mode SN"},
  {key:"snIds",label:"N° SN"},
  {key:"nConect",label:"Connecteur"},
];
const ConnectorActionButton = ({action,connector,disabled,title,onClick}) => {
  const mating=action==="Mating",tone=mating?C.green:C.red;
  const half={width:6,height:10,border:"2px solid currentColor",borderRadius:2,display:"inline-block"};
  return <button type="button" aria-label={`${action} ${connector}`} disabled={disabled} title={title} onClick={onClick}
    style={{height:34,minWidth:0,width:"100%",padding:"2px",border:`1px solid ${disabled?C.border:tone}`,borderRadius:4,
      background:disabled?C.raised:tone+"18",color:disabled?C.muted:tone,cursor:disabled?"default":"pointer",
      display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:1,fontFamily:"system-ui,sans-serif",fontSize:11,lineHeight:"13px",fontWeight:700}}>
    <span aria-hidden="true" style={{display:"flex",alignItems:"center",justifyContent:"center",height:12,gap:2,opacity:disabled?.5:1}}>
      <span style={half}/><span style={{width:23,textAlign:"center",fontSize:13,lineHeight:1}}>{mating?"→←":"←→"}</span><span style={half}/>
    </span>
    <span>{action}</span>
  </button>;
};

const TabDeMating = ({data,onChange,user,perms={},header,forceShowDeleted=false,onCopyAcross}) => {
  const connectors = data.connectors||[];
  const canEdit = row => canEditLine(user,row);
  const [deleteEvTarget,   setDeleteEvTarget]   = useState(null); // {cid,eid}
  const [deleteConnTarget, setDeleteConnTarget] = useState(null); // cid
  const [restoreEvTarget,   setRestoreEvTarget]   = useState(null); // {cid,eid}
  const [restoreConnTarget, setRestoreConnTarget] = useState(null); // cid
  const [showDeleted, setShowDeleted] = useState(false);
  const [historyConnector,setHistoryConnector] = useState("all");
  const snFilter=workSnFilter(header);

  const scopeIds = row => {
    const snRows=snRowsFromHeader(header);
    if(!snRows.length) return ["__of__"];
    const scope=snScope(row,snRows);
    const excluded=(row?.snExcludeIds||[]).filter(id=>snRows.some(s=>s.id===id));
    return scope.mode==="all"
      ? snRows.map(s=>s.id).filter(id=>!excluded.includes(id))
      : scope.ids;
  };
  const makeConnector = (scope,nConect="") => ({
    id:uid(), ...scope, nConect, validated:true, connError:"",
    deleted:false, deletedReason:"", deletedVisa:"", deletedDate:"",
    createdVisa:user?.trigram||"",
    createdDT:nowDT(),
    comments:[],
    events:[]
  });
  const appendConnectors = additions => {
    for(const c of additions){
      const ids=scopeIds(c);
      const duplicate=connectors.some(x=>!x.deleted&&String(x.nConect||"").trim().toUpperCase()===c.nConect&&scopeIds(x).some(id=>ids.includes(id)));
      if(duplicate){window.alert(`Connecteur ${c.nConect} déjà existant pour le SN ou lot concerné.`);return;}
    }
    onChange({connectors:[...connectors,...additions]});
  };

  // ── Connecteurs ─────────────────────────────────────────────
  const addC = () => {
    if(!perms.canWrite) return;
    const snRows=snRowsFromHeader(header);
    const active=header?._entrySnIds?.[0]||workSnFilter(header);
    const name=window.prompt("Nom du connecteur à créer (ex: J4)", "");
    if(name===null) return;
    const nConect=String(name||"").trim().toUpperCase();
    if(!nConect){window.alert("Nom du connecteur requis (ex: J4).");return;}
    if(snRows.length>1){
      const createAll=window.confirm(
        `Créer ${nConect||"ce connecteur"} pour tous les SN / LOT ?\n\n${snRows.map(snTitle).join("\n")}\n\nOK = créer un connecteur indépendant par SN / LOT.\nAnnuler = créer uniquement pour le SN de saisie.`
      );
      if(createAll){
        appendConnectors(snRows.map(sn=>makeConnector({snScope:"custom",snIds:[sn.id],unitId:sn.id},nConect)));
        return;
      }
      if(active==="all"){
        window.alert("Sélectionne d'abord un SN dans TRAVAIL pour créer un connecteur sur un seul SN.");
        return;
      }
      appendConnectors([makeConnector({snScope:"custom",snIds:[active],unitId:active},nConect)]);
      return;
    }
    appendConnectors([makeConnector(defaultSnScope(header),nConect)]);
  };
  const updC = (cid,f,v) => {
    const c=connectors.find(x=>x.id===cid);
    if(f==="comments" ? !perms.canComment : !canEdit(c)) return;
    onChange({connectors:scopedRowsPatch(connectors,cid,header,{[f]:v})});
  };
  const patchC = (cid,fields) => {
    const c=connectors.find(x=>x.id===cid);
    if(canEdit(c)) onChange({connectors:scopedRowsPatch(connectors,cid,header,fields)});
  };
  const validateConn = cid => {
    const c=connectors.find(x=>x.id===cid);
    if(!canEdit(c)) return;
    if(!c?.nConect?.trim()){ onChange({connectors:connectors.map(x=>x.id===cid?{...x,connError:"Nom du connecteur requis (ex: J13)"}:x)}); return; }
    const snRows=snRowsFromHeader(header);
    const currentIds=scopeIds(c);
    const same=String(c.nConect||"").trim().toUpperCase();
    const duplicate=connectors.find(x=>x.id!==cid&&!x.deleted&&String(x.nConect||"").trim().toUpperCase()===same&&
      scopeIds(x).some(id=>currentIds.includes(id)));
    if(duplicate){
      const dupIds=scopeIds(duplicate).filter(id=>currentIds.includes(id));
      const label=dupIds.includes("__of__")
        ? "cet OF"
        : dupIds.slice(0,3).map(id=>snTitle(snRows.find(s=>s.id===id))).join(" + ")+(dupIds.length>3?` + ${dupIds.length-3} SN`:"");
      onChange({connectors:connectors.map(x=>x.id===cid?{...x,connError:`Connecteur ${same} déjà existant sur ${label}`}:x)});
      return;
    }
    onChange({connectors:scopedRowsPatch(connectors,cid,header,x=>withEditHistory({...x,connError:""},user,CONNECTOR_EDIT_FIELDS))});
  };
  const unlockConn = cid => {
    const c=connectors.find(x=>x.id===cid);
    if(canEdit(c)) onChange({connectors:connectors.map(c=>c.id===cid?{...c,validated:false,_scopeEditConfirmed:false,editBase:snapshotFields(c,CONNECTOR_EDIT_FIELDS)}:c)});
  };
  const restoreC   = reason => {
    onChange({connectors:connectors.map(c=>c.id===restoreConnTarget?{...c,deleted:false,restoredReason:reason,restoredVisa:user?.trigram||"?",restoredDate:nowDT()}:c)});
    setRestoreConnTarget(null);
  };
  const confirmDelConn = reason => {
    const c=connectors.find(x=>x.id===deleteConnTarget);
    if(canEdit(c)) onChange({connectors:scopedRowsDelete(connectors,deleteConnTarget,header,{deleted:true,deletedReason:reason,deletedVisa:user?.trigram||"?",deletedDate:nowDT()})});
    setDeleteConnTarget(null);
  };
  const delConn = cid => {
    const c=connectors.find(x=>x.id===cid);
    if(!canEdit(c)) return;
    if(!c.validated&&!c.editBase&&!(c.events||[]).length) onChange({connectors:connectors.filter(x=>x.id!==cid)});
    else if(!c.validated) onChange({connectors:scopedRowsDelete(connectors,cid,header,{deleted:true,deletedReason:"",deletedVisa:user?.trigram||"?",deletedDate:nowDT()})});
    else setDeleteConnTarget(cid);
  };

  // ── Événements ───────────────────────────────────────────────
  // Dernier événement actif (non supprimé)
  const lastActive = c => [...(c.events||[])].filter(e=>!e.deleted).slice(-1)[0]||null;

  // Prochaine action attendue : "either" si aucun event, sinon opposé du dernier
  const nextExpected = c => {
    const last = lastActive(c);
    if(!last) return "either";
    return last.action==="Mating" ? "Demating" : "Mating";
  };

  // Compteur de cycles (décimal)
  const cycleCount = c => {
    const n = (c.events||[]).filter(e=>!e.deleted).length;
    return n/2;
  };

  // Statut
  const connStatus = c => {
    const last = lastActive(c);
    if(!last) return {label:"Aucune action", color:C.muted};
    return last.action==="Mating"
      ? {label:"⚡ MATÉ", color:C.green}
      : {label:"✓ DÉMATÉ", color:C.red};
  };

  const addEvent = (cid, action) => {
    const c = connectors.find(x=>x.id===cid); if(!c) return;
    if(!canRecordMating(user,c)) return;
    const ne = nextExpected(c);
    if(ne!=="either"&&ne!==action) return; // should not happen (button disabled)
    const ev = {id:uid(), dt:nowDT(), visa:user?.trigram||"", action, remarque:"", comments:[], deleted:false, deletedReason:"", deletedVisa:"", deletedDate:""};
    const ids=scopeIds(c);
    if(ids.length>1){
      const active=workSnFilter(header);
      const snRows=snRowsFromHeader(header);
      const activeRow=snRows.find(s=>s.id===active);
      if(!activeRow||!rowMatchesSn(c,activeRow,snRows)){
        window.alert("Choisis d'abord le SN de travail avant d'enregistrer un Mating/Demating.");
        return;
      }
      let inserted=null;
      const next=connectors.map(x=>{
        if(x.id!==cid) return x;
        const excluded=[...new Set([...(x.snExcludeIds||[]),active])];
        inserted={...x,id:uid(),snScope:"custom",snIds:[active],unitId:active,snExcludeIds:[],events:[...(x.events||[]),ev],_scopeEditConfirmed:undefined};
        return {...x,...remainingSnScope(x,active),_scopeEditConfirmed:undefined};
      });
      onChange({connectors:[...next,inserted]});
      return;
    }
    onChange({connectors:scopedRowsPatch(connectors,cid,header,{events:[...(c.events||[]),ev]})});
  };
  const requestEventFromTile = (c,chosenAction) => {
    if(!canRecordMating(user,c)) return;
    const expected=nextExpected(c);
    let action=chosenAction||expected;
    if(chosenAction&&expected!=="either"&&chosenAction!==expected) return;
    if(expected==="either"&&!chosenAction){
      const choice=window.prompt(
        `${c.nConect||"Connecteur"} : première action à enregistrer\n\n1 = Mating\n2 = Demating\n3 = annuler`,
        "1"
      );
      if(choice===null||String(choice).trim()==="3") return;
      action=String(choice).trim()==="2" ? "Demating" : "Mating";
    }
    const label = action==="Mating" ? "Mating" : "Demating";
    if(window.confirm(`${c.nConect||"Connecteur"} : enregistrer ${label} maintenant ?`)) {
      addEvent(c.id, action);
    }
  };

  const updEv = (cid,eid,f,v) => {
    const c=connectors.find(x=>x.id===cid);
    if(f==="comments" ? !perms.canComment : !canEdit(c)) return;
    onChange({connectors:scopedRowsPatch(connectors,cid,header,c=>({
      events:c.events.map(e=>e.id===eid?{...e,[f]:v}:e)
    }))});
  };
  const updEvDate = (cid,eid,value) => {
    const c=connectors.find(x=>x.id===cid);
    if(!c?.editBase||!canEdit(c)) return;
    onChange({connectors:scopedRowsPatch(connectors,cid,header,current=>({
      events:(current.events||[]).map(event=>event.id!==eid?event:{
        ...event,
        dt:value,
        editHistory:[...(event.editHistory||[]),{
          id:uid(),dt:nowDT(),visa:user?.trigram||"?",
          changes:[{label:"Date de l'opération",from:event.dt||"",to:value}],
        }],
      }),
    }))});
  };

  const confirmDelEv = reason => {
    const {cid,eid}=deleteEvTarget;
    const c=connectors.find(x=>x.id===cid);
    if(canEdit(c)) onChange({connectors:scopedRowsPatch(connectors,cid,header,c=>({
      events:c.events.map(e=>e.id===eid?{...e,deleted:true,deletedReason:reason,deletedVisa:user?.trigram||"?",deletedDate:nowDT()}:e)
    }))});
    setDeleteEvTarget(null);
  };
  const restoreEv = reason => {
    const {cid,eid}=restoreEvTarget;
    onChange({connectors:scopedRowsPatch(connectors,cid,header,c=>({
      events:c.events.map(e=>e.id===eid?{...e,deleted:false,restoredReason:reason,restoredVisa:user?.trigram||"?",restoredDate:nowDT()}:e)
    }))});
    setRestoreEvTarget(null);
  };

  const totalDeleted = connectors.filter(c=>c.deleted).length;
  const visibleConnectors = connectors.filter(c=>
    (!c.deleted||showDeleted||forceShowDeleted) && rowMatchesSnFilter(c,snFilter,header)
  );
  const snRows=snRowsFromHeader(header);
  const connectorGroups = snFilter==="all" && snRows.length
    ? snRows.map(sn=>({
        id:sn.id,
        label:snTitle(sn),
        rows:visibleConnectors.filter(c=>rowMatchesSn(c,sn,snRows))
      })).filter(g=>g.rows.length)
    : [{id:"active",label:null,rows:visibleConnectors}];
  const historyRows = connectors.flatMap(c=>(c.events||[]).map((ev,idx)=>({
    c, ev, cycle:(idx+1)/2
  }))).filter(x=>
    (!x.c.deleted||showDeleted||forceShowDeleted) &&
    (!x.ev.deleted||showDeleted||forceShowDeleted) &&
    rowMatchesSnFilter(x.c,snFilter,header) &&
    (historyConnector==="all" || x.c.id===historyConnector)
  ).reverse();
  const activeVisibleConnectors = visibleConnectors.filter(c=>!c.deleted);
  const summaryStats = {
    total: activeVisibleConnectors.length,
    mattes: activeVisibleConnectors.filter(c=>lastActive(c)?.action==="Mating").length,
    demattes: activeVisibleConnectors.filter(c=>lastActive(c)?.action==="Demating").length,
    sansAction: activeVisibleConnectors.filter(c=>!lastActive(c)).length,
    cycles: activeVisibleConnectors.reduce((s,c)=>s+cycleCount(c),0)
  };
  const cycleRows = visibleConnectors
    .filter(c=>!c.deleted && (historyConnector==="all" || c.id===historyConnector))
    .sort((a,b)=>connectorSortKey(a.nConect).localeCompare(connectorSortKey(b.nConect)))
    .flatMap(c=>{
      const status=connStatus(c);
      const cycles=buildMatingCycles(c);
      if(!cycles.length) return [{c,status,idx:0,mat:null,dem:null,empty:true}];
      return cycles
        .map((cy,i)=>({cy,idx:i+1}))
        .sort((a,b)=>String(cycleLastDt(b.cy)).localeCompare(String(cycleLastDt(a.cy))))
        .map(({cy,idx})=>({c,status,idx,mat:cy.mat,dem:cy.dem,empty:false}));
    });
  const cycleGroups = visibleConnectors
    .filter(c=>!c.deleted && (historyConnector==="all" || c.id===historyConnector))
    .sort((a,b)=>connectorSortKey(a.nConect).localeCompare(connectorSortKey(b.nConect)))
    .map(c=>{
      const status=connStatus(c);
      const last=lastActive(c);
      const cycles=buildMatingCycles(c)
        .map((cy,i)=>({cy,n:i+1}))
        .sort((a,b)=>String(cycleLastDt(b.cy)).localeCompare(String(cycleLastDt(a.cy))) || b.n-a.n)
        .map(({cy},i)=>({idx:i+1,mat:cy.mat,dem:cy.dem,empty:false}));
      return {c,status,last,cycles:cycles.length?cycles:[{idx:0,mat:null,dem:null,empty:true}]};
    });

  return (
    <div style={{maxWidth:1500}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
        <div style={{display:"flex",gap:6,alignItems:"center",flexWrap:"wrap"}}>
          {perms.canWrite&&<Btn onClick={addC} small>+ Connecteur</Btn>}
          <Badge label={`${summaryStats.total} connecteur${summaryStats.total>1?"s":""}`} color={C.border}/>
          <Badge label={`${summaryStats.mattes} maté${summaryStats.mattes>1?"s":""}`} color={C.green}/>
          <Badge label={`${summaryStats.demattes} dématé${summaryStats.demattes>1?"s":""}`} color={C.red}/>
          <Badge label={`${summaryStats.sansAction} sans action`} color={C.muted}/>
          <Badge label={`${summaryStats.cycles} cycles`} color={C.blue}/>
        </div>
        <div style={{display:"flex",gap:8,alignItems:"center"}}>
          <span style={{fontSize:10,color:C.muted,fontFamily:"monospace"}}>
            Filtre SN : {snFilter==="all"?"TRAVAIL = Tous":snScopeLabel({snScope:"custom",snIds:[snFilter]},snRows)}
          </span>
          {totalDeleted>0&&<Btn onClick={()=>setShowDeleted(s=>!s)} color={showDeleted?"#da3633":C.border} small>
            {showDeleted?"▲ Masquer annulés":"▼ Voir annulés"}
          </Btn>}
        </div>
      </div>

      {connectors.length===0&&(
        <div style={{textAlign:"center",color:C.muted,padding:48,fontSize:13}}>
          Cliquez <strong>+ Connecteur</strong> pour ajouter un connecteur (J13, J15…)
        </div>
      )}

      {connectors.length>0&&connectorGroups.map(group=>(
        <div key={group.id} style={{marginBottom:16}}>
          {group.label&&(
            <div style={{display:"flex",alignItems:"center",gap:8,margin:"8px 0 7px"}}>
              <Badge label={group.label} color={C.blue}/>
              <span style={{fontSize:10,color:C.muted,fontFamily:"monospace"}}>
                {group.rows.length} connecteur{group.rows.length>1?"s":""}
              </span>
            </div>
          )}
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(156px,1fr))",
            gap:8}}>
          {group.rows.map(c=>{
            const st=connStatus(c);
            const cy=cycleCount(c);
            const ne=nextExpected(c);
            const editable=canEdit(c);
            const last=lastActive(c);
            return (
              <div key={c.id} role="group" aria-label={`Connecteur ${c.nConect||"sans nom"}`}
                style={{minHeight:124,border:`1px solid ${c.deleted?C.red:st.color}`,
                  background:c.deleted?"#da363318":st.color+"16",borderRadius:6,padding:6,
                  display:"flex",flexDirection:"column",
                  justifyContent:"space-between",boxShadow:c.validated&&!c.deleted?`0 0 0 1px ${st.color}22 inset`:undefined}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:6}}>
                  {!c.validated?(
                    <div onClick={e=>e.stopPropagation()} style={{width:62}}>
                      <Input value={c.nConect} onChange={v=>updC(c.id,"nConect",v.toUpperCase())}
                        placeholder="J13" small readOnly={!editable}
                        style={{fontWeight:900,fontSize:12,textTransform:"uppercase",padding:"2px 4px",...(!editable?LOCKED_INPUT_STYLE:{})}}/>
                    </div>
                  ):(
                    <div style={{fontFamily:"monospace",fontSize:16,fontWeight:900,color:C.text,lineHeight:1}}>
                      {c.nConect||"J?"}<CopyOriginMark origin={c.copyOrigin}/>
                    </div>
                  )}
                  <span style={{fontSize:10,fontFamily:"monospace",color:st.color,fontWeight:800}}>
                    {cy}
                  </span>
                </div>
                {c.connError&&<div style={{fontSize:9,color:C.yellow,fontFamily:"monospace"}}>{c.connError}</div>}
                {!c.validated&&<div onClick={e=>e.stopPropagation()} style={{pointerEvents:"all"}}>
                  <SnScopePicker row={c} header={header} onChange={fields=>patchC(c.id,fields)} disabled={!!c.validated||!editable}/>
                </div>}
                <div>
                  <div style={{fontSize:9,color:st.color,fontWeight:800,textTransform:"uppercase",letterSpacing:.2}}>
                    {st.label.replace("⚡ ","").replace("✓ ","")}
                  </div>
                  <div style={{fontSize:8,color:C.muted,fontFamily:"monospace",marginTop:1}}>
                    {last?`${last.visa||"?"} · ${last.dt||""}`:"aucune action"}
                  </div>
                </div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:4,marginTop:4}}>
                  {["Mating","Demating"].map(action=><ConnectorActionButton key={action} action={action} connector={c.nConect||"Connecteur"}
                    disabled={!canRecordMating(user,c)||(ne!=="either"&&ne!==action)}
                    title={!c.validated?"Valider le connecteur avant action":!canRecordMating(user,c)?"Action non autorisée":ne!=="either"&&ne!==action?`${action} déjà enregistré`:`Enregistrer ${action} sur ${c.nConect||"ce connecteur"}`}
                    onClick={()=>requestEventFromTile(c,action)}/>)}
                </div>
                <div onClick={e=>e.stopPropagation()}
                  style={{display:"flex",gap:2,alignItems:"center",justifyContent:"flex-end",marginTop:4,pointerEvents:"all",flexWrap:"wrap"}}>
                  <CommentBtn comments={c.comments||[]} onChange={v=>updC(c.id,"comments",v)} user={user} disabled={!perms.canComment}/>
                  {!c.deleted&&perms.canWrite&&onCopyAcross&&<MiniIconBtn onClick={()=>onCopyAcross(c)} color={C.blue} title="Copier vers OF / SN">⧉</MiniIconBtn>}
                  {!c.deleted&&!c.validated&&editable&&<>
                    <MiniIconBtn onClick={()=>validateConn(c.id)} color={C.green} title="Valider">✓</MiniIconBtn>
                    <HistoryBtn row={c} mini/>
                    <MiniIconBtn onClick={()=>delConn(c.id)} color={C.border} title="Supprimer">×</MiniIconBtn>
                  </>}
                  {!c.deleted&&c.validated&&editable&&<>
                    <MiniIconBtn onClick={()=>unlockConn(c.id)} color={C.yellow} title="Modifier">✎</MiniIconBtn>
                    <HistoryBtn row={c} mini/>
                    <MiniIconBtn onClick={()=>delConn(c.id)} color={C.red} title="Annuler">×</MiniIconBtn>
                  </>}
                  {!c.deleted&&!editable&&perms.canWrite&&<>
                    <HistoryBtn row={c} mini/>
                  </>}
                  {c.deleted&&<PurgeLineButton user={user} data={data} onChange={onChange} id={c.id}/> }
                  {c.deleted&&editable&&<MiniIconBtn onClick={()=>setRestoreConnTarget(c.id)} color={C.yellow} title="Réactiver">↩</MiniIconBtn>}
                </div>
              </div>
            );
          })}
          </div>
        </div>
      ))}

      {connectors.length>0&&(
        <div style={{border:`1px solid ${C.border}`,borderRadius:8,overflow:"hidden",marginBottom:16}}>
          <div style={{background:C.raised,padding:"8px 12px",display:"flex",alignItems:"center",gap:10,justifyContent:"space-between",flexWrap:"wrap"}}>
            <div>
              <div style={{color:C.accent,fontSize:12,fontWeight:800,textTransform:"uppercase",letterSpacing:.8}}>Cycles Mating/Demating</div>
              <div style={{color:C.muted,fontSize:10}}>Une ligne par cycle, triée par connecteur</div>
            </div>
            <div style={{display:"flex",alignItems:"center",gap:8}}>
              <span style={{color:C.muted,fontSize:10,textTransform:"uppercase",letterSpacing:.8}}>Connecteur</span>
              <select value={historyConnector} onChange={e=>setHistoryConnector(e.target.value)}
                style={{background:C.input,border:`1px solid ${C.border}`,borderRadius:4,
                  color:C.text,padding:"4px 8px",fontSize:11,fontFamily:"monospace",outline:"none",minWidth:120}}>
                <option value="all">Tous</option>
                {visibleConnectors.map(c=><option key={c.id} value={c.id}>{c.nConect||"J?"}</option>)}
              </select>
            </div>
          </div>
          <div style={{overflowX:"auto"}}>
            <table style={{width:"100%",borderCollapse:"collapse",tableLayout:"fixed",fontSize:12}}>
              <thead>
                <tr>
                  <TH w={88}>Connecteur</TH><TH w={94}>État actuel</TH><TH w={48}>Cycle</TH>
                  <TH w={122}>Mating date</TH><TH w={52} color={C.accent}>Visa M</TH>
                  <TH w={122}>Demating date</TH><TH w={52} color={C.accent}>Visa D</TH>
                  <TH w={78}>N° SN</TH><TH w={42}>💬</TH><TH w={112}>Actions</TH>
                </tr>
              </thead>
              <tbody>
                {cycleGroups.flatMap(({c,status,last,cycles},gi)=>{
                  const tone=connectorStateTone(last?.action);
                  return [
                  <tr key={`${c.id}_group`} style={{background:last?.action==="Mating"?C.green+"1f":last?.action==="Demating"?C.red+"1f":C.blue+"12",borderLeft:`3px solid ${tone.stroke}`}}>
                    <td colSpan={10} style={{padding:"7px 10px",borderBottom:`1px solid ${C.border}`}}>
                      <div style={{display:"flex",gap:10,alignItems:"center",flexWrap:"wrap"}}>
                        <span style={{fontFamily:"monospace",fontSize:13,fontWeight:900,color:C.text}}>{c.nConect||"J?"}</span>
                        <Badge label={status.label.replace("⚡ ","").replace("✓ ","")} color={status.color}/>
                        <span style={{fontFamily:"monospace",fontSize:10,color:C.muted}}>
                          Dernière action : {last?.action||"aucune"} {last?.dt||""} {last?.visa||""}
                        </span>
                        <span style={{fontFamily:"monospace",fontSize:10,color:C.blue}}>
                          {snScopeLabel(c,snRowsFromHeader(header))}
                        </span>
                        <CommentBtn comments={c.comments||[]} onChange={v=>updC(c.id,"comments",v)} user={user} disabled={!perms.canComment}/>
                      </div>
                    </td>
                  </tr>,
                  ...cycles.map(({idx,mat,dem,empty},i)=>(
                    <tr key={`${c.id}_${idx||"empty"}_${i}`} style={{background:(gi+i)%2===0?"transparent":C.stripe}}>
                      <TD></TD>
                      <TD></TD>
                      <TD><span style={{fontFamily:"monospace",fontSize:11,color:C.muted}}>{empty?"—":idx}</span></TD>
                      <TD><OperationDateCell value={mat?.dt} editing={!!mat&&!!c.editBase&&canEdit(c)&&!mat.deleted} onChange={value=>updEvDate(c.id,mat.id,value)}/></TD>
                      <TD><span style={{fontFamily:"monospace",fontWeight:800,fontSize:12,color:mat?C.accent:C.muted}}>{mat?.visa||"—"}</span></TD>
                      <TD><OperationDateCell value={dem?.dt} editing={!!dem&&!!c.editBase&&canEdit(c)&&!dem.deleted} onChange={value=>updEvDate(c.id,dem.id,value)}/></TD>
                      <TD><span style={{fontFamily:"monospace",fontWeight:800,fontSize:12,color:dem?C.accent:C.muted}}>{dem?.visa||"—"}</span></TD>
                      <TD></TD>
                      <TD></TD>
                      <TD center style={{pointerEvents:"all"}}>
                        {canEdit(c)&&<ActionGroup>
                          {mat&&<button onClick={()=>setDeleteEvTarget({cid:c.id,eid:mat.id})}
                            title="Annuler l'action Mating"
                            style={{background:C.green+"22",border:`1px solid ${C.green}`,borderRadius:4,
                              color:C.green,fontSize:9,padding:"2px 5px",cursor:"pointer",fontWeight:800,whiteSpace:"nowrap"}}>
                            Annuler M
                          </button>}
                          {dem&&<button onClick={()=>setDeleteEvTarget({cid:c.id,eid:dem.id})}
                            title="Annuler l'action Demating"
                            style={{background:C.blue+"22",border:`1px solid ${C.blue}`,borderRadius:4,
                              color:C.blue,fontSize:9,padding:"2px 5px",cursor:"pointer",fontWeight:800,whiteSpace:"nowrap"}}>
                            Annuler D
                          </button>}
                        </ActionGroup>}
                      </TD>
                    </tr>
                  ))
                ]})}
              </tbody>
            </table>
            {cycleGroups.length===0&&<div style={{textAlign:"center",color:C.muted,padding:14,fontSize:12}}>Aucun connecteur actif</div>}
          </div>
        </div>
      )}

      {deleteEvTarget  &&<DeleteModal godMode={perms.godMode} onConfirm={confirmDelEv}   onCancel={()=>setDeleteEvTarget(null)}/>}
      {deleteConnTarget&&<DeleteModal godMode={perms.godMode} onConfirm={confirmDelConn} onCancel={()=>setDeleteConnTarget(null)}/>}
      {restoreEvTarget  &&<RestoreModal onConfirm={restoreEv}   onCancel={()=>setRestoreEvTarget(null)}/>}
      {restoreConnTarget&&<RestoreModal onConfirm={restoreC} onCancel={()=>setRestoreConnTarget(null)}/>}
    </div>
  );
};

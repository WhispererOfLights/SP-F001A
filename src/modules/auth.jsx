// ─── LOGIN ─────────────────────────────────────────────────────────────────
const hash=str=>{let h=0;for(let i=0;i<str.length;i++){h=Math.imul(31,h)+str.charCodeAt(i)|0;}return h.toString(36);};

const ADMIN_TRIGRAM = "ADMIN";
const DEFAULT_ADMIN_PASSWORD = "admin";
const USER_INDEX_KEY = "users-list";
const defaultUserPassword = trigram => `${String(trigram||"").trim().toLowerCase()}0`;

const cleanUserImportCell = v => String(v||"").replace(/\*\*/g,"").trim();
const parseImportRows = text => {
  const source=String(text||"").replace(/^\uFEFF/,"");
  const first=source.split(/\r?\n/).find(l=>l.trim())||"";
  const delimiter=first.includes(";")?";":first.includes("\t")?"\t":first.includes("|")?"|":",";
  const rows=[]; let row=[], cell="", quoted=false;
  for(let i=0;i<source.length;i++){
    const c=source[i];
    if(c==='"'){
      if(quoted&&source[i+1]==='"'){cell+='"';i++;}
      else if(quoted||!cell.trim()) quoted=!quoted;
      else cell+=c;
    }else if(c===delimiter&&!quoted){row.push(cell.trim());cell="";}
    else if((c==='\n'||c==='\r')&&!quoted){
      if(c==='\r'&&source[i+1]==='\n') i++;
      row.push(cell.trim());rows.push(row);row=[];cell="";
    }else cell+=c;
  }
  row.push(cell.trim());rows.push(row);
  return rows.map(r=>delimiter==="|"?r.filter((v,i)=>v||(i>0&&i<r.length-1)):r).filter(r=>r.some(Boolean));
};
const readImportFile = async file => {
  const bytes=await file.arrayBuffer();
  const text=new TextDecoder("utf-8").decode(bytes);
  return text.includes("\uFFFD")?new TextDecoder("windows-1252").decode(bytes):text;
};
const ImportCsvFile = ({onText,onError}) => <input type="file" accept=".csv,.txt,.tsv" aria-label="Charger un fichier CSV"
  style={{color:C.text,maxWidth:"100%",marginBottom:8}} onChange={async e=>{
    const file=e.target.files?.[0];e.target.value="";
    if(!file) return;
    try{onText(await readImportFile(file));}catch{onError("Erreur de lecture du fichier CSV");}
  }}/>;
const splitUserImportLine = line => {
  const txt=String(line||"").trim();
  if(!txt) return [];
  if(txt.includes("|")) return txt.split("|").map(cleanUserImportCell).filter((v,i,a)=>v || (i>0&&i<a.length-1));
  if(txt.includes("\t")) return txt.split("\t").map(cleanUserImportCell);
  if(txt.includes(";")) return txt.split(";").map(cleanUserImportCell);
  if(/\s{2,}/.test(txt)) return txt.split(/\s{2,}/).map(cleanUserImportCell);
  return txt.split(",").map(cleanUserImportCell);
};
const userImportLabel = v => cleanUserImportCell(v).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"");
const isUserImportSeparator = cells => cells.length && cells.every(c=>!c || /^:?-{2,}:?$/.test(c));
const roleFromImport = v => normalizeRole({role:cleanUserImportCell(v)||"Opérateur"});
const parseUserImportPaste = text => {
  const rows=[];
  let headers=null;
  const headerKey = label => {
    const l=userImportLabel(label);
    if(l.includes("trigram")||l==="visa"||l==="user") return "trigram";
    if(l.includes("prenom")||l.includes("first")) return "prenom";
    if(l==="nom"||l.includes("name")) return "nom";
    if(l.includes("service")||l.includes("depart")) return "service";
    if(l.includes("role")||l.includes("fonction")) return "role";
    if(l.includes("mail")) return "email";
    return "";
  };
  parseImportRows(text).forEach(rawCells=>{
    const cells=rawCells.map(cleanUserImportCell);
    if(!cells.length || !cells.some(Boolean) || isUserImportSeparator(cells)) return;
    const detected=cells.map(headerKey);
    if(detected.includes("trigram") && (detected.includes("role") || detected.includes("nom") || detected.includes("prenom"))){
      headers={};
      detected.forEach((key,i)=>{if(key && headers[key]===undefined) headers[key]=i;});
      return;
    }
    const pick = key => headers ? cells[headers[key]] : cells[{trigram:0,prenom:1,nom:2,service:3,role:4,email:5}[key]];
    const trigram=cleanUserImportCell(pick("trigram")).toUpperCase().replace(/\s+/g,"");
    if(!trigram) return;
    rows.push({
      trigram,
      prenom:cleanUserImportCell(pick("prenom")),
      nom:cleanUserImportCell(pick("nom")),
      service:cleanUserImportCell(pick("service"))||"Production",
      role:roleFromImport(pick("role")),
      ...(pick("email")!==undefined?{email:cleanUserImportCell(pick("email"))}:{}),
    });
  });
  return [...new Map(rows.map(u=>[u.trigram,u])).values()];
};
const comparableUser = u => JSON.stringify({
  trigram:String(u?.trigram||"").toUpperCase(),
  prenom:String(u?.prenom||"").trim(),
  nom:String(u?.nom||"").trim(),
  service:String(u?.service||"").trim(),
  role:normalizeRole(u),
  email:String(u?.email||"").trim(),
});

const getUserIndex = async () => {
  try {
    const r = await window.storage.get(USER_INDEX_KEY, true);
    return r ? JSON.parse(r.value) : [];
  } catch {
    return [];
  }
};

const setUserIndex = async list => {
  const clean = [...new Set((list||[]).map(t=>String(t).toUpperCase()).filter(Boolean))].sort();
  await window.storage.set(USER_INDEX_KEY, JSON.stringify(clean), true);
  return clean;
};
const DEFAULT_SERVICES = ["Production","Qualité","Ingénierie","Méthodes","Support"];
const servicesFromUsers = users => [...new Set([...DEFAULT_SERVICES,...users.map(u=>String(u.service||"").trim()).filter(Boolean)])].sort((a,b)=>a.localeCompare(b,"fr"));
const loadUserServices = async () => {
  let keys=(await getUserIndex()).map(t=>`user:${t}`);
  try{if(window.storage.list) keys=[...new Set([...keys,...await window.storage.list(true)])];}catch{}
  const users=await Promise.all(keys.filter(k=>k.startsWith("user:")).map(async key=>{
    try{return JSON.parse((await window.storage.get(key,true)).value);}catch{return {};}
  }));
  return servicesFromUsers(users);
};

const ensureDefaultAdmin = async () => {
  const key = `user:${ADMIN_TRIGRAM}`;
  try {
    await window.storage.get(key, true);
  } catch {
    await window.storage.set(key, JSON.stringify({
      trigram: ADMIN_TRIGRAM,
      pwd: hash(DEFAULT_ADMIN_PASSWORD),
      role: "Admin",
      service: "Administration",
      prenom: "Compte",
      nom: "Admin",
    }), true);
  }
  const users = await getUserIndex();
  if(!users.includes(ADMIN_TRIGRAM)) await setUserIndex([...users, ADMIN_TRIGRAM]);
};

// ─── Profil utilisateur ────────────────────────────────────────────────────
const ProfileModal = ({user, onClose, onSave}) => {
  const [profile, setProfile] = React.useState({...user});
  const [pwdSection, setPwdSection] = React.useState(false);
  const [oldPwd, setOldPwd] = React.useState("");
  const [newPwd, setNewPwd] = React.useState("");
  const [newPwd2, setNewPwd2] = React.useState("");
  const [err, setErr] = React.useState("");
  const [ok, setOk]   = React.useState("");

  const [SERVICES,setServices] = React.useState(servicesFromUsers([user]));
  React.useEffect(()=>{loadUserServices().then(setServices).catch(()=>{});},[]);

  const saveProfile = () => {
    onSave({...profile});
    setOk("✓ Profil mis à jour"); setErr("");
  };

  const changePwd = async () => {
    setErr(""); setOk("");
    if(!oldPwd||!newPwd){setErr("Tous les champs sont requis");return;}
    if(newPwd!==newPwd2){setErr("Les mots de passe ne correspondent pas");return;}
    if(newPwd.length<4){setErr("Mot de passe trop court (min 4 caractères)");return;}
    try{
      if(window.authApi){
        await window.authApi.changePassword(oldPwd,newPwd);
        setOk("✓ Mot de passe modifié");setOldPwd("");setNewPwd("");setNewPwd2("");setPwdSection(false);
        return;
      }
      const key=`user:${user.trigram}`;
      const r=await window.storage.get(key,true);
      if(!r){setErr("Compte introuvable");return;}
      const u=JSON.parse(r.value);
      if(u.pwd!==hash(oldPwd)){setErr("Mot de passe actuel incorrect");return;}
      await window.storage.set(key,JSON.stringify({...u,...profile,pwd:hash(newPwd)}),true);
      setOk("✓ Mot de passe modifié");setOldPwd("");setNewPwd("");setNewPwd2("");setPwdSection(false);
    }catch{setErr("Erreur lors du changement");}
  };

  return (
    <div style={{position:"fixed",inset:0,background:"#000000cc",zIndex:300,display:"flex",alignItems:"center",justifyContent:"center",padding:24}}
      onClick={e=>{if(e.target===e.currentTarget)onClose();}}>
      <div style={{background:C.surface,border:`1px solid ${C.accent}`,borderRadius:10,width:"100%",maxWidth:480,overflow:"hidden"}}>
        {/* Header */}
        <div style={{padding:"14px 20px",borderBottom:`1px solid ${C.border}`,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <div style={{background:C.accent+"33",border:`1px solid ${C.accent}`,borderRadius:"50%",width:36,height:36,
              display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"monospace",fontWeight:900,color:C.accent,fontSize:14}}>
              {user.trigram}
            </div>
            <div>
              <div style={{fontWeight:700,fontSize:13,color:C.text}}>Mon profil</div>
              <div style={{fontSize:10,color:C.muted}}>{user.nom&&user.prenom?`${user.prenom} ${user.nom}`:user.trigram}</div>
            </div>
          </div>
          <span onClick={onClose} style={{cursor:"pointer",color:C.muted,fontSize:20}}>×</span>
        </div>

        <div style={{padding:20,display:"flex",flexDirection:"column",gap:14}}>
          {/* Infos perso */}
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
            {[["Prénom","prenom",""],["Nom","nom",""],].map(([label,key,ph])=>(
              <div key={key}>
                <div style={{color:C.muted,fontSize:9,textTransform:"uppercase",letterSpacing:.8,marginBottom:3}}>{label}</div>
                <Input value={profile[key]||""} onChange={v=>setProfile(p=>({...p,[key]:v}))} placeholder={ph||label} small/>
              </div>
            ))}
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
            <div>
              <div style={{color:C.muted,fontSize:9,textTransform:"uppercase",letterSpacing:.8,marginBottom:3}}>Service</div>
              <select value={profile.service||""} onChange={e=>setProfile(p=>({...p,service:e.target.value}))}
                style={{width:"100%",background:C.input,border:`1px solid ${C.border}`,borderRadius:4,color:C.text,padding:"5px 8px",fontSize:12,fontFamily:"monospace",outline:"none"}}>
                <option value="">— choisir —</option>
                {SERVICES.map(s=><option key={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <div style={{color:C.muted,fontSize:9,textTransform:"uppercase",letterSpacing:.8,marginBottom:3}}>Rôle</div>
              <div style={{background:C.input,border:`1px solid ${C.border}`,borderRadius:4,color:C.muted,
                padding:"5px 8px",fontSize:12,fontFamily:"monospace"}}>
                {normalizeRole(profile)}
              </div>
            </div>
          </div>

          {ok&&<div style={{background:"#23863620",border:"1px solid #238636",borderRadius:4,padding:"6px 12px",color:C.green,fontSize:12}}>{ok}</div>}
          {err&&<div style={{background:"#da363320",border:"1px solid #da3633",borderRadius:4,padding:"6px 12px",color:C.red,fontSize:12}}>{err}</div>}

          <Btn onClick={saveProfile} color={C.green} small>✓ Enregistrer le profil</Btn>

          {/* Changer mot de passe */}
          <div style={{borderTop:`1px solid ${C.border}`,paddingTop:12}}>
            <div onClick={()=>setPwdSection(v=>!v)}
              style={{cursor:"pointer",color:C.muted,fontSize:11,display:"flex",alignItems:"center",gap:6,userSelect:"none"}}>
              {pwdSection?"▼":"▶"} Changer le mot de passe
            </div>
            {pwdSection&&(
              <div style={{marginTop:10,display:"flex",flexDirection:"column",gap:8}}>
                {[["Mot de passe actuel",oldPwd,setOldPwd],["Nouveau mot de passe",newPwd,setNewPwd],["Confirmer le nouveau",newPwd2,setNewPwd2]]
                  .map(([label,val,set])=>(
                  <div key={label}>
                    <div style={{color:C.muted,fontSize:9,textTransform:"uppercase",letterSpacing:.8,marginBottom:3}}>{label}</div>
                    <input type="password" value={val} onChange={e=>set(e.target.value)}
                      style={{width:"100%",background:C.input,border:`1px solid ${C.border}`,borderRadius:4,color:C.text,padding:"5px 8px",fontSize:12,fontFamily:"monospace",outline:"none",boxSizing:"border-box"}}/>
                  </div>
                ))}
                <Btn onClick={changePwd} color={C.blue} small>🔑 Changer le mot de passe</Btn>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const AdminUsersModal = ({onClose}) => {
  const blank = {trigram:"", prenom:"", nom:"", service:"Production", role:"Opérateur", email:"", pwd:""};
  const [users,setUsers] = React.useState([]);
  const [form,setForm] = React.useState(blank);
  const [newService,setNewService] = React.useState(false);
  const [importText,setImportText] = React.useState("");
  const [err,setErr] = React.useState("");
  const [ok,setOk] = React.useState("");
  const roleColor = role => {
    const r=normalizeRole({role});
    if(r==="Admin") return C.red;
    if(r==="Manager") return C.blue;
    if(r==="Contrôleur") return C.yellow;
    if(r==="Logistique") return C.purple;
    if(r==="Consultation") return C.muted;
    return C.green;
  };

  const load = React.useCallback(async()=>{
    if(window.authApi){
      const rows=await window.authApi.users();
      setUsers(rows.sort((a,b)=>(a.trigram||"").localeCompare(b.trigram||"")));
      return;
    }
    await ensureDefaultAdmin();
    let index = await getUserIndex();
    try{
      if(window.storage.list){
        const storageKeys = await window.storage.list(true);
        const discovered = storageKeys
          .filter(k=>String(k||"").startsWith("user:"))
          .map(k=>String(k).slice(5).toUpperCase())
          .filter(Boolean);
        const merged = [...new Set([...index, ...discovered])].sort();
        if(merged.length!==index.length || merged.some((v,i)=>v!==index[i])){
          index = await setUserIndex(merged);
        }else{
          index = merged;
        }
      }
    }catch{}
    const rows = [];
    const seen = new Set();
    for(const trigram of index){
      if(seen.has(trigram)) continue;
      seen.add(trigram);
      try{
        const r = await window.storage.get(`user:${trigram}`, true);
        if(r) rows.push(JSON.parse(r.value));
      }catch{}
    }
    setUsers(rows.sort((a,b)=>(a.trigram||"").localeCompare(b.trigram||"")));
  },[]);

  React.useEffect(()=>{ load(); },[load]);

  const resetMessages = () => { setErr(""); setOk(""); };

  const saveUser = async () => {
    resetMessages();
    const trigram = form.trigram.trim().toUpperCase();
    if(!trigram){setErr("Trigramme requis");return;}
    if(trigram.length<2||trigram.length>8){setErr("Trigramme : 2 à 8 caractères");return;}
    if(form.email&&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())){setErr("Adresse e-mail invalide");return;}
    try{
      const existing = users.find(u=>u.trigram===trigram) || {};
      if(window.authApi){
        await window.authApi.saveUser({...existing,...form,email:String(form.email||"").trim(),trigram,role:normalizeRole(form)},form.pwd);
        setForm(blank);
        setOk(`Utilisateur ${trigram} enregistré${form.pwd?"":` - MDP initial : ${defaultUserPassword(trigram)}`}`);
        await load();
        return;
      }
      const pwd = form.pwd ? hash(form.pwd) : (existing.pwd || hash(defaultUserPassword(trigram)));
      const next = {...existing, ...form, email:String(form.email||"").trim(), trigram, role:normalizeRole(form), pwd,
        mustChangePassword:form.pwd?true:!!existing.mustChangePassword};
      await window.storage.set(`user:${trigram}`, JSON.stringify(next), true);
      await setUserIndex([...await getUserIndex(), trigram]);
      setForm(blank);
      setOk(`Utilisateur ${trigram} enregistré${form.pwd?"":` - MDP initial : ${defaultUserPassword(trigram)}`}`);
      await load();
    }catch{setErr("Erreur lors de l'enregistrement");}
  };

  const importUsers = async () => {
    resetMessages();
    const parsed=parseUserImportPaste(importText);
    if(!parsed.length){setErr("Aucun utilisateur détecté dans le collage");return;}
    if(parsed.some(u=>u.email&&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(u.email))){setErr("Adresse e-mail invalide dans l'import");return;}
    let created=0, updated=0, unchanged=0;
    try{
      if(window.authApi){
        const result=await window.authApi.importUsers(parsed);
        created=result.created||0;updated=result.updated||0;unchanged=result.unchanged||0;
        setImportText("");
        setOk(`Import utilisateurs : ${created} créé${created>1?"s":""}, ${updated} modifié${updated>1?"s":""}, ${unchanged} inchangé${unchanged>1?"s":""}. MDP initial = trigramme minuscule + 0.`);
        await load();
        return;
      }
      const currentIndex=await getUserIndex();
      const nextIndex=[...currentIndex];
      for(const imported of parsed){
        let existing=null;
        try{
          const r=await window.storage.get(`user:${imported.trigram}`, true);
          if(r) existing=JSON.parse(r.value);
        }catch{}
        if(existing){
          const next={...existing,...imported,pwd:existing.pwd||hash(defaultUserPassword(imported.trigram))};
          if(comparableUser(existing)===comparableUser(next)){unchanged++;continue;}
          await window.storage.set(`user:${imported.trigram}`, JSON.stringify(next), true);
          updated++;
        }else{
          await window.storage.set(`user:${imported.trigram}`, JSON.stringify({
            ...imported,
            pwd:hash(defaultUserPassword(imported.trigram)),
          }), true);
          created++;
        }
        if(!nextIndex.includes(imported.trigram)) nextIndex.push(imported.trigram);
      }
      await setUserIndex(nextIndex);
      setImportText("");
      setOk(`Import utilisateurs : ${created} créé${created>1?"s":""}, ${updated} modifié${updated>1?"s":""}, ${unchanged} inchangé${unchanged>1?"s":""}. MDP initial = trigramme minuscule + 0.`);
      await load();
    }catch{setErr("Erreur pendant l'import utilisateurs");}
  };

  const editUser = u => {
    resetMessages();
    setNewService(false);
    setForm({...u, role:normalizeRole(u), pwd:""});
  };

  const deleteUser = async trigram => {
    resetMessages();
    if(trigram===ADMIN_TRIGRAM){setErr("Le compte ADMIN ne peut pas être supprimé");return;}
    if(!window.confirm(`Supprimer l'utilisateur ${trigram} ?`)) return;
    try{
      if(window.authApi){
        await window.authApi.deleteUser(trigram);
        setOk(`Utilisateur ${trigram} supprimé`);
        await load();
        return;
      }
      await window.storage.delete(`user:${trigram}`, true);
      await setUserIndex((await getUserIndex()).filter(t=>t!==trigram));
      setOk(`Utilisateur ${trigram} supprimé`);
      await load();
    }catch{setErr("Erreur lors de la suppression");}
  };

  const resetPassword = async account => {
    resetMessages();
    if(!window.confirm(`Réinitialiser le mot de passe de ${account.trigram} à ${defaultUserPassword(account.trigram)} ? Il devra le changer à sa prochaine connexion.`)) return;
    try{
      if(window.authApi){
        const result=await window.authApi.resetPassword(account.trigram);
        setOk(`Mot de passe temporaire de ${account.trigram} : ${result.temporaryPassword}. Changement obligatoire à la prochaine connexion.`);
        await load();
        return;
      }
      const result=await window.storage.get(`user:${account.trigram}`,true);
      const stored=JSON.parse(result.value);
      await window.storage.set(`user:${account.trigram}`,JSON.stringify({...stored,pwd:hash(defaultUserPassword(account.trigram)),mustChangePassword:true}),true);
      setOk(`Mot de passe temporaire de ${account.trigram} : ${defaultUserPassword(account.trigram)}. Changement obligatoire à la prochaine connexion.`);
      await load();
    }catch{setErr("Erreur lors de la réinitialisation du mot de passe");}
  };

  return (
    <div style={{position:"fixed",inset:0,background:"#000000cc",zIndex:300,display:"flex",alignItems:"center",justifyContent:"center",padding:24}}
      onClick={e=>{if(e.target===e.currentTarget)onClose();}}>
      <div style={{background:C.surface,border:`1px solid ${C.accent}`,borderRadius:8,width:"100%",maxWidth:1080,maxHeight:"86vh",overflow:"hidden",display:"flex",flexDirection:"column"}}>
        <div style={{padding:"14px 18px",borderBottom:`1px solid ${C.border}`,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div>
            <div style={{fontWeight:800,color:C.accent,fontSize:14}}>Administration utilisateurs</div>
            <div style={{fontSize:11,color:C.muted}}>{users.length} utilisateur{users.length>1?"s":""}</div>
          </div>
          <span onClick={onClose} style={{cursor:"pointer",color:C.muted,fontSize:22}}>×</span>
        </div>
        <div style={{padding:16,display:"grid",gridTemplateColumns:"320px minmax(0,1fr)",gap:16,overflow:"auto"}}>
          <div style={{border:`1px solid ${C.border}`,borderRadius:6,padding:12}}>
            <div style={{fontSize:11,color:C.muted,textTransform:"uppercase",letterSpacing:.8,marginBottom:10}}>Créer / modifier</div>
            {[
              ["Trigramme","trigram","ADMIN"],
              ["Prénom","prenom","Julien"],
              ["Nom","nom","Grosjean"],
              ["Service","service","Production"],
              ["E-mail","email","prenom.nom@entreprise.com"],
            ].map(([label,key,ph])=>(
              <div key={key} style={{marginBottom:9}}>
                <div style={{color:C.muted,fontSize:9,textTransform:"uppercase",letterSpacing:.8,marginBottom:3}}>{label}</div>
                {key==="service"?<><select aria-label="Service" value={newService?"__new__":form.service||""} onChange={e=>{
                  const adding=e.target.value==="__new__";setNewService(adding);setForm(f=>({...f,service:adding?"":e.target.value}));
                }} style={{width:"100%",background:C.input,border:`1px solid ${C.border}`,borderRadius:4,color:C.text,padding:"5px 8px",fontSize:12}}>
                  <option value="">Choisir un service</option>
                  {servicesFromUsers([...users,form]).map(s=><option key={s} value={s}>{s}</option>)}
                  <option value="__new__">+ Nouveau service</option>
                </select>
                  {newService&&<Input value={form.service||""} onChange={v=>setForm(f=>({...f,service:v}))} placeholder="Nouveau service" small/>}</>:
                  <Input value={form[key]||""} onChange={v=>setForm(f=>({...f,[key]:key==="trigram"?v.toUpperCase():v}))} placeholder={ph} small readOnly={key==="trigram"&&form.trigram===ADMIN_TRIGRAM}/>}
              </div>
            ))}
            <div style={{marginBottom:9}}>
              <div style={{color:C.muted,fontSize:9,textTransform:"uppercase",letterSpacing:.8,marginBottom:3}}>Rôle</div>
              <select value={form.role||"Opérateur"} onChange={e=>setForm(f=>({...f,role:e.target.value}))}
                style={{width:"100%",background:C.input,border:`1px solid ${C.border}`,borderRadius:4,
                  color:C.text,padding:"4px 6px",fontSize:11,fontFamily:"monospace",outline:"none"}}>
                {ROLES.map(r=><option key={r} value={r}>{r}</option>)}
              </select>
            </div>
            <div style={{marginBottom:12}}>
              <div style={{color:C.muted,fontSize:9,textTransform:"uppercase",letterSpacing:.8,marginBottom:3}}>Mot de passe</div>
              <Input value={form.pwd||""} onChange={v=>setForm(f=>({...f,pwd:v}))} type="password" placeholder={form.trigram?defaultUserPassword(form.trigram):"auto"} small/>
              <div style={{fontSize:9,color:C.muted,marginTop:3}}>Vide = {form.trigram?defaultUserPassword(form.trigram):"trigramme minuscule + 0"} à la création, inchangé à la modification. Un mot de passe imposé devra être changé à la prochaine connexion.</div>
            </div>
            {err&&<ErrBox msg={err}/>}
            {ok&&<div style={{background:C.green+"22",border:`1px solid ${C.green}`,color:C.green,borderRadius:6,padding:"8px 12px",fontSize:12,marginBottom:14}}>{ok}</div>}
            <div style={{display:"flex",gap:8}}>
              <Btn onClick={saveUser} color={C.green} small>{form.trigram&&users.some(u=>u.trigram===form.trigram)?"Mettre à jour":"Créer"}</Btn>
              <Btn onClick={()=>{setForm(blank);resetMessages();}} color={C.border} small>Réinitialiser</Btn>
            </div>
            <div style={{borderTop:`1px solid ${C.border}`,marginTop:14,paddingTop:12}}>
              <div style={{fontSize:11,color:C.muted,textTransform:"uppercase",letterSpacing:.8,marginBottom:6}}>Import utilisateurs</div>
              <ImportCsvFile onText={text=>{setImportText(text);resetMessages();}} onError={setErr}/>
              <textarea value={importText} onChange={e=>{setImportText(e.target.value);resetMessages();}}
                placeholder={"Trigramme;Prénom;Nom;Service;Rôle;E-mail\nJGR;Julien;Grosjean;Opération Spatiale;Manager;julien@entreprise.com"}
                rows={6}
                style={{width:"100%",background:C.input,border:`1px solid ${C.border}`,borderRadius:4,
                  color:C.text,fontSize:11,fontFamily:"monospace",padding:"7px 8px",outline:"none",resize:"vertical",boxSizing:"border-box",marginBottom:8}}/>
              <Btn onClick={importUsers} color={importText.trim()?C.green:C.border} small disabled={!importText.trim()}>Importer</Btn>
            </div>
          </div>
          <div style={{overflow:"auto",maxHeight:"62vh"}}>
            <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
              <thead><tr><TH>Trigramme</TH><TH>Nom</TH><TH>Service</TH><TH>Rôle</TH><TH w={180}>Actions</TH></tr></thead>
              <tbody>
                {users.map(u=>(
                  <tr key={u.trigram}>
                    <TD><span style={{fontFamily:"monospace",fontWeight:800,color:u.trigram===ADMIN_TRIGRAM?C.accent:C.text}}>{u.trigram}</span></TD>
                    <TD><span style={{color:C.text,fontWeight:650}}>{[u.prenom,u.nom].filter(Boolean).join(" ")||"—"}</span></TD>
                    <TD><span style={{color:C.text}}>{u.service||"—"}</span></TD>
                    <TD>
                      <span style={{display:"inline-flex",alignItems:"center",border:`1px solid ${roleColor(u.role)}`,
                        background:roleColor(u.role)+"22",color:roleColor(u.role),borderRadius:4,
                        padding:"2px 7px",fontSize:11,fontWeight:800,whiteSpace:"nowrap"}}>
                        {normalizeRole(u)}
                      </span>
                    </TD>
                    <TD>
                      <div style={{display:"flex",gap:8}}>
                        <Btn onClick={()=>editUser(u)} color={C.blue} small>Modifier / MDP</Btn>
                        <Btn onClick={()=>resetPassword(u)} color={C.yellow} small>Réinitialiser MDP</Btn>
                        <Btn onClick={()=>deleteUser(u.trigram)} color={C.red} small disabled={u.trigram===ADMIN_TRIGRAM}>Supprimer</Btn>
                      </div>
                    </TD>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

const RequiredPasswordChange = ({user,onDone,onLogout}) => {
  const [password,setPassword]=useState("");
  const [confirmation,setConfirmation]=useState("");
  const [error,setError]=useState("");
  const [saving,setSaving]=useState(false);
  const save=async event=>{
    event.preventDefault();setError("");
    if(!password.trim()){setError("Nouveau mot de passe requis");return;}
    if(password!==confirmation){setError("Les mots de passe ne correspondent pas");return;}
    setSaving(true);
    try{
      if(window.authApi){
        const updated=await window.authApi.changePassword("",password);
        await onDone(updated);
        return;
      }
      const result=await window.storage.get(`user:${user.trigram}`,true);
      const stored=JSON.parse(result.value);
      if(stored.pwd===hash(password)){setError("Choisissez un mot de passe différent du mot de passe temporaire");return;}
      const next={...stored,pwd:hash(password),mustChangePassword:false};
      await window.storage.set(`user:${user.trigram}`,JSON.stringify(next),true);
      await onDone({trigram:user.trigram});
    }catch(error){setError(error?.message||"Changement non enregistré. Réessayez.");}
    finally{setSaving(false);}
  };
  return <div style={{minHeight:"100vh",background:C.bg,color:C.text,display:"flex",alignItems:"center",justifyContent:"center",padding:24,fontFamily:"system-ui,sans-serif"}}>
    <form onSubmit={save} style={{width:400,maxWidth:"100%",background:C.surface,border:`1px solid ${C.border}`,borderRadius:6,padding:24}}>
      <h1 style={{fontSize:20,margin:"0 0 16px"}}>Changement de mot de passe obligatoire</h1>
      <div style={{marginBottom:16,color:C.muted}}>{user.trigram}</div>
      <label style={{display:"block",marginBottom:12}}>Nouveau mot de passe<input autoFocus autoComplete="new-password" type="password" value={password} onChange={e=>setPassword(e.target.value)} style={{display:"block",width:"100%",padding:8,marginTop:4,background:C.input,color:C.text,border:`1px solid ${C.border}`,borderRadius:4}}/></label>
      <label style={{display:"block",marginBottom:16}}>Confirmer le mot de passe<input autoComplete="new-password" type="password" value={confirmation} onChange={e=>setConfirmation(e.target.value)} style={{display:"block",width:"100%",padding:8,marginTop:4,background:C.input,color:C.text,border:`1px solid ${C.border}`,borderRadius:4}}/></label>
      {error&&<ErrBox msg={error}/>}
      <div style={{display:"flex",gap:8}}>
        <button type="submit" disabled={saving} style={{padding:"8px 12px",background:C.green,color:"white",border:0,borderRadius:4,cursor:"pointer"}}>{saving?"Enregistrement…":"Enregistrer le mot de passe"}</button>
        <Btn onClick={onLogout} color={C.border} small>Déconnexion</Btn>
      </div>
    </form>
  </div>;
};
const LoginScreen = ({onLogin}) => {
  const [tri,setTri]   = useState("");
  const [pwd,setPwd]   = useState("");
  const [err,setErr]   = useState("");

  const reset=()=>{setErr("");};

  const doLogin=async()=>{
    if(!tri||!pwd){setErr("Trigramme et mot de passe requis");return;}
    const key=`user:${tri.toUpperCase()}`;
    try{
      if(window.authApi){
        const profile=await window.authApi.login(tri.toUpperCase(),pwd);
        onLogin(profile);
        return;
      }
      const r=await window.storage.get(key,true);
      if(!r){setErr("Trigramme inconnu — demandez la création du compte à un admin");return;}
      const u=JSON.parse(r.value);
      if(u.pwd!==hash(pwd)){setErr("Mot de passe incorrect");return;}
      onLogin({trigram:tri.toUpperCase(), role:u.role||"Opérateur"});
    }catch(error){setErr(error?.message||"Erreur de connexion");}
  };

  return (
    <div style={{minHeight:"100vh",background:C.bg,fontFamily:"system-ui,sans-serif",display:"flex",alignItems:"center",justifyContent:"center",padding:24}}>
      <div style={{position:"absolute",top:16,right:20}}><ThemeButton/></div>
      <div style={{width:"100%",maxWidth:400}}>
        <div style={{textAlign:"center",marginBottom:32}}>
          <img src="assets/logo.png" alt="Safran" style={{width:200,maxWidth:"100%",height:65,objectFit:"contain",background:"#ffffff",borderRadius:4,marginBottom:12}}/>
          <div style={{fontSize:12,color:C.muted,marginBottom:8}}>Safran Timing Technologies SA</div>
          <div style={{fontSize:30,fontWeight:900,color:C.text,fontFamily:"monospace"}}>SP-F001A7</div>
          <div style={{width:50,height:3,background:C.accent,borderRadius:2,margin:"14px auto 0"}}/>
        </div>

        <div style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:10,padding:24}}>

          {/* Trigramme — commun à tous les modes */}
          <div style={{marginBottom:14}}>
            <div style={{color:C.muted,fontSize:10,marginBottom:5,textTransform:"uppercase",letterSpacing:.8}}>Trigramme</div>
            <Input value={tri} onChange={v=>setTri(v.toUpperCase())} placeholder="ex: JGR"
              style={{textTransform:"uppercase",letterSpacing:3,fontWeight:700,fontSize:16,textAlign:"center"}}/>
          </div>

          <div style={{marginBottom:20}}>
            <div style={{color:C.muted,fontSize:10,marginBottom:5,textTransform:"uppercase",letterSpacing:.8}}>Mot de passe</div>
            <Input value={pwd} onChange={setPwd} type="password" placeholder="••••••"
              onKeyDown={e=>{if(e.key==="Enter"){e.preventDefault();doLogin();}}}/>
          </div>
          {err&&<ErrBox msg={err}/>}
          <Btn onClick={doLogin} color={C.accent} full>Se connecter</Btn>
        </div>
      </div>
    </div>
  );
};

const ErrBox = ({msg}) => (
  <div style={{background:C.red+"22",border:`1px solid ${C.red}`,color:C.red,borderRadius:6,
    padding:"8px 12px",fontSize:12,marginBottom:14}}>{msg}</div>
);

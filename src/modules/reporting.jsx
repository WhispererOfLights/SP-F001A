const HELVETICA_WIDTHS={
  " ":278,"!":278,'"':355,"#":556,"$":556,"%":889,"&":667,"'":191,
  "(":333,")":333,"*":389,"+":584,",":278,"-":333,".":278,"/":278,
  ":":278,";":278,"<":584,"=":584,">":584,"?":556,"@":1015,
  "A":667,"B":667,"C":722,"D":722,"E":667,"F":611,"G":778,"H":722,"I":278,"J":500,"K":667,"L":556,"M":833,
  "N":722,"O":778,"P":667,"Q":778,"R":722,"S":667,"T":611,"U":722,"V":667,"W":944,"X":667,"Y":667,"Z":611,
  "[":278,"\\":278,"]":278,"^":469,"_":556,"`":333,
  "a":556,"b":556,"c":500,"d":556,"e":556,"f":278,"g":556,"h":556,"i":222,"j":222,"k":500,"l":222,"m":833,
  "n":556,"o":556,"p":556,"q":556,"r":333,"s":500,"t":278,"u":556,"v":500,"w":722,"x":500,"y":500,"z":500,
  "{":334,"|":260,"}":334,"~":584,
};
"0123456789".split("").forEach(character=>{HELVETICA_WIDTHS[character]=556;});
const pdfHelveticaTextWidth=(value,size)=>[...pdfText(value).normalize("NFD").replace(/[\u0300-\u036f]/g,"")]
  .reduce((sum,character)=>sum+(HELVETICA_WIDTHS[character]||556),0)*size/1000;
const pdfSafeName = v => pdfAscii(v).replace(/[^a-zA-Z0-9_-]+/g,"_").replace(/^_+|_+$/g,"") || "rapport";
const fileSafeName = v => pdfAscii(v).replace(/#/g,"SN").replace(/[<>:"/\\|?*\x00-\x1F]+/g," ").replace(/\s+/g," ").trim().replace(/[ .]+$/,"") || "export";
const xmlEsc = value => String(value??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");
const zipU16 = value => new Uint8Array([value&255,(value>>>8)&255]);
const zipU32 = value => new Uint8Array([value&255,(value>>>8)&255,(value>>>16)&255,(value>>>24)&255]);
const concatBytes = parts => {
  const size=parts.reduce((total,part)=>total+part.length,0);
  const result=new Uint8Array(size);
  let offset=0;
  parts.forEach(part=>{result.set(part,offset);offset+=part.length;});
  return result;
};
const crc32Bytes = bytes => {
  let crc=0xFFFFFFFF;
  for(const byte of bytes){
    crc^=byte;
    for(let bit=0;bit<8;bit++) crc=(crc>>>1)^((crc&1)?0xEDB88320:0);
  }
  return (crc^0xFFFFFFFF)>>>0;
};
const buildStoredZip = entries => {
  const encoder=new TextEncoder();
  const locals=[];
  const centrals=[];
  let offset=0;
  const now=new Date();
  const dosTime=(now.getHours()<<11)|(now.getMinutes()<<5)|(now.getSeconds()>>1);
  const dosDate=((Math.max(1980,now.getFullYear())-1980)<<9)|((now.getMonth()+1)<<5)|now.getDate();
  entries.forEach(entry=>{
    const name=encoder.encode(entry.name);
    const data=typeof entry.data==="string"?encoder.encode(entry.data):entry.data;
    const crc=crc32Bytes(data);
    const local=concatBytes([
      zipU32(0x04034B50),zipU16(20),zipU16(0),zipU16(0),zipU16(dosTime),zipU16(dosDate),
      zipU32(crc),zipU32(data.length),zipU32(data.length),zipU16(name.length),zipU16(0),name,data,
    ]);
    const central=concatBytes([
      zipU32(0x02014B50),zipU16(20),zipU16(20),zipU16(0),zipU16(0),zipU16(dosTime),zipU16(dosDate),
      zipU32(crc),zipU32(data.length),zipU32(data.length),zipU16(name.length),zipU16(0),zipU16(0),
      zipU16(0),zipU16(0),zipU32(0),zipU32(offset),name,
    ]);
    locals.push(local);centrals.push(central);offset+=local.length;
  });
  const centralData=concatBytes(centrals);
  const end=concatBytes([
    zipU32(0x06054B50),zipU16(0),zipU16(0),zipU16(entries.length),zipU16(entries.length),
    zipU32(centralData.length),zipU32(offset),zipU16(0),
  ]);
  return new Blob([...locals,centralData,end],{type:"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"});
};
const excelColumnName = index => {
  let value=index+1,name="";
  while(value){value--;name=String.fromCharCode(65+(value%26))+name;value=Math.floor(value/26);}
  return name;
};
const excelWorksheetXml = (rows,headerRows=0) => {
  const width=Math.max(1,...rows.map(row=>row.length));
  const styledRows=new Set(Array.isArray(headerRows)?headerRows:Array.from({length:headerRows},(_,index)=>index));
  const body=rows.map((row,rowIndex)=>`<row r="${rowIndex+1}">${Array.from({length:width},(_,columnIndex)=>{
    const value=row[columnIndex]??"";
    const ref=`${excelColumnName(columnIndex)}${rowIndex+1}`;
    const style=styledRows.has(rowIndex)?' s="1"':"";
    return `<c r="${ref}"${style} t="inlineStr"><is><t xml:space="preserve">${xmlEsc(value)}</t></is></c>`;
  }).join("")}</row>`).join("");
  const lastRow=Math.max(1,rows.length);
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><dimension ref="A1:${excelColumnName(width-1)}${lastRow}"/><sheetData>${body}</sheetData></worksheet>`;
};
const buildExcelWorkbook = sheets => {
  const sheetEntries=sheets.map((sheet,index)=>({name:`xl/worksheets/sheet${index+1}.xml`,data:excelWorksheetXml(sheet.rows||[],sheet.headerRows||0)}));
  const overrides=sheets.map((_,index)=>`<Override PartName="/xl/worksheets/sheet${index+1}.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>`).join("");
  const workbookSheets=sheets.map((sheet,index)=>`<sheet name="${xmlEsc(sheet.name)}" sheetId="${index+1}" r:id="rId${index+1}"/>`).join("");
  const workbookRels=sheets.map((_,index)=>`<Relationship Id="rId${index+1}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet${index+1}.xml"/>`).join("");
  const styleRel=`<Relationship Id="rId${sheets.length+1}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>`;
  return buildStoredZip([
    {name:"[Content_Types].xml",data:`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>${overrides}<Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/></Types>`},
    {name:"_rels/.rels",data:`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/></Relationships>`},
    {name:"xl/workbook.xml",data:`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><sheets>${workbookSheets}</sheets></workbook>`},
    {name:"xl/_rels/workbook.xml.rels",data:`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">${workbookRels}${styleRel}</Relationships>`},
    {name:"xl/styles.xml",data:`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><fonts count="2"><font><sz val="11"/><name val="Calibri"/></font><font><b/><sz val="11"/><name val="Calibri"/></font></fonts><fills count="2"><fill><patternFill patternType="none"/></fill><fill><patternFill patternType="solid"><fgColor rgb="FFD9E1E8"/><bgColor indexed="64"/></patternFill></fill></fills><borders count="1"><border/></borders><cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs><cellXfs count="2"><xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/><xf numFmtId="0" fontId="1" fillId="1" borderId="0" xfId="0" applyFont="1" applyFill="1"/></cellXfs></styleSheet>`},
    ...sheetEntries,
  ]);
};
const compactArticleCode = v => String(v??"").replace(/\s+/g,"").trim();
const consoDescriptionForCsv = (conso={}, fallback="") => {
  const code = compactArticleCode(conso.sap||conso.code||"");
  const label = String(conso.label||fallback||"").trim();
  return code
    ? label.replace(new RegExp("^"+code.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")+"\\s*[-–—]?\\s*","i"),"").trim()
    : label;
};
const visaStamp = (visa,dt) => [visa,dt].filter(Boolean).join(" - ");
const isFourEquip = r => !!(r?.isFour||r?.four||r?.isOven);
const uniqueOvenChoices = rows => {
  const seen=new Set();
  return (rows||[]).filter(row=>{
    if(row.deleted||!isFourEquip(row)) return false;
    const key=String(row.nInv||row.designation||"").trim().toLowerCase();
    if(!key||seen.has(key)) return false;
    seen.add(key);
    return true;
  });
};

const computeReworkWarnings = (rows=[], snRows=[], filter="all") => {
  const repereKey = r => (r?.repere||"").trim().toUpperCase();
  const units = snRows.length ? snRows.map(s=>({id:s.id,label:snTitle(s)})) : [{id:"all",label:"Tous"}];
  const unitIdsForRow = row => {
    const scope=snScope(row,snRows);
    const excluded=(row?.snExcludeIds||[]).filter(id=>units.some(u=>u.id===id));
    const ids=scope.mode==="all"
      ? units.map(u=>u.id).filter(id=>!excluded.includes(id))
      : scope.ids.filter(id=>units.some(u=>u.id===id));
    if(filter && filter!=="all" && filter!=="scope-all") return ids.includes(filter) ? [filter] : [];
    if(filter==="scope-all") return scope.mode==="all" ? ids : [];
    return ids;
  };
  const unitLabel = id => units.find(u=>u.id===id)?.label || "Tous";
  const state={installed:{},openD:{},first:[],pointed:[],mismatch:[],sequence:[]};
  const lastAction={};
  const valueKey=r=>String(r.valeur||"").replace(/\s+/g,"").toUpperCase();
  const addMismatch=(previous,current,kind,repere,uid)=>{
    const fromValue=valueKey(previous),toValue=valueKey(current);
    if(fromValue&&toValue&&fromValue!==toValue&&!previous.isAdjust&&!current.isAdjust){
      state.mismatch.push({repere,previous,current,d:previous.action1==="D"?previous:current,s:current.action1==="D"?previous:current,
        kind,unitId:uid,snLabel:unitLabel(uid)});
    }
  };
  const ordered=rows.map((r,index)=>({r,index})).sort((a,b)=>{
    const stamp=r=>String(r.createdDT||"").replace(/^(\d{2})\/(\d{2})\/(\d{4})/,"$3-$2-$1");
    return a.r.createdDT&&b.r.createdDT?(stamp(a.r).localeCompare(stamp(b.r))||a.index-b.index):a.index-b.index;
  });
  ordered.forEach(({r})=>{
    if(r.deleted) return;
    const key=repereKey(r);
    if(!key||!["S","D","P"].includes(r.action1)) return;
    unitIdsForRow(r).forEach(uid=>{
      const k=`${uid}::${key}`;
      const previous=lastAction[k];
      if(previous&&(previous.action1===r.action1||(previous.action1==="S"&&r.action1==="P")))
        state.sequence.push({repere:key,row:r,previous,unitId:uid,snLabel:unitLabel(uid)});
      if(r.action1==="S"){
        const d=state.openD[k]?.d;
        if(d){
          addMismatch(d,r,"resolder",key,uid);
          delete state.openD[k];
        }else if(state.installed[k]?.action1==="P"){
          addMismatch(state.installed[k],r,"finish-point",key,uid);
        }
        state.installed[k]=r;
      }
      if(r.action1==="D"){
        const installed=state.installed[k];
        if(installed) addMismatch(installed,r,"desolder",key,uid);
        state.openD[k]={repere:key,d:r,initial:!installed,unitId:uid,snLabel:unitLabel(uid)};
        delete state.installed[k];
      }
      if(r.action1==="P"){
        const d=state.openD[k]?.d;
        if(d){
          addMismatch(d,r,"repoint",key,uid);
          delete state.openD[k];
        }
        state.installed[k]=r;
      }
      lastAction[k]=r;
    });
  });
  state.first=Object.values(state.openD).filter(w=>w.initial);
  state.pointed=Object.entries(state.installed).filter(([,r])=>r.action1==="P").map(([k,row])=>{
    const [unitId,repere]=k.split("::");
    return {repere,row,unitId,snLabel:unitLabel(unitId)};
  });
  return state;
};
const computeOpenDesoudes = (rows=[]) => Object.values(rows.reduce((open,r)=>{
  if(r?.deleted) return open;
  const key=(r?.repere||"").trim().toUpperCase();
  if(!key) return open;
  if(["S","P"].includes(r.action1)) delete open[key];
  else if(r.action1==="D") open[key]=r;
  return open;
},{}));
const REWORK_CTRL_ALLOWED_ACTIONS = new Set(["S","R","P"]);
const REWORK_CTRL_REQUIRED_ACTIONS = new Set(["S","R"]);
const canActionReceiveCtrl = action => REWORK_CTRL_ALLOWED_ACTIONS.has(action);
const computeMissingReworkControls = (rows=[]) => rows.filter(r=>
  !r?.deleted &&
  REWORK_CTRL_REQUIRED_ACTIONS.has(r?.action1) &&
  !r?.visaCtrl
);
const connectorSortKey = v => String(v||"").trim().toUpperCase().replace(/^([A-Z]+)(\d+)$/,(_,a,n)=>`${a}${String(n).padStart(6,"0")}`);
const normalizeMatingAction = action => action==="Matting"?"Mating":action==="Dematting"?"Demating":action;
const buildMatingCycles = c => {
  const events=(c?.events||[]).filter(e=>!e.deleted&&e.action).map(e=>({...e,action:normalizeMatingAction(e.action)}));
  const cycles=[];
  for(let i=0;i<events.length;i++){
    const ev=events[i];
    const next=events[i+1];
    if(ev.action==="Mating"){
      const row={mat:ev,dem:null};
      if(next?.action==="Demating"){
        row.dem=next;
        i++;
      }
      cycles.push(row);
    }else if(ev.action==="Demating"){
      cycles.push({mat:null,dem:ev});
    }
  }
  return cycles;
};
const cycleLastDt = cycle => cycle?.dem?.dt || cycle?.mat?.dt || "";
const connectorStateTone = lastAction => lastAction==="Mating"
  ? {fill:"0.88 0.96 0.90",stroke:"0.14 0.45 0.21",text:"0.14 0.45 0.21"}
  : lastAction==="Demating"
    ? {fill:"0.99 0.91 0.91",stroke:"0.85 0.21 0.20",text:"0.85 0.21 0.20"}
    : {fill:"0.90 0.93 0.97",stroke:"0.78 0.82 0.87",text:"0.00 0.27 0.57"};

const REPORT_SECTIONS=[
  {id:"rework",label:"Adjust/Rework",title:"Adjust / Rework"},
  {id:"consommables",label:"Consommables",title:"Consommables"},
  {id:"etuvage",label:"Étuvages",title:"Etuvages"},
  {id:"testequip",label:"Test Équipement",title:"Test Equip."},
  {id:"demating",label:"Mating/Demating",title:"Mating / Demating"},
  {id:"faits",label:"Suivi technique",title:"Suivi technique"},
];

const buildSimplePdf = ({width,height,pages,logoImage=null}) => {
  const objects=[
    "<< /Type /Catalog /Pages 2 0 R >>",
    "<< /Type /Pages /Kids [] /Count 0 >>",
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>",
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>",
  ];
  const logoObjId=logoImage?objects.length+1:null;
  if(logoImage){
    objects.push(`<< /Type /XObject /Subtype /Image /Width ${logoImage.width} /Height ${logoImage.height} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter [/ASCIIHexDecode /DCTDecode] /Length ${logoImage.data.length+1} >>\nstream\n${logoImage.data}>\nendstream`);
  }
  const pageIds=[];
  pages.forEach(ops=>{
    const pageId=objects.length+1;
    const contentId=pageId+1;
    pageIds.push(pageId);
    const xobj=logoObjId?`/XObject << /Logo ${logoObjId} 0 R >> `:"";
    objects.push(`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${width.toFixed(2)} ${height.toFixed(2)}] /Resources << /Font << /F1 3 0 R /F2 4 0 R >> ${xobj}>> /Contents ${contentId} 0 R >>`);
    const stream=ops.join("\n");
    objects.push(`<< /Length ${stream.length} >>\nstream\n${stream}\nendstream`);
  });
  objects[1]=`<< /Type /Pages /Kids [${pageIds.map(id=>`${id} 0 R`).join(" ")}] /Count ${pageIds.length} >>`;
  let pdf="%PDF-1.4\n";
  const offsets=[0];
  objects.forEach((object,index)=>{offsets[index+1]=pdf.length;pdf+=`${index+1} 0 obj\n${object}\nendobj\n`;});
  const xref=pdf.length;
  pdf+=`xref\n0 ${objects.length+1}\n0000000000 65535 f \n`;
  for(let id=1;id<=objects.length;id++) pdf+=String(offsets[id]).padStart(10,"0")+" 00000 n \n";
  pdf+=`trailer\n<< /Size ${objects.length+1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF`;
  return new Blob([pdf],{type:"application/pdf"});
};

const componentLabelUnits = (ofData,row,selectedUnitIds=null) => {
  const header=ofData?.header||{};
  const units=(ofData?.units?.rows||snRowsFromHeader(header)).filter(unit=>!unit.deleted&&hasUnitIdentity(unit));
  const selected=selectedUnitIds?.length ? units.filter(unit=>selectedUnitIds.includes(unit.id)) : units;
  const matched=selected.filter(unit=>rowMatchesSn(row,unit,units));
  if(matched.length) return matched;
  if(units.length) return [];
  return [{id:"of-global",sn:header.sn||"",lot:header.lot||""}];
};

const buildComponentLabelPdf = ({ofData,row,selectedUnitIds=null}) => {
  const MM=72/25.4;
  const width=76*MM, height=50.8*MM;
  const header=ofData?.header||{};
  const units=componentLabelUnits(ofData,row,selectedUnitIds);
  if(!units.length) throw new Error("Cette ligne ne concerne pas le SN sélectionné.");
  const clipped=(value,max)=>{const text=pdfText(value||"N/A");return text.length>max?text.slice(0,Math.max(1,max-3))+"...":text;};
  const txt=(value,x,y,size=7,bold=false,color="0.08 0.10 0.14")=>`BT /${bold?"F2":"F1"} ${size} Tf ${color} rg 1 0 0 1 ${x.toFixed(2)} ${y.toFixed(2)} Tm (${pdfEsc(value)}) Tj ET`;
  const line=(x1,y1,x2,y2,color="0.70 0.73 0.77",lineWidth=.45)=>`q ${color} RG ${lineWidth} w ${x1.toFixed(2)} ${y1.toFixed(2)} m ${x2.toFixed(2)} ${y2.toFixed(2)} l S Q`;
  const rect=(x,y,w,h,color="0.20 0.24 0.30",lineWidth=.55)=>`q ${color} RG ${lineWidth} w ${x.toFixed(2)} ${y.toFixed(2)} ${w.toFixed(2)} ${h.toFixed(2)} re S Q`;
  const pages=units.map(unit=>{
    const identity=unit.sn||unit.lot||"N/A";
    const description=clipped(header.description,58);
    const madeArticle=compactArticleCode(header.codeArticle||header.articleNo)||"N/A";
    const componentArticle=compactArticleCode(row?.codeERP)||"N/A";
    const ofAndSn=`${header.of||"N/A"} - ${identity}`;
    const articleLine=`${madeArticle} - ${description}`;
    const mainLine=`${row?.repere||"N/A"} - ${row?.valeur||"N/A"}`;
    const componentLine=`(${componentArticle})`;
    const footerLine=`Dessoudé le ${row?.createdDT||"N/A"} | Visa : ${row?.createdVisa||"N/A"}`;
    const fit=(value,max,min,maxWidth)=>Math.max(min,Math.min(max,maxWidth/Math.max(1,pdfHelveticaTextWidth(value,1))));
    const centered=(value,y,size,bold=false,color="0.08 0.10 0.14")=>txt(value,(width-pdfHelveticaTextWidth(value,size))/2,y,size,bold,color);
    const ofSize=fit(ofAndSn,12,8,width-12);
    const articleSize=fit(articleLine,9.5,6.2,width-12);
    const mainSize=fit(mainLine,16,9,width-8);
    const componentSize=fit(componentLine,8.5,6,width-10);
    const footerSize=fit(footerLine,7.2,5.3,width-10);
    const ops=[
      `q 0.02 0.02 0.02 rg 0 ${(height-42).toFixed(2)} ${width.toFixed(2)} 42 re f Q`,
      centered(ofAndSn,height-17,ofSize,false,"1 1 1"),
      centered(articleLine,height-35,articleSize,false,"1 1 1"),
      centered(mainLine,height-61,mainSize,false),
      centered(componentLine,height-79,componentSize,false),
      line(0,height-86,width,height-86,"0.08 0.10 0.14",1.15),
      line(0,19,width,19,"0.08 0.10 0.14",1.15),
      centered(footerLine,7,footerSize,false),
    ];
    return ops;
  });
  return buildSimplePdf({width,height,pages});
};

const OPERATIONAL_LABEL_TYPES = [
  {id:"kitting",label:"Kitting"},
  {id:"binder",label:"Log fab"},
  {id:"stock",label:"Mise en stock"},
  {id:"bonding",label:"Collage / coating"},
  {id:"facts",label:"Info suivi technique"},
];

const operationalLabelUnits = (ofData,selectedUnitIds=null) => {
  const header=ofData?.header||{};
  const units=(ofData?.units?.rows||snRowsFromHeader(header)).filter(unit=>!unit.deleted&&hasUnitIdentity(unit));
  const selected=selectedUnitIds?.length?units.filter(unit=>selectedUnitIds.includes(unit.id)):units;
  return selected.length?selected:[{id:"of-global",sn:header.sn||"",lot:header.lot||"",unitKind:header.lot?"lot":"sn",qte:header.qte||""}];
};

const operationalLabelIdentity = unit => snTitle(unit)||"N/A";
const operationalLabelIdentityWithQuantity = unit => {
  const identity=operationalLabelIdentity(unit);
  const quantity=unit?.lot?String(trackedLotQty(unit)||"").trim():"";
  return quantity?`${identity} - Qté ${quantity}`:identity;
};
const operationalLabelProduct = consumable => {
  const code=compactArticleCode(consumable?.sap||consumable?.code||"");
  const label=String(consumable?.label||consumable?.designation||"").trim();
  return [code,label].filter(Boolean).join(" - ")||"N/A";
};
const operationalLabelPolymerization = ({ofData,unit,consommables}) => {
  const units=operationalLabelUnits(ofData);
  const byId=Object.fromEntries((consommables||[]).map(item=>[item.id,item]));
  const candidates=(ofData?.consommables?.ops||[])
    .filter(op=>!op.deleted&&op.validated&&rowMatchesSn(op,unit,units))
    .flatMap(op=>(op.items||[]).filter(item=>!item.deleted&&item.validated).map(item=>{
      const consumable=byId[item.consoId]||{};
      const status=polymerizationStatus(consumable,item.createdDT||op.createdDT);
      return status?{...status,consumable,item,op}:null;
    }).filter(Boolean));
  return candidates.reduce((latest,candidate)=>!latest||candidate.readyAt>latest.readyAt?candidate:latest,null);
};
const operationalLabelFacts = ({ofData,unit}) => {
  const units=operationalLabelUnits(ofData);
  return effectiveScopedRows(ofData,"faits")
    .filter(fact=>rowMatchesSn(fact,unit,units))
    .sort((a,b)=>String(a.date||a.createdDT||"").localeCompare(String(b.date||b.createdDT||"")));
};
const operationalLabelAvailability = ({type,ofData,selectedUnitIds=null,consommables=[]}) => {
  const units=operationalLabelUnits(ofData,selectedUnitIds);
  if(!["bonding","facts"].includes(type)) return {available:true,count:units.length,total:units.length};
  const count=units.filter(unit=>type==="bonding"
    ? !!operationalLabelPolymerization({ofData,unit,consommables})
    : operationalLabelFacts({ofData,unit}).length>0).length;
  return {available:count>0,count,total:units.length};
};
const operationalLabelTypeAvailable = args => operationalLabelAvailability(args).available;

const buildOperationalLabelsPdf = ({type,entries=[],consommables=[],orientation="landscape"}) => {
  if(!OPERATIONAL_LABEL_TYPES.some(item=>item.id===type)) throw new Error("Type d'étiquette inconnu.");
  if(!["landscape","portrait"].includes(orientation)) throw new Error("Orientation d'étiquette inconnue.");
  const MM=72/25.4;
  const portrait=orientation==="portrait";
  const width=(portrait?50.8:76)*MM,height=(portrait?76:50.8)*MM;
  const fit=(value,max,min,maxWidth)=>Math.max(min,Math.min(max,maxWidth/Math.max(1,pdfHelveticaTextWidth(value,1))));
  const txt=(value,x,y,size=7,bold=false,color="0.08 0.10 0.14")=>`BT /${bold?"F2":"F1"} ${size.toFixed(2)} Tf ${color} rg 1 0 0 1 ${x.toFixed(2)} ${y.toFixed(2)} Tm (${pdfEsc(value)}) Tj ET`;
  const centered=(value,y,max=9,min=5.3,bold=false,color="0.08 0.10 0.14",maxWidth=width-10)=>{
    const text=pdfText(value||"N/A");
    const size=fit(text,max,min,maxWidth);
    return txt(text,(width-pdfHelveticaTextWidth(text,size))/2,y,size,bold,color);
  };
  const page=({title="",footer,dividerY=0,lines=[]})=>{
    const ops=[];
    if(title){
      ops.push(`q 0.02 0.02 0.02 rg 0 ${(height-22).toFixed(2)} ${width.toFixed(2)} 22 re f Q`);
      ops.push(centered(title,height-15,10,6.4,true,"1 1 1"));
    }
    if(footer){
      ops.push(`q 0.02 0.02 0.02 rg 0 0 ${width.toFixed(2)} 15 re f Q`);
      ops.push(centered(footer,5,7.2,5,true,"1 1 1"));
    }
    if(dividerY) ops.push(`q 0.70 0.73 0.77 RG .45 w 8 ${dividerY.toFixed(2)} m ${(width-8).toFixed(2)} ${dividerY.toFixed(2)} l S Q`);
    lines.forEach(line=>ops.push(centered(line.text,line.y,line.max||9,line.min||5.3,!!line.bold,line.color||"0.08 0.10 0.14",line.maxWidth||width-10)));
    return ops;
  };
  const pages=[];
  entries.forEach(entry=>{
    const ofData=entry?.ofData||{};
    const header=ofData.header||{};
    const article=compactArticleCode(header.codeArticle||header.articleNo)||"N/A";
    const description=header.description||"N/A";
    const of=header.of||"N/A";
    const otp=header.otp||header.projet||"N/A";
    const units=operationalLabelUnits(ofData,entry.selectedUnitIds||null);
    const commonHeader=(identity,identityMax=10)=>portrait?[
      {text:article,y:195,max:13,min:8.5,bold:true},
      {text:description,y:177,max:8,min:5.2},
      {text:identity,y:142,max:Math.max(identityMax,15),min:8,bold:true},
      {text:`OF ${of}`,y:116,max:8,min:5.4,bold:true},
      {text:`OTP ${otp}`,y:102,max:7.3,min:4.8,bold:true},
    ]:[
      {text:article,y:128,max:10.5,bold:true},
      {text:description,y:114,max:7.6},
      {text:identity,y:87,max:identityMax,min:7.5,bold:true},
      {text:`OF ${of} - OTP ${otp}`,y:67,max:7,bold:true},
    ];
    if(type==="kitting"){
      const serials=units.filter(unit=>unit.sn).map(unit=>unit.sn);
      const lots=units.filter(unit=>unit.lot).map(unit=>unit.lot);
      const identity=serials.length>1&&lots.length===0
        ? `SN de ${serials[0]} à ${serials[serials.length-1]}`
        : serials.length===1&&lots.length===0?`SN ${serials[0]}`
        : lots.length===1&&serials.length===0?`LOT ${lots[0]}`
        : units.map(operationalLabelIdentity).join(" / ");
      const quantity=units.reduce((total,unit)=>total+(unit.lot?Number(trackedLotQty(unit)||0):1),0);
      pages.push(page({footer:"KITTING",dividerY:portrait?88:59,lines:commonHeader(`${identity} - Qté ${quantity||"N/A"}`,13)}));
      return;
    }
    units.forEach(unit=>{
      const identity=operationalLabelIdentity(unit);
      if(type==="binder"){
        pages.push(page({dividerY:portrait?0:59,lines:portrait?[
          {text:article,y:190,max:16,min:10,bold:true},
          {text:description,y:165,max:9,min:5.6},
          {text:operationalLabelIdentityWithQuantity(unit),y:115,max:22,min:11,bold:true},
          {text:`OF ${of}`,y:70,max:10,min:6,bold:true},
          {text:`OTP ${otp}`,y:45,max:9,min:5.5,bold:true},
        ]:commonHeader(operationalLabelIdentityWithQuantity(unit),22)}));
      }else if(type==="stock"){
        pages.push(page({lines:portrait?[
          {text:article,y:190,max:20,min:12,bold:true},
          {text:description,y:168,max:9,min:5.4},
          {text:identity,y:122,max:20,min:10,bold:true},
          {text:`OF ${of}`,y:84,max:9,min:5.8,bold:true},
          {text:`OTP ${otp}`,y:64,max:8,min:5.2,bold:true},
        ]:[
          {text:article,y:116,max:18,min:12,bold:true},
          {text:description,y:91,max:9,min:5.8},
          {text:identity,y:54,max:17,min:9,bold:true},
          {text:`OF ${of} - OTP ${otp}`,y:18,max:8,min:5.2,bold:true},
        ]}));
      }else if(type==="bonding"){
        const polymerization=operationalLabelPolymerization({ofData,unit,consommables});
        if(!polymerization) return;
        const category=String(polymerization.consumable?.cat||"").toUpperCase();
        const title=category.includes("COAT")||category.includes("VERNIS")?"COATING":"COLLAGE";
        pages.push(page({dividerY:portrait?88:59,lines:[
          ...commonHeader(operationalLabelIdentityWithQuantity(unit),10),
          {text:title,y:portrait?77:48,max:9,bold:true},
          {text:`Produit : ${operationalLabelProduct(polymerization.consumable)}`,y:portrait?59:34,max:6.8,bold:true},
          {text:portrait?`Début : ${formatAvailabilityDT(polymerization.start)}`:`Début : ${formatAvailabilityDT(polymerization.start)}  |  Fin : ${formatAvailabilityDT(polymerization.readyAt)}`,y:portrait?41:18,max:6,min:4.6,bold:true},
          ...(portrait?[{text:`Fin : ${formatAvailabilityDT(polymerization.readyAt)}`,y:27,max:6,min:4.6,bold:true}]:[]),
        ]}));
      }else if(type==="facts"){
        const facts=operationalLabelFacts({ofData,unit});
        if(!facts.length) return;
        for(let index=0;index<facts.length;index+=2){
          const chunk=facts.slice(index,index+2);
          pages.push(page({footer:"SUIVI TECHNIQUE",dividerY:portrait?88:59,lines:[
            ...commonHeader(operationalLabelIdentityWithQuantity(unit),10),
            ...chunk.map((fact,factIndex)=>({
              text:`${technicalFollowUpLabel(fact)} : ${fact.commentaires||fact.description||"N/A"}`,
              y:(portrait?74:43)-factIndex*(portrait?26:19),max:7.2,min:4.8,bold:true,
            })),
          ]}));
        }
      }
    });
  });
  if(!pages.length) throw new Error("Aucune étiquette à générer.");
  return buildSimplePdf({width,height,pages});
};

const buildComponentRetentionSheetsPdf = ({ofData,selectedUnitIds=null,logoImage=null,exportedAt="",exportedBy=""}) => {
  const MM=72/25.4;
  const width=297*MM, height=210*MM;
  const header=ofData?.header||{};
  const allUnits=(ofData?.units?.rows||snRowsFromHeader(header)).filter(unit=>!unit.deleted&&hasUnitIdentity(unit));
  const units=selectedUnitIds?.length ? allUnits.filter(unit=>selectedUnitIds.includes(unit.id)) : allUnits;
  const targets=units.length?units:[{id:"of-global",sn:header.sn||"",lot:header.lot||""}];
  const rows=(ofData?.rework?.rows||[]).filter(row=>!row.deleted&&row.validated&&row.action1==="D");
  const labelsPerPage=9;
  const labelW=76*MM,labelH=50.8*MM,gapX=8*MM,gapY=3*MM;
  const startX=(width-(labelW*3+gapX*2))/2;
  const gridTop=height-39*MM;
  const textWidth=(value,size,bold=false)=>pdfText(value).length*size*(bold?.54:.48);
  const pages=[];
  targets.forEach(unit=>{
    const unitRows=rows.filter(row=>unit.id==="of-global"||rowMatchesSn(row,unit,allUnits));
    const requiredPages=Math.max(2,Math.ceil(unitRows.length/labelsPerPage));
    const pageCount=requiredPages%2===0?requiredPages:requiredPages+1;
    for(let sheet=0;sheet<pageCount;sheet++){
      const ops=[];
      const title="COMPOSANTS DESSOUDÉS CONSERVÉS";
      const margin=28,top=height-margin;
      if(logoImage){
        const logoW=113.39;
        const logoH=Math.min(32,logoW*logoImage.height/logoImage.width);
        ops.push(`q ${logoW.toFixed(2)} 0 0 ${logoH.toFixed(2)} ${margin.toFixed(2)} ${(top-logoH+2).toFixed(2)} cm /Logo Do Q`);
      }
      ops.push(`BT /F2 14 Tf 0.12 0.43 0.92 rg 1 0 0 1 ${((width-textWidth(title,14,true))/2).toFixed(2)} ${(top-7).toFixed(2)} Tm (${pdfEsc(title)}) Tj ET`);
      ops.push(`BT /F2 7 Tf 0.00 0.27 0.57 rg 1 0 0 1 ${(width-margin-textWidth("SP-F001A",7,true)).toFixed(2)} ${(top-8).toFixed(2)} Tm (SP-F001A) Tj ET`);
      const exportText=pdfText(`${exportedAt}${exportedBy?` - ${exportedBy}`:""}`);
      ops.push(`BT /F1 6 Tf 0.31 0.35 0.41 rg 1 0 0 1 ${(width-margin-textWidth(exportText,6)).toFixed(2)} ${(top-20).toFixed(2)} Tm (${pdfEsc(exportText)}) Tj ET`);
      const lineY=top-34;
      ops.push(`q 0.00 0.27 0.57 RG .6 w ${margin.toFixed(2)} ${lineY.toFixed(2)} m ${(width-margin).toFixed(2)} ${lineY.toFixed(2)} l S Q`);
      const identity=snTitle(unit);
      const article=`${compactArticleCode(header.codeArticle||header.articleNo)||"N/A"} - ${header.description||"N/A"}`;
      ops.push(`BT /F2 8.5 Tf 0.08 0.10 0.14 rg 1 0 0 1 ${margin.toFixed(2)} ${(lineY-14).toFixed(2)} Tm (${pdfEsc(header.otp||header.projet||"N/A")}) Tj ET`);
      ops.push(`BT /F2 8.5 Tf 0.08 0.10 0.14 rg 1 0 0 1 ${((width-textWidth(header.of||"N/A",8.5,true))/2-170).toFixed(2)} ${(lineY-14).toFixed(2)} Tm (${pdfEsc(header.of||"N/A")}) Tj ET`);
      ops.push(`BT /F2 8.5 Tf 0.08 0.10 0.14 rg 1 0 0 1 ${((width-textWidth(article,8.5,true))/2).toFixed(2)} ${(lineY-14).toFixed(2)} Tm (${pdfEsc(article)}) Tj ET`);
      ops.push(`BT /F2 8.5 Tf 0.08 0.10 0.14 rg 1 0 0 1 ${(width-margin-textWidth(identity,8.5,true)).toFixed(2)} ${(lineY-14).toFixed(2)} Tm (${pdfEsc(identity)}) Tj ET`);
      for(let slot=0;slot<labelsPerPage;slot++){
        const col=slot%3,rowIndex=Math.floor(slot/3);
        const x=startX+col*(labelW+gapX);
        const y=gridTop-(rowIndex+1)*labelH-rowIndex*gapY;
        const number=sheet*labelsPerPage+slot+1;
        ops.push(`q 0.55 0.58 0.63 RG .6 w [3 2] 0 d ${x.toFixed(2)} ${y.toFixed(2)} ${labelW.toFixed(2)} ${labelH.toFixed(2)} re S Q`);
        const slotText=String(number);
        ops.push(`BT /F2 30 Tf 0.72 0.74 0.78 rg 1 0 0 1 ${(x+(labelW-textWidth(slotText,30,true))/2).toFixed(2)} ${(y+labelH/2-10).toFixed(2)} Tm (${pdfEsc(slotText)}) Tj ET`);
      }
      const footerY=14;
      const footerLeft="Composants dessoudés conservés";
      const confidentiality="Document confidentiel - diffusion limitee aux personnes autorisees.";
      ops.push(`q 0.00 0.27 0.57 RG .55 w ${margin.toFixed(2)} 28 m ${(width-margin).toFixed(2)} 28 l S Q`);
      ops.push(`BT /F1 5.8 Tf 0.31 0.35 0.41 rg 1 0 0 1 ${margin.toFixed(2)} ${footerY} Tm (${pdfEsc(footerLeft)}) Tj ET`);
      ops.push(`BT /F1 5.8 Tf 0.31 0.35 0.41 rg 1 0 0 1 ${((width-textWidth(confidentiality,5.8))/2).toFixed(2)} ${footerY} Tm (${pdfEsc(confidentiality)}) Tj ET`);
      pages.push(ops);
    }
  });
  return buildSimplePdf({width,height,pages,logoImage});
};

const buildDirectReportPdf = ({ofData, lists, exportedAt, exportedBy, includeHistory=false, includeDeleted=true, skipEmptyReports=false, selectedSections=null, selectedSnIds=null, logoImage=null}) => {
  ofData=withUnitMetadata(ofData);
  const includeSection=title=>!selectedSections||REPORT_SECTIONS.some(s=>s.title===title&&selectedSections.includes(s.id));
  const h = ofData?.header||{};
  const W=841.89,H=595.28,M=28;
  const usable=W-M*2;
  const pages=[];
  const newPage=()=>{const p={ops:[],y:H-M,context:"",section:""};pages.push(p);return p;};
  let page=newPage();
  const color={ink:"0.07 0.09 0.13",muted:"0.31 0.35 0.41",line:"0.78 0.82 0.87",head:"0.90 0.92 0.95",soft:"0.96 0.97 0.98",orange:"0.12 0.43 0.92",blue:"0.00 0.27 0.57",green:"0.14 0.45 0.21",red:"0.85 0.21 0.20",warn:"0.95 0.56 0.00"};
  const PDF_CONFIDENTIALITY = "Document confidentiel - diffusion limitee aux personnes autorisees.";
  const PDF_LOGO_WIDTH_PT = 113.39; // 40 mm
  const setFill=c=>`${c} rg`;
  const setStroke=c=>`${c} RG`;
  const text=(txt,x,y,size=7,bold=false,c=color.ink)=>{
    page.ops.push(`BT /${bold?"F2":"F1"} ${size} Tf ${setFill(c)} 1 0 0 1 ${x.toFixed(2)} ${y.toFixed(2)} Tm (${pdfEsc(txt)}) Tj ET`);
  };
  const line=(x1,y1,x2,y2,c=color.line,w=.35)=>page.ops.push(`q ${setStroke(c)} ${w} w ${x1.toFixed(2)} ${y1.toFixed(2)} m ${x2.toFixed(2)} ${y2.toFixed(2)} l S Q`);
  const rect=(x,y,w,h,fill=null,stroke=color.line,lineWidth=.35)=>{
    page.ops.push(`q ${stroke?setStroke(stroke):""} ${fill?setFill(fill):""} ${lineWidth} w ${x.toFixed(2)} ${y.toFixed(2)} ${w.toFixed(2)} ${h.toFixed(2)} re ${fill&&stroke?"B":fill?"f":"S"} Q`);
  };
  const image=(name,x,y,w,h)=>{
    page.ops.push(`q ${w.toFixed(2)} 0 0 ${h.toFixed(2)} ${x.toFixed(2)} ${y.toFixed(2)} cm /${name} Do Q`);
  };
  const wrap=(txt,w,size=7)=>{
    const max=Math.max(3,Math.floor(w/(size*.48)));
    const words=pdfText(txt).split(" ");
    const lines=[]; let cur="";
    words.forEach(word=>{
      if((cur+" "+word).trim().length>max){ if(cur) lines.push(cur); cur=word; }
      else cur=(cur+" "+word).trim();
    });
    if(cur) lines.push(cur);
    return lines.length?lines:["-"];
  };
  const wrapped=(txt,x,y,w,size=6.4,maxLines=4,c=color.ink,bold=false)=>{
    wrap(txt,w,size).slice(0,maxLines).forEach((ln,i)=>text(ln,x,y-i*(size+1.3),size,bold,c));
  };
  const textW=(txt,size=7,bold=false)=>pdfText(txt).length*size*(bold ? .54 : .48);
  const wrappedRight=(txt,x,y,w,size=6.4,maxLines=4,c=color.ink,bold=false)=>{
    wrap(txt,w,size).slice(0,maxLines).forEach((ln,i)=>text(ln,x+w-textW(ln,size,bold),y-i*(size+1.3),size,bold,c));
  };
  const wrappedCenter=(txt,x,y,w,size=6.4,maxLines=4,c=color.ink,bold=false)=>{
    wrap(txt,w,size).slice(0,maxLines).forEach((ln,i)=>text(ln,x+(w-textW(ln,size,bold))/2,y-i*(size+1.3),size,bold,c));
  };
  const statusLabel=s=>STATUTS?.[s]?.label||UNIT_STATUTS?.[s]?.label||s||"-";
  const ofTypeLabel=t=>OF_TYPES?.[t]?.label||t||"Production";
  const unitLabel = u => snTitle(u);
  const activeUnits=(ofData?.units?.rows||[]).filter(u=>!u.deleted&&hasUnitIdentity(u));
  const fallbackUnit={
    id:"of-global",
    sn:h.sn||h.snProduitFini||"",
    lot:h.lot||"",
    status:"en_cours",
    remarque:"",
  };
  const packUnits=activeUnits.length?activeUnits:[fallbackUnit];
  const selectedSet = selectedSnIds&&selectedSnIds.length ? new Set(selectedSnIds) : new Set(packUnits.map(u=>u.id).filter(Boolean));
  const selectedUnits = activeUnits.length ? activeUnits.filter(u=>selectedSet.has(u.id)) : packUnits;
  const selectedSnLabel = selectedUnits.length
    ? selectedUnits.map(snTitle).join(" ; ")
    : "Tous les SN";
  const rowInSelectedSn = row => {
    if(!activeUnits.length || !selectedSet.size) return true;
    const scope=snScope(row,activeUnits);
    if(scope.mode==="all") return true;
    return scope.ids.some(id=>selectedSet.has(id));
  };
  const unitMatches=(row,unit)=>!unit||unit.id==="of-global" ? true : rowMatchesSn(row,unit,activeUnits);
  const trace = r => {
    const hist=(r?.editHistory||[]).flatMap(e=>(e.changes||[]).map(c=>`Modifie ${e.dt} ${e.visa}: ${c.label} "${c.from||"-"}" -> "${c.to||"-"}"`));
    if(r?.remarque) hist.push(`Remarque: ${r.remarque}`);
    if(r?.deleted) hist.push(`Annule ${r.deletedDate||""} ${r.deletedVisa||""}: ${r.deletedReason||""}`);
    if(r?.restoredReason) hist.push(`Reactive ${r.restoredDate||""} ${r.restoredVisa||""}: ${r.restoredReason||""}`);
    return hist.join(" | ");
  };
  const commentsForPdf = r => (r?.comments||[])
    .filter(c=>String(c?.text||"").trim())
    .map(c=>`${c.visa||"-"} - ${c.dt||"-"} - ${c.text||""}`);
  const headerBlock=(title,unit=null,sectionName=title)=>{
    page.context=title;
    page.section=sectionName;
    const logoH=logoImage?.width&&logoImage?.height
      ? Math.min(32,PDF_LOGO_WIDTH_PT*logoImage.height/logoImage.width)
      : 20;
    const top=page.y;
    const sectionTitle=pdfText(REPORT_SECTIONS.find(section=>String(title).includes(section.title))?.title||String(title).replace(/ - suite$/,""));
    const sectionSize=14;
    if(logoImage){
      image("Logo",M,top-logoH+2,PDF_LOGO_WIDTH_PT,logoH);
    }else{
      rect(M,top-29,PDF_LOGO_WIDTH_PT,22,null,color.line);
      text("LOGO",M+PDF_LOGO_WIDTH_PT/2-10,top-21,7,true,color.muted);
    }
    text(sectionTitle,(W-textW(sectionTitle,sectionSize,true))/2,top-7,sectionSize,true,color.orange);
    const exportText=pdfAscii(`${exportedAt} - ${exportedBy}`);
    text("SP-F001A",W-M-textW("SP-F001A",7,true),top-8,7,true,color.blue);
    text(exportText,W-M-textW(exportText,6),top-20,6,false,color.muted);
    const lineY=top-34;
    line(M,lineY,W-M,lineY,color.orange,.6);
    const article=h.codeArticle||h.articleNo||"-";
    const unitIdentity=current=>[current?.sn||"",current?.lot||""].filter(Boolean).join(" / ")||"-";
    const unitQuantity=current=>current?.lot?String(trackedLotQty(current)||"").trim():"";
    const identityValue=unit?unitIdentity(unit):selectedUnits.map(unitIdentity).join(" ; ")||"-";
    const quantityValue=unit
      ? unitQuantity(unit)||"-"
      : selectedUnits.map(unitQuantity).filter(Boolean).join(" ; ")||"-";
    const meta=[
      {label:"OTP",value:h.otp||h.projet||"-",weight:1.1,align:"left"},
      {label:"N° OF",value:h.of||"-",weight:.85,align:"center"},
      {label:"Article",value:`${article} - ${h.description||"-"}`,weight:3,align:"center"},
      {label:"SN ou LOT",value:identityValue,weight:1.25,align:"right"},
      {label:"Qté",value:quantityValue,weight:.55,align:"right"},
    ];
    const totalWeight=meta.reduce((sum,item)=>sum+item.weight,0);
    let metaX=M;
    meta.forEach(m=>{
      const cw=usable*m.weight/totalWeight;
      const contentWidth=cw-8;
      if(m.align==="right"){
        wrappedRight(m.label,metaX,lineY-10,contentWidth,7,1,color.muted,true);
        wrappedRight(m.value,metaX,lineY-24,contentWidth,10.5,2,color.ink,true);
      }else if(m.align==="center"){
        wrappedCenter(m.label,metaX,lineY-10,contentWidth,7,1,color.muted,true);
        wrappedCenter(m.value,metaX,lineY-24,contentWidth,10.5,2,color.ink,true);
      }else{
        wrapped(m.label,metaX,lineY-10,contentWidth,7,1,color.muted,true);
        wrapped(m.value,metaX,lineY-24,contentWidth,10.5,2,color.ink,true);
      }
      metaX+=cw;
    });
    page.y=lineY-45;
  };
  const table=(headers,rows,widths,sectionTitle,unit=null)=>{
    const tableLine="0.18 0.20 0.22";
    const sum=widths.reduce((a,b)=>a+b,0);
    widths=widths.map(w=>w/sum*usable);
    const drawHead=()=>{
      let x=M; rect(x,page.y-19,usable,19,color.head,tableLine,.22);
      headers.forEach((hd,i)=>{wrapped(hd,x+2,page.y-9,widths[i]-4,5.6,2,color.ink,true); x+=widths[i]; if(i) line(x-widths[i],page.y,x-widths[i],page.y-19,tableLine,.22);});
      page.y-=19;
    };
    drawHead();
    rows.forEach((row,rowIndex)=>{
      const rowObj=Array.isArray(row)?{cells:row}:row;
      if(rowObj?.fullText){
        const fullLines=wrap(rowObj.fullText,usable-8,6.4).slice(0,2);
        const rh=Math.max(15,fullLines.length*7.8+6);
        if(page.y-rh<M+28){ page=newPage(); headerBlock(`${sectionTitle} - suite`,unit,sectionTitle); drawHead(); }
        rect(M,page.y-rh,usable,rh,rowObj.fill||"0.90 0.93 0.97",rowObj.stroke||color.line);
        fullLines.forEach((ln,i)=>text(ln,M+4,page.y-9-i*7.8,6.4,true,rowObj.color||color.blue));
        page.y-=rh;
        return;
      }
      const cells=headers.map((_,i)=>rowObj?.cells?.[i]??"");
      const lineCounts=cells.map((cell,i)=>wrap(cell,widths[i]-4,6.1).slice(0,5).length);
      const rh=Math.max(13,Math.max(...lineCounts)*7.5+5);
      if(page.y-rh<M+28){ page=newPage(); headerBlock(`${sectionTitle} - suite`,unit,sectionTitle); drawHead(); }
      let x=M; rect(x,page.y-rh,usable,rh,rowIndex%2===1?"0.94 0.95 0.96":null,tableLine,.22);
      const rowColor=rowObj?.deleted?color.red:color.ink;
      cells.forEach((cell,i)=>{
        const style=rowObj?.cellStyles?.[i];
        if(style?.fill) rect(x,page.y-rh,widths[i],rh,style.fill,tableLine,.22);
        const cellLines=wrap(cell,widths[i]-4,6.1).slice(0,5);
        cellLines.forEach((cellLine,lineIndex)=>{
          const baseline=page.y-8-lineIndex*7.4;
          text(cellLine,x+2,baseline,6.1,!!style?.bold,style?.color||rowColor);
          if(rowObj?.deleted) line(x+2,baseline+2,x+2+Math.min(widths[i]-4,textW(cellLine,6.1,!!style?.bold)),baseline+2,color.red,.55);
        });
        x+=widths[i];
        if(i) line(x-widths[i],page.y,x-widths[i],page.y-rh,tableLine,.22);
      });
      page.y-=rh;
      if(rowObj?.deleted&&rowObj?.deleteText){
        const reasonLines=wrap(rowObj.deleteText,usable-12,5.8).slice(0,3);
        const dh=Math.max(11,reasonLines.length*6.5+5);
        if(page.y-dh<M+28){ page=newPage(); headerBlock(`${sectionTitle} - suite`,unit,sectionTitle); drawHead(); }
        rect(M,page.y-dh,usable,dh,"0.99 0.91 0.91",color.red);
        reasonLines.forEach((ln,i)=>text(ln,M+4,page.y-8-i*6.5,5.8,true,color.red));
        page.y-=dh;
      }
      if(rowObj?.comments?.length){
        rowObj.comments.slice(0,8).forEach(item=>{
          const detail=typeof item==="object"&&item!==null?item:{text:item};
          const commentLines=wrap(detail.text,usable-12,5.8).slice(0,detail.maxLines||3);
          const ch=Math.max(11,commentLines.length*6.5+5);
          if(page.y-ch<M+28){ page=newPage(); headerBlock(`${sectionTitle} - suite`,unit,sectionTitle); drawHead(); }
          rect(M,page.y-ch,usable,ch,detail.fill||"0.90 0.95 1.00",detail.stroke||color.blue);
          commentLines.forEach((ln,i)=>text(ln,M+4,page.y-8-i*6.5,5.8,!!detail.bold,detail.color||color.blue));
          page.y-=ch;
        });
      }
      if(includeHistory&&rowObj?.trace){
        const items=String(rowObj.trace||"").split(" | ").filter(Boolean).slice(0,6);
        items.forEach(item=>{
          const traceLines=wrap(item,usable-12,5.8).slice(0,3);
          const th=Math.max(11,traceLines.length*6.5+5);
          if(page.y-th<M+28){ page=newPage(); headerBlock(`${sectionTitle} - suite`,unit,sectionTitle); drawHead(); }
          rect(M,page.y-th,usable,th,"0.91 0.93 0.96",color.line);
          traceLines.forEach((ln,i)=>text(ln,M+4,page.y-8-i*6.5,5.8,false,color.muted));
          page.y-=th;
        });
      }
    });
  };
  const section=(title,headers,rows,widths,unit)=> {
    if(!includeSection(title)) return;
    if(skipEmptyReports&&!rows.length) return;
    page=newPage();
    const displayTitle=unit&&unit.id!=="of-global" ? `${unitLabel(unit)} - ${title}` : title;
    headerBlock(displayTitle,unit,displayTitle);
    const body=rows.length?rows:[headers.map((_,i)=>i===0?"Aucune ligne":"")];
    table(headers,body,widths,displayTitle,unit);
  };
  const warningBlock=(title,items,tone,sectionTitle,unit)=>{
    if(!items.length) return;
    const c=tone==="red"?color.red:color.warn;
    const fill=tone==="red"?"0.99 0.91 0.91":"1.00 0.96 0.84";
    const lines=items.flatMap(item=>wrap(item,usable-18,6.1).slice(0,2));
    while(lines.length){
      let capacity=Math.floor((page.y-M-28-25)/7);
      if(capacity<1){page=newPage();headerBlock(`${sectionTitle} - suite`,unit,sectionTitle);capacity=Math.floor((page.y-M-28-25)/7);}
      const chunk=lines.splice(0,capacity);
      const h=Math.max(20,chunk.length*7+17);
      rect(M,page.y-h,usable,h,fill,c);
      text(title,M+6,page.y-10,6.6,true,c);
      chunk.forEach((ln,i)=>text(ln,M+12,page.y-19-i*7,6.1,false,c));
      page.y-=h+8;
    }
  };
  const infoBlock=(pairs,x,y,w)=>{
    const col=w/2;
    pairs.forEach((m,i)=>{
      const px=x+(i%2)*col;
      const py=y-Math.floor(i/2)*22;
      text(m[0],px,py,6,false,color.muted);
      wrapped(m[1],px,py-8,col-12,7.2,2,color.ink);
    });
  };

  const consoById=Object.fromEntries((lists?.consommables||[]).map(c=>[c.id,c]));
  const unitRows=(rows,unit)=>(rows||[]).filter(row=>!row?.deleted&&unitMatches(row,unit)&&rowInSelectedSn(row));
  const compactItems=(label,items,max=5)=>{
    const values=[...new Set(items.map(value=>String(value||"").trim()).filter(Boolean))];
    if(!values.length) return "";
    const shown=values.slice(0,max);
    return `${label} : ${shown.join(", ")}${values.length>shown.length?` (+${values.length-shown.length})`:""}`;
  };
  const unitSummary=unit=>{
    const alerts=[];
    const open=[];
    const reworkRows=unitRows(ofData?.rework?.rows,unit);
    const reworkWarnings=computeReworkWarnings(reworkRows);
    const openDesoldered=computeOpenDesoudes(reworkRows);
    const missingControls=reworkRows.filter(row=>row.validated&&["S","R"].includes(row.action1)&&!row.visaCtrl);
    const missingTrace=reworkRows.filter(row=>row.validated&&missingReworkTrace(row,true).length);
    const expiredCodes=reworkRows.filter(row=>{
      const dc=dcCheck(row.dc,row.createdDT);
      return row.validated&&["S","P","M"].includes(row.action1)&&dc?.max!==undefined&&!dc.ok;
    });
    [
      compactItems("Contrôles manquants",missingControls.map(row=>row.repere||"repère ?")),
      compactItems("Traçabilité LOT/DC incomplète",missingTrace.map(row=>row.repere||"repère ?")),
      compactItems("Dates code hors validité",expiredCodes.map(row=>row.repere||"repère ?")),
    ].filter(Boolean).forEach(item=>alerts.push(item));
    [
      compactItems("Composants dessoudés sans remontage",openDesoldered.map(row=>row.repere||"repère ?")),
      compactItems("Composants pointés à souder",reworkWarnings.pointed.map(item=>item.repere||item.row?.repere||"repère ?")),
    ].filter(Boolean).forEach(item=>open.push(item));

    const consumableIssues=[];
    const consumableSoon=[];
    unitRows(ofData?.consommables?.ops,unit).forEach(op=>(op.items||[]).filter(item=>!item.deleted).forEach(item=>{
      const consumable=consoById[item.consoId]||{};
      const name=compactArticleCode(consumable.sap||consumable.code||item.consoId)||"consommable ?";
      const status=dpStatus(item.dp,item.createdDT||op.createdDT);
      if(item.dp&&!isValidDMY(item.dp)) consumableIssues.push(`${name} date invalide`);
      else if(status?.label==="PÉRIMÉ") consumableIssues.push(`${name} périmé`);
      else if(status?.label==="BIENTÔT") consumableSoon.push(`${name} bientôt périmé`);
    }));
    const expiredEquipment=[];
    const equipmentSoon=[];
    unitRows(effectiveScopedRows(ofData,"testequip"),unit).forEach(row=>{
      const status=calibStatus(row.dateExpiration);
      const name=row.nInv||row.designation||"appareil ?";
      if(status?.label==="HORS CALIBRATION") expiredEquipment.push(name);
      else if(status?.label==="EXPIRE BIENTÔT") equipmentSoon.push(name);
    });
    [
      compactItems("Consommables périmés ou invalides",consumableIssues),
      compactItems("Appareils hors calibration",expiredEquipment),
    ].filter(Boolean).forEach(item=>alerts.push(item));
    [
      compactItems("Consommables bientôt périmés",consumableSoon),
      compactItems("Calibrations bientôt expirées",equipmentSoon),
    ].filter(Boolean).forEach(item=>open.push(item));

    const facts=unitRows(effectiveScopedRows(ofData,"faits"),unit).filter(row=>!row.closedDate);
    const ovens=unitRows(effectiveScopedRows(ofData,"etuvage"),unit);
    const runningOvens=ovens.filter(row=>row.entreeDT&&!row.sortieDT);
    const incompleteOvens=ovens.filter(row=>!row.validated&&ovenRequiredMissing(row).length);
    [
      compactItems("Suivis techniques ouverts",facts.map(row=>technicalFollowUpLabel(row))),
      compactItems("Étuvages en cours",runningOvens.map(row=>row.fourN||row.entreeDT||"étuvage")),
      compactItems("Étuvages incomplets",incompleteOvens.map(row=>ovenRequiredMissing(row).join(" / "))),
    ].filter(Boolean).forEach(item=>open.push(item));
    return {alerts,open};
  };
  const drawSummaryCover=()=>{
    const summary=selectedUnits.reduce((result,unit)=>{
      const current=unitSummary(unit);
      const prefix=unit?.id&&unit.id!=="of-global"?`${unitLabel(unit)} - `:"";
      current.alerts.forEach(item=>result.alerts.push(`${prefix}${item}`));
      current.open.forEach(item=>result.open.push(`${prefix}${item}`));
      return result;
    },{alerts:[],open:[]});
    const sectionTitle="Synthèse";
    page=newPage();
    headerBlock("Synthèse des points ouverts",null,sectionTitle);
    if(!summary.alerts.length&&!summary.open.length){
      const h=27;
      rect(M,page.y-h,usable,h,"0.91 0.97 0.92",color.green);
      text("Aucun point ouvert ni alerte détecté.",M+8,page.y-17,7.2,true,color.green);
      page.y-=h+8;
      return;
    }
    warningBlock("ALERTES",summary.alerts,"red",sectionTitle,null);
    warningBlock("POINTS OUVERTS",summary.open,"yellow",sectionTitle,null);
  };
  const rowPdf=(cells,row,extraTrace="")=>({
    cells,
    deleted:!!row?.deleted,
    deleteText:row?.deleted
      ? `Annulé le ${row.deletedDate||"-"} par ${row.deletedVisa||"-"} - Motif : ${row.deletedReason||"-"}`
      : "",
    comments:commentsForPdf(row),
    trace:[trace(row),extraTrace].filter(Boolean).join(" | ")
  });
  const rowPdfWithComments=(cells,row,extraComments=[],extraTrace="")=>({
    ...rowPdf(cells,row,extraTrace),
    comments:[...commentsForPdf(row),...extraComments.filter(Boolean)]
  });

  drawSummaryCover();

  selectedUnits.forEach(unit=>{
    const inUnit = row => unitMatches(row,unit) && rowInSelectedSn(row) && (includeDeleted || !row?.deleted);

    const reworkRowsForUnit = (ofData?.rework?.rows||[]).filter(inUnit);
    const reworkWarnings = computeReworkWarnings(reworkRowsForUnit);
    const openDesoudes = computeOpenDesoudes(reworkRowsForUnit);
    const openPointes = reworkWarnings.pointed;
    const hdArticles=reworkRowsForUnit.filter(r=>{
      const dc=dcCheck(r.dc,r.createdDT);
      return !r.deleted&&["S","P","M"].includes(r.action1)&&dc?.max!==undefined&&!dc.ok;
    });
    const actionName=code=>ACTION_LABELS?.[code]||code||"action";
    const warningEntries=[
      ...hdArticles.map(row=>({row,tone:"red",problem:`Date code ${row.dc||"-"} hors validité à la date de l’opération`})),
      ...openPointes.map(item=>({row:item.row,tone:"red",repere:item.repere,problem:`Composant pointé${item.row.valeur?` (valeur ${item.row.valeur})`:""} : un soudage final est requis`})),
      ...openDesoudes.map(row=>({row,tone:"yellow",problem:`Composant dessoudé${row.valeur?` (valeur ${row.valeur})`:""} : aucun soudage ultérieur enregistré`})),
      ...reworkWarnings.sequence.map(item=>({row:item.row,tone:"red",repere:item.repere,problem:`Deux actions ${actionName(item.row.action1)} consécutives : une alternance soudage / dessoudage est attendue`})),
      ...reworkWarnings.mismatch.map(item=>({row:item.current,tone:"red",repere:item.repere,problem:`Valeur incohérente : ${actionName(item.previous.action1)} ${item.previous.valeur||"-"}, puis ${actionName(item.current.action1)} ${item.current.valeur||"-"}`})),
      ...reworkWarnings.first.map(item=>({row:item.d,tone:"red",repere:item.repere,problem:"L’historique commence par un dessoudage sans soudage initial enregistré"})),
    ];
    const warningSeen=new Set();
    const warningRows=warningEntries
      .map(entry=>({repere:String(entry.repere||entry.row?.repere||"N/A").trim()||"N/A",problem:entry.problem,operator:entry.row?.createdVisa||"N/A",date:entry.row?.createdDT||"N/A",tone:entry.tone}))
      .filter(item=>{const key=[item.repere,item.problem,item.operator,item.date].join("|");if(warningSeen.has(key)) return false;warningSeen.add(key);return true;})
      .sort((a,b)=>a.repere.localeCompare(b.repere,undefined,{numeric:true})||a.problem.localeCompare(b.problem))
      .map(item=>({cells:[item.repere,item.problem,item.operator,item.date],cellStyles:{0:{bold:true}}}));

    const pdfValue=value=>String(value??"").trim()?value:"N/A";
    const rework=(ofData?.rework?.rows||[])
      .filter(inUnit)
      .map(r=>{
        const quantity=String(r.qty||r.qte||"").trim();
        const repere=quantity&&Number(quantity)!==1?`${quantity}x ${pdfValue(r.repere)}`:pdfValue(r.repere);
        const controlRequired=["S","R"].includes(r.action1);
        const controlVisa=r.visaCtrl|| (controlRequired?"Contrôle à faire":"N/A");
        const missingTrace=!r.deleted?missingReworkTrace(r,true):[];
        const tracePdfValue=(value,field)=>String(value||"").trim()?value:missingTrace.includes(field)?"MANQUANT":"N/A";
        const lotPdf=r.action1==="O"?"N/A":tracePdfValue(r.lot,"LOT");
        const dcPdf=r.action1==="O"?"N/A":tracePdfValue(r.dc,"DC");
        const base=rowPdf([repere,r.action1==="O"?"N/A":r.isAdjust?"Oui":"Non",pdfValue(r.action1),r.action1==="O"?"N/A":pdfValue(r.codeERP),r.action1==="O"?"N/A":pdfValue(r.valeur),lotPdf,dcPdf,r.action1==="O"?"N/A":pdfValue(r.sn),pdfValue(r.fiche),pdfValue(r.etape),pdfValue(r.createdVisa),pdfValue(r.createdDT),controlVisa,pdfValue(r.dateCtrl)],r);
        const remark=String(r.remarques||"").trim()
          ? [{text:`${r.action1==="O"?"Observation":"Remarque"} : ${r.remarques}`,maxLines:18,bold:true,fill:"0.94 0.96 0.99",color:color.ink,stroke:color.blue}]
          : [];
        return {...base,comments:[...remark,...base.comments],
        cellStyles:{
          ...(hdArticles.some(hd=>hd.id===r.id)?{6:{color:color.red,bold:true}}:{}),
          ...(!r.deleted&&r.action1!=="O"&&!missingTrace.includes("LOT")&&lotPdf==="N/A"
            ? {5:{fill:"1.00 0.96 0.84",color:color.warn,bold:true}}
            : !r.deleted&&missingTrace.includes("LOT")
              ? {5:{fill:"0.99 0.91 0.91",color:color.red,bold:true}}
              : {}),
          ...(!r.deleted&&r.action1!=="O"&&!missingTrace.includes("DC")&&dcPdf==="N/A"
            ? {6:{fill:"1.00 0.96 0.84",color:color.warn,bold:true}}
            : !r.deleted&&missingTrace.includes("DC")
              ? {6:{fill:"0.99 0.91 0.91",color:color.red,bold:true}}
              : {}),
          ...(controlRequired&&!r.visaCtrl?{12:{fill:"0.99 0.91 0.91",color:color.red,bold:true}}:{})
        }};
      });
    if(includeSection("Adjust / Rework")&&(!skipEmptyReports||rework.length||warningRows.length)){
      const title="Adjust / Rework";
      const displayTitle=unit&&unit.id!=="of-global" ? `${unitLabel(unit)} - ${title}` : title;
      page=newPage();
      headerBlock(displayTitle,unit,displayTitle);
      if(warningRows.length){
        text("Points à vérifier",M,page.y-1,7.2,true,color.red);
        page.y-=10;
        table(["Repère TOPO","Problème","Opérateur","Date / heure"],warningRows,[19,70,18,27],displayTitle,unit);
        page.y-=8;
      }
      table(["Repère TOPO","ADJ","Act.","Code article","Valeur - description","LOT","Date code","SN composant","Fiche suiveuse / fait","N° OP","VISA","Date","CTRL","CTRL le"],rework.length?rework:[["N/A"]],[22,9,9,27,55,19,17,17,39,11,15,24,36,24],displayTitle,unit);
    }

    const cons=(ofData?.consommables?.ops||[])
      .filter(inUnit)
      .flatMap(op=>(op.items||[{}]).filter(it=>includeDeleted||!it?.deleted).map(it=>{
        const conso=consoById[it.consoId]||{};
        const code=compactArticleCode(conso.sap||conso.code||it.consoId);
        const desc=consoDescriptionForCsv(conso,it.consoId);
        const status=dpStatus(it.dp,it.createdDT||op.createdDT);
        const polymerization=polymerizationStatus(conso,it.createdDT||op.createdDT);
        const polymerizationTrace=polymerization
          ? `Polymérisation ${polymerization.hours} h - sous vide dès le ${formatAvailabilityDT(polymerization.readyAt)}`
          : "";
        const invalid=!!it.dp&&!isValidDMY(it.dp);
        const row=rowPdfWithComments([
          it.createdDT||op.createdDT,
          it.createdVisa||op.createdVisa,
          op.fiche,
          op.op,
          code,
          desc,
          it.echantillon||"",
          it.lot,
          `${it.dp||""}${invalid?" - DATE INVALIDE":status&&status.label!=="OK"?` - ${status.label}`:""}`
        ],it,commentsForPdf(op),[trace(op),polymerizationTrace].filter(Boolean).join(" | "));
        return {...row,cellStyles:{
          ...(invalid||status?.label==="PÉRIMÉ"?{8:{fill:"0.99 0.91 0.91",color:color.red,bold:true}}:{}),
          ...(status?.label==="BIENTÔT"?{8:{fill:"0.99 0.96 0.84",bold:true}}:{})
        }};
      }));
    section("Consommables",["Date","Visa","Fiche suiveuse","OP","Code article","Description","N ech.","LOT","DP"],cons,[23,12,26,11,34,88,22,30,20],unit);

    const testEquipRows=(ofData?.testequip?.rows||[])
      .filter(inUnit)
      .sort((a,b)=>(isFourEquip(b)?1:0)-(isFourEquip(a)?1:0))
      .map(r=>{
        const status=calibStatus(r.dateExpiration);
        const row=rowPdf([r.createdDT,r.createdVisa,isFourEquip(r)?"FOUR":"-",r.nInv,r.type,r.designation,r.dateExpiration,r.checkDate],r);
        return {...row,cellStyles:{
          ...(status?.label==="HORS CALIBRATION"?{6:{fill:"0.99 0.91 0.91",color:color.red,bold:true}}:{}),
          ...(status?.label==="EXPIRE BIENTÔT"?{6:{fill:"0.99 0.96 0.84",color:color.warn,bold:true}}:{})
        }};
      });
    section("Test Equip.",["Date","Visa","Four","N INV","Type","Designation","Date calib","Ctrl"],testEquipRows,[23,13,18,30,26,79,25,24],unit);

    section("Suivi technique",["Date","Visa","Type","Numero","Date ouv.","Description"],(ofData?.faits?.rows||[]).filter(inUnit).map(r=>rowPdfWithComments([r.createdDT,r.createdVisa,r.type,r.numero,r.date,r.commentaires],r,commentsForPdf(r))),[25,15,20,36,28,145],unit);

    section("Etuvages",["Date","Visa","Four","Durée [h]","Température [°C]","Entrée","Visa E","Sortie","Visa S"],(ofData?.etuvage?.rows||[]).filter(inUnit).map(r=>rowPdf([r.createdDT,r.createdVisa,r.fourN,r.duree,r.temp,r.entreeDT,r.entreeVisa,r.sortieDT,r.sortieVisa],r)),[23,13,26,16,16,36,14,36,14],unit);

    const demConnectors=(ofData?.demating?.connectors||[]).filter(c=>!c.deleted&&inUnit(c))
      .sort((a,b)=>connectorSortKey(a.nConect).localeCompare(connectorSortKey(b.nConect)));
    const demRows=demConnectors.flatMap(c=>{
      const events=(c.events||[]).filter(e=>!e.deleted&&e.action);
      const last=events.slice(-1)[0]||{};
      const cycles=buildMatingCycles(c);
      const state=last.action==="Mating" ? "Matte" : last.action==="Demating" ? "Dematte" : "-";
      const lastText=last.action ? `${last.action} ${last.dt||"-"} ${last.visa||"-"}` : "Aucune action";
      const tone=connectorStateTone(last.action);
      const group={fullText:`${c.nConect||"Connecteur ?"} - Etat actuel : ${state} - Derniere action : ${lastText} - ${cycles.length} cycle${cycles.length>1?"s":""}`,fill:tone.fill,stroke:tone.stroke,color:tone.text};
      if(!cycles.length) return [group,rowPdf([c.nConect||"-","0","-","-","-","-"],c)];
      const sortedCycles=cycles
        .map((cy,i)=>({cy,n:i+1}))
        .sort((a,b)=>String(cycleLastDt(b.cy)).localeCompare(String(cycleLastDt(a.cy))) || b.n-a.n);
      return [group,...sortedCycles.map(({cy,n})=>rowPdf([
        c.nConect||"-",
        String(n),
        cy.mat?.dt||"-",
        cy.mat?.visa||"-",
        cy.dem?.dt||"-",
        cy.dem?.visa||"-"
      ],c))];
    });
    section("Mating / Demating",["Connecteur","Cycle","Mating date","Visa M","Demating date","Visa D"],demRows,[22,14,44,18,44,18],unit);

  });

  const printablePages=pages.filter(p=>p.ops.length);
  if(!printablePages.length) throw new Error("Aucun rapport non vide pour les SN sélectionnés.");
  const sectionCounts={};
  printablePages.forEach(p=>{
    const key=p.section||p.context||"Rapport";
    sectionCounts[key]=(sectionCounts[key]||0)+1;
  });
  const sectionSeen={};
  const objects=["<< /Type /Catalog /Pages 2 0 R >>"];
  const pageKids=[];
  const font1=3, font2=4;
  objects.push("<< /Type /Pages /Kids [] /Count 0 >>");
  objects.push("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>");
  objects.push("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>");
  const logoObjId=logoImage ? objects.length+1 : null;
  if(logoImage){
    objects.push(`<< /Type /XObject /Subtype /Image /Width ${logoImage.width} /Height ${logoImage.height} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter [/ASCIIHexDecode /DCTDecode] /Length ${logoImage.data.length+1} >>\nstream\n${logoImage.data}>\nendstream`);
  }
  printablePages.forEach((p,i)=>{
    const sectionKey=p.section||p.context||"Rapport";
    sectionSeen[sectionKey]=(sectionSeen[sectionKey]||0)+1;
    const footerY=14;
    const actionLegend="Actions : S = Soudé | D = Dessoudé | P = Pointé | M = Matière | R = Rework | O = Observation";
    const showActionLegend=String(p.section||p.context||"").includes("Adjust / Rework");
    const pageText=`Page ${sectionSeen[sectionKey]} / ${sectionCounts[sectionKey]}`;
    p.ops.push(`q ${setStroke(color.blue)} .55 w ${M.toFixed(2)} 28 m ${(W-M).toFixed(2)} 28 l S Q`);
    if(showActionLegend) p.ops.push(`BT /F1 5.8 Tf ${setFill(color.muted)} 1 0 0 1 ${M.toFixed(2)} ${footerY} Tm (${pdfEsc(actionLegend)}) Tj ET`);
    p.ops.push(`BT /F1 5.8 Tf ${setFill(color.muted)} 1 0 0 1 ${((W-textW(PDF_CONFIDENTIALITY,5.8))/2).toFixed(2)} ${footerY} Tm (${pdfEsc(PDF_CONFIDENTIALITY)}) Tj ET`);
    p.ops.push(`BT /F2 7 Tf ${setFill(color.muted)} 1 0 0 1 ${(W-M-textW(pageText,7,true)).toFixed(2)} ${footerY} Tm (${pdfEsc(pageText)}) Tj ET`);
    const stream=p.ops.join("\n");
    const contentId=objects.length+2;
    const pageId=objects.length+1;
    pageKids.push(`${pageId} 0 R`);
    const xobj=logoObjId ? `/XObject << /Logo ${logoObjId} 0 R >> ` : "";
    objects.push(`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${W} ${H}] /Resources << /Font << /F1 ${font1} 0 R /F2 ${font2} 0 R >> ${xobj}>> /Contents ${contentId} 0 R >>`);
    objects.push(`<< /Length ${stream.length} >>\nstream\n${stream}\nendstream`);
  });
  objects[1]=`<< /Type /Pages /Kids [${pageKids.join(" ")}] /Count ${printablePages.length} >>`;
  let pdf="%PDF-1.4\n";
  const offsets=[0];
  objects.forEach((obj,i)=>{offsets[i+1]=pdf.length; pdf+=`${i+1} 0 obj\n${obj}\nendobj\n`;});
  const xref=pdf.length;
  pdf+=`xref\n0 ${objects.length+1}\n0000000000 65535 f \n`;
  for(let i=1;i<=objects.length;i++) pdf+=String(offsets[i]).padStart(10,"0")+" 00000 n \n";
  pdf+=`trailer\n<< /Size ${objects.length+1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF`;
  return new Blob([pdf],{type:"application/pdf"});
};

const loadPdfLogoImage = src => new Promise(resolve=>{
  const raw=String(src||"").trim();
  if(!raw){ resolve(null); return; }
  const url=raw.replace(/\\/g,"/");
  if(/^[a-zA-Z]:\//.test(url)){ resolve(null); return; }
  const img=new Image();
  img.crossOrigin="anonymous";
  img.onload=()=>{
    try{
      const canvas=document.createElement("canvas");
      canvas.width=img.naturalWidth||img.width;
      canvas.height=img.naturalHeight||img.height;
      const ctx=canvas.getContext("2d");
      ctx.fillStyle="#ffffff";
      ctx.fillRect(0,0,canvas.width,canvas.height);
      ctx.drawImage(img,0,0);
      const dataUrl=canvas.toDataURL("image/jpeg",0.92);
      const b64=dataUrl.split(",")[1]||"";
      const bin=atob(b64);
      let hex="";
      for(let i=0;i<bin.length;i++) hex+=bin.charCodeAt(i).toString(16).padStart(2,"0");
      resolve({width:canvas.width,height:canvas.height,data:hex});
    }catch{
      resolve(null);
    }
  };
  img.onerror=()=>resolve(null);
  img.src=url;
});

const mergeGeneratedPdfBlobs = async blobs => {
  const sources=await Promise.all(blobs.map(blob=>blob.text()));
  const merged=[];
  const pageIds=[];
  let nextId=3;
  sources.forEach(source=>{
    const parsed=[...source.matchAll(/(?:^|\n)(\d+) 0 obj\n([\s\S]*?)\nendobj/g)].map(match=>({oldId:Number(match[1]),body:match[2]}));
    const idMap=new Map([[1,1],[2,2]]);
    parsed.filter(object=>object.oldId>2).forEach(object=>idMap.set(object.oldId,nextId++));
    parsed.filter(object=>object.oldId>2).forEach(object=>{
      const id=idMap.get(object.oldId);
      const body=object.body.replace(/(\d+) 0 R/g,(_,raw)=>`${idMap.get(Number(raw))||raw} 0 R`);
      merged.push({id,body});
      if(/\/Type \/Page\b/.test(body)) pageIds.push(id);
    });
  });
  if(!pageIds.length) throw new Error("Aucune page à imprimer.");
  const objects=[
    {id:1,body:"<< /Type /Catalog /Pages 2 0 R >>"},
    {id:2,body:`<< /Type /Pages /Kids [${pageIds.map(id=>`${id} 0 R`).join(" ")}] /Count ${pageIds.length} >>`},
    ...merged
  ].sort((a,b)=>a.id-b.id);
  let pdf="%PDF-1.4\n";
  const offsets=[0];
  objects.forEach(object=>{offsets[object.id]=pdf.length;pdf+=`${object.id} 0 obj\n${object.body}\nendobj\n`;});
  const xref=pdf.length;
  pdf+=`xref\n0 ${objects.length+1}\n0000000000 65535 f \n`;
  for(let id=1;id<=objects.length;id++) pdf+=String(offsets[id]||0).padStart(10,"0")+" 00000 n \n";
  pdf+=`trailer\n<< /Size ${objects.length+1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF`;
  return new Blob([pdf],{type:"application/pdf"});
};

const downloadBrowserBlob = (blob,name) => {
  const url=URL.createObjectURL(blob);
  const link=document.createElement("a");
  link.href=url;
  link.download=name;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(()=>URL.revokeObjectURL(url),1000);
};

// ─── Modale d'annulation de ligne (soft-delete) ───────────────────────────
const DeleteModal = ({onConfirm, onCancel, godMode=false}) => {
  const [reason, setReason] = useState("");
  useEffect(()=>{if(godMode) onConfirm("");},[godMode]);
  if(godMode) return null;
  return (
    <div style={{position:"fixed",inset:0,background:"#000000cc",zIndex:300,
      display:"flex",alignItems:"center",justifyContent:"center",padding:24}}>
      <div style={{background:C.surface,border:`2px solid ${C.red}`,borderRadius:10,
        padding:24,width:460,maxWidth:"100%"}}>
        <div style={{fontWeight:700,color:C.red,fontSize:15,marginBottom:6}}>
          ✕ Annuler cette ligne
        </div>
        <div style={{color:C.muted,fontSize:12,marginBottom:16,lineHeight:1.6}}>
          La ligne sera <strong style={{color:C.text}}>barrée et conservée</strong> dans l'historique.
          L'annulation est tracée (visa + date) et réversible.
        </div>
        <div style={{marginBottom:18}}>
          <div style={{color:C.muted,fontSize:10,textTransform:"uppercase",
            letterSpacing:.8,marginBottom:6}}>Motif de l'annulation *</div>
          <Input value={reason} onChange={setReason}/>
        </div>
        <div style={{display:"flex",gap:10,justifyContent:"flex-end"}}>
          <Btn onClick={onCancel} color={C.border}>Annuler</Btn>
          <Btn onClick={()=>reason.trim()&&onConfirm(reason.trim())} color={C.red}
            disabled={!reason.trim()}>✕ Confirmer</Btn>
        </div>
      </div>
    </div>
  );
};

const LabelOptionsModal = ({snRows,defaultSelectedIds=null,ofData,consommables,onCancel,onConfirm}) => {
  const [types,setTypes]=useState(["binder"]);
  const [orientation,setOrientation]=useState("landscape");
  const [selected,setSelected]=useState(()=>defaultSelectedIds?.length?defaultSelectedIds:snRows.map(unit=>unit.id));
  const toggle=id=>setSelected(current=>current.includes(id)?current.filter(value=>value!==id):[...current,id]);
  const availability=id=>operationalLabelAvailability({type:id,ofData,selectedUnitIds:selected,consommables});
  const availableForUnit=(type,unit)=>operationalLabelTypeAvailable({type,ofData,selectedUnitIds:[unit.id],consommables});
  const available=id=>availability(id).available;
  const toggleType=id=>available(id)&&setTypes(current=>current.includes(id)?current.filter(value=>value!==id):[...current,id]);
  useEffect(()=>setTypes(current=>current.filter(available)),[selected.join("|"),ofData,consommables]);
  const canGenerate=types.length>0&&(!snRows.length||selected.length>0);
  return <div style={{position:"fixed",inset:0,background:"#000000cc",zIndex:320,display:"flex",alignItems:"center",justifyContent:"center",padding:24}}>
    <div role="dialog" aria-modal="true" aria-labelledby="label-options-title" style={{background:C.surface,border:`2px solid ${C.blue}`,borderRadius:8,padding:20,width:560,maxWidth:"100%",maxHeight:"90vh",overflowY:"auto",boxShadow:"0 12px 40px #0008"}}>
      <h2 id="label-options-title" style={{margin:"0 0 14px",fontSize:16,color:C.blue}}>Imprimer des étiquettes</h2>
      <fieldset style={{border:`1px solid ${C.border}`,borderRadius:4,padding:10,margin:"0 0 12px"}}>
        <legend style={{color:C.text,fontSize:12,fontWeight:700}}>Orientation</legend>
        <div style={{display:"grid",gridTemplateColumns:"repeat(2,minmax(0,1fr))",gap:8}}>
          {[
            {id:"landscape",label:"Paysage",detail:"76 × 50,8 mm"},
            {id:"portrait",label:"Portrait",detail:"50,8 × 76 mm · dos classeur"},
          ].map(option=><label key={option.id} style={{display:"flex",alignItems:"center",gap:7,padding:"8px 9px",border:`1px solid ${orientation===option.id?C.blue:C.border}`,borderRadius:4,color:C.text,fontSize:12,cursor:"pointer",background:orientation===option.id?C.blue+"12":"transparent"}}>
            <input type="radio" name="label-orientation" aria-label={option.label} value={option.id} checked={orientation===option.id} onChange={()=>setOrientation(option.id)} style={{accentColor:C.blue}}/>
            <span><strong>{option.label}</strong><br/><span style={{fontSize:10,color:C.muted}}>{option.detail}</span></span>
          </label>)}
        </div>
      </fieldset>
      <fieldset style={{border:`1px solid ${C.border}`,borderRadius:4,padding:10,margin:"0 0 14px"}}>
        <legend style={{color:C.text,fontSize:12,fontWeight:700}}>Type d'étiquette</legend>
        <div style={{display:"grid",gridTemplateColumns:"repeat(2,minmax(0,1fr))",gap:8}}>
          {OPERATIONAL_LABEL_TYPES.map(item=>{const status=availability(item.id);const enabled=status.available;const isConditional=["bonding","facts"].includes(item.id);return <label key={item.id} title={enabled?"":item.id==="bonding"?"Aucun collage ou coating disponible pour la sélection":"Aucun suivi technique disponible pour la sélection"} style={{display:"flex",alignItems:"center",gap:7,padding:"8px 9px",border:`1px solid ${types.includes(item.id)?C.blue:C.border}`,borderRadius:4,color:enabled?C.text:C.muted,fontSize:12,cursor:enabled?"pointer":"not-allowed",background:types.includes(item.id)?C.blue+"12":"transparent",opacity:enabled?1:.45}}>
            <input type="checkbox" aria-label={item.label} checked={types.includes(item.id)} disabled={!enabled} onChange={()=>toggleType(item.id)} style={{accentColor:C.blue}}/>
            <span>{item.label}</span>
            {isConditional&&status.total>0&&<span style={{marginLeft:"auto",fontSize:10,color:status.count===status.total?C.green:C.orange,fontWeight:700,whiteSpace:"nowrap"}}>{status.count} sur {status.total} disponible{status.count>1?"s":""}</span>}
          </label>})}
        </div>
      </fieldset>
      {snRows.length>0&&<>
        <div style={{display:"flex",gap:8,marginBottom:8}}>
          <Btn small color={C.border} onClick={()=>setSelected(snRows.map(unit=>unit.id))}>Tout cocher</Btn>
          <Btn small color={C.border} onClick={()=>setSelected([])}>Tout décocher</Btn>
        </div>
        <div style={{maxHeight:250,overflowY:"auto",border:`1px solid ${C.border}`,borderRadius:4,padding:6,marginBottom:14}}>
          <div style={{display:"grid",gridTemplateColumns:"22px minmax(90px,1fr) 105px 105px",gap:6,padding:"2px 4px 6px",color:C.muted,fontSize:9,fontWeight:800,textTransform:"uppercase"}}>
            <span/><span>SN / LOT</span><span>Collage</span><span>Suivi tech.</span>
          </div>
          {snRows.map(unit=>{
            const bonding=availableForUnit("bonding",unit);
            const facts=availableForUnit("facts",unit);
            const status=(type,label,isAvailable)=>{
              const requested=types.includes(type);
              const color=isAvailable?C.green:requested?C.yellow:C.muted;
              return <span aria-label={`Disponibilité ${label} pour ${snTitle(unit)}`} title={isAvailable?`${label} disponible`:`${label} non disponible`}
                style={{display:"inline-flex",alignItems:"center",justifyContent:"center",gap:4,minWidth:0,padding:"2px 5px",border:`1px solid ${color}`,borderRadius:3,color,fontSize:9,fontWeight:800,whiteSpace:"nowrap"}}>
                <span>{isAvailable?"✓":"—"}</span><span>{label==="Collage / coating"?"Collage":"Suivi"}</span>
              </span>;
            };
            return <label key={unit.id} style={{display:"grid",gridTemplateColumns:"22px minmax(90px,1fr) 105px 105px",alignItems:"center",gap:6,padding:"6px 4px",borderBottom:`1px solid ${C.border}55`,fontFamily:"monospace",fontSize:12,color:C.text,cursor:"pointer"}}>
              <input type="checkbox" aria-label={snTitle(unit)} checked={selected.includes(unit.id)} onChange={()=>toggle(unit.id)} style={{accentColor:C.blue}}/>
              <strong style={{overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}} title={snTitle(unit)}>{snTitle(unit)}</strong>
              {status("bonding","Collage / coating",bonding)}
              {status("facts","Info suivi technique",facts)}
            </label>;
          })}
        </div>
      </>}
      <div style={{display:"flex",justifyContent:"flex-end",gap:8}}>
        <Btn onClick={onCancel} color={C.border} small>Annuler</Btn>
        <Btn disabled={!canGenerate} onClick={()=>canGenerate&&onConfirm({types,selectedSnIds:selected,orientation})} color={canGenerate?C.green:C.border} small>Générer</Btn>
      </div>
    </div>
  </div>;
};

const BulkLabelOptionsModal = ({entries,consommables,onCancel,onConfirm}) => {
  const [types,setTypes]=useState(["kitting"]);
  const [orientation,setOrientation]=useState("landscape");
  const availability=id=>(entries||[]).reduce((result,entry)=>{
    const status=operationalLabelAvailability({type:id,ofData:entry.ofData,selectedUnitIds:entry.selectedUnitIds,consommables});
    result.count+=status.count;
    result.total+=status.total;
    return result;
  },{count:0,total:0});
  const available=id=>availability(id).count>0;
  const toggleType=id=>available(id)&&setTypes(current=>current.includes(id)?current.filter(value=>value!==id):[...current,id]);
  useEffect(()=>setTypes(current=>current.filter(available)),[entries,consommables]);
  const unitCount=(entries||[]).reduce((total,entry)=>total+operationalLabelUnits(entry.ofData,entry.selectedUnitIds).length,0);
  return <div style={{position:"fixed",inset:0,background:"#000000cc",zIndex:320,display:"flex",alignItems:"center",justifyContent:"center",padding:24}}>
    <div role="dialog" aria-modal="true" aria-labelledby="bulk-label-options-title" style={{background:C.surface,border:`2px solid ${C.blue}`,borderRadius:8,padding:20,width:560,maxWidth:"100%",maxHeight:"90vh",overflowY:"auto",boxShadow:"0 12px 40px #0008"}}>
      <h2 id="bulk-label-options-title" style={{margin:"0 0 6px",fontSize:16,color:C.blue}}>Imprimer des étiquettes</h2>
      <div style={{color:C.muted,fontSize:12,marginBottom:14}}>{entries.length} dossier{entries.length>1?"s":""} · {unitCount} SN/lot{unitCount>1?"s":""}</div>
      <fieldset style={{border:`1px solid ${C.border}`,borderRadius:4,padding:10,margin:"0 0 12px"}}>
        <legend style={{color:C.text,fontSize:12,fontWeight:700}}>Orientation</legend>
        <div style={{display:"grid",gridTemplateColumns:"repeat(2,minmax(0,1fr))",gap:8}}>
          {[
            {id:"landscape",label:"Paysage",detail:"76 × 50,8 mm"},
            {id:"portrait",label:"Portrait",detail:"50,8 × 76 mm · dos classeur"},
          ].map(option=><label key={option.id} style={{display:"flex",alignItems:"center",gap:7,padding:"8px 9px",border:`1px solid ${orientation===option.id?C.blue:C.border}`,borderRadius:4,color:C.text,fontSize:12,cursor:"pointer",background:orientation===option.id?C.blue+"12":"transparent"}}>
            <input type="radio" name="bulk-label-orientation" aria-label={option.label} value={option.id} checked={orientation===option.id} onChange={()=>setOrientation(option.id)} style={{accentColor:C.blue}}/>
            <span><strong>{option.label}</strong><br/><span style={{fontSize:10,color:C.muted}}>{option.detail}</span></span>
          </label>)}
        </div>
      </fieldset>
      <fieldset style={{border:`1px solid ${C.border}`,borderRadius:4,padding:10,margin:"0 0 14px"}}>
        <legend style={{color:C.text,fontSize:12,fontWeight:700}}>Type d'étiquette</legend>
        <div style={{display:"grid",gridTemplateColumns:"repeat(2,minmax(0,1fr))",gap:8}}>
          {OPERATIONAL_LABEL_TYPES.map(item=>{const status=availability(item.id);const enabled=status.count>0;const isConditional=["bonding","facts"].includes(item.id);return <label key={item.id} title={enabled?"":item.id==="bonding"?"Aucun collage ou coating disponible pour la sélection":"Aucun suivi technique disponible pour la sélection"} style={{display:"flex",alignItems:"center",gap:7,padding:"8px 9px",border:`1px solid ${types.includes(item.id)?C.blue:C.border}`,borderRadius:4,color:enabled?C.text:C.muted,fontSize:12,cursor:enabled?"pointer":"not-allowed",background:types.includes(item.id)?C.blue+"12":"transparent",opacity:enabled?1:.45}}>
            <input type="checkbox" aria-label={item.label} checked={types.includes(item.id)} disabled={!enabled} onChange={()=>toggleType(item.id)} style={{accentColor:C.blue}}/>
            <span>{item.label}</span>
            {isConditional&&status.total>0&&<span style={{marginLeft:"auto",fontSize:10,color:status.count===status.total?C.green:C.orange,fontWeight:700,whiteSpace:"nowrap"}}>{status.count} sur {status.total} disponible{status.count>1?"s":""}</span>}
          </label>})}
        </div>
      </fieldset>
      <div style={{display:"flex",justifyContent:"flex-end",gap:8}}>
        <Btn onClick={onCancel} color={C.border} small>Annuler</Btn>
        <Btn disabled={!types.length} onClick={()=>types.length&&onConfirm({types,orientation})} color={types.length?C.green:C.border} small>Générer</Btn>
      </div>
    </div>
  </div>;
};

const PdfOptionsModal = ({snRows, defaultSelectedIds=null, includeHistoryDefault=false, onCancel, onConfirm}) => {
  const [includeHistory,setIncludeHistory] = useState(includeHistoryDefault);
  const [includeDeleted,setIncludeDeleted] = useState(true);
  const [skipEmptyReports,setSkipEmptyReports] = useState(true);
  const [includePdf,setIncludePdf] = useState(true);
  const [includeExcel,setIncludeExcel] = useState(false);
  const [selectedSections,setSelectedSections]=useState(()=>REPORT_SECTIONS.map(s=>s.id));
  const [selected,setSelected] = useState(()=>defaultSelectedIds?.length ? defaultSelectedIds : snRows.map(u=>u.id));
  const toggle=id=>setSelected(prev=>prev.includes(id)?prev.filter(x=>x!==id):[...prev,id]);
  const selectAll=()=>setSelected(snRows.map(u=>u.id));
  const selectNone=()=>setSelected([]);
  const canGenerate=(!snRows.length || selected.length>0) && (includePdf||includeExcel) && (!includePdf||selectedSections.length>0);
  return (
    <div style={{position:"fixed",inset:0,background:"#000000cc",zIndex:320,
      display:"flex",alignItems:"center",justifyContent:"center",padding:24}}>
      <div style={{background:C.surface,border:`2px solid ${C.blue}`,borderRadius:10,
        padding:20,width:520,maxWidth:"100%",maxHeight:"90vh",overflowY:"auto",boxShadow:"0 12px 40px #0008"}}>
        <div style={{fontWeight:800,color:C.blue,fontSize:15,marginBottom:6,textTransform:"uppercase"}}>
          Export rapport
        </div>
        <div style={{color:C.muted,fontSize:12,marginBottom:14,lineHeight:1.5}}>
          Export rapport de production
        </div>
        <div style={{display:"flex",gap:14,marginBottom:14,flexWrap:"wrap"}}>
          <label style={{display:"flex",alignItems:"center",gap:8,color:C.text,fontSize:12,cursor:"pointer"}}>
            <input type="checkbox" checked={includePdf} onChange={e=>setIncludePdf(e.target.checked)}
              style={{accentColor:C.blue}}/>
            PDF
          </label>
          <label style={{display:"flex",alignItems:"center",gap:8,color:C.text,fontSize:12,cursor:"pointer"}}>
            <input type="checkbox" checked={includeExcel} onChange={e=>setIncludeExcel(e.target.checked)}
              style={{accentColor:C.blue}}/>
            Excel SAP (IB52 + CO02)
          </label>
        </div>
        {includePdf&&<fieldset style={{border:`1px solid ${C.border}`,borderRadius:4,padding:10,margin:"0 0 14px"}}>
          <legend style={{color:C.text,fontSize:12,fontWeight:700}}>Pages du PDF</legend>
          <div style={{display:"flex",gap:8,marginBottom:8}}>
            <Btn small color={C.border} onClick={()=>setSelectedSections(REPORT_SECTIONS.map(s=>s.id))}>Tout cocher</Btn>
            <Btn small color={C.border} onClick={()=>setSelectedSections([])}>Tout décocher</Btn>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
            {REPORT_SECTIONS.map(s=><label key={s.id} style={{display:"flex",alignItems:"center",gap:6,color:C.text,fontSize:12,cursor:"pointer"}}>
              <input type="checkbox" checked={selectedSections.includes(s.id)} onChange={()=>setSelectedSections(prev=>prev.includes(s.id)?prev.filter(id=>id!==s.id):[...prev,s.id])}/>{s.label}
            </label>)}
          </div>
        </fieldset>}
        {snRows.length>0 ? (
          <>
            <div style={{display:"flex",gap:8,marginBottom:10}}>
              <Btn onClick={selectAll} color={C.blue} small>Tout cocher</Btn>
              <Btn onClick={selectNone} color={C.border} small>Tout decocher</Btn>
            </div>
            <div style={{maxHeight:220,overflow:"auto",border:`1px solid ${C.border}`,borderRadius:6,
              padding:8,marginBottom:12}}>
              {snRows.map(u=>(
                <label key={u.id} style={{display:"flex",alignItems:"center",gap:8,padding:"5px 4px",
                  borderBottom:`1px solid ${C.border}55`,cursor:"pointer",fontFamily:"monospace",fontSize:12}}>
                  <input type="checkbox" checked={selected.includes(u.id)} onChange={()=>toggle(u.id)}
                    style={{accentColor:C.blue}}/>
                  <span style={{color:C.text}}>{snTitle(u)}</span>
                </label>
              ))}
            </div>
          </>
        ) : (
          <div style={{border:`1px solid ${C.border}`,borderRadius:6,padding:10,color:C.muted,marginBottom:12}}>
            Aucun SN dans la table SN : le rapport exportera les lignes globales de l'OF.
          </div>
        )}
        <label style={{display:"flex",alignItems:"center",gap:8,color:C.text,fontSize:12,marginBottom:16,cursor:"pointer"}}>
          <input type="checkbox" checked={includeHistory} onChange={e=>setIncludeHistory(e.target.checked)}
            style={{accentColor:C.blue}}/>
          Inclure les historiques de modification des lignes
        </label>
        <label style={{display:"flex",alignItems:"center",gap:8,color:C.text,fontSize:12,marginBottom:16,cursor:"pointer"}}>
          <input type="checkbox" checked={includeDeleted} onChange={e=>setIncludeDeleted(e.target.checked)}
            style={{accentColor:C.blue}}/>
          Inclure les lignes annulées barrées
        </label>
        <label style={{display:"flex",alignItems:"center",gap:8,color:C.text,fontSize:12,marginBottom:16,cursor:"pointer"}}>
          <input type="checkbox" checked={skipEmptyReports} onChange={e=>setSkipEmptyReports(e.target.checked)} style={{accentColor:C.blue}}/>
          Ne pas exporter les rapports vides
        </label>
        <div style={{display:"flex",justifyContent:"flex-end",gap:8}}>
          <Btn onClick={onCancel} color={C.border} small>Annuler</Btn>
          <Btn disabled={!canGenerate} onClick={()=>canGenerate&&onConfirm({selectedSnIds:selected,selectedSections,includeHistory,includeDeleted,skipEmptyReports,includePdf,includeExcel})}
            color={canGenerate?C.green:C.border} small>Generer</Btn>
        </div>
      </div>
    </div>
  );
};

const BulkPdfOptionsModal = ({rows,onCancel,onConfirm}) => {
  const [includeHistory,setIncludeHistory]=useState(false);
  const [includeDeleted,setIncludeDeleted]=useState(true);
  const [skipEmptyReports,setSkipEmptyReports]=useState(true);
  const [includePdf,setIncludePdf]=useState(true);
  const [includeExcel,setIncludeExcel]=useState(false);
  const [selectedSections,setSelectedSections]=useState(()=>REPORT_SECTIONS.map(section=>section.id));
  const [running,setRunning]=useState(false);
  const [error,setError]=useState("");
  const ofCount=new Set(rows.map(row=>row.id)).size;
  const run=async()=>{
    setRunning(true);setError("");
    try{await onConfirm({selectedSections,includeHistory,includeDeleted,skipEmptyReports,includePdf,includeExcel});}
    catch(reason){setError(reason?.message||String(reason));setRunning(false);}
  };
  return <div style={{position:"fixed",inset:0,background:"#000000cc",zIndex:320,display:"flex",alignItems:"center",justifyContent:"center",padding:24}}>
    <div role="dialog" aria-modal="true" aria-labelledby="bulk-pdf-title" style={{background:C.surface,border:`2px solid ${C.blue}`,borderRadius:8,padding:20,width:520,maxWidth:"100%",maxHeight:"90vh",overflowY:"auto",boxShadow:"0 12px 40px #0008"}}>
      <h2 id="bulk-pdf-title" style={{margin:"0 0 6px",fontSize:16,color:C.blue}}>Impression en masse</h2>
      <div style={{color:C.muted,fontSize:12,marginBottom:14}}>{ofCount} dossier{ofCount>1?"s":""} · {rows.length} SN/lot{rows.length>1?"s":""} sélectionné{rows.length>1?"s":""}</div>
      <div style={{display:"flex",gap:16,marginBottom:14,flexWrap:"wrap"}}>
        <label style={{display:"flex",alignItems:"center",gap:8,color:C.text,fontSize:12,cursor:"pointer"}}><input type="checkbox" checked={includePdf} onChange={event=>setIncludePdf(event.target.checked)}/>PDF groupé</label>
        <label style={{display:"flex",alignItems:"center",gap:8,color:C.text,fontSize:12,cursor:"pointer"}}><input type="checkbox" checked={includeExcel} onChange={event=>setIncludeExcel(event.target.checked)}/>Excel SAP (IB52 + CO02)</label>
      </div>
      {includePdf&&<fieldset style={{border:`1px solid ${C.border}`,borderRadius:4,padding:10,margin:"0 0 14px"}}>
        <legend style={{color:C.text,fontSize:12,fontWeight:700}}>Pages du PDF groupé</legend>
        <div style={{display:"flex",gap:8,marginBottom:8}}>
          <Btn small color={C.border} onClick={()=>setSelectedSections(REPORT_SECTIONS.map(section=>section.id))}>Tout cocher</Btn>
          <Btn small color={C.border} onClick={()=>setSelectedSections([])}>Tout décocher</Btn>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
          {REPORT_SECTIONS.map(section=><label key={section.id} style={{display:"flex",alignItems:"center",gap:6,color:C.text,fontSize:12,cursor:"pointer"}}>
            <input type="checkbox" checked={selectedSections.includes(section.id)} onChange={()=>setSelectedSections(previous=>previous.includes(section.id)?previous.filter(id=>id!==section.id):[...previous,section.id])}/>{section.label}
          </label>)}
        </div>
      </fieldset>}
      {includePdf&&<>
        <label style={{display:"flex",alignItems:"center",gap:8,color:C.text,fontSize:12,marginBottom:12,cursor:"pointer"}}><input type="checkbox" checked={includeHistory} onChange={event=>setIncludeHistory(event.target.checked)}/>Inclure les historiques de modification</label>
        <label style={{display:"flex",alignItems:"center",gap:8,color:C.text,fontSize:12,marginBottom:12,cursor:"pointer"}}><input type="checkbox" checked={includeDeleted} onChange={event=>setIncludeDeleted(event.target.checked)}/>Inclure les lignes annulées barrées</label>
        <label style={{display:"flex",alignItems:"center",gap:8,color:C.text,fontSize:12,marginBottom:14,cursor:"pointer"}}><input type="checkbox" checked={skipEmptyReports} onChange={event=>setSkipEmptyReports(event.target.checked)}/>Ne pas exporter les rapports vides</label>
      </>}
      {error&&<div role="alert" style={{color:C.red,fontSize:12,marginBottom:10}}>{error}</div>}
      <div style={{display:"flex",justifyContent:"flex-end",gap:8}}>
        <Btn onClick={onCancel} disabled={running} color={C.border} small>Annuler</Btn>
        <Btn onClick={run} disabled={running||(!includePdf&&!includeExcel)||(includePdf&&!selectedSections.length)} color={C.blue} small>{running?"Génération…":"Générer les fichiers"}</Btn>
      </div>
    </div>
  </div>;
};

const RestoreModal = ({onConfirm, onCancel}) => {
  const [reason, setReason] = useState("");
  return (
    <div style={{position:"fixed",inset:0,background:"#000000cc",zIndex:300,
      display:"flex",alignItems:"center",justifyContent:"center",padding:24}}>
      <div style={{background:C.surface,border:`2px solid ${C.yellow}`,borderRadius:10,
        padding:24,width:460,maxWidth:"100%"}}>
        <div style={{fontWeight:700,color:C.yellow,fontSize:15,marginBottom:6}}>
          ↩ Réactiver cette ligne
        </div>
        <div style={{color:C.muted,fontSize:12,marginBottom:16,lineHeight:1.6}}>
          La réactivation sera tracée avec visa, date et motif.
        </div>
        <div style={{marginBottom:18}}>
          <div style={{color:C.muted,fontSize:10,textTransform:"uppercase",
            letterSpacing:.8,marginBottom:6}}>Motif de la réactivation *</div>
          <Input value={reason} onChange={setReason}/>
        </div>
        <div style={{display:"flex",gap:10,justifyContent:"flex-end"}}>
          <Btn onClick={onCancel} color={C.border}>Annuler</Btn>
          <Btn onClick={()=>reason.trim()&&onConfirm(reason.trim())} color={C.yellow}
            disabled={!reason.trim()}>↩ Confirmer</Btn>
        </div>
      </div>
    </div>
  );
};

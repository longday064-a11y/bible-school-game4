import { useMemo, useState } from "react";
import "./App.css";

const TEAMS = [
  { id: 1, name: "فريق 1", pin: "7420" },
  { id: 2, name: "فريق 2", pin: "3691" },
  { id: 3, name: "فريق 3", pin: "5827" },
  { id: 4, name: "فريق 4", pin: "9153" }
];
const PARTS = [
  ["سور الخيمة",800,"🪵"],["باب الخيمة",700,"🚪"],["مرحضة",900,"🪣"],["مذبح المحرقة",1200,"🔥"],["الأغطية",1000,"🧵"],["القدس",1400,"🏛️"],["المنارة الذهبية",1800,"🕎"],["مذبح البخور",1500,"🪔"],["مائدة خبز الوجوه",1300,"🍞"],["قدس الأقداس",2000,"✨"],["تابوت العهد",2500,"📦"],["لباس رئيس الكهنة",1700,"👑"],["مواد الخيمة",1100,"🧰"]
].map(([name,price,icon],i)=>({id:i+1,name,price,icon}));
const STATIONS=[
 ["محطة البداية",500,"🌴"],["محطة الصحراء",700,"🏜️"],["محطة الإيمان",900,"📖"],["محطة الحكمة",1100,"💡"],["محطة الفريق",1300,"🤝"],["محطة المغامرة",1500,"🧭"],["المحطة الأخيرة",2000,"🏆"]
].map(([name,reward,icon],i)=>({id:i+1,name,reward,icon}));

export default function App(){
 const [page,setPage]=useState("home");
 const [teams,setTeams]=useState(()=>TEAMS.map(t=>({...t,balance:0,engineers:0,stations:0,completedParts:0,parts:[],stationIds:[]})));
 const [selected,setSelected]=useState(""); const [pin,setPin]=useState(""); const [teamId,setTeamId]=useState(null); const [adminPin,setAdminPin]=useState(""); const [notice,setNotice]=useState("");
 const team=teams.find(t=>t.id===teamId); const progress=team?Math.round(team.completedParts/PARTS.length*100):0;
 const sorted=useMemo(()=>[...teams].sort((a,b)=>b.completedParts-a.completedParts||b.stations-a.stations||b.balance-a.balance),[teams]);
 const msg=x=>{setNotice(x);setTimeout(()=>setNotice(""),2500)};
 const update=(id,fn)=>setTeams(ts=>ts.map(t=>t.id===id?fn(t):t));
 const login=()=>{const t=teams.find(x=>x.id===+selected); if(!t||t.pin!==pin)return msg("❌ بيانات الدخول غير صحيحة");setTeamId(t.id);setPin("");setPage("team")};
 const station=s=>{if(team.stationIds.includes(s.id))return;update(team.id,t=>({...t,balance:t.balance+s.reward,stations:t.stations+1,stationIds:[...t.stationIds,s.id]}));msg(`🎉 حصلتم على ${s.reward} جنيه`)};
 const engineer=()=>{if(team.balance<500)return msg("❌ الرصيد غير كافٍ");update(team.id,t=>({...t,balance:t.balance-500,engineers:t.engineers+1}));msg("👷 تم شراء مهندس")};
 const part=p=>{if(team.parts.includes(p.id))return;if(team.balance<p.price)return msg("❌ الرصيد غير كافٍ");if(team.engineers<1)return msg("👷 تحتاجون إلى مهندس");update(team.id,t=>({...t,balance:t.balance-p.price,parts:[...t.parts,p.id],completedParts:t.completedParts+1}));msg(`🏕️ تم بناء ${p.name}`)};
 const adjust=(id,key,delta)=>update(id,t=>({...t,[key]:Math.max(0,(t[key]||0)+delta)}));
 if(page==="admin-login")return <div className="center"><h1>👑 دخول الأدمن</h1><input type="password" maxLength="4" placeholder="9999" value={adminPin} onChange={e=>setAdminPin(e.target.value)}/><button onClick={()=>adminPin==="9999"?setPage("admin"):msg("❌ الرقم غير صحيح")}>دخول</button><button onClick={()=>setPage("home")}>رجوع</button>{notice&&<p>{notice}</p>}</div>;
 if(page==="team-login")return <div className="center"><h1>🏕️ دخول الفريق</h1><select value={selected} onChange={e=>setSelected(e.target.value)}><option value="">اختر الفريق</option>{TEAMS.map(t=><option key={t.id} value={t.id}>{t.name}</option>)}</select><input type="password" inputMode="numeric" maxLength="4" placeholder="PIN" value={pin} onChange={e=>setPin(e.target.value)}/><button onClick={login}>ابدأ المغامرة</button><button onClick={()=>setPage("home")}>رجوع</button>{notice&&<p>{notice}</p>}</div>;
 if(page==="team"&&team)return <div className="app"><header><h1>🛡️ {team.name}</h1><button onClick={()=>{setTeamId(null);setPage("home")}}>تسجيل الخروج</button></header><div className="stats"><div>💰 الرصيد<br/><b>{team.balance} جنيه</b></div><div>🏕️ البناء<br/><b>{progress}%</b></div><div>👷 المهندسين<br/><b>{team.engineers}</b></div><div>🗺️ المحطات<br/><b>{team.stations}/7</b></div></div><section><h2>🗺️ المحطات</h2><div className="grid">{STATIONS.map(s=><article className={team.stationIds.includes(s.id)?"done":""} key={s.id}><h3>{s.icon} {s.name}</h3><p>المكافأة {s.reward} جنيه</p><button disabled={team.stationIds.includes(s.id)} onClick={()=>station(s)}>{team.stationIds.includes(s.id)?"✅ مكتملة":"إنجاز المحطة"}</button></article>)}</div></section><section><h2>👷 المهندسين</h2><button onClick={engineer}>شراء مهندس — 500 جنيه</button></section><section><h2>🏕️ أجزاء الخيمة</h2><div className="grid">{PARTS.map(p=><article className={team.parts.includes(p.id)?"done":""} key={p.id}><h3>{p.icon} {p.name}</h3><p>{p.price} جنيه</p><button disabled={team.parts.includes(p.id)} onClick={()=>part(p)}>{team.parts.includes(p.id)?"✅ مكتمل":"شراء وبناء"}</button></article>)}</div></section><section><h2>🏆 الترتيب</h2>{sorted.map((t,i)=><p key={t.id}>{i+1}. {t.name} — {t.completedParts}/13</p>)}</section>{notice&&<div className="notice">{notice}</div>}</div>;
 if(page==="admin")return <div className="app"><header><h1>👑 لوحة تحكم الأدمن</h1><button onClick={()=>setPage("home")}>خروج</button></header><div className="grid">{teams.map(t=><article key={t.id}><h2>{t.name}</h2><p>💰 {t.balance} جنيه</p><button onClick={()=>adjust(t.id,"balance",500)}>+500</button><button onClick={()=>adjust(t.id,"balance",-500)}>-500</button><p>👷 {t.engineers}</p><button onClick={()=>adjust(t.id,"engineers",1)}>إضافة مهندس</button><button onClick={()=>adjust(t.id,"engineers",-1)}>إنقاص مهندس</button><p>🏕️ {t.completedParts}/13</p><p>🗺️ {t.stations}/7</p></article>)}</div></div>;
 return <div className="app hero"><h1>🏕️ بناء خيمة الاجتماع</h1><h2>Bible School Adventure</h2><p>«واصنعوا لي مقدسًا فأسكن في وسطهم» — خروج 25:8</p><div className="actions"><button onClick={()=>setPage("team-login")}>👥 دخول الفريق</button><button onClick={()=>setPage("admin-login")}>👑 لوحة الأدمن</button></div><h2>🏆 ترتيب الفرق</h2>{sorted.map((t,i)=><p key={t.id}>{i+1}. {t.name} — {t.completedParts}/13</p>)}</div>
}

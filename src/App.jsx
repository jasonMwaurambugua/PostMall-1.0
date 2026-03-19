import { useState, useEffect, useRef, useCallback } from "react";

/* ── Google Fonts ── */
const _style = document.createElement("style");
_style.textContent = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Outfit:wght@300;400;500;600;700;800&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html { -webkit-font-smoothing: antialiased; }
  body { font-family: 'Plus Jakarta Sans', sans-serif; background: #F7F8FA; }
  ::-webkit-scrollbar { width: 3px; height: 3px; }
  ::-webkit-scrollbar-thumb { background: #E0E0E0; border-radius: 3px; }
  input, textarea, button { font-family: inherit; outline: none; }
  button { cursor: pointer; border: none; background: none; }
  img { display: block; }
  @keyframes spin { to { transform: rotate(360deg); } }
  @keyframes fadeUp { from { opacity:0; transform:translateY(18px); } to { opacity:1; transform:translateY(0); } }
  @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.4} }
  @keyframes bounceTyping { 0%,80%,100%{transform:scale(0);opacity:.3} 40%{transform:scale(1);opacity:1} }
  @keyframes shimmer { 0%{background-position:-400px 0} 100%{background-position:400px 0} }
  @keyframes slideIn { from{transform:translateY(100%)} to{transform:translateY(0)} }
  @keyframes heartPop { 0%{transform:scale(1)} 25%{transform:scale(1.4)} 50%{transform:scale(.9)} 100%{transform:scale(1)} }
  .fadeUp { animation: fadeUp .45s cubic-bezier(.34,1.56,.64,1) both; }
  .shimmer { background: linear-gradient(90deg,#f0f0f0 25%,#e0e0e0 50%,#f0f0f0 75%); background-size:400px 100%; animation:shimmer 1.4s infinite; }
`;
document.head.appendChild(_style);

/* ── Design tokens ── */
const C = {
  orange:      "#FF8C00",
  orangeLight: "#FFF3E0",
  orangeGlow:  "rgba(255,140,0,.18)",
  dark:        "#1E2235",
  darkMid:     "#2A2E43",
  white:       "#FFFFFF",
  bg:          "#F7F8FA",
  card:        "#FFFFFF",
  border:      "#EAEDF0",
  text:        "#141928",
  sub:         "#6B7280",
  muted:       "#9CA3AF",
  green:       "#10B981",
  red:         "#EF4444",
  blue:        "#3B82F6",
  shadow:      "0 1px 3px rgba(0,0,0,.06), 0 4px 16px rgba(0,0,0,.04)",
  shadowMd:    "0 4px 24px rgba(0,0,0,.10)",
  shadowLg:    "0 12px 48px rgba(0,0,0,.16)",
  radius:      "16px",
  radiusSm:    "10px",
};

/* ── Unsplash image data ── */
const IMGS = {
  fashion: [
    "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&q=85",
    "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=85",
    "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800&q=85",
    "https://images.unsplash.com/photo-1581044777550-4cfa60707c03?w=800&q=85",
    "https://images.unsplash.com/photo-1445205170230-053b83016050?w=800&q=85",
  ],
  cars: [
    "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&q=85",
    "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=800&q=85",
    "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800&q=85",
    "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800&q=85",
  ],
  food: [
    "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=85",
    "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800&q=85",
    "https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?w=800&q=85",
    "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=800&q=85",
  ],
  tech: [
    "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&q=85",
    "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=85",
    "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=800&q=85",
  ],
  avatars: [
    "https://images.unsplash.com/photo-1531384441138-2736e62e0919?w=120&q=85",
    "https://images.unsplash.com/photo-1589156191108-c762ff4b96ab?w=120&q=85",
    "https://images.unsplash.com/photo-1506277886164-e25aa3f4ef7f?w=120&q=85",
    "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=120&q=85",
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&q=85",
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&q=85",
  ],
};

/* ── Mock data (mirrors MongoDB seed) ── */
const POSTS = [
  { _id:"p1", store:{_id:"s1",name:"Baraka Stores",category:"Fashion",logo:IMGS.avatars[0],location:{building:"Sawa Mall",floor:"2nd Floor",shopNumber:"Shop 104",street:"Tom Mboya St"},isOpen:true,rating:4.8}, author:{name:"Jason Mbugua",avatar:IMGS.avatars[0]}, caption:"Fresh arrivals this week! 🔥 Streetwear, formal and casual — everything for the modern Nairobian. Visit us at Sawa Mall Shop 104.", images:IMGS.fashion.slice(0,3), tags:["fashion","newarrivals"], likes:[], shares:7, views:342, comments:[], createdAt:new Date(Date.now()-3600000*2) },
  { _id:"p2", store:{_id:"s2",name:"Joan Foods",category:"Food",logo:IMGS.avatars[1],location:{building:"City Mall",floor:"3rd Floor",shopNumber:"Stall 07",street:"Moi Ave"},isOpen:true,rating:4.6}, author:{name:"Amina Hassan",avatar:IMGS.avatars[1]}, caption:"🍽️ Lunch special today! Full meal + juice for only KSh 350. Fresh, hot and homemade. Find us at City Mall 3rd Floor, Stall 07.", images:IMGS.food.slice(0,3), tags:["food","lunch","affordable"], likes:[], shares:19, views:521, comments:[], createdAt:new Date(Date.now()-3600000*5) },
  { _id:"p3", store:{_id:"s3",name:"Urban Drives",category:"Automotive",logo:IMGS.avatars[2],location:{building:"Central Plaza",floor:"Ground Floor",shopNumber:"Bay 02",street:"Kenyatta Ave"},isOpen:true,rating:4.9}, author:{name:"Kevin Ochieng",avatar:IMGS.avatars[2]}, caption:"🚘 Just arrived — 2021 BMW X5, low mileage, full service history. Flexible financing available. Urban Drives — we find your dream car!", images:IMGS.cars.slice(0,4), tags:["cars","BMW","dealership"], likes:[], shares:28, views:891, comments:[], createdAt:new Date(Date.now()-3600000*8) },
  { _id:"p4", store:{_id:"s4",name:"Rahym Systems",category:"Electronics",logo:IMGS.avatars[3],location:{building:"Metropolis Bldg",floor:"2nd Floor",shopNumber:"Shop 208",street:"Tom Mboya St"},isOpen:false,rating:4.3}, author:{name:"Grace Wanjiru",avatar:IMGS.avatars[3]}, caption:"💻 Back-to-school deals on laptops! From KSh 35,000 with 6-month warranty. We also do repairs same day.", images:IMGS.tech.slice(0,3), tags:["laptops","tech"], likes:[], shares:3, views:178, comments:[], createdAt:new Date(Date.now()-3600000*14) },
  { _id:"p5", store:{_id:"s5",name:"Elegant Boutique",category:"Fashion",logo:IMGS.avatars[5],location:{building:"City Mall",floor:"3rd Floor",shopNumber:"Shop 15",street:"Moi Ave"},isOpen:true,rating:4.7}, author:{name:"Amina Hassan",avatar:IMGS.avatars[1]}, caption:"✨ New collection just dropped! Premium ladies wear starting from KSh 2,500. Sizes XS–4XL. Come slay with us! 💃", images:IMGS.fashion.slice(1,4), tags:["ladies","fashion"], likes:[], shares:12, views:445, comments:[], createdAt:new Date(Date.now()-3600000*20) },
];

const PRODUCTS = [
  { _id:"pr1",  name:"Streetwear Hoodie",  price:2500,    category:"Fashion",     images:[IMGS.fashion[0]], locationLabel:"Sawa Mall · Shop 104 · 2nd Fl",      store:{name:"Baraka Stores",isOpen:true},   rating:4.8 },
  { _id:"pr2",  name:"Slim Fit Chinos",    price:3200,    category:"Fashion",     images:[IMGS.fashion[2]], locationLabel:"Sawa Mall · Shop 104 · 2nd Fl",      store:{name:"Baraka Stores",isOpen:true},   rating:4.6 },
  { _id:"pr3",  name:"Full Meal Combo",    price:350,     category:"Food",        images:[IMGS.food[0]],    locationLabel:"City Mall · Stall 07 · 3rd Fl",     store:{name:"Joan Foods",isOpen:true},      rating:4.9 },
  { _id:"pr4",  name:"2021 BMW X5",        price:6500000, category:"Automotive",  images:[IMGS.cars[0]],    locationLabel:"Central Plaza · Bay 02 · Ground Fl", store:{name:"Urban Drives",isOpen:true},    rating:5.0 },
  { _id:"pr5",  name:"HP Laptop 15\"",     price:38000,   category:"Electronics", images:[IMGS.tech[0]],    locationLabel:"Metropolis · Shop 208 · 2nd Fl",    store:{name:"Rahym Systems",isOpen:false},  rating:4.2 },
  { _id:"pr6",  name:"Maxi Dress",         price:4500,    category:"Fashion",     images:[IMGS.fashion[1]], locationLabel:"City Mall · Shop 15 · 3rd Fl",      store:{name:"Elegant Boutique",isOpen:true},rating:4.7 },
  { _id:"pr7",  name:"Designer Handbag",   price:7800,    category:"Fashion",     images:[IMGS.fashion[3]], locationLabel:"City Mall · Shop 15 · 3rd Fl",      store:{name:"Elegant Boutique",isOpen:true},rating:4.5 },
  { _id:"pr8",  name:"Gaming Desktop PC",  price:65000,   category:"Electronics", images:[IMGS.tech[1]],    locationLabel:"Metropolis · Shop 208 · 2nd Fl",    store:{name:"Rahym Systems",isOpen:false},  rating:4.4 },
  { _id:"pr9",  name:"2019 Toyota Prado",  price:4800000, category:"Automotive",  images:[IMGS.cars[1]],    locationLabel:"Central Plaza · Bay 02 · Ground Fl", store:{name:"Urban Drives",isOpen:true},    rating:4.8 },
  { _id:"pr10", name:"Fresh Juice Combo",  price:180,     category:"Food",        images:[IMGS.food[2]],    locationLabel:"City Mall · Stall 07 · 3rd Fl",     store:{name:"Joan Foods",isOpen:true},      rating:4.7 },
];

const USER = {
  _id:"u5", name:"Jason Mbugua", email:"jason@postmall.co.ke",
  phone:"+254 712 345 678", avatar:IMGS.avatars[0],
  bio:"Fashion enthusiast & PostMall seller 🛍️",
  location:"Nairobi, Kenya", memberSince:"2024", role:"merchant",
};

const LANA_SYS = `You are Lana, PostMall's friendly AI shopping assistant for Nairobi, Kenya. Help users find stores, products and deals across Nairobi malls: Sawa Mall (Tom Mboya St), City Mall (Moi Ave), Metropolis Building, Dynamic Mall, Heritage Plaza, Central Plaza. Keep replies concise (2-3 sentences), warm and practical. Use Kenyan expressions: "Sawa!", "Poa!", "Hakuna matata!". Format prices as KSh X,XXX.`;

/* ── Helpers ── */
const fmt = n =>
  n >= 1000000 ? `KSh ${(n/1000000).toFixed(1)}M`
  : n >= 1000  ? `KSh ${(n/1000).toFixed(n%1000===0?0:1)}k`
  : `KSh ${n.toLocaleString()}`;

const timeAgo = d => {
  const s = (Date.now() - new Date(d)) / 1000;
  if (s < 60)    return "just now";
  if (s < 3600)  return `${Math.floor(s/60)}m ago`;
  if (s < 86400) return `${Math.floor(s/3600)}h ago`;
  return `${Math.floor(s/86400)}d ago`;
};

/* ────────────────────────────────────────────────────────────────────────── */
/* COMPONENTS                                                                  */

function Img({ src, alt="", style={}, fallbackColor="#e8e8e8" }) {
  const [loaded, setLoaded] = useState(false);
  const [err,    setErr]    = useState(false);
  return (
    <div style={{ position:"relative", overflow:"hidden", background:fallbackColor, ...style }}>
      {!loaded && !err && <div className="shimmer" style={{ position:"absolute", inset:0 }} />}
      {!err && (
        <img src={src} alt={alt} onLoad={()=>setLoaded(true)} onError={()=>setErr(true)}
          style={{ width:"100%", height:"100%", objectFit:"cover", opacity:loaded?1:0, transition:"opacity .3s" }} />
      )}
      {err && (
        <div style={{ width:"100%", height:"100%", background:"#e8e8e8", display:"flex", alignItems:"center", justifyContent:"center", fontSize:28 }}>🖼️</div>
      )}
    </div>
  );
}

function Avatar({ src, name="?", size=40, border, onClick, style={} }) {
  const [err, setErr] = useState(false);
  const initials = name.split(" ").map(w=>w[0]).slice(0,2).join("").toUpperCase();
  return (
    <div onClick={onClick} style={{ width:size, height:size, borderRadius:"50%", overflow:"hidden", flexShrink:0, border:border?`2.5px solid ${border}`:undefined, cursor:onClick?"pointer":"default", background:C.dark, display:"flex", alignItems:"center", justifyContent:"center", ...style }}>
      {!err && src
        ? <img src={src} alt={name} onError={()=>setErr(true)} style={{ width:"100%", height:"100%", objectFit:"cover" }} />
        : <span style={{ color:"#fff", fontWeight:700, fontSize:size*0.38, fontFamily:"'Outfit',sans-serif" }}>{initials}</span>
      }
    </div>
  );
}

function Badge({ children, color=C.orange, bg }) {
  return (
    <span style={{ fontSize:11, fontWeight:700, color, background:bg||"rgba(255,140,0,.12)", borderRadius:20, padding:"3px 10px", whiteSpace:"nowrap" }}>
      {children}
    </span>
  );
}

function Btn({ children, onClick, variant="primary", full=false, size="md", disabled=false, style={} }) {
  const sizes = {
    sm: { padding:"7px 14px",  fontSize:13 },
    md: { padding:"11px 20px", fontSize:14 },
    lg: { padding:"14px 28px", fontSize:15 },
  };
  const variants = {
    primary:   { background:C.orange,      color:"#fff",    border:"none" },
    secondary: { background:C.orangeLight, color:C.orange,  border:"none" },
    outline:   { background:"transparent", color:C.orange,  border:`1.5px solid ${C.orange}` },
    ghost:     { background:"#F3F4F6",     color:C.text,    border:"none" },
    dark:      { background:C.dark,        color:"#fff",    border:"none" },
    danger:    { background:"#FEE2E2",     color:C.red,     border:"none" },
  };
  return (
    <button onClick={onClick} disabled={disabled}
      style={{ display:"inline-flex", alignItems:"center", justifyContent:"center", gap:7, borderRadius:C.radiusSm, fontWeight:600, cursor:disabled?"not-allowed":"pointer", opacity:disabled?.5:1, width:full?"100%":"auto", transition:"all .15s", boxShadow:variant==="primary"?`0 2px 12px ${C.orangeGlow}`:"none", ...sizes[size], ...variants[variant], ...style }}>
      {children}
    </button>
  );
}

function Toggle({ value, onChange }) {
  return (
    <div onClick={()=>onChange(!value)} style={{ width:46, height:26, borderRadius:13, background:value?C.orange:"#D1D5DB", position:"relative", cursor:"pointer", transition:"background .2s", flexShrink:0 }}>
      <div style={{ position:"absolute", top:3, left:value?23:3, width:20, height:20, borderRadius:"50%", background:"#fff", transition:"left .2s", boxShadow:"0 1px 4px rgba(0,0,0,.2)" }} />
    </div>
  );
}

function Field({ label, type="text", placeholder, value, onChange, icon, multiline=false, right }) {
  return (
    <div style={{ marginBottom:16 }}>
      {label && <label style={{ fontSize:12.5, fontWeight:600, color:C.sub, display:"block", marginBottom:6, letterSpacing:.3 }}>{label}</label>}
      <div style={{ display:"flex", alignItems:"center", background:"#F9FAFB", border:`1.5px solid ${C.border}`, borderRadius:C.radiusSm, paddingInline:12, gap:8, transition:"border-color .2s" }}
        onFocus={e=>e.currentTarget.style.borderColor=C.orange}
        onBlur={e=>e.currentTarget.style.borderColor=C.border}>
        {icon && <span style={{ fontSize:16, flexShrink:0 }}>{icon}</span>}
        {multiline
          ? <textarea placeholder={placeholder} value={value} onChange={onChange} rows={3}
              style={{ flex:1, background:"none", border:"none", fontSize:14, color:C.text, padding:"10px 0", resize:"none" }}/>
          : <input type={type} placeholder={placeholder} value={value} onChange={onChange}
              style={{ flex:1, background:"none", border:"none", fontSize:14, color:C.text, padding:"12px 0" }}/>
        }
        {right && <span style={{ flexShrink:0 }}>{right}</span>}
      </div>
    </div>
  );
}

/* ── Carousel ── */
function Carousel({ images, height=380 }) {
  const [idx, setIdx]   = useState(0);
  const touchStart      = useRef(null);
  const go              = useCallback(i => setIdx(Math.max(0, Math.min(images.length-1, i))), [images.length]);

  useEffect(() => { setIdx(0); }, [images]);

  if (!images?.length) return <div style={{ height, background:"#f0f0f0", display:"flex", alignItems:"center", justifyContent:"center", fontSize:32 }}>🖼️</div>;

  return (
    <div style={{ position:"relative", height, background:"#111", userSelect:"none", overflow:"hidden" }}
      onTouchStart={e=>{ touchStart.current = e.touches[0].clientX; }}
      onTouchEnd={e=>{ const dx = e.changedTouches[0].clientX - touchStart.current; if (Math.abs(dx) > 40) go(idx + (dx < 0 ? 1 : -1)); }}>

      <Img src={images[idx]} style={{ height, width:"100%" }} />
      <div style={{ position:"absolute", inset:0, background:"linear-gradient(to top, rgba(0,0,0,.45) 0%, transparent 50%)" }} />

      {images.length > 1 && <>
        <button onClick={()=>go(idx-1)} disabled={idx===0}
          style={{ position:"absolute", left:12, top:"50%", transform:"translateY(-50%)", width:36, height:36, borderRadius:"50%", background:"rgba(255,255,255,.92)", border:"none", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, fontWeight:700, color:C.text, opacity:idx===0?.3:1, transition:"opacity .2s", backdropFilter:"blur(4px)" }}>‹</button>
        <button onClick={()=>go(idx+1)} disabled={idx===images.length-1}
          style={{ position:"absolute", right:12, top:"50%", transform:"translateY(-50%)", width:36, height:36, borderRadius:"50%", background:"rgba(255,255,255,.92)", border:"none", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, fontWeight:700, color:C.text, opacity:idx===images.length-1?.3:1, transition:"opacity .2s", backdropFilter:"blur(4px)" }}>›</button>
      </>}

      {images.length > 1 && (
        <div style={{ position:"absolute", bottom:14, left:0, right:0, display:"flex", justifyContent:"center", gap:5 }}>
          {images.map((_,i) => (
            <button key={i} onClick={()=>go(i)}
              style={{ width:i===idx?22:7, height:7, borderRadius:4, border:"none", background:i===idx?C.orange:"rgba(255,255,255,.6)", padding:0, cursor:"pointer", transition:"all .25s" }} />
          ))}
        </div>
      )}

      <div style={{ position:"absolute", top:12, right:12, background:"rgba(0,0,0,.55)", color:"#fff", fontSize:11, fontWeight:700, borderRadius:20, padding:"3px 10px", backdropFilter:"blur(4px)" }}>
        {idx+1} / {images.length}
      </div>
    </div>
  );
}

/* ── Splash ── */
function Splash({ onDone }) {
  const [p, setP] = useState(0);
  useEffect(() => {
    const t = [setTimeout(()=>setP(1),400), setTimeout(()=>setP(2),900), setTimeout(onDone,3200)];
    return () => t.forEach(clearTimeout);
  }, [onDone]);
  return (
    <div style={{ position:"fixed", inset:0, background:`linear-gradient(150deg, ${C.dark} 0%, #13162a 100%)`, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center" }}>
      <div style={{ position:"absolute", top:"35%", left:"50%", transform:"translate(-50%,-50%)", width:300, height:300, borderRadius:"50%", background:`radial-gradient(circle, rgba(255,140,0,.18), transparent 70%)`, pointerEvents:"none" }} />
      <div style={{ opacity:p>=1?1:0, transform:p>=1?"translateY(0)":"translateY(30px)", transition:"all .7s cubic-bezier(.34,1.56,.64,1)", textAlign:"center" }}>
        <div style={{ display:"flex", alignItems:"baseline", justifyContent:"center", gap:2 }}>
          <span style={{ fontSize:80, fontWeight:800, color:"#fff", letterSpacing:-3, fontFamily:"'Outfit',sans-serif", lineHeight:1 }}>Post</span>
          <span style={{ fontSize:80, fontWeight:800, color:C.orange, letterSpacing:-3, fontFamily:"'Outfit',sans-serif", lineHeight:1 }}>Mall</span>
        </div>
        <p style={{ color:"rgba(255,255,255,.38)", fontSize:14, letterSpacing:2, marginTop:10, textTransform:"uppercase" }}>Nairobi's Social Commerce Hub</p>
      </div>
      <div style={{ position:"absolute", bottom:56, opacity:p>=2?1:0, transition:"opacity .5s .4s ease", display:"flex", flexDirection:"column", alignItems:"center", gap:12 }}>
        <div style={{ width:36, height:36, border:`3px solid ${C.orange}`, borderTopColor:"transparent", borderRadius:"50%", animation:"spin 1s linear infinite" }} />
        <span style={{ color:"rgba(255,255,255,.25)", fontSize:12, letterSpacing:1 }}>Loading…</span>
      </div>
    </div>
  );
}

/* ── Login ── */
function Login({ onLogin }) {
  const [tab,     setTab]     = useState("login");
  const [form,    setForm]    = useState({ name:"", email:"", phone:"", password:"" });
  const [showPwd, setShowPwd] = useState(false);
  const [err,     setErr]     = useState("");
  const [loading, setLoading] = useState(false);
  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));

  const submit = async () => {
    if (tab==="login"    && (!form.email || !form.password))                               { setErr("Please fill in all fields."); return; }
    if (tab==="register" && (!form.name || !form.email || !form.phone || !form.password)) { setErr("Please fill in all fields."); return; }
    setLoading(true); setErr("");
    await new Promise(r => setTimeout(r, 900));
    setLoading(false);
    onLogin();
  };

  return (
    <div style={{ minHeight:"100vh", background:`linear-gradient(150deg, ${C.dark} 0%, #13162a 100%)`, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"24px 16px" }}>
      <div style={{ position:"absolute", top:"20%", left:"50%", transform:"translateX(-50%)", width:400, height:400, borderRadius:"50%", background:`radial-gradient(circle, rgba(255,140,0,.1), transparent 70%)`, pointerEvents:"none" }} />
      <div style={{ marginBottom:32, textAlign:"center", animation:"fadeUp .6s ease both" }}>
        <div style={{ display:"flex", alignItems:"baseline", justifyContent:"center" }}>
          <span style={{ fontSize:62, fontWeight:800, color:"#fff", letterSpacing:-2, fontFamily:"'Outfit',sans-serif" }}>Post</span>
          <span style={{ fontSize:62, fontWeight:800, color:C.orange, letterSpacing:-2, fontFamily:"'Outfit',sans-serif" }}>Mall</span>
        </div>
        <p style={{ color:"rgba(255,255,255,.35)", fontSize:13, marginTop:4, letterSpacing:.5 }}>Nairobi's Social Commerce Platform</p>
      </div>
      <div style={{ width:"100%", maxWidth:420, background:C.white, borderRadius:20, boxShadow:C.shadowLg, overflow:"hidden", animation:"fadeUp .6s .15s ease both" }}>
        <div style={{ display:"flex", borderBottom:`1px solid ${C.border}` }}>
          {["login","register"].map(t => (
            <button key={t} onClick={()=>{setTab(t);setErr("");}}
              style={{ flex:1, padding:"17px 0", background:"none", border:"none", borderBottom:tab===t?`2.5px solid ${C.orange}`:"2.5px solid transparent", color:tab===t?C.orange:C.muted, fontWeight:700, fontSize:14, cursor:"pointer", transition:"all .2s" }}>
              {t==="login"?"Sign In":"Create Account"}
            </button>
          ))}
        </div>
        <div style={{ padding:"28px 28px 24px" }}>
          {tab==="register" && <Field label="FULL NAME" placeholder="Your full name" value={form.name} onChange={set("name")} icon="👤"/>}
          <Field label="EMAIL ADDRESS" type="email" placeholder="your@email.com" value={form.email} onChange={set("email")} icon="✉️"/>
          {tab==="register" && <Field label="PHONE NUMBER" type="tel" placeholder="+254 7XX XXX XXX" value={form.phone} onChange={set("phone")} icon="📱"/>}
          <div style={{ marginBottom:16 }}>
            <label style={{ fontSize:12.5, fontWeight:600, color:C.sub, display:"block", marginBottom:6, letterSpacing:.3 }}>PASSWORD</label>
            <div style={{ display:"flex", alignItems:"center", background:"#F9FAFB", border:`1.5px solid ${C.border}`, borderRadius:C.radiusSm, paddingInline:12, gap:8 }}>
              <span style={{ fontSize:16 }}>🔒</span>
              <input type={showPwd?"text":"password"} placeholder="Enter password" value={form.password} onChange={set("password")} style={{ flex:1, background:"none", border:"none", fontSize:14, color:C.text, padding:"12px 0" }}/>
              <button onClick={()=>setShowPwd(!showPwd)} style={{ fontSize:16, cursor:"pointer", background:"none", border:"none", color:C.muted, padding:4 }}>{showPwd?"🙈":"👁️"}</button>
            </div>
          </div>
          {err && <p style={{ color:C.red, fontSize:13, textAlign:"center", marginBottom:12, padding:"8px 12px", background:"#FEF2F2", borderRadius:8 }}>{err}</p>}
          {tab==="login" && (
            <div style={{ textAlign:"right", marginTop:-6, marginBottom:16 }}>
              <span style={{ color:C.orange, fontSize:13, fontWeight:600, cursor:"pointer" }}>Forgot Password?</span>
            </div>
          )}
          <Btn onClick={submit} full size="lg" disabled={loading}>
            {loading
              ? <div style={{ width:20, height:20, border:"2.5px solid #fff", borderTopColor:"transparent", borderRadius:"50%", animation:"spin 1s linear infinite" }}/>
              : tab==="login" ? "Sign In →" : "Create Account →"}
          </Btn>
          <div style={{ display:"flex", alignItems:"center", gap:12, margin:"20px 0" }}>
            <div style={{ flex:1, height:1, background:C.border }}/><span style={{ color:C.muted, fontSize:12 }}>or continue with</span><div style={{ flex:1, height:1, background:C.border }}/>
          </div>
          {[{icon:"G",label:"Google",c:"#EA4335"},{icon:"f",label:"Facebook",c:"#1877F2"}].map(s => (
            <button key={s.label} onClick={onLogin}
              style={{ width:"100%", display:"flex", alignItems:"center", justifyContent:"center", gap:10, border:`1.5px solid ${C.border}`, borderRadius:C.radiusSm, padding:"12px", background:C.white, cursor:"pointer", marginBottom:10, fontSize:14, fontWeight:500, transition:"background .15s" }}
              onMouseEnter={e=>e.currentTarget.style.background="#F9FAFB"}
              onMouseLeave={e=>e.currentTarget.style.background=C.white}>
              <span style={{ color:s.c, fontWeight:800, fontSize:17 }}>{s.icon}</span> Continue with {s.label}
            </button>
          ))}
        </div>
      </div>
      <p style={{ color:"rgba(255,255,255,.2)", fontSize:12, marginTop:20, textAlign:"center", lineHeight:1.8 }}>
        By continuing you agree to our <span style={{ color:C.orange, cursor:"pointer" }}>Terms of Service</span> &amp; <span style={{ color:C.orange, cursor:"pointer" }}>Privacy Policy</span>
      </p>
    </div>
  );
}

/* ── Post Card ── */
function PostCard({ post: initialPost, onViewStore }) {
  const [post]                        = useState(initialPost);
  const [liked,    setLiked]          = useState(false);
  const [saved,    setSaved]          = useState(false);
  const [comment,  setComment]        = useState("");
  const [comments, setComments]       = useState(post.comments||[]);
  const [showCmts, setShowCmts]       = useState(false);
  const [likePop,  setLikePop]        = useState(false);

  const toggleLike = () => {
    setLiked(l => !l);
    setLikePop(true);
    setTimeout(() => setLikePop(false), 400);
  };

  const addComment = () => {
    if (!comment.trim()) return;
    setComments(c => [...c, { _id:Date.now(), user:{ name:"You", avatar:USER.avatar }, text:comment, createdAt:new Date() }]);
    setComment("");
    setShowCmts(true);
  };

  const loc    = post.store?.location;
  const locStr = loc ? `${loc.building}${loc.shopNumber?` · ${loc.shopNumber}`:""}${loc.floor?` · ${loc.floor}`:""}` : "";

  return (
    <div className="fadeUp" style={{ background:C.card, borderRadius:C.radius, boxShadow:C.shadow, overflow:"hidden", marginBottom:12 }}>
      {/* Header */}
      <div style={{ display:"flex", alignItems:"center", padding:"13px 16px", gap:11 }}>
        <Avatar src={post.store?.logo} name={post.store?.name} size={46} border={C.orange} onClick={()=>onViewStore(post.store)} />
        <div style={{ flex:1, minWidth:0 }}>
          <div style={{ fontWeight:700, fontSize:14.5, color:C.text, cursor:"pointer", whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }} onClick={()=>onViewStore(post.store)}>{post.store?.name}</div>
          <div style={{ fontSize:11.5, color:C.muted, marginTop:2, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{locStr} · {timeAgo(post.createdAt)}</div>
        </div>
        <Badge color={post.store?.isOpen?C.green:C.red} bg={post.store?.isOpen?"#D1FAE5":"#FEE2E2"}>
          {post.store?.isOpen?"● Open":"● Closed"}
        </Badge>
      </div>

      <Carousel images={post.images} height={340} />

      {/* Actions */}
      <div style={{ padding:"10px 14px 0", display:"flex", alignItems:"center" }}>
        <div style={{ display:"flex", flex:1, gap:2 }}>
          <button onClick={toggleLike} style={{ display:"flex", alignItems:"center", gap:5, padding:"8px 10px", borderRadius:C.radiusSm, background:liked?C.orangeLight:"transparent", border:"none", cursor:"pointer", transition:"all .15s" }}>
            <span style={{ fontSize:21, animation:likePop?"heartPop .4s ease":"none" }}>{liked?"❤️":"🤍"}</span>
            <span style={{ fontSize:12.5, color:liked?C.orange:C.muted, fontWeight:600 }}>{(post.likes?.length||0)+(liked?1:0)}</span>
          </button>
          <button onClick={()=>setShowCmts(!showCmts)} style={{ display:"flex", alignItems:"center", gap:5, padding:"8px 10px", borderRadius:C.radiusSm, background:showCmts?C.orangeLight:"transparent", border:"none", cursor:"pointer" }}>
            <span style={{ fontSize:20 }}>💬</span>
            <span style={{ fontSize:12.5, color:C.muted, fontWeight:600 }}>{(post.comments?.length||0)+comments.length}</span>
          </button>
          <button style={{ display:"flex", alignItems:"center", gap:5, padding:"8px 10px", borderRadius:C.radiusSm, border:"none", cursor:"pointer", background:"transparent" }}>
            <span style={{ fontSize:20 }}>↗️</span>
            <span style={{ fontSize:12.5, color:C.muted, fontWeight:600 }}>{post.shares}</span>
          </button>
        </div>
        <button onClick={()=>setSaved(!saved)} style={{ padding:"8px 10px", borderRadius:C.radiusSm, background:saved?C.orangeLight:"transparent", border:"none", cursor:"pointer", fontSize:21 }}>
          {saved?"🔖":"🏷️"}
        </button>
      </div>

      {/* Rating */}
      <div style={{ padding:"4px 14px 0", display:"flex", alignItems:"center", gap:6 }}>
        <span style={{ fontSize:13, color:"#FBBF24" }}>{"★".repeat(Math.floor(post.store?.rating||0))}{"☆".repeat(5-Math.floor(post.store?.rating||0))}</span>
        <span style={{ fontSize:12, color:C.muted }}>{post.store?.rating?.toFixed(1)} · {post.views?.toLocaleString()} views</span>
      </div>

      {/* Caption */}
      <div style={{ padding:"8px 16px 10px" }}>
        <p style={{ fontSize:13.5, color:C.text, lineHeight:1.65 }}>
          <span style={{ fontWeight:700 }}>{post.store?.name} </span>{post.caption}
        </p>
        {post.tags?.length > 0 && (
          <div style={{ display:"flex", flexWrap:"wrap", gap:4, marginTop:7 }}>
            {post.tags.map(t => <span key={t} style={{ fontSize:11.5, color:C.blue, fontWeight:500 }}>#{t}</span>)}
          </div>
        )}
      </div>

      {/* Comments */}
      {showCmts && comments.length > 0 && (
        <div style={{ borderTop:`1px solid ${C.border}`, padding:"10px 16px", display:"flex", flexDirection:"column", gap:8 }}>
          {comments.map(c => (
            <div key={c._id} style={{ display:"flex", gap:9, alignItems:"flex-start" }}>
              <Avatar src={c.user?.avatar} name={c.user?.name} size={28} />
              <div style={{ background:"#F9FAFB", borderRadius:12, padding:"8px 12px", flex:1 }}>
                <span style={{ fontWeight:700, fontSize:12 }}>{c.user?.name} </span>
                <span style={{ fontSize:13, color:C.text }}>{c.text}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Comment input */}
      <div style={{ borderTop:`1px solid ${C.border}`, padding:"10px 14px", display:"flex", gap:10, alignItems:"center" }}>
        <Avatar src={USER.avatar} name={USER.name} size={30} />
        <input value={comment} onChange={e=>setComment(e.target.value)} onKeyDown={e=>{if(e.key==="Enter")addComment();}} placeholder="Add a comment…"
          style={{ flex:1, background:"#F9FAFB", border:`1px solid ${C.border}`, borderRadius:24, padding:"8px 16px", fontSize:13, color:C.text }} />
        <button onClick={addComment} disabled={!comment.trim()}
          style={{ width:36, height:36, borderRadius:"50%", background:comment.trim()?C.orange:"#E5E7EB", border:"none", cursor:comment.trim()?"pointer":"default", display:"flex", alignItems:"center", justifyContent:"center", fontSize:15, color:"#fff", transition:"background .2s" }}>➤</button>
      </div>
    </div>
  );
}

/* ── Home ── */
function Home({ onViewStore }) {
  const stories = [{ name:"Your Story", img:USER.avatar, mine:true }, ...POSTS.map(p=>({ name:p.store.name, img:p.store.logo }))];
  return (
    <div style={{ maxWidth:600, margin:"0 auto", padding:"0 0 24px" }}>
      <div style={{ overflowX:"auto", display:"flex", gap:14, padding:"14px 16px", background:C.card, borderBottom:`1px solid ${C.border}`, scrollbarWidth:"none" }}>
        {stories.map((s,i) => (
          <div key={i} style={{ flexShrink:0, display:"flex", flexDirection:"column", alignItems:"center", gap:5, width:62 }}>
            <div style={{ padding:2.5, borderRadius:"50%", background:i===0?`linear-gradient(135deg,#ddd,#bbb)`:`linear-gradient(135deg,${C.orange},#FF4500)` }}>
              <div style={{ padding:2, background:C.white, borderRadius:"50%" }}>
                <Avatar src={s.img} name={s.name} size={52} />
              </div>
            </div>
            <span style={{ fontSize:10, color:C.text, textAlign:"center", width:"100%", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
              {i===0?"Your Story":s.name.split(" ")[0]}
            </span>
          </div>
        ))}
      </div>
      <div style={{ padding:"10px 10px 0" }}>
        {POSTS.map(p => <PostCard key={p._id} post={p} onViewStore={onViewStore} />)}
      </div>
    </div>
  );
}

/* ── Search ── */
function Search() {
  const [q,   setQ]   = useState("");
  const [cat, setCat] = useState("All");
  const cats     = ["All","Fashion","Food","Automotive","Electronics","Accessories"];
  const filtered = PRODUCTS.filter(p => {
    const matchQ = !q || p.name.toLowerCase().includes(q.toLowerCase()) || p.locationLabel.toLowerCase().includes(q.toLowerCase());
    const matchC = cat==="All" || p.category===cat || p.category.includes(cat);
    return matchQ && matchC;
  });
  return (
    <div style={{ maxWidth:720, margin:"0 auto", padding:"18px 14px 28px" }}>
      <div style={{ display:"flex", alignItems:"center", background:C.card, border:`1.5px solid ${C.orange}`, borderRadius:28, padding:"11px 18px", gap:10, marginBottom:16, boxShadow:`0 2px 20px ${C.orangeGlow}` }}>
        <span style={{ color:C.orange, fontSize:18 }}>🔍</span>
        <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search stores, products, malls…" style={{ flex:1, background:"none", border:"none", fontSize:15, color:C.text }} />
        {q && <button onClick={()=>setQ("")} style={{ color:C.muted, fontSize:16, cursor:"pointer" }}>✕</button>}
      </div>
      <div style={{ display:"flex", gap:8, overflowX:"auto", paddingBottom:10, scrollbarWidth:"none", marginBottom:14 }}>
        {cats.map(c => (
          <button key={c} onClick={()=>setCat(c)}
            style={{ flexShrink:0, padding:"8px 18px", borderRadius:24, background:cat===c?C.orange:C.card, color:cat===c?"#fff":C.text, border:`1.5px solid ${cat===c?C.orange:C.border}`, fontSize:13, fontWeight:600, cursor:"pointer", transition:"all .2s", boxShadow:cat===c?`0 2px 10px ${C.orangeGlow}`:"none" }}>{c}</button>
        ))}
      </div>
      <p style={{ fontSize:12.5, color:C.muted, marginBottom:12 }}>{filtered.length} results</p>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(2,1fr)", gap:12 }}>
        {filtered.map(p => (
          <div key={p._id} style={{ background:C.card, borderRadius:C.radius, boxShadow:C.shadow, overflow:"hidden", cursor:"pointer", transition:"transform .2s, box-shadow .2s" }}
            onMouseEnter={e=>{ e.currentTarget.style.transform="translateY(-3px)"; e.currentTarget.style.boxShadow=C.shadowMd; }}
            onMouseLeave={e=>{ e.currentTarget.style.transform=""; e.currentTarget.style.boxShadow=C.shadow; }}>
            <Img src={p.images[0]} style={{ height:170 }} />
            <div style={{ padding:"12px 14px 14px" }}>
              <p style={{ fontWeight:700, fontSize:14, color:C.text, marginBottom:3 }}>{p.name}</p>
              <p style={{ fontSize:13.5, color:C.orange, fontWeight:700, marginBottom:5 }}>{fmt(p.price)}</p>
              <p style={{ fontSize:11.5, color:C.muted, lineHeight:1.5 }}>{p.locationLabel}</p>
              <div style={{ display:"flex", alignItems:"center", gap:5, marginTop:7 }}>
                <span style={{ fontSize:11.5, color:"#FBBF24" }}>{"★".repeat(Math.floor(p.rating))}</span>
                <span style={{ fontSize:11, color:C.muted }}>{p.rating}</span>
                <span style={{ marginLeft:"auto", fontSize:11, color:p.store.isOpen?C.green:C.red, fontWeight:600 }}>{p.store.isOpen?"Open":"Closed"}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Lana AI ── */
function LanaAI() {
  const [msgs,    setMsgs]    = useState([{ id:"0", role:"assistant", text:"Mambo! 👋 I'm Lana, your PostMall shopping assistant. Ask me about stores, products or deals across Nairobi!" }]);
  const [input,   setInput]   = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);
  const QUICK = ["Best fashion stores in Nairobi?","Affordable food near City Mall?","Car dealerships with financing?","Tech shops & laptop repairs?"];

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior:"smooth" }); }, [msgs, loading]);

  const send = async text => {
    const t = text || input.trim();
    if (!t || loading) return;
    setInput("");
    const userMsg = { id:Date.now().toString(), role:"user", text:t };
    const history = [...msgs, userMsg];
    setMsgs(history);
    setLoading(true);
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method:"POST",
        headers:{ "Content-Type":"application/json", "anthropic-version":"2023-06-01", "anthropic-dangerous-direct-browser-access":"true" },
        body: JSON.stringify({ model:"claude-haiku-4-5-20251001", max_tokens:350, system:LANA_SYS, messages:history.map(m=>({ role:m.role, content:m.text })) })
      });
      const data = await res.json();
      setMsgs(p => [...p, { id:(Date.now()+1).toString(), role:"assistant", text:data?.content?.[0]?.text||"Sorry, try again!" }]);
    } catch {
      setMsgs(p => [...p, { id:(Date.now()+1).toString(), role:"assistant", text:"Oops! Network issue. Please try again in a moment." }]);
    } finally { setLoading(false); }
  };

  return (
    <div style={{ display:"flex", flexDirection:"column", height:"calc(100vh - 112px)", maxWidth:640, margin:"0 auto" }}>
      <div style={{ flex:1, overflowY:"auto", padding:"16px 16px 8px", background:"#F5F7FA" }}>
        {msgs.map(m => (
          <div key={m.id} style={{ display:"flex", flexDirection:m.role==="user"?"row-reverse":"row", gap:9, marginBottom:16, alignItems:"flex-end" }}>
            {m.role==="assistant" && (
              <div style={{ width:34, height:34, borderRadius:"50%", background:`linear-gradient(135deg,${C.orange},#FF4500)`, flexShrink:0, display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontWeight:800, fontSize:15, fontFamily:"'Outfit',sans-serif", boxShadow:`0 3px 10px ${C.orangeGlow}` }}>L</div>
            )}
            <div style={{ maxWidth:"73%", padding:"11px 16px", borderRadius:18, borderBottomRightRadius:m.role==="user"?4:18, borderBottomLeftRadius:m.role==="assistant"?4:18, background:m.role==="user"?C.orange:C.card, color:m.role==="user"?"#fff":C.text, fontSize:14, lineHeight:1.65, boxShadow:C.shadow }}>
              {m.text}
            </div>
            {m.role==="user" && <Avatar src={USER.avatar} name={USER.name} size={32} />}
          </div>
        ))}
        {loading && (
          <div style={{ display:"flex", gap:9, alignItems:"flex-end", marginBottom:16 }}>
            <div style={{ width:34, height:34, borderRadius:"50%", background:`linear-gradient(135deg,${C.orange},#FF4500)`, display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontWeight:800, fontSize:15, fontFamily:"'Outfit',sans-serif" }}>L</div>
            <div style={{ background:C.card, padding:"14px 18px", borderRadius:18, borderBottomLeftRadius:4, boxShadow:C.shadow, display:"flex", gap:5, alignItems:"center" }}>
              {[0,1,2].map(i=><div key={i} style={{ width:8, height:8, borderRadius:"50%", background:C.orange, animation:`bounceTyping 1.2s ${i*.18}s infinite ease-in-out` }}/>)}
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {msgs.length<=2 && (
        <div style={{ background:C.card, padding:"10px 14px", display:"flex", gap:8, overflowX:"auto", scrollbarWidth:"none", borderTop:`1px solid ${C.border}`, flexShrink:0 }}>
          {QUICK.map(q => (
            <button key={q} onClick={()=>send(q)}
              style={{ flexShrink:0, border:`1.5px solid ${C.orange}`, background:C.card, color:C.orange, borderRadius:24, padding:"8px 16px", fontSize:12.5, fontWeight:600, cursor:"pointer", whiteSpace:"nowrap", transition:"background .15s" }}
              onMouseEnter={e=>e.currentTarget.style.background=C.orangeLight}
              onMouseLeave={e=>e.currentTarget.style.background=C.card}>{q}</button>
          ))}
        </div>
      )}

      <div style={{ background:C.card, padding:"10px 14px", display:"flex", gap:10, alignItems:"flex-end", borderTop:`1px solid ${C.border}`, flexShrink:0 }}>
        <textarea value={input} onChange={e=>setInput(e.target.value)}
          onKeyDown={e=>{ if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();send();}}}
          placeholder="Ask Lana anything about Nairobi stores…" rows={1}
          style={{ flex:1, resize:"none", background:"#F9FAFB", border:`1.5px solid ${C.border}`, borderRadius:22, padding:"11px 16px", fontSize:14, color:C.text, maxHeight:90, transition:"border-color .2s" }} />
        <button onClick={()=>send()} disabled={!input.trim()||loading}
          style={{ width:44, height:44, borderRadius:"50%", background:input.trim()&&!loading?C.orange:"#E5E7EB", border:"none", cursor:input.trim()&&!loading?"pointer":"default", display:"flex", alignItems:"center", justifyContent:"center", fontSize:20, color:"#fff", flexShrink:0, transition:"all .2s", boxShadow:input.trim()?`0 4px 14px ${C.orangeGlow}`:"none" }}>➤</button>
      </div>
    </div>
  );
}

/* ── Profile ── */
function Profile({ onNavigate }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuItems = [
    { icon:"🏪", label:"Create Merchandise Account", screen:"create-merch" },
    { icon:"🛍️", label:"Your Merchandise Profile",   screen:"merch-profile" },
    { icon:"⚙️", label:"Settings",                   screen:"settings" },
    { icon:"🚪", label:"Log Out",                    screen:"logout", danger:true },
  ];
  const recentItems = [
    { name:"Baraka Fashion",  img:IMGS.avatars[0] },
    { name:"Joan Foods",      img:IMGS.food[0] },
    { name:"Urban Drives",    img:IMGS.cars[0] },
    { name:"Rahym Tech",      img:IMGS.tech[0] },
    { name:"Elegant Boutique",img:IMGS.fashion[1] },
  ];
  const storeItems = [
    { name:"Baraka Stores",   img:IMGS.fashion[0] },
    { name:"House of Cars",   img:IMGS.cars[1] },
    { name:"Car Soko",        img:IMGS.cars[2] },
    { name:"Ann's Thrift",    img:IMGS.fashion[3] },
    { name:"Sawa Outfitz",    img:IMGS.fashion[4] },
    { name:"Glitz & Glamour", img:IMGS.fashion[2] },
  ];

  return (
    <div style={{ maxWidth:600, margin:"0 auto", paddingBottom:24 }}>
      <div style={{ background:`linear-gradient(150deg,${C.dark} 0%,#13162a 100%)`, padding:"28px 18px 22px", position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", top:-40, right:-40, width:180, height:180, borderRadius:"50%", background:`radial-gradient(circle,${C.orangeGlow},transparent 70%)`, pointerEvents:"none" }} />
        <div style={{ display:"flex", alignItems:"center", gap:16, marginBottom:20 }}>
          <div style={{ position:"relative" }}>
            <Avatar src={USER.avatar} name={USER.name} size={80} border={C.orange} />
            <div style={{ position:"absolute", bottom:2, right:2, width:14, height:14, borderRadius:"50%", background:C.green, border:`2px solid ${C.dark}` }} />
          </div>
          <div style={{ flex:1 }}>
            <p style={{ fontSize:21, fontWeight:800, color:"#fff", fontFamily:"'Outfit',sans-serif" }}>{USER.name}</p>
            <p style={{ fontSize:13, color:"rgba(255,255,255,.65)", marginTop:3 }}>{USER.bio}</p>
            <p style={{ fontSize:12, color:"rgba(255,255,255,.4)", marginTop:3 }}>📍 {USER.location}</p>
          </div>
          <button onClick={()=>setMenuOpen(true)} style={{ background:"rgba(255,255,255,.1)", border:"none", borderRadius:10, width:40, height:40, display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", color:"#fff", fontSize:20, backdropFilter:"blur(4px)" }}>☰</button>
        </div>
        <div style={{ display:"flex", justifyContent:"space-around", borderTop:"1px solid rgba(255,255,255,.1)", paddingTop:18 }}>
          {[{val:3,lbl:"Stores"},{val:"4.8",lbl:"Rating"},{val:"2024",lbl:"Since"}].map(s => (
            <div key={s.lbl} style={{ textAlign:"center" }}>
              <p style={{ fontSize:24, fontWeight:800, color:"#fff", fontFamily:"'Outfit',sans-serif" }}>{s.val}</p>
              <p style={{ fontSize:11, color:"rgba(255,255,255,.4)", marginTop:2, textTransform:"uppercase", letterSpacing:.5 }}>{s.lbl}</p>
            </div>
          ))}
        </div>
      </div>

      <div style={{ padding:"12px 16px", background:C.card, borderBottom:`1px solid ${C.border}` }}>
        <Btn onClick={()=>onNavigate("edit-profile")} variant="outline" full>✎  Edit Profile</Btn>
      </div>

      <div style={{ padding:"18px 16px 4px", background:C.card, marginBottom:8 }}>
        <h3 style={{ fontSize:15, fontWeight:700, color:C.text, marginBottom:14, fontFamily:"'Outfit',sans-serif" }}>Recently Viewed</h3>
        <div style={{ display:"flex", gap:14, overflowX:"auto", paddingBottom:16, scrollbarWidth:"none" }}>
          {recentItems.map((item,i) => (
            <div key={i} style={{ flexShrink:0, display:"flex", flexDirection:"column", alignItems:"center", gap:6, width:68, cursor:"pointer" }}>
              <Img src={item.img} style={{ width:64, height:64, borderRadius:14, border:`2px solid ${C.orange}`, overflow:"hidden" }} />
              <p style={{ fontSize:10.5, color:C.text, textAlign:"center", lineHeight:1.3, fontWeight:500 }}>{item.name}</p>
            </div>
          ))}
        </div>
      </div>

      <div style={{ padding:"18px 16px", background:C.card }}>
        <h3 style={{ fontSize:15, fontWeight:700, color:C.text, marginBottom:14, fontFamily:"'Outfit',sans-serif" }}>Your Stores</h3>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:10 }}>
          {storeItems.map((s,i) => (
            <div key={i} style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:6, cursor:"pointer" }}>
              <Img src={s.img} style={{ width:"100%", aspectRatio:"1", borderRadius:12, overflow:"hidden" }} />
              <p style={{ fontSize:11, color:C.text, textAlign:"center", fontWeight:600, lineHeight:1.3 }}>{s.name}</p>
            </div>
          ))}
        </div>
      </div>

      {menuOpen && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,.55)", zIndex:300, display:"flex", alignItems:"flex-end" }} onClick={()=>setMenuOpen(false)}>
          <div style={{ width:"100%", maxWidth:600, margin:"0 auto", background:C.card, borderRadius:"22px 22px 0 0", padding:"16px 0 36px", animation:"slideIn .3s ease" }} onClick={e=>e.stopPropagation()}>
            <div style={{ width:40, height:4, background:"#E5E7EB", borderRadius:2, margin:"0 auto 18px" }} />
            {menuItems.map(opt => (
              <button key={opt.label} onClick={()=>{ setMenuOpen(false); onNavigate(opt.screen); }}
                style={{ width:"100%", display:"flex", alignItems:"center", gap:16, padding:"16px 24px", background:"none", border:"none", cursor:"pointer", borderBottom:`1px solid ${C.border}`, color:opt.danger?C.red:C.text, fontSize:15, fontWeight:500, transition:"background .15s" }}
                onMouseEnter={e=>e.currentTarget.style.background="#F9FAFB"}
                onMouseLeave={e=>e.currentTarget.style.background=""}>
                <span style={{ fontSize:22 }}>{opt.icon}</span>{opt.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Store Profile ── */
function StoreProfile({ store, onBack }) {
  const [followed, setFollowed] = useState(false);
  const s         = store || POSTS[0].store;
  const storeImgs = s.category==="Fashion"?IMGS.fashion : s.category==="Automotive"?IMGS.cars : s.category==="Food"?IMGS.food : IMGS.tech;

  return (
    <div style={{ maxWidth:720, margin:"0 auto", paddingBottom:90 }}>
      <div style={{ background:C.dark, padding:"14px 16px", display:"flex", alignItems:"center", gap:12 }}>
        <button onClick={onBack} style={{ background:"rgba(255,255,255,.1)", border:"none", borderRadius:8, width:36, height:36, display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", color:"#fff", fontSize:20 }}>←</button>
        <span style={{ color:"#fff", fontSize:16, fontWeight:700, fontFamily:"'Outfit',sans-serif" }}>Store Profile</span>
      </div>
      <div style={{ position:"relative" }}>
        <Img src={storeImgs[0]} style={{ height:220 }} />
        <div style={{ position:"absolute", inset:0, background:"linear-gradient(to top, rgba(0,0,0,.7), transparent 50%)" }} />
        <div style={{ position:"absolute", bottom:16, left:16, right:16, display:"flex", alignItems:"flex-end", gap:14 }}>
          <Avatar src={s.logo} name={s.name} size={68} border={C.orange} style={{ boxShadow:"0 4px 16px rgba(0,0,0,.3)" }} />
          <div style={{ flex:1 }}>
            <p style={{ fontSize:20, fontWeight:800, color:"#fff", fontFamily:"'Outfit',sans-serif" }}>{s.name}</p>
            <p style={{ fontSize:12, color:"rgba(255,255,255,.8)", marginTop:2 }}>{s.location?.building} · {s.location?.shopNumber}</p>
          </div>
          <button onClick={()=>setFollowed(!followed)}
            style={{ background:followed?"rgba(255,255,255,.2)":"#fff", color:followed?"#fff":C.orange, border:followed?"2px solid rgba(255,255,255,.4)":"none", borderRadius:24, padding:"9px 18px", fontWeight:700, fontSize:13, cursor:"pointer", transition:"all .2s", backdropFilter:"blur(4px)" }}>
            {followed?"✓ Following":"+ Follow"}
          </button>
        </div>
      </div>

      <div style={{ background:C.card, display:"flex", borderBottom:`1px solid ${C.border}` }}>
        {[{v:`${s.rating}★`,l:"Rating"},{v:followed?"1.3k":"1.2k",l:"Followers"},{v:"247",l:"Posts"}].map(stat => (
          <div key={stat.l} style={{ flex:1, padding:"16px 0", textAlign:"center", borderRight:`1px solid ${C.border}` }}>
            <p style={{ fontSize:19, fontWeight:800, color:C.text, fontFamily:"'Outfit',sans-serif" }}>{stat.v}</p>
            <p style={{ fontSize:11, color:C.muted, marginTop:2, textTransform:"uppercase", letterSpacing:.5 }}>{stat.l}</p>
          </div>
        ))}
      </div>

      <div style={{ background:C.card, padding:"18px 16px", marginBottom:8 }}>
        <h3 style={{ fontSize:15, fontWeight:700, marginBottom:14, color:C.text, fontFamily:"'Outfit',sans-serif" }}>Gallery</h3>
        <div style={{ display:"flex", gap:10, overflowX:"auto", paddingBottom:12, scrollbarWidth:"none" }}>
          {storeImgs.map((img,i) => <Img key={i} src={img} style={{ width:220, height:165, borderRadius:12, flexShrink:0, border:`1px solid ${C.border}`, overflow:"hidden" }} />)}
        </div>
      </div>

      <div style={{ background:C.card, padding:"14px 16px", display:"flex", gap:10, marginBottom:8 }}>
        {[{icon:"📞",label:"Call"},{icon:"💬",label:"Message"},{icon:"🗺️",label:"Directions"}].map(a => (
          <button key={a.label}
            style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center", gap:7, background:"#F9FAFB", border:`1px solid ${C.border}`, borderRadius:12, padding:"13px", cursor:"pointer", fontSize:14, fontWeight:600, color:C.text, transition:"all .15s" }}
            onMouseEnter={e=>{ e.currentTarget.style.background=C.orangeLight; e.currentTarget.style.color=C.orange; e.currentTarget.style.borderColor=C.orange; }}
            onMouseLeave={e=>{ e.currentTarget.style.background="#F9FAFB"; e.currentTarget.style.color=C.text; e.currentTarget.style.borderColor=C.border; }}>
            <span style={{ fontSize:18 }}>{a.icon}</span>{a.label}
          </button>
        ))}
      </div>

      <div style={{ background:C.card, padding:"18px 16px" }}>
        <h3 style={{ fontSize:15, fontWeight:700, marginBottom:10, color:C.text, fontFamily:"'Outfit',sans-serif" }}>About</h3>
        <p style={{ fontSize:14, color:"#444", lineHeight:1.75 }}>{s.name} is a trusted retailer in Nairobi. Find us at {s.location?.building}, {s.location?.shopNumber}, {s.location?.floor}.</p>
        <div style={{ display:"flex", flexWrap:"wrap", gap:8, marginTop:14 }}>
          {[`🕘 Mon–Sat 8am–8pm`,`📍 ${s.location?.building}`,`⭐ ${s.rating} rating`,`✅ Verified Store`].map(info => (
            <span key={info} style={{ fontSize:12, color:C.sub, background:"#F9FAFB", border:`1px solid ${C.border}`, padding:"5px 12px", borderRadius:20 }}>{info}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Settings ── */
function Settings({ onBack, onNavigate }) {
  const [notifs, setNotifs] = useState(true);
  const [dark,   setDark]   = useState(false);
  const [loc,    setLoc]    = useState(true);
  const items = [
    { icon:"👤", label:"My Profile",          fn:()=>onNavigate("edit-profile"), r:"›" },
    { icon:"🏪", label:"Merchandise Account", fn:()=>onNavigate("merch-profile"), r:"›" },
    { icon:"🔔", label:"Notifications",       toggle:notifs, onT:setNotifs },
    { icon:"🌙", label:"Dark Mode",           toggle:dark,   onT:setDark },
    { icon:"📍", label:"Location Services",   toggle:loc,    onT:setLoc },
    { icon:"🌐", label:"Language",            r:"English" },
    { icon:"🔒", label:"Privacy & Security",  r:"›" },
    { icon:"❓", label:"Help & FAQ",          r:"›" },
    { icon:"ℹ️",  label:"About PostMall v1.0",r:"›" },
    { icon:"🗑️", label:"Clear Cache" },
    { icon:"🚪", label:"Log Out",             fn:()=>onNavigate("logout"), danger:true },
  ];
  return (
    <div style={{ maxWidth:600, margin:"0 auto", paddingBottom:90 }}>
      <div style={{ background:C.dark, padding:"20px 16px", display:"flex", alignItems:"center", gap:14 }}>
        <button onClick={onBack} style={{ background:"rgba(255,255,255,.1)", border:"none", borderRadius:8, width:36, height:36, display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", color:"#fff", fontSize:20 }}>←</button>
        <h2 style={{ color:"#fff", fontSize:20, fontWeight:700, fontFamily:"'Outfit',sans-serif" }}>Settings</h2>
      </div>
      <div style={{ background:C.card, marginTop:8 }}>
        {items.map((s,i) => (
          <div key={i} onClick={s.fn}
            style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"17px 20px", borderBottom:`1px solid ${C.border}`, cursor:s.fn?"pointer":"default", transition:"background .15s" }}
            onMouseEnter={e=>{ if(s.fn) e.currentTarget.style.background="#F9FAFB"; }}
            onMouseLeave={e=>e.currentTarget.style.background=""}>
            <div style={{ display:"flex", alignItems:"center", gap:14 }}>
              <span style={{ fontSize:20 }}>{s.icon}</span>
              <span style={{ fontSize:15, color:s.danger?C.red:C.text, fontWeight:500 }}>{s.label}</span>
            </div>
            {s.toggle!==undefined
              ? <Toggle value={s.toggle} onChange={v=>s.onT(v)} />
              : <span style={{ color:C.muted, fontSize:14 }}>{s.r||""}</span>}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Create Merch ── */
function CreateMerch({ onBack }) {
  const [form, setForm] = useState({ storeName:"", city:"Nairobi", street:"", address:"", phone:"", category:"" });
  const set  = k => e => setForm(f => ({ ...f, [k]: e.target.value }));
  const cats = ["Fashion","Electronics","Food & Restaurant","Automotive","Accessories","Beauty","Sports","General"];
  return (
    <div style={{ maxWidth:600, margin:"0 auto", paddingBottom:90 }}>
      <div style={{ background:C.dark, padding:"20px 16px", display:"flex", alignItems:"center", gap:14 }}>
        <button onClick={onBack} style={{ background:"rgba(255,255,255,.1)", border:"none", borderRadius:8, width:36, height:36, display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", color:"#fff", fontSize:20 }}>←</button>
        <div>
          <h2 style={{ color:"#fff", fontSize:18, fontWeight:700, fontFamily:"'Outfit',sans-serif" }}>Create Merchandise Account</h2>
          <p style={{ color:"rgba(255,255,255,.4)", fontSize:12, marginTop:2 }}>Set up your store on PostMall</p>
        </div>
      </div>
      <div style={{ padding:24, background:C.card, marginTop:8 }}>
        <p style={{ fontSize:13, color:C.orange, marginBottom:20, cursor:"pointer", fontWeight:600 }}>Already registered? Sign in here →</p>
        <Field label="STORE NAME"    placeholder="e.g. Baraka Fashion House"         value={form.storeName} onChange={set("storeName")} icon="🏪"/>
        <Field label="CITY / TOWN"   placeholder="e.g. Nairobi"                      value={form.city}      onChange={set("city")}      icon="🏙️"/>
        <Field label="STREET"        placeholder="e.g. Moi Avenue"                   value={form.street}    onChange={set("street")}    icon="🗺️"/>
        <Field label="STORE ADDRESS" placeholder="e.g. City Mall, Shop 12, 2nd Fl"  value={form.address}   onChange={set("address")}   icon="📍"/>
        <Field label="PHONE NUMBER"  placeholder="+254 7XX XXX XXX"                  value={form.phone}     onChange={set("phone")}     icon="📱" type="tel"/>
        <label style={{ fontSize:12.5, fontWeight:600, color:C.sub, display:"block", marginBottom:8, letterSpacing:.3 }}>CATEGORY</label>
        <div style={{ display:"flex", flexWrap:"wrap", gap:8, marginBottom:24 }}>
          {cats.map(c => (
            <button key={c} onClick={()=>setForm(f=>({...f,category:c}))}
              style={{ padding:"8px 16px", borderRadius:24, border:`1.5px solid ${form.category===c?C.orange:C.border}`, background:form.category===c?C.orangeLight:C.card, color:form.category===c?C.orange:C.text, fontSize:13, fontWeight:600, cursor:"pointer", transition:"all .2s" }}>{c}</button>
          ))}
        </div>
        <Btn full size="lg" onClick={()=>alert("🎉 Your store is now live on PostMall!")}>Create Merchandise Account</Btn>
      </div>
    </div>
  );
}

/* ── Edit Profile ── */
function EditProfile({ onBack }) {
  const [form, setForm] = useState({ name:USER.name, email:USER.email, phone:USER.phone, bio:USER.bio, location:USER.location });
  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));
  return (
    <div style={{ maxWidth:600, margin:"0 auto", paddingBottom:90 }}>
      <div style={{ background:C.dark, padding:"20px 16px", display:"flex", alignItems:"center", gap:14 }}>
        <button onClick={onBack} style={{ background:"rgba(255,255,255,.1)", border:"none", borderRadius:8, width:36, height:36, display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", color:"#fff", fontSize:20 }}>←</button>
        <h2 style={{ color:"#fff", fontSize:18, fontWeight:700, fontFamily:"'Outfit',sans-serif" }}>Edit Profile</h2>
      </div>
      <div style={{ background:C.card, padding:"24px 20px", textAlign:"center", borderBottom:`1px solid ${C.border}` }}>
        <div style={{ position:"relative", display:"inline-block" }}>
          <Avatar src={USER.avatar} name={USER.name} size={90} border={C.orange} />
          <button style={{ position:"absolute", bottom:0, right:0, background:C.orange, border:"none", borderRadius:"50%", width:30, height:30, cursor:"pointer", color:"#fff", fontSize:14, display:"flex", alignItems:"center", justifyContent:"center" }}>✎</button>
        </div>
        <p style={{ fontSize:13, color:C.orange, marginTop:12, cursor:"pointer", fontWeight:600 }}>Change profile photo</p>
      </div>
      <div style={{ background:C.card, padding:"24px 20px", marginTop:8 }}>
        <Field label="FULL NAME" value={form.name}     onChange={set("name")}     icon="👤"/>
        <Field label="EMAIL"     type="email" value={form.email} onChange={set("email")} icon="✉️"/>
        <Field label="PHONE"     type="tel"   value={form.phone} onChange={set("phone")} icon="📱"/>
        <Field label="LOCATION"  value={form.location} onChange={set("location")} icon="📍"/>
        <Field label="BIO"       value={form.bio}      onChange={set("bio")}      icon="📝" multiline/>
        <Btn full size="lg" onClick={()=>alert("✅ Profile updated successfully!")}>Save Changes</Btn>
      </div>
    </div>
  );
}

/* ── Bottom Nav ── */
function BottomNav({ active, onChange }) {
  const tabs = [
    { id:"home",    icon:"🏠", label:"Home" },
    { id:"search",  icon:"🔍", label:"Search" },
    { id:"ai",      icon:"✨", label:"Lana AI", special:true },
    { id:"profile", icon:"👤", label:"Profile" },
  ];
  return (
    <nav style={{ position:"fixed", bottom:0, left:0, right:0, zIndex:200, background:C.card, borderTop:`1px solid ${C.border}`, display:"flex", justifyContent:"space-around", boxShadow:"0 -4px 24px rgba(0,0,0,.08)" }}>
      {tabs.map(t => (
        <button key={t.id} onClick={()=>onChange(t.id)}
          style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:3, padding:"8px 0 12px", background:"none", border:"none", cursor:"pointer" }}>
          {t.special
            ? <div style={{ width:48, height:48, borderRadius:"50%", background:active===t.id?C.orange:C.dark, display:"flex", alignItems:"center", justifyContent:"center", fontSize:20, marginTop:-20, boxShadow:`0 6px 20px ${C.orangeGlow}`, border:`3px solid ${C.card}`, transition:"all .2s" }}>{t.icon}</div>
            : <span style={{ fontSize:22, filter:active===t.id?"none":"grayscale(.8) opacity(.6)", transition:"filter .2s" }}>{t.icon}</span>
          }
          <span style={{ fontSize:10.5, fontWeight:700, color:active===t.id?C.orange:C.muted, marginTop:t.special?3:0, letterSpacing:.3 }}>{t.label}</span>
        </button>
      ))}
    </nav>
  );
}

/* ── ROOT APP ── */
export default function App() {
  const [phase,    setPhase]    = useState("splash");
  const [tab,      setTab]      = useState("home");
  const [sub,      setSub]      = useState(null);
  const [selStore, setSelStore] = useState(null);

  const navigate = screen => {
    if (screen==="logout") { setPhase("auth"); setTab("home"); setSub(null); return; }
    setSub(screen);
  };

  if (phase==="splash") return <Splash onDone={()=>setPhase("auth")} />;
  if (phase==="auth")   return <Login  onLogin={()=>setPhase("main")} />;

  if (sub==="merch-profile") return <div style={{ minHeight:"100vh", background:C.bg }}><StoreProfile store={selStore} onBack={()=>setSub(null)} /></div>;
  if (sub==="settings")      return <div style={{ minHeight:"100vh", background:C.bg }}><Settings     onBack={()=>setSub(null)} onNavigate={navigate} /></div>;
  if (sub==="create-merch")  return <div style={{ minHeight:"100vh", background:C.bg }}><CreateMerch  onBack={()=>setSub(null)} /></div>;
  if (sub==="edit-profile")  return <div style={{ minHeight:"100vh", background:C.bg }}><EditProfile  onBack={()=>setSub(null)} /></div>;

  return (
    <div style={{ minHeight:"100vh", background:C.bg }}>
      <header style={{ position:"sticky", top:0, zIndex:100, background:C.card, borderBottom:`1px solid ${C.border}`, padding:"0 16px", display:"flex", alignItems:"center", justifyContent:"space-between", height:58, boxShadow:"0 1px 12px rgba(0,0,0,.05)" }}>
        {(tab==="home"||tab==="ai")
          ? <div style={{ display:"flex", alignItems:"baseline" }}>
              <span style={{ fontSize:24, fontWeight:800, color:C.dark, fontFamily:"'Outfit',sans-serif" }}>Post</span>
              <span style={{ fontSize:24, fontWeight:800, color:C.orange, fontFamily:"'Outfit',sans-serif" }}>Mall</span>
            </div>
          : <h2 style={{ fontSize:18, fontWeight:700, color:C.text, fontFamily:"'Outfit',sans-serif" }}>
              {tab==="search"?"Explore 🔍":"My Profile 👤"}
            </h2>
        }
        <div style={{ display:"flex", gap:4 }}>
          {tab==="home" && <>
            <button style={{ width:36, height:36, borderRadius:10, display:"flex", alignItems:"center", justifyContent:"center", fontSize:19, color:C.text }} onMouseEnter={e=>e.currentTarget.style.background="#F3F4F6"} onMouseLeave={e=>e.currentTarget.style.background=""}>🤍</button>
            <button style={{ width:36, height:36, borderRadius:10, display:"flex", alignItems:"center", justifyContent:"center", fontSize:19, color:C.text }} onMouseEnter={e=>e.currentTarget.style.background="#F3F4F6"} onMouseLeave={e=>e.currentTarget.style.background=""}>✈️</button>
          </>}
          {tab==="ai" && (
            <div style={{ display:"flex", alignItems:"center", gap:6 }}>
              <div style={{ width:8, height:8, borderRadius:"50%", background:C.green, animation:"pulse 2s infinite" }}/>
              <span style={{ fontSize:12, color:C.muted, fontWeight:500 }}>Online</span>
            </div>
          )}
          {tab==="profile" && (
            <button style={{ background:C.orangeLight, border:"none", borderRadius:10, padding:"7px 13px", cursor:"pointer", fontSize:13, color:C.orange, fontWeight:700 }}>+ New Post</button>
          )}
        </div>
      </header>

      <main style={{ paddingBottom:70 }}>
        {tab==="home"    && <Home    onViewStore={s=>{ setSelStore(s); setSub("merch-profile"); }} />}
        {tab==="search"  && <Search  />}
        {tab==="ai"      && <LanaAI  />}
        {tab==="profile" && <Profile onNavigate={navigate} />}
      </main>

      <BottomNav active={tab} onChange={setTab} />
    </div>
  );
}

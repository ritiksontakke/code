import { useEffect, useState } from "react";
import axios from "axios";
import Lenis from "lenis";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ArrowDown, ArrowUpRight, Check, Heart, Sparkles } from "lucide-react";
import "@/App.css";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;
const reasons = [
  "Tula mazha rag aala ahe mhnun bolat nahe",
  "Interest nahe mhnun",
  "Life madhee kadhi bolaycha nahe",
  "Mala thoda time hava ahe",
];

function Teddy() {
  return (
    <div className="teddy-stage" aria-label="A cute teddy holding its ears and saying sorry" data-testid="teddy-apology-animation">
      <div className="halo" />
      <motion.div className="teddy" animate={{ y: [0, -10, 0], rotate: [-2, 2, -2] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}>
        <div className="ear ear-left" /><div className="ear ear-right" />
        <div className="paw paw-left" /><div className="paw paw-right" />
        <div className="teddy-face"><span className="eye eye-left" /><span className="eye eye-right" /><span className="muzzle"><span className="nose" /><span className="smile" /></span></div>
        <div className="teddy-body"><span className="heart-mark">♥</span></div>
      </motion.div>
      {["♥", "✦", "♡", "✧"].map((symbol, index) => <motion.span key={symbol} className={`float float-${index}`} animate={{ y: [-4, -34], opacity: [0, 1, 0], scale: [0.8, 1.1] }} transition={{ duration: 3 + index * .4, repeat: Infinity, delay: index * .6 }}>{symbol}</motion.span>)}
    </div>
  );
}

function App() {
  const [reason, setReason] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const tilt = useMotionValue(0);
  const smoothTilt = useSpring(tilt, { stiffness: 120, damping: 20 });
  const teddyRotate = useTransform(smoothTilt, [-20, 20], [-4, 4]);

  useEffect(() => {
    document.title = "Just For You — a little corner for us";
    const lenis = new Lenis({ duration: 1.15, smoothWheel: true });
    let frame;
    const raf = (time) => { lenis.raf(time); frame = requestAnimationFrame(raf); };
    frame = requestAnimationFrame(raf);
    return () => { cancelAnimationFrame(frame); lenis.destroy(); };
  }, []);

  const submit = async (event) => {
    event.preventDefault();
    if (!reason) { setError("Ek reason select kara, please."); return; }
    setLoading(true); setError("");
    try {
      await axios.post(`${API}/responses`, { reason, message });
      setSubmitted(true);
    } catch { setError("Message pathavta ala nahi. Please punha try kara."); }
    finally { setLoading(false); }
  };

  return (
    <main className="site-shell" onPointerMove={(event) => tilt.set((event.clientX / window.innerWidth - .5) * 12)}>
      <nav className="topbar"><a href="#top" className="brand" data-testid="brand-home-link"><span className="brand-mark">♥</span><span>Just For You</span></a><span className="nav-note" data-testid="nav-note">a little corner for us <Heart size={14} fill="currentColor" /></span></nav>
      <section className="hero" id="top">
        <motion.div className="hero-copy" initial="hidden" animate="show" variants={{ hidden: {}, show: { transition: { staggerChildren: .12 } } }}>
          <motion.p className="eyebrow" variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}><Sparkles size={14} /> an honest little note</motion.p>
          <motion.h1 variants={{ hidden: { opacity: 0, y: 48 }, show: { opacity: 1, y: 0, transition: { duration: .8 } } }}>I’m sorry.<br /><em>Can we talk?</em></motion.h1>
          <motion.p className="lede" variants={{ hidden: { opacity: 0, y: 22 }, show: { opacity: 1, y: 0 } }}>Some feelings deserve more than a text. This one comes with tiny paws, a full heart, and the courage to ask.</motion.p>
          <motion.a href="#reply" className="hero-cta" variants={{ hidden: { opacity: 0 }, show: { opacity: 1 } }} data-testid="hero-reply-link">Tell me how you feel <ArrowDown size={17} /></motion.a>
        </motion.div>
        <motion.div className="hero-art" style={{ rotate: teddyRotate }} initial={{ opacity: 0, scale: .8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1, delay: .3 }}><Teddy /><div className="sorry-stamp">I AM<br /><strong>SORRY</strong></div></motion.div>
        <div className="hero-index" data-testid="hero-index">01 <span /> 03</div>
      </section>
      <div className="marquee" data-testid="romantic-marquee"><div>soft hearts • honest words • one more chance • soft hearts • honest words • one more chance • </div></div>
      {!submitted ? <section className="reply-section" id="reply"><div className="section-kicker">02 / your turn</div><div className="reply-grid"><div><h2>Tell me what’s<br /><em>on your mind.</em></h2><p className="section-copy">No pressure, no perfect words. Just pick what feels closest and leave a little note if you want to.</p><div className="tiny-note"><span className="pulse-dot" /> Your answer comes straight to my inbox.</div></div><motion.form className="reply-card" onSubmit={submit} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}><label htmlFor="reason">What happened?</label><div className="select-wrap"><select id="reason" value={reason} onChange={(event) => setReason(event.target.value)} data-testid="reason-select" aria-label="Choose a reason"><option value="">Select a reason...</option>{reasons.map((item) => <option value={item} key={item}>{item}</option>)}</select><ArrowDown size={17} /></div><label htmlFor="message">A few words, if you feel like it <span>(optional)</span></label><textarea id="message" rows="4" maxLength="1000" value={message} onChange={(event) => setMessage(event.target.value)} placeholder="Write anything... even just a heart." data-testid="message-input" aria-label="Optional message" /><div className="form-bottom"><span className="privacy"><Heart size={13} /> only for us</span><button type="submit" disabled={loading} data-testid="submit-response-button">{loading ? "Sending..." : "Send my answer"} <ArrowUpRight size={17} /></button></div>{error && <p className="form-error" role="alert" data-testid="form-error">{error}</p>}</motion.form></div></section> : <section className="success-section" data-testid="success-screen"><div className="success-orbit"><Heart size={52} fill="currentColor" /></div><div className="section-kicker">03 / received with love</div><h2>Tujha answer milala,<br /><em>thank you ❤️</em></h2><p>Mi vachla. Mi samajun gheto. And I’m really glad you told me.</p><div className="success-check"><Check size={16} /> delivered to my heart</div></section>}
      <footer><span>Made with a soft heart, for one person.</span><span>© Just For You <Heart size={13} fill="currentColor" /></span></footer>
    </main>
  );
}

export default App;
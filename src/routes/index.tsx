import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { ArrowDown, ArrowUpRight, ChevronLeft, ChevronRight, Flame, Instagram, Mail, Menu, Phone, ShieldCheck, Sparkles, Truck, X, Zap, Gauge, Users, Wrench, CalendarDays } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Toaster } from "@/components/ui/sonner";
import { acts, advantages, gallery, images, tour } from "@/content";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Team Klaas Motor Show | Stunt Shows for Events & Celebrations" },
      { name: "description", content: "Monstertrucks, drifting, fire stunts and full-throttle crashes. Book Team Klaas Motor Show for festivals, celebrations and live events." },
      { property: "og:title", content: "Team Klaas Motor Show | Feel the Impact" },
      { property: "og:description", content: "Monstertrucks, drifting, fire stunts and full-throttle crashes. Bring Team Klaas to your next event." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ]
  }),
  component: Home,
});

const nav = [{ label: "The Show", href: "#show" }, { label: "Pictures", href: "#pictures" }, { label: "Price / Tour", href: "#price" }, { label: "Contact", href: "#contact" }];
const filters = ["All", "Monstertrucks", "Drift", "Fire", "Crash", "Jumps"];
const schema = z.object({
  name: z.string().trim().min(1, "Please enter your name.").max(100),
  email: z.string().trim().email("Please enter a valid email.").max(255),
  event: z.string().min(1, "Please select an event type."),
  date: z.string(),
  message: z.string().trim().min(10, "Please tell us a little more about your event.").max(2000),
});

type FormData = z.infer<typeof schema>;
const initialForm: FormData = { name: "", email: "", event: "", date: "", message: "" };

function Reveal({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const reduced = useReducedMotion();
  return <motion.div className={className} initial={reduced ? false : { opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.13 }} transition={{ duration: .65, ease: "easeOut" }}>{children}</motion.div>;
}

function Heading({ eyebrow, title, aside }: { eyebrow: string; title: string; aside?: string }) {
  return <div className="section-heading"><div><p className="eyebrow"><span className="eyebrow-line" />{eyebrow}</p><h2 className="display-title">{title}</h2></div>{aside && <p className="section-aside">{aside}</p>}</div>;
}

function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [filter, setFilter] = useState("All");
  const [activeImage, setActiveImage] = useState<number | null>(null);
  const [form, setForm] = useState<FormData>(initialForm);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const reduced = useReducedMotion();
  const { scrollY } = useScroll();
  const heroShift = useTransform(scrollY, [0, 800], [0, reduced ? 0 : 110]);
  const shownGallery = gallery.map((item, index) => ({ ...item, index })).filter(item => filter === "All" || item.category === filter);
  const selectedImage = activeImage === null ? undefined : gallery[activeImage];

  useEffect(() => { document.body.style.overflow = menuOpen ? "hidden" : ""; return () => { document.body.style.overflow = ""; }; }, [menuOpen]);
  useEffect(() => {
    if (activeImage === null) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight") setActiveImage(current => current === null ? null : (current + 1) % gallery.length);
      if (event.key === "ArrowLeft") setActiveImage(current => current === null ? null : (current - 1 + gallery.length) % gallery.length);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [activeImage]);

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const result = schema.safeParse(form);
    if (!result.success) {
      const next: Partial<Record<keyof FormData, string>> = {};
      result.error.issues.forEach(issue => { const key = issue.path[0] as keyof FormData; if (!next[key]) next[key] = issue.message; });
      setErrors(next);
      toast.error("Please check the highlighted fields.");
      return;
    }
    setErrors({});
    const data = result.data;
    const subject = encodeURIComponent(`Show booking enquiry — ${data.event}`);
    const body = encodeURIComponent(`Name: ${data.name}\nEmail: ${data.email}\nEvent type: ${data.event}\nEvent date: ${data.date || "Not confirmed"}\n\n${data.message}`);
    window.location.href = `mailto:teamklaasmotorshow@gmail.com?subject=${subject}&body=${body}`;
    toast.success("Your email draft is ready. Send it from your email app to complete the request.");
  }

  return <div className="site-shell">
    <Toaster position="bottom-right" richColors />
    <header className="site-header">
      <div className="nav-shell">
        <a href="#top" className="brand" aria-label="Team Klaas home"><span>TEAM KLAAS<span className="brand-small">MOTOR SHOW</span></span></a>
        <nav className="desktop-nav" aria-label="Main navigation">{nav.map(item => <a key={item.href} href={item.href}>{item.label}</a>)}</nav>
        <Button asChild className="nav-cta orange-button"><a href="#booking">BOOK THE SHOW <ArrowUpRight size={16} /></a></Button>
        <Button variant="ghost" size="icon" className="menu-toggle" aria-label={menuOpen ? "Close menu" : "Open menu"} aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X /> : <Menu />}</Button>
      </div>
    </header>
    {menuOpen && <div className="mobile-menu"><nav aria-label="Mobile navigation">{nav.map(item => <a key={item.href} href={item.href} onClick={() => setMenuOpen(false)}>{item.label}<ArrowUpRight /></a>)}<a href="#booking" onClick={() => setMenuOpen(false)}>Book the Show<ArrowUpRight /></a></nav><p>FULL THROTTLE. NO COMPROMISE.</p></div>}

    <main>
      <section id="top" className="hero" aria-labelledby="hero-title">
        <motion.div className="hero-image-wrap" style={{ y: heroShift }}><img src={"https://www.team-klaas.com/pluginAppObj/pluginAppObj_3_02/017_sb.jpg"} alt="Monster truck leaping over crushed cars amid fire at a stunt arena" className="hero-image" width={1920} height={1280} fetchPriority="high" /></motion.div>
        <div className="hero-shade" />
        <div className="hero-inner page-width">
          <div className="hero-copy"><p className="eyebrow hero-eyebrow"><span className="eyebrow-line" /> THE MOTOR SHOW EXPERIENCE <span className="edition">DENMARK · EST. IN ACTION</span></p>
            <h1 id="hero-title">KLAAS-<br /><span>STUNTMEN</span></h1>
            <p className="hero-subline">AVAILABLE FOR EVENTS & CELEBRATIONS.</p>
            <p className="hero-description">Monster trucks, drifting, fire stunts and full-throttle crashes — a motor show your audience will never forget.</p>
            <div className="hero-actions"><Button asChild className="orange-button big-button"><a href="#booking">BOOK THE SHOW <ArrowUpRight /></a></Button><Button asChild variant="outline" className="outline-button big-button"><a href="#show">SEE THE SHOW <ArrowDown /></a></Button></div>
          </div>
          <div className="hero-bottom"><div className="hero-index"><span className="index-dash" /> LIVE STUNT EXPERIENCE <span className="hero-index-number">01 / 04</span></div><a className="scroll-cue" href="#show">SCROLL TO EXPLORE <ArrowDown size={15} /></a></div>
        </div>
      </section>

      <div className="marquee" aria-label="Monstertrucks, drift, fire, crash, jumps, quad"><div className="marquee-track" aria-hidden="true">{Array.from({ length: 4 }).map((_, i) => <span key={i}>MONSTERTRUCKS <b>✳</b> DRIFT <b>✳</b> FIRE <b>✳</b> CRASH <b>✳</b> JUMPS <b>✳</b> QUAD <b>✳</b> </span>)}</div></div>

      <section id="show" className="section show-section page-width"><Reveal><Heading eyebrow="01 / WHAT WE DO" title="THE SHOW" aside="Nine acts. One unforgettable experience. Every second built to keep your audience on the edge of their seats." /></Reveal><div className="acts-grid">{acts.map((act, index) => <Reveal key={act.number} className={`act-card act-${index + 1}`}><div className="act-image"><img src={act.image} alt={`${act.title} stunt act`} loading="lazy" width={600} height={450} /></div><div className="act-overlay" /><div className="act-top"><span>{act.number} / 09</span><ArrowUpRight size={19} /></div><div className="act-bottom"><h3>{act.title}</h3><p>{act.description}</p></div></Reveal>)}</div></section>

      <section id="pictures" className="section pictures-section"><div className="page-width"><Reveal><Heading eyebrow="02 / THE MOMENTS" title="PICTURES" aside="No render can capture the noise. These are real moments from the Team Klaas arena." /></Reveal><div className="filter-row" role="group" aria-label="Filter pictures">{filters.map(item => <Button key={item} variant="ghost" className={`filter-chip ${filter === item ? "active" : ""}`} aria-pressed={filter === item} onClick={() => setFilter(item)}>{item}</Button>)}</div><div className="gallery-grid">{shownGallery.map((item) => <Button key={item.index} variant="ghost" className="gallery-item" aria-label={`View photo: ${item.title}`} onClick={() => setActiveImage(item.index)}><img src={item.image} alt={item.title} loading="lazy" width={500} height={380} /><span className="gallery-caption"><span>{item.category}</span><ArrowUpRight size={18} /></span></Button>)}</div></div></section>

      <section className="section why-section page-width"><Reveal><Heading eyebrow="03 / WHY TEAM KLAAS" title={"BUILT TO\nBLOW MINDS"} aside="More than a show. A full-sensory moment your crowd will talk about long after the engines stop." /></Reveal><div className="advantages-grid">{advantages.map((item, i) => { const Icon = [Zap, Truck, Users, ShieldCheck, Gauge, Wrench][i] ?? Zap; return <Reveal key={item.title} className="advantage"><span className="advantage-icon"><Icon size={25} strokeWidth={1.7} /></span><span className="advantage-number">0{i + 1}</span><h3>{item.title}</h3><p>{item.description}</p></Reveal>; })}</div></section>

      <section className="cta-band"><div className="page-width cta-inner"><div><p className="eyebrow">THE NEXT BIG MOMENT STARTS HERE</p><h2>KLAAS-STUNTMEN.<br />YOUR EVENT. <em>OUR ARENA.</em></h2><p>Available for events & celebrations.</p></div><Button asChild className="cta-white-button"><a href="#booking">REQUEST A QUOTE <ArrowUpRight size={19} /></a></Button></div></section>

      <section id="price" className="section info-section page-width"><Reveal><Heading eyebrow="04 / LET'S MAKE IT HAPPEN" title="PRICE / TOUR" aside="Every show is different. Tell us what you have in mind, and we'll put together the right experience." /></Reveal><div className="info-grid"><div className="booking-steps"><h3>FROM IDEA TO IMPACT</h3>{[{ n: "01", title: "CONTACT US", text: "Tell us about your event, venue and audience." }, { n: "02", title: "CHOOSE YOUR ACTS", text: "We'll shape a show around your space and vision." }, { n: "03", title: "WE BRING THE SHOW", text: "The crew, the vehicles and the adrenaline arrive." }].map(step => <div className="step" key={step.n}><span>{step.n}</span><div><h4>{step.title}</h4><p>{step.text}</p></div><ArrowUpRight size={18} /></div>)}</div><div className="tour-panel"><div className="tour-panel-head"><div><p className="eyebrow">ON THE ROAD</p><h3>2026 TOUR</h3></div><CalendarDays size={26} /></div><p className="tour-intro">Recent tour stops. Check the official schedule for new dates.</p>{tour.map(date => <div className="tour-row" key={date.place}><span className="tour-date">{date.date}</span><div><strong>{date.place}</strong><small>{date.venue}</small></div><ArrowUpRight size={17} /></div>)}<a className="tour-link" href="https://www.team-klaas.com/price-tour.html" target="_blank" rel="noopener noreferrer">VIEW FULL TOUR SCHEDULE <ArrowUpRight size={16} /></a><div className="price-note"><Sparkles size={18} /><p><strong>YOUR SHOW, YOUR QUOTE.</strong><br />Prices depend on acts, location and date. Contact us for a custom quote.</p></div></div></div>
        <div id="booking" className="booking-block"><div className="booking-intro"><p className="eyebrow"><span className="eyebrow-line" /> MAKE SOME NOISE</p><h2>BRING THE<br /><span>SHOW TO YOU.</span></h2><p>Planning a festival, city celebration or company event? Tell us what you're dreaming up.</p><div className="booking-contact"><a href="mailto:teamklaasmotorshow@gmail.com"><Mail size={18} /> teamklaasmotorshow@gmail.com</a><a href="tel:+4552822978"><Phone size={18} /> +45 52822978</a></div></div><form className="booking-form" onSubmit={submit} noValidate><div className="form-two"><div className="field"><label htmlFor="name">YOUR NAME *</label><Input id="name" placeholder="Your name" maxLength={100} value={form.name} aria-invalid={!!errors.name} onChange={e => setForm({ ...form, name: e.target.value })} />{errors.name && <span className="field-error">{errors.name}</span>}</div><div className="field"><label htmlFor="email">EMAIL ADDRESS *</label><Input id="email" type="email" placeholder="you@example.com" maxLength={255} value={form.email} aria-invalid={!!errors.email} onChange={e => setForm({ ...form, email: e.target.value })} />{errors.email && <span className="field-error">{errors.email}</span>}</div></div><div className="form-two"><div className="field"><label htmlFor="event">EVENT TYPE *</label><select id="event" value={form.event} aria-invalid={!!errors.event} onChange={e => setForm({ ...form, event: e.target.value })}><option value="">Select event type</option><option>Festival</option><option>City celebration</option><option>Corporate event</option><option>Other event</option></select>{errors.event && <span className="field-error">{errors.event}</span>}</div><div className="field"><label htmlFor="date">EVENT DATE</label><Input id="date" type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} /></div></div><div className="field"><label htmlFor="message">TELL US ABOUT YOUR EVENT *</label><Textarea id="message" placeholder="Where is it? How big is the crowd? What acts are you interested in?" maxLength={2000} value={form.message} aria-invalid={!!errors.message} onChange={e => setForm({ ...form, message: e.target.value })} />{errors.message && <span className="field-error">{errors.message}</span>}</div><div className="form-submit"><Button type="submit" className="orange-button big-button"> REQUEST SHOW <ArrowUpRight /></Button></div></form></div>
      </section>
    </main>

    <footer id="contact" className="footer"><div className="page-width"><div className="footer-top"><div><a href="#top" className="footer-logo">TEAM KLAAS<span>MOTOR SHOW</span></a><p>Full-throttle entertainment.<br />Built to be remembered.</p></div><div className="footer-group"><h3>EXPLORE</h3>{nav.map(item => <a key={item.href} href={item.href}>{item.label}</a>)}</div><div className="footer-group"><h3>GET IN TOUCH</h3><span>Dustin Klaas</span><a href="mailto:teamklaasmotorshow@gmail.com">teamklaasmotorshow@gmail.com</a><a href="tel:+4552822978">+45 52822978</a><div className="socials"><a href="#contact" aria-label="Facebook (link coming soon)"><span className="facebook-glyph">f</span></a><a href="#contact" aria-label="Instagram (link coming soon)"><Instagram size={18} /></a></div></div></div><div className="footer-giant" aria-hidden="true">TEAM KLAAS</div><div className="footer-bottom"><span>© {new Date().getFullYear()} TEAM KLAAS MOTOR SHOW</span><span>MADE FOR THE MOMENT.</span><div><a href="https://www.team-klaas.com/impressum.html" target="_blank" rel="noopener noreferrer">IMPRINT</a><a href="https://www.team-klaas.com/datenschutz.html" target="_blank" rel="noopener noreferrer">PRIVACY POLICY</a></div></div></div></footer>

    <Dialog open={activeImage !== null} onOpenChange={open => { if (!open) setActiveImage(null); }}><DialogContent className="lightbox"><DialogTitle className="sr-only">{selectedImage?.title ?? "Picture"}</DialogTitle><DialogDescription className="sr-only">Team Klaas action photo. Use arrow keys to browse.</DialogDescription>{selectedImage && activeImage !== null && <><img src={selectedImage.image} alt={selectedImage.title} /><div className="lightbox-bottom"><span>{selectedImage.title} <small>{activeImage + 1} / {gallery.length}</small></span><div><Button variant="ghost" size="icon" aria-label="Previous picture" onClick={() => setActiveImage((activeImage - 1 + gallery.length) % gallery.length)}><ChevronLeft /></Button><Button variant="ghost" size="icon" aria-label="Next picture" onClick={() => setActiveImage((activeImage + 1) % gallery.length)}><ChevronRight /></Button></div></div></>}</DialogContent></Dialog>
  </div>;
}

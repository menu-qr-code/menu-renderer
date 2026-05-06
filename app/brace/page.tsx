"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  AnimatePresence,
  motion,
  useAnimationFrame,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from "motion/react";
import { createPortal } from "react-dom";
import { X, ChevronDown, Menu } from "lucide-react";
import * as THREE from "three";
import { useMousePositionRef } from "@/hooks/use-mouse-position-ref";
import { cn } from "@/lib/utils";

// ─────────────────────────────────────────────
// PALETTE BRACE
// ─────────────────────────────────────────────
const C = {
  bg: "#0A0A0A",
  fire: "#E8540A",
  ember: "#C4380A",
  text: "#F0EAD6",
  muted: "#8C7B6B",
  card: "#141414",
  nav: "rgba(10,10,10,0.85)",
};

// ─────────────────────────────────────────────
// MOLTEN CORE SHADER (background)
// ─────────────────────────────────────────────
function MoltenCoreShader() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const clock = new THREE.Clock();
    const renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);

    const vertexShader = `void main() { gl_Position = vec4(position, 1.0); }`;
    const fragmentShader = `
      precision highp float;
      uniform vec2 iResolution;
      uniform float iTime;

      float random(vec2 st) { return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123); }
      float noise(vec2 st) {
        vec2 i = floor(st); vec2 f = fract(st);
        float a = random(i); float b = random(i + vec2(1.0, 0.0));
        float c = random(i + vec2(0.0, 1.0)); float d = random(i + vec2(1.0, 1.0));
        vec2 u = f * f * (3.0 - 2.0 * f);
        return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.y * u.x;
      }
      float fbm(vec2 st) {
        float value = 0.0; float amplitude = 0.5;
        for (int i = 0; i < 6; i++) { value += amplitude * noise(st); st *= 2.0; amplitude *= 0.5; }
        return value;
      }
      void main() {
        vec2 uv = gl_FragCoord.xy / iResolution.xy;
        uv.x *= iResolution.x / iResolution.y;
        float t = iTime * 0.2;
        vec2 q = uv * 3.0;
        float n1 = fbm(q + vec2(t * 0.5, t * 0.2));
        float n2 = fbm(q * 2.0 - vec2(t * 0.5, t * 0.2));
        float cn = n1 + n2 * 0.5;
        vec3 c1 = vec3(0.05, 0.0, 0.0);
        vec3 c2 = vec3(0.7, 0.15, 0.0);
        vec3 c3 = vec3(0.91, 0.33, 0.04);
        vec3 c4 = vec3(1.0, 0.82, 0.2);
        vec3 lava = mix(c1, c2, smoothstep(0.3, 0.45, cn));
        lava = mix(lava, c3, smoothstep(0.5, 0.6, cn));
        lava = mix(lava, c4, smoothstep(0.7, 0.75, cn));
        float vignette = 1.0 - length(uv - 0.5) * 0.9;
        lava *= vignette;
        gl_FragColor = vec4(lava, 0.35);
      }
    `;

    const uniforms = {
      iTime: { value: 0 },
      iResolution: { value: new THREE.Vector2() },
    };
    const material = new THREE.ShaderMaterial({ vertexShader, fragmentShader, uniforms, transparent: true });
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
    scene.add(mesh);

    let animId: number;
    const onResize = () => {
      const w = container.clientWidth, h = container.clientHeight;
      renderer.setSize(w, h);
      uniforms.iResolution.value.set(w, h);
    };
    onResize();
    window.addEventListener("resize", onResize);

    const animate = () => {
      uniforms.iTime.value = clock.getElapsedTime();
      renderer.render(scene, camera);
      animId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(animId);
      renderer.dispose();
      material.dispose();
      if (container.contains(renderer.domElement)) container.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none" }}
    />
  );
}

// ─────────────────────────────────────────────
// VERTICAL CUT REVEAL
// ─────────────────────────────────────────────
interface VCRProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}
function VerticalCutReveal({ children, delay = 0, className }: VCRProps) {
  const text = typeof children === "string" ? children : String(children);
  const words = text.split(" ");
  return (
    <span className={cn("inline-flex flex-wrap gap-x-[0.25em]", className)}>
      {words.map((word, wi) => (
        <span key={wi} className="overflow-hidden inline-flex">
          <motion.span
            className="inline-block"
            initial={{ y: "110%" }}
            animate={{ y: 0 }}
            transition={{ type: "spring", stiffness: 120, damping: 20, delay: delay + wi * 0.06 }}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </span>
  );
}

// ─────────────────────────────────────────────
// PARALLAX TEXT SCROLL (ticker)
// ─────────────────────────────────────────────
const wrap = (min: number, max: number, v: number) => {
  const r = max - min;
  return ((((v - min) % r) + r) % r) + min;
};

function ParallaxText({ children, baseVelocity = -5 }: { children: React.ReactNode; baseVelocity?: number }) {
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, { damping: 50, stiffness: 400 });
  const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 5], { clamp: false });
  const x = useTransform(baseX, (v) => `${wrap(-20, -45, v)}%`);
  const directionFactor = useRef<number>(1);

  useAnimationFrame((_, delta) => {
    let moveBy = directionFactor.current * baseVelocity * (delta / 1000);
    if (velocityFactor.get() < 0) directionFactor.current = -1;
    else if (velocityFactor.get() > 0) directionFactor.current = 1;
    moveBy += directionFactor.current * moveBy * velocityFactor.get();
    baseX.set(baseX.get() + moveBy);
  });

  return (
    <div className="overflow-hidden whitespace-nowrap flex flex-nowrap">
      <motion.div style={{ x }} className="flex whitespace-nowrap flex-nowrap will-change-transform">
        {[...Array(4)].map((_, i) => (
          <span key={i} className="block mr-8">{children} </span>
        ))}
      </motion.div>
    </div>
  );
}

// ─────────────────────────────────────────────
// 3D CARD (piatto)
// ─────────────────────────────────────────────
const MouseEnterCtx = createContext<[boolean, React.Dispatch<React.SetStateAction<boolean>>] | undefined>(undefined);

function CardContainer({ children, className }: { children: React.ReactNode; className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isEntered, setIsEntered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const { left, top, width, height } = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - left - width / 2) / 25;
    const y = (e.clientY - top - height / 2) / 25;
    containerRef.current.style.transform = `rotateY(${x}deg) rotateX(${y}deg)`;
  };

  return (
    <MouseEnterCtx.Provider value={[isEntered, setIsEntered]}>
      <div style={{ perspective: "1000px" }}>
        <div
          ref={containerRef}
          onMouseEnter={() => setIsEntered(true)}
          onMouseMove={handleMouseMove}
          onMouseLeave={() => { setIsEntered(false); if (containerRef.current) containerRef.current.style.transform = "rotateY(0deg) rotateX(0deg)"; }}
          className={cn("flex items-center justify-center relative transition-all duration-200 ease-linear", className)}
          style={{ transformStyle: "preserve-3d" }}
        >
          {children}
        </div>
      </div>
    </MouseEnterCtx.Provider>
  );
}

function CardBody({ children, className, style, onClick }: { children: React.ReactNode; className?: string; style?: React.CSSProperties; onClick?: () => void }) {
  return (
    <div className={cn("[transform-style:preserve-3d] [&>*]:[transform-style:preserve-3d]", className)} style={style} onClick={onClick}>
      {children}
    </div>
  );
}

function CardItem({ children, className, translateZ = 0, style }: { children: React.ReactNode; className?: string; translateZ?: number; style?: React.CSSProperties }) {
  const ref = useRef<HTMLDivElement>(null);
  const ctx = useContext(MouseEnterCtx);
  const isEntered = ctx ? ctx[0] : false;

  useEffect(() => {
    if (!ref.current) return;
    ref.current.style.transform = isEntered
      ? `translateZ(${translateZ}px)`
      : "translateZ(0px)";
  }, [isEntered, translateZ]);

  return (
    <div ref={ref} className={cn("w-fit transition duration-200 ease-linear", className)} style={style}>
      {children}
    </div>
  );
}

// ─────────────────────────────────────────────
// PARALLAX FLOATING
// ─────────────────────────────────────────────
interface FloatingCtxType {
  registerElement: (id: string, el: HTMLDivElement, depth: number) => void;
  unregisterElement: (id: string) => void;
}
const FloatingCtx = createContext<FloatingCtxType | null>(null);

function Floating({ children, className, sensitivity = 1, easingFactor = 0.05 }: {
  children: React.ReactNode; className?: string; sensitivity?: number; easingFactor?: number;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const elementsMap = useRef(new Map<string, { element: HTMLDivElement; depth: number; currentPosition: { x: number; y: number } }>());
  const mousePositionRef = useMousePositionRef(containerRef as React.RefObject<HTMLElement>);

  const registerElement = useCallback((id: string, element: HTMLDivElement, depth: number) => {
    elementsMap.current.set(id, { element, depth, currentPosition: { x: 0, y: 0 } });
  }, []);
  const unregisterElement = useCallback((id: string) => { elementsMap.current.delete(id); }, []);

  useAnimationFrame(() => {
    if (!containerRef.current) return;
    elementsMap.current.forEach((data) => {
      const strength = (data.depth * sensitivity) / 20;
      const newTargetX = mousePositionRef.current.x * strength;
      const newTargetY = mousePositionRef.current.y * strength;
      data.currentPosition.x += (newTargetX - data.currentPosition.x) * easingFactor;
      data.currentPosition.y += (newTargetY - data.currentPosition.y) * easingFactor;
      data.element.style.transform = `translate3d(${data.currentPosition.x}px, ${data.currentPosition.y}px, 0)`;
    });
  });

  return (
    <FloatingCtx.Provider value={{ registerElement, unregisterElement }}>
      <div ref={containerRef} className={cn("absolute top-0 left-0 w-full h-full", className)}>
        {children}
      </div>
    </FloatingCtx.Provider>
  );
}

function FloatingElement({ children, className, depth = 1 }: { children: React.ReactNode; className?: string; depth?: number }) {
  const elementRef = useRef<HTMLDivElement>(null);
  const idRef = useRef(Math.random().toString(36).substring(7));
  const ctx = useContext(FloatingCtx);

  useEffect(() => {
    if (!elementRef.current || !ctx) return;
    ctx.registerElement(idRef.current, elementRef.current, depth);
    return () => ctx.unregisterElement(idRef.current);
  }, [depth]);

  return (
    <div ref={elementRef} className={cn("absolute will-change-transform", className)}>
      {children}
    </div>
  );
}

// ─────────────────────────────────────────────
// MODAL DROP (popup sconto)
// ─────────────────────────────────────────────
function ModalDrop({ isOpen, onClose, title, subtitle, children }: {
  isOpen: boolean; onClose: () => void; title?: string; subtitle?: string; children: React.ReactNode;
}) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape" && isOpen) onClose(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[100] flex items-center justify-center"
          style={{ background: "rgba(0,0,0,0.75)" }}
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 24 }}
            transition={{ type: "spring", stiffness: 400, damping: 32, mass: 0.7 }}
            style={{ background: "#141414", border: "1px solid #2A2A2A", borderRadius: 8, maxWidth: 440, width: "90%", position: "relative" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ padding: "24px 24px 16px", borderBottom: "1px solid #2A2A2A" }}>
              <h2 style={{ color: C.text, fontSize: 22, fontWeight: 700, margin: 0, fontFamily: "var(--font-barlow), sans-serif", textTransform: "uppercase", letterSpacing: "0.05em" }}>{title}</h2>
              {subtitle && <p style={{ color: C.muted, fontSize: 14, marginTop: 4 }}>{subtitle}</p>}
              <button
                onClick={onClose}
                style={{ position: "absolute", top: 16, right: 16, background: "transparent", border: "none", cursor: "pointer", color: C.muted, padding: 4, borderRadius: 4 }}
              >
                <X size={20} />
              </button>
            </div>
            <div style={{ padding: 24 }}>{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}

// ─────────────────────────────────────────────
// RESPONSIVE MODAL (dettaglio piatto)
// ─────────────────────────────────────────────
function PlattoModal({ isOpen, onClose, piatto }: {
  isOpen: boolean; onClose: () => void;
  piatto: { nome: string; desc: string; prezzo: string; tag?: string; img: string } | null;
}) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape" && isOpen) onClose(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [isOpen, onClose]);

  if (!mounted || !piatto) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          style={{ position: "fixed", inset: 0, zIndex: 90, background: "rgba(0,0,0,0.8)", display: "flex", alignItems: "center", justifyContent: "center" }}
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.92, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.92, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            style={{ background: "#141414", borderRadius: 8, overflow: "hidden", maxWidth: 520, width: "92%", border: "1px solid #2A2A2A" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ position: "relative" }}>
              <img src={piatto.img} alt={piatto.nome} style={{ width: "100%", height: 260, objectFit: "cover", display: "block" }} />
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, #141414 0%, transparent 50%)" }} />
              <button
                onClick={onClose}
                style={{ position: "absolute", top: 12, right: 12, background: "rgba(10,10,10,0.7)", border: "none", cursor: "pointer", color: C.text, padding: 8, borderRadius: 4 }}
              >
                <X size={20} />
              </button>
              {piatto.tag && (
                <span style={{ position: "absolute", top: 12, left: 12, background: C.fire, color: "#fff", fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 2, letterSpacing: "0.08em", textTransform: "uppercase" }}>
                  {piatto.tag}
                </span>
              )}
            </div>
            <div style={{ padding: "20px 24px 28px" }}>
              <h3 style={{ color: C.text, fontSize: 24, fontWeight: 700, margin: "0 0 8px", textTransform: "uppercase", letterSpacing: "0.04em", fontFamily: "var(--font-barlow), sans-serif" }}>{piatto.nome}</h3>
              <p style={{ color: C.muted, fontSize: 15, lineHeight: 1.6, margin: "0 0 16px" }}>{piatto.desc}</p>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ color: C.fire, fontSize: 22, fontWeight: 700 }}>{piatto.prezzo}</span>
                <button onClick={onClose} style={{ background: "transparent", border: `1px solid ${C.muted}`, color: C.muted, padding: "8px 20px", borderRadius: 2, cursor: "pointer", fontSize: 13, letterSpacing: "0.05em", textTransform: "uppercase" }}>
                  Chiudi
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}

// ─────────────────────────────────────────────
// DATI RISTORANTE
// ─────────────────────────────────────────────
const PIATTI = [
  {
    nome: "Tartare di Chianina",
    desc: "Manzo piemontese battuto al coltello, olio di nocciola, capperi di Pantelleria, crostini di pane affumicato.",
    prezzo: "€18",
    tag: "CRUDO",
    img: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80",
    categoria: "ANTIPASTI",
  },
  {
    nome: "Animelle alla Brace",
    desc: "Animelle di vitello grigliate a fuoco vivo, salsa verde al prezzemolo, limone bruciato.",
    prezzo: "€22",
    tag: "SIGNATURE",
    img: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&q=80",
    categoria: "ANTIPASTI",
  },
  {
    nome: "Costata Maturata 60 Giorni",
    desc: "Costata di Angus irlandese, maturazione dry-aged 60 giorni. Servita per 2 persone con sale Maldon e rosmarino fresco.",
    prezzo: "€85",
    tag: "PER 2",
    img: "https://images.unsplash.com/photo-1558030006-450675393462?w=800&q=80",
    categoria: "SECONDI ALLA BRACE",
  },
  {
    nome: "Porcini alla Brace",
    desc: "Porcini freschi di stagione grigliati su carbone di quercia, aglio in camicia, prezzemolo, olio extravergine toscano.",
    prezzo: "€16",
    img: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=800&q=80",
    categoria: "SECONDI ALLA BRACE",
  },
  {
    nome: "Gelato al Carbone Vegetale",
    desc: "Gelato artigianale al carbone attivo con caramello bruciato, granella di nocciole tostate, sale di Maldon.",
    prezzo: "€9",
    img: "https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?w=800&q=80",
    categoria: "DOLCI",
  },
];

// ─────────────────────────────────────────────
// NAV (con shrink allo scroll)
// ─────────────────────────────────────────────
function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <header
      style={{
        position: "fixed", top: 0, left: 0, width: "100%", zIndex: 50,
        background: scrolled ? "rgba(10,10,10,0.92)" : "transparent",
        backdropFilter: scrolled ? "blur(12px)" : "none",
        transition: "background 0.4s ease, padding 0.3s ease",
        padding: scrolled ? "12px 32px" : "24px 32px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        boxSizing: "border-box",
      }}
    >
      <span style={{ color: C.text, fontSize: 22, fontWeight: 900, letterSpacing: "0.1em", textTransform: "uppercase", fontFamily: "var(--font-barlow), sans-serif" }}>
        BRACE
      </span>

      <nav style={{ display: "flex", gap: 32 }} className="hidden md:flex">
        {["Menu", "Il Locale", "Contatti"].map((item) => (
          <a key={item} href={`#${item.toLowerCase().replace(" ", "-")}`}
            style={{ color: C.muted, fontSize: 14, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", textDecoration: "none", transition: "color 0.2s" }}
            onMouseEnter={(e) => ((e.target as HTMLElement).style.color = C.text)}
            onMouseLeave={(e) => ((e.target as HTMLElement).style.color = C.muted)}
          >
            {item}
          </a>
        ))}
      </nav>

      <button onClick={() => setMobileOpen(!mobileOpen)} className="flex md:hidden" style={{ background: "transparent", border: "none", cursor: "pointer", color: C.text }}>
        <Menu size={24} />
      </button>
    </header>
  );
}

// ─────────────────────────────────────────────
// HERO
// ─────────────────────────────────────────────
function Hero() {
  return (
    <section style={{ position: "relative", height: "100vh", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ position: "absolute", inset: 0, zIndex: 1 }}>
        <img
          src="https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=1600&q=80"
          alt="Brace — braciere"
          style={{ width: "100%", height: "100%", objectFit: "cover", filter: "grayscale(0.4) brightness(0.4)" }}
        />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, #0A0A0A 0%, transparent 50%)" }} />

        <Floating sensitivity={-0.5}>
          <FloatingElement depth={2} className="top-[15%] right-[8%]">
            <motion.img
              initial={{ opacity: 0 }} animate={{ opacity: 0.6 }} transition={{ delay: 1.2, duration: 1 }}
              src="https://images.unsplash.com/photo-1558030006-450675393462?w=400&q=80"
              style={{ width: 140, height: 180, objectFit: "cover", borderRadius: 2 }}
            />
          </FloatingElement>
          <FloatingElement depth={1} className="bottom-[20%] left-[6%]">
            <motion.img
              initial={{ opacity: 0 }} animate={{ opacity: 0.5 }} transition={{ delay: 1.5, duration: 1 }}
              src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=300&q=80"
              style={{ width: 100, height: 130, objectFit: "cover", borderRadius: 2 }}
            />
          </FloatingElement>
        </Floating>
      </div>

      <div style={{ position: "relative", zIndex: 2, textAlign: "center", padding: "0 24px" }}>
        <motion.p
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.8 }}
          style={{ color: C.fire, fontSize: 13, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", margin: "0 0 16px" }}
        >
          Braceria Contemporanea · Milano, Navigli
        </motion.p>

        <h1 style={{
          color: C.text, fontSize: "clamp(80px, 18vw, 160px)", fontWeight: 900,
          lineHeight: 0.9, margin: "0 0 24px", textTransform: "uppercase",
          letterSpacing: "-0.02em", fontFamily: "var(--font-barlow), sans-serif"
        }}>
          <VerticalCutReveal delay={0.5}>BRACE</VerticalCutReveal>
        </h1>

        <motion.p
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2, duration: 0.8 }}
          style={{ color: C.muted, fontSize: 16, lineHeight: 1.6, maxWidth: 400, margin: "0 auto 40px" }}
        >
          Fuoco, carbone, materia.<br />La costata matura 60 giorni.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.5, duration: 0.6 }}
        >
          <a href="#menu"
            style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              color: C.text, fontSize: 13, fontWeight: 700, letterSpacing: "0.12em",
              textTransform: "uppercase", textDecoration: "none",
              padding: "12px 32px", border: `1px solid ${C.fire}`,
              transition: "background 0.2s",
            }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = C.fire)}
            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "transparent")}
          >
            Scopri il menu <ChevronDown size={16} />
          </a>
        </motion.div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────
// TICKER
// ─────────────────────────────────────────────
function Ticker() {
  return (
    <div style={{ background: C.bg, padding: "20px 0", borderTop: `1px solid #1A1A1A`, borderBottom: `1px solid #1A1A1A`, overflow: "hidden" }}>
      <ParallaxText baseVelocity={-4}>
        <span style={{ color: C.fire, fontSize: 20, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", fontFamily: "var(--font-barlow), sans-serif" }}>
          BRACE • FUOCO • MATERIA • CARBONE • 60 GIORNI • NAVIGLI • MILANO •
        </span>
      </ParallaxText>
    </div>
  );
}

// ─────────────────────────────────────────────
// MANIFESTO
// ─────────────────────────────────────────────
function Manifesto() {
  return (
    <section style={{ background: C.bg, padding: "120px 32px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center", maxWidth: 1100, margin: "0 auto" }} className="flex-col md:grid-cols-2">
      <div>
        <p style={{ color: C.fire, fontSize: 12, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 24 }}>
          Il nostro principio
        </p>
        <h2 style={{ color: C.text, fontSize: "clamp(40px, 6vw, 64px)", fontWeight: 900, lineHeight: 1, margin: "0 0 32px", textTransform: "uppercase", fontFamily: "var(--font-barlow), sans-serif" }}>
          <VerticalCutReveal delay={0.1}>IL FUOCO È</VerticalCutReveal>
          <br />
          <VerticalCutReveal delay={0.3}>L'INGREDIENTE</VerticalCutReveal>
        </h2>
        <p style={{ color: C.muted, fontSize: 16, lineHeight: 1.8, maxWidth: 420 }}>
          Non usiamo abbreviazioni. La costata matura 60 giorni. La brace brucia ore prima. Il piatto arriva quando è pronto — non prima.
        </p>
      </div>
      <div style={{ position: "relative", height: 400 }}>
        <img
          src="https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=600&q=80"
          alt="Brace ardente"
          style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: 2, filter: "brightness(0.8)" }}
        />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, rgba(232,84,10,0.1) 0%, transparent 60%)", borderRadius: 2 }} />
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────
// MENU SEZIONE
// ─────────────────────────────────────────────
function MenuSection({ onPiattoClick }: { onPiattoClick: (p: typeof PIATTI[0]) => void }) {
  const categorie = [...new Set(PIATTI.map((p) => p.categoria))];

  return (
    <section id="menu" style={{ background: C.bg, padding: "80px 32px 120px", maxWidth: 1100, margin: "0 auto" }}>
      <h2 style={{ color: C.text, fontSize: "clamp(48px, 7vw, 80px)", fontWeight: 900, textTransform: "uppercase", margin: "0 0 64px", fontFamily: "var(--font-barlow), sans-serif" }}>
        Il Menu
      </h2>

      {categorie.map((cat) => (
        <div key={cat} style={{ marginBottom: 64 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 32 }}>
            <p style={{ color: C.fire, fontSize: 12, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", margin: 0 }}>{cat}</p>
            <div style={{ flex: 1, height: 1, background: "#1A1A1A" }} />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 24 }}>
            {PIATTI.filter((p) => p.categoria === cat).map((piatto) => (
              <CardContainer key={piatto.nome}>
                <CardBody
                  className="w-full cursor-pointer"
                  style={{ background: C.card, border: "1px solid #1E1E1E", borderRadius: 4, overflow: "hidden" } as any}
                  onClick={() => onPiattoClick(piatto)}
                >
                  <CardItem translateZ={20} className="w-full">
                    <div style={{ position: "relative", overflow: "hidden" }}>
                      <img
                        src={piatto.img} alt={piatto.nome}
                        style={{ width: "100%", height: 200, objectFit: "cover", display: "block", transition: "transform 0.4s ease" }}
                        onMouseEnter={(e) => ((e.target as HTMLImageElement).style.transform = "scale(1.05)")}
                        onMouseLeave={(e) => ((e.target as HTMLImageElement).style.transform = "scale(1)")}
                      />
                      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(20,20,20,0.8) 0%, transparent 50%)" }} />
                      {piatto.tag && (
                        <span style={{ position: "absolute", top: 12, left: 12, background: C.fire, color: "#fff", fontSize: 10, fontWeight: 700, padding: "3px 10px", letterSpacing: "0.08em", textTransform: "uppercase" }}>
                          {piatto.tag}
                        </span>
                      )}
                    </div>
                  </CardItem>
                  <CardItem translateZ={40} className="w-full" style={{ padding: "16px 20px 20px" } as any}>
                    <h3 style={{ color: C.text, fontSize: 18, fontWeight: 700, margin: "0 0 8px", textTransform: "uppercase", letterSpacing: "0.04em", fontFamily: "var(--font-barlow), sans-serif" }}>
                      {piatto.nome}
                    </h3>
                    <p style={{ color: C.muted, fontSize: 13, lineHeight: 1.5, margin: "0 0 12px" }}>
                      {piatto.desc.substring(0, 80)}…
                    </p>
                    <span style={{ color: C.fire, fontSize: 18, fontWeight: 700 }}>{piatto.prezzo}</span>
                  </CardItem>
                </CardBody>
              </CardContainer>
            ))}
          </div>
        </div>
      ))}
    </section>
  );
}

// ─────────────────────────────────────────────
// FOOTER
// ─────────────────────────────────────────────
function Footer() {
  return (
    <footer style={{ background: "#050505", borderTop: "1px solid #1A1A1A", padding: "40px 32px", textAlign: "center" }}>
      <p style={{ color: C.muted, fontSize: 13, margin: 0, letterSpacing: "0.08em" }}>
        BRACE — Via Corsico 4, Milano · +39 02 1234567 · info@brace.it
      </p>
    </footer>
  );
}

// ─────────────────────────────────────────────
// PAGE
// ─────────────────────────────────────────────
export default function BracePage() {
  const [piattoOpen, setPiattoOpen] = useState(false);
  const [selectedPiatto, setSelectedPiatto] = useState<typeof PIATTI[0] | null>(null);
  const [promoOpen, setPromoOpen] = useState(false);
  const [phone, setPhone] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => setPromoOpen(true), 30000);
    return () => clearTimeout(timer);
  }, []);

  const handlePiattoClick = (piatto: typeof PIATTI[0]) => {
    setSelectedPiatto(piatto);
    setPiattoOpen(true);
  };

  return (
    <div style={{ background: C.bg, minHeight: "100vh", position: "relative" }}>
      <MoltenCoreShader />

      <div style={{ position: "relative", zIndex: 1 }}>
        <Nav />
        <Hero />
        <Ticker />
        <Manifesto />
        <MenuSection onPiattoClick={handlePiattoClick} />
        <Footer />
      </div>

      <PlattoModal isOpen={piattoOpen} onClose={() => setPiattoOpen(false)} piatto={selectedPiatto} />

      <ModalDrop
        isOpen={promoOpen}
        onClose={() => setPromoOpen(false)}
        title="10% al prossimo ritorno"
        subtitle="Lascia il numero. Ti avvisiamo delle serate speciali."
      >
        <p style={{ color: C.muted, fontSize: 14, lineHeight: 1.6, marginBottom: 20 }}>
          Sconto riservato ai clienti che si registrano questa sera.
        </p>
        <input
          type="tel"
          placeholder="+39 333 000 0000"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          style={{
            width: "100%", padding: "12px 16px", background: "#0A0A0A",
            border: `1px solid #2A2A2A`, color: C.text, fontSize: 15,
            borderRadius: 2, marginBottom: 12, boxSizing: "border-box", outline: "none",
          }}
        />
        <button
          onClick={() => { alert("Iscritto! Ti aspettiamo presto."); setPromoOpen(false); }}
          style={{
            width: "100%", padding: "14px", background: C.fire, border: "none",
            color: "#fff", fontWeight: 700, fontSize: 14, letterSpacing: "0.1em",
            textTransform: "uppercase", cursor: "pointer", borderRadius: 2,
            fontFamily: "var(--font-barlow), sans-serif",
          }}
        >
          Attiva lo sconto
        </button>
        <button
          onClick={() => setPromoOpen(false)}
          style={{ display: "block", margin: "12px auto 0", background: "transparent", border: "none", color: C.muted, fontSize: 13, cursor: "pointer" }}
        >
          No grazie
        </button>
      </ModalDrop>
    </div>
  );
}

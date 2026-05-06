"use client";

// =========================================================
// CENERE — Menu Digitale
// Via Tortona 14, Milano
// =========================================================
// Dipendenze npm:
//   framer-motion, motion, lenis, usehooks-ts,
//   react-use-measure, lucide-react, @radix-ui/react-slot,
//   class-variance-authority
// Font: var(--font-playfair) / var(--font-dm-sans) via layout.tsx
// =========================================================

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
  useScroll,
  useSpring,
  useTransform,
  useMotionValue,
} from "framer-motion";
import { ReactLenis } from "lenis/react";
import { useOnClickOutside } from "usehooks-ts";
import useMeasure from "react-use-measure";
import { Wine, UtensilsCrossed, Dessert, MenuIcon, X, Heart, Star } from "lucide-react";

// =========================================================
// PALETTE CENERE
// =========================================================
const C = {
  bg:       "#0A0A0A",
  surface:  "#1A1A1A",
  cream:    "#F5F0E8",
  gold:     "#C8A96E",
  goldDim:  "#8B6E3A",
  text:     "#E8E0D0",
  muted:    "#6B6357",
};

// =========================================================
// UTILS
// =========================================================
const cn = (...classes: (string | undefined | false | null)[]) =>
  classes.filter(Boolean).join(" ");

// =========================================================
// 1. NOISE — Background Snippets Noise effect (21st.dev)
// =========================================================
interface NoiseProps {
  patternRefreshInterval?: number;
  patternAlpha?: number;
}

const Noise: React.FC<NoiseProps> = ({
  patternRefreshInterval = 2,
  patternAlpha = 15,
}) => {
  const grainRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = grainRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;
    let frame = 0;
    let animationId = 0;
    const canvasSize = 1024;
    const resize = () => {
      canvas.width = canvasSize;
      canvas.height = canvasSize;
      canvas.style.width = "100vw";
      canvas.style.height = "100vh";
    };
    const drawGrain = () => {
      const imageData = ctx.createImageData(canvasSize, canvasSize);
      const data = imageData.data;
      for (let i = 0; i < data.length; i += 4) {
        const value = Math.random() * 255;
        data[i] = value; data[i + 1] = value; data[i + 2] = value;
        data[i + 3] = patternAlpha;
      }
      ctx.putImageData(imageData, 0, 0);
    };
    const loop = () => {
      if (frame % patternRefreshInterval === 0) drawGrain();
      frame++;
      animationId = window.requestAnimationFrame(loop);
    };
    window.addEventListener("resize", resize);
    resize();
    loop();
    return () => {
      window.removeEventListener("resize", resize);
      window.cancelAnimationFrame(animationId);
    };
  }, [patternRefreshInterval, patternAlpha]);

  return (
    <canvas
      ref={grainRef}
      className="pointer-events-none absolute inset-0 z-10"
      style={{ imageRendering: "pixelated" }}
    />
  );
};

// =========================================================
// 2. ANIMATED SPINNER — Animated Spinner (21st.dev)
// =========================================================
interface AnimatedSpinnerProps {
  size?: string;
  className?: string;
}

const SPINNER_CSS = `
  @property --deg { syntax: "<angle>"; initial-value: 0deg; inherits: true; }
  @property --p   { syntax: "<percentage>"; initial-value: 0%; inherits: true; }
  @property --line-width { syntax: "<length>"; initial-value: 1rem; inherits: true; }
  .animated-spinner {
    background: conic-gradient(from var(--deg), #C8A96E, #F5F0E8, #8B6E3A, transparent var(--p));
    mask: radial-gradient(circle, transparent calc(50% - var(--line-width, 0.6rem)), black calc(50% - var(--line-width, 0.6rem)));
    filter: drop-shadow(0.5rem 0 1rem #C8A96E);
    border-radius: 50%;
    aspect-ratio: 1;
    animation: cenere-rotate 1.1s ease infinite, cenere-lw 3.3s ease infinite;
  }
  @keyframes cenere-rotate {
    from { --p: 20%; }
    50%  { --p: 50%; }
    70%  { --p: 30%; }
    90%  { --p: 10%; }
    to   { --p: 20%; --deg: -360deg; }
  }
  @keyframes cenere-lw {
    from, 20%, 70%, to { --line-width: 0.6rem; }
    50%               { --line-width: 0.1rem; }
  }
`;

function AnimatedSpinner({ size = "8rem", className = "" }: AnimatedSpinnerProps) {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: SPINNER_CSS }} />
      <div className={`animated-spinner ${className}`} style={{ width: size }} />
    </>
  );
}

// =========================================================
// 3. HERO GEOMETRIC — Shape Landing Hero (21st.dev)
// =========================================================
function ElegantShape({
  className, delay = 0, width = 400, height = 100, rotate = 0, gradient = "from-white/[0.08]",
}: { className?: string; delay?: number; width?: number; height?: number; rotate?: number; gradient?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -150, rotate: rotate - 15 }}
      animate={{ opacity: 1, y: 0, rotate }}
      transition={{ duration: 2.4, delay, ease: [0.23, 0.86, 0.39, 0.96] as [number, number, number, number], opacity: { duration: 1.2 } }}
      className={cn("absolute", className)}
    >
      <motion.div
        animate={{ y: [0, 15, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        style={{ width, height }}
        className="relative"
      >
        <div className={cn(
          "absolute inset-0 rounded-full",
          "bg-gradient-to-r to-transparent",
          gradient,
          "backdrop-blur-[2px] border-2 border-white/[0.15]",
          "shadow-[0_8px_32px_0_rgba(255,255,255,0.1)]",
          "after:absolute after:inset-0 after:rounded-full",
          "after:bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.2),transparent_70%)]"
        )} />
      </motion.div>
    </motion.div>
  );
}

function HeroGeometric({ badge, title1, title2 }: { badge?: string; title1?: string; title2?: string }) {
  const fadeUpVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: (i: number) => ({
      opacity: 1, y: 0,
      transition: { duration: 1, delay: 0.5 + i * 0.2, ease: [0.25, 0.4, 0.25, 1] as [number, number, number, number] },
    }),
  };
  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden" style={{ background: C.bg }}>
      <div className="absolute inset-0 bg-gradient-to-br from-amber-900/[0.05] via-transparent to-amber-700/[0.05] blur-3xl" />
      <div className="absolute inset-0 overflow-hidden">
        <ElegantShape delay={0.3} width={600} height={140} rotate={12}  gradient="from-amber-500/[0.12]" className="left-[-10%] md:left-[-5%] top-[15%] md:top-[20%]" />
        <ElegantShape delay={0.5} width={500} height={120} rotate={-15} gradient="from-yellow-700/[0.10]" className="right-[-5%] md:right-[0%] top-[70%] md:top-[75%]" />
        <ElegantShape delay={0.4} width={300} height={80}  rotate={-8}  gradient="from-amber-800/[0.08]" className="left-[5%] md:left-[10%] bottom-[5%] md:bottom-[10%]" />
        <ElegantShape delay={0.6} width={200} height={60}  rotate={20}  gradient="from-amber-400/[0.10]" className="right-[15%] md:right-[20%] top-[10%] md:top-[15%]" />
        <ElegantShape delay={0.7} width={150} height={40}  rotate={-25} gradient="from-stone-500/[0.08]"  className="left-[20%] md:left-[25%] top-[5%] md:top-[10%]" />
      </div>
      <Noise patternRefreshInterval={3} patternAlpha={10} />
      <div className="relative z-20 container mx-auto px-4 md:px-6">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div custom={0} variants={fadeUpVariants} initial="hidden" animate="visible"
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border mb-8 md:mb-12"
            style={{ background: "rgba(200,169,110,0.06)", borderColor: "rgba(200,169,110,0.2)" }}>
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: C.gold }} />
            <span className="text-sm tracking-widest uppercase font-light" style={{ color: C.gold }}>{badge}</span>
          </motion.div>
          <motion.div custom={1} variants={fadeUpVariants} initial="hidden" animate="visible">
            <h1 className="font-bold mb-6 md:mb-8 tracking-tight" style={{ fontFamily: "var(--font-playfair), serif" }}>
              <span className="block text-5xl sm:text-7xl md:text-9xl bg-clip-text text-transparent bg-gradient-to-b"
                style={{ backgroundImage: `linear-gradient(to bottom, ${C.cream}, ${C.cream}cc)` }}>
                {title1}
              </span>
              <span className="block text-3xl sm:text-4xl md:text-5xl mt-2 bg-clip-text text-transparent"
                style={{ backgroundImage: `linear-gradient(to right, ${C.goldDim}, ${C.gold}, ${C.goldDim})` }}>
                {title2}
              </span>
            </h1>
          </motion.div>
          <motion.div custom={2} variants={fadeUpVariants} initial="hidden" animate="visible">
            <p className="text-base md:text-lg leading-relaxed font-light tracking-wide max-w-md mx-auto px-4"
              style={{ color: `${C.text}66`, fontFamily: "var(--font-dm-sans), sans-serif" }}>
              Milano, Via Tortona 14 — Apertura ore 18:00
            </p>
          </motion.div>
        </div>
      </div>
      <div className="absolute inset-0 pointer-events-none z-20"
        style={{ background: `linear-gradient(to top, ${C.bg} 0%, transparent 30%, ${C.bg}cc 100%)` }} />
    </div>
  );
}

// =========================================================
// 4. TEXT REVEAL BY WORD — Text Reveal (21st.dev)
// =========================================================
function RevealWord({ children, progress, range }: {
  children: React.ReactNode;
  progress: ReturnType<typeof useScroll>["scrollYProgress"];
  range: [number, number];
}) {
  const opacity = useTransform(progress, range, [0, 1]);
  return (
    <span className="xl:lg-3 relative mx-1 lg:mx-2.5">
      <span className="absolute opacity-20" style={{ color: C.text }}>{children}</span>
      <motion.span style={{ opacity, color: C.cream }}>{children}</motion.span>
    </span>
  );
}

function TextRevealByWord({ text, className }: { text: string; className?: string }) {
  const targetRef = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({ target: targetRef });
  const words = text.split(" ");
  return (
    <div ref={targetRef} className={cn("relative z-0 h-[200vh]", className)}>
      <div className="sticky top-0 mx-auto flex h-[50%] max-w-4xl items-center bg-transparent px-[1rem] py-[5rem]">
        <p className="flex flex-wrap p-5 text-2xl font-bold md:p-8 md:text-3xl lg:p-10 lg:text-4xl xl:text-5xl"
          style={{ fontFamily: "var(--font-playfair), serif", color: `${C.text}33` }}>
          {words.map((word, i) => {
            const start = i / words.length;
            const end = start + 1 / words.length;
            return (
              <RevealWord key={i} progress={scrollYProgress} range={[start, end]}>
                {word}
              </RevealWord>
            );
          })}
        </p>
      </div>
    </div>
  );
}

// =========================================================
// 5. TEXT SCRAMBLE — Text Scramble (21st.dev)
// =========================================================
const defaultChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

interface TextScrambleProps {
  children: string;
  duration?: number;
  speed?: number;
  characterSet?: string;
  as?: React.ElementType;
  className?: string;
  trigger?: boolean;
  onScrambleComplete?: () => void;
}

function TextScramble({
  children, duration = 0.8, speed = 0.04, characterSet = defaultChars,
  className, as: Component = "p", trigger = true, onScrambleComplete,
  style,
}: TextScrambleProps & { style?: React.CSSProperties }) {
  const [displayText, setDisplayText] = useState(children);
  const [isAnimating, setIsAnimating] = useState(false);
  const text = children;

  const scramble = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    const steps = duration / speed;
    let step = 0;
    const interval = setInterval(() => {
      let scrambled = "";
      const progress = step / steps;
      for (let i = 0; i < text.length; i++) {
        if (text[i] === " ") { scrambled += " "; continue; }
        if (progress * text.length > i) { scrambled += text[i]; }
        else { scrambled += characterSet[Math.floor(Math.random() * characterSet.length)]; }
      }
      setDisplayText(scrambled);
      step++;
      if (step > steps) {
        clearInterval(interval);
        setDisplayText(text);
        setIsAnimating(false);
        onScrambleComplete?.();
      }
    }, speed * 1000);
  };

  useEffect(() => { if (!trigger) return; scramble(); }, [trigger]);

  const Tag = Component as keyof React.JSX.IntrinsicElements;
  return <Tag className={className} style={style}>{displayText}</Tag>;
}

// =========================================================
// 6. PARALLAX FLOATING — Parallax Floating (21st.dev)
// =========================================================
interface FloatingContextType {
  registerElement: (id: string, element: HTMLDivElement, depth: number) => void;
  unregisterElement: (id: string) => void;
}

const FloatingContext = createContext<FloatingContextType | null>(null);

function useMousePositionRef(containerRef?: React.RefObject<HTMLElement | SVGElement | null>) {
  const positionRef = useRef({ x: 0, y: 0 });
  useEffect(() => {
    const updatePosition = (x: number, y: number) => {
      if (containerRef?.current) {
        const rect = containerRef.current.getBoundingClientRect();
        positionRef.current = { x: x - rect.left, y: y - rect.top };
      } else {
        positionRef.current = { x, y };
      }
    };
    const handleMouseMove = (ev: MouseEvent) => updatePosition(ev.clientX, ev.clientY);
    const handleTouchMove = (ev: TouchEvent) => {
      const touch = ev.touches[0];
      updatePosition(touch.clientX, touch.clientY);
    };
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("touchmove", handleTouchMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleTouchMove);
    };
  }, [containerRef]);
  return positionRef;
}

function Floating({ children, className, sensitivity = 1, easingFactor = 0.05, ...props }:
  { children: React.ReactNode; className?: string; sensitivity?: number; easingFactor?: number }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const elementsMap = useRef(new Map<string, { element: HTMLDivElement; depth: number; currentPosition: { x: number; y: number } }>());
  const mousePositionRef = useMousePositionRef(containerRef);

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
      const dx = newTargetX - data.currentPosition.x;
      const dy = newTargetY - data.currentPosition.y;
      data.currentPosition.x += dx * easingFactor;
      data.currentPosition.y += dy * easingFactor;
      data.element.style.transform = `translate3d(${data.currentPosition.x}px, ${data.currentPosition.y}px, 0)`;
    });
  });

  return (
    <FloatingContext.Provider value={{ registerElement, unregisterElement }}>
      <div ref={containerRef} className={cn("absolute top-0 left-0 w-full h-full", className)} {...props}>
        {children}
      </div>
    </FloatingContext.Provider>
  );
}

function FloatingElement({ children, className, depth = 1 }:
  { children: React.ReactNode; className?: string; depth?: number }) {
  const elementRef = useRef<HTMLDivElement>(null);
  const idRef = useRef(Math.random().toString(36).substring(7));
  const context = useContext(FloatingContext);
  useEffect(() => {
    if (!elementRef.current || !context) return;
    context.registerElement(idRef.current, elementRef.current, depth ?? 0.01);
    return () => context.unregisterElement(idRef.current);
  }, [depth]);
  return (
    <div ref={elementRef} className={cn("absolute will-change-transform", className)}>
      {children}
    </div>
  );
}

// =========================================================
// 7. CARD HOVER REVEAL — Reveal on Hover (21st.dev)
// =========================================================
interface CardHoverRevealContextValue {
  isHovered: boolean;
  setIsHovered: React.Dispatch<React.SetStateAction<boolean>>;
}

const CardHoverRevealContext = React.createContext<CardHoverRevealContextValue>(
  {} as CardHoverRevealContextValue
);

const useCardHoverRevealContext = () => {
  const context = React.useContext(CardHoverRevealContext);
  if (!context) throw new Error("useCardHoverRevealContext must be used within CardHoverReveal");
  return context;
};

const CardHoverReveal = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    const [isHovered, setIsHovered] = React.useState(false);
    return (
      <CardHoverRevealContext.Provider value={{ isHovered, setIsHovered }}>
        <div ref={ref} className={cn("relative overflow-hidden", className)}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)} {...props} />
      </CardHoverRevealContext.Provider>
    );
  }
);
CardHoverReveal.displayName = "CardHoverReveal";

interface CardHoverRevealMainProps { initialScale?: number; hoverScale?: number; }
const CardHoverRevealMain = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & CardHoverRevealMainProps>(
  ({ className, initialScale = 1, hoverScale = 1.06, ...props }, ref) => {
    const { isHovered } = useCardHoverRevealContext();
    return (
      <div ref={ref} className={cn("size-full transition-transform duration-500", className)}
        style={isHovered ? { transform: `scale(${hoverScale})`, ...props.style } : { transform: `scale(${initialScale})`, ...props.style }}
        {...props} />
    );
  }
);
CardHoverRevealMain.displayName = "CardHoverRevealMain";

const CardHoverRevealContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    const { isHovered } = useCardHoverRevealContext();
    return (
      <div ref={ref}
        className={cn("absolute inset-[auto_1rem_1rem] p-5 transition-all duration-500 ease-in-out rounded-xl", className)}
        style={isHovered ? { translate: "0%", opacity: 1, ...props.style } : { translate: "0% 120%", opacity: 0, ...props.style }}
        {...props} />
    );
  }
);
CardHoverRevealContent.displayName = "CardHoverRevealContent";

// =========================================================
// 8. EXPANDED TABS — Expanded Tabs (21st.dev)
// =========================================================
interface TabItem { title: string; icon: React.ElementType; type?: never; }
interface SeparatorItem { type: "separator"; title?: never; icon?: never; }
type ExpandedTabItem = TabItem | SeparatorItem;

interface ExpandedTabsProps {
  tabs: ExpandedTabItem[];
  className?: string;
  activeColor?: string;
  onChange?: (index: number | null) => void;
  defaultSelected?: number;
}

const buttonVariantsET = {
  initial: { gap: 0, paddingLeft: ".5rem", paddingRight: ".5rem" },
  animate: (isSelected: boolean) => ({
    gap: isSelected ? ".5rem" : 0,
    paddingLeft: isSelected ? "1rem" : ".5rem",
    paddingRight: isSelected ? "1rem" : ".5rem",
  }),
};
const spanVariantsET = {
  initial: { width: 0, opacity: 0 },
  animate: { width: "auto", opacity: 1 },
  exit: { width: 0, opacity: 0 },
};
const transitionET = { delay: 0.1, type: "spring" as const, bounce: 0, duration: 0.6 };

function ExpandedTabs({ tabs, className, activeColor = "text-primary", onChange, defaultSelected }: ExpandedTabsProps) {
  const [selected, setSelected] = useState<number | null>(defaultSelected ?? null);
  const outsideClickRef = useRef<HTMLDivElement>(null as unknown as HTMLDivElement);
  useOnClickOutside(outsideClickRef, () => { setSelected(null); onChange?.(null); });
  const handleSelect = (index: number) => { setSelected(index); onChange?.(index); };
  const Separator = () => <div className="h-[24px] w-[1.2px]" style={{ background: "#2a2a2a" }} aria-hidden="true" />;
  return (
    <div ref={outsideClickRef} className={cn("flex gap-2 rounded-2xl border p-1 shadow-sm", className)}
      style={{ background: C.surface, borderColor: "#2a2a2a" }}>
      {tabs.map((tab, index) => {
        if (tab.type === "separator") return <Separator key={`sep-${index}`} />;
        const Icon = tab.icon;
        return (
          <motion.button key={tab.title} variants={buttonVariantsET} initial={false}
            animate="animate" custom={selected === index} onClick={() => handleSelect(index)}
            transition={transitionET}
            className={cn("relative flex items-center rounded-xl py-2 text-sm font-medium transition-colors duration-300",
              selected === index ? cn("text-sm", activeColor) : "hover:text-foreground")}
            style={{
              color: selected === index ? C.gold : C.muted,
              background: selected === index ? "rgba(200,169,110,0.1)" : "transparent",
            }}>
            <Icon size={18} />
            <AnimatePresence initial={false}>
              {selected === index && (
                <motion.span variants={spanVariantsET} initial="initial" animate="animate" exit="exit"
                  transition={transitionET} className="overflow-hidden whitespace-nowrap">
                  {tab.title}
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        );
      })}
    </div>
  );
}

// =========================================================
// 9. EXPANDABLE CARD — Expand Cards (21st.dev)
// =========================================================
const springConfig = { stiffness: 200, damping: 20, bounce: 0.2 };

interface ExpandableContextType {
  isExpanded: boolean; toggleExpand: () => void;
  expandDirection: "vertical" | "horizontal" | "both";
  expandBehavior: "replace" | "push";
  transitionDuration: number; easeType: string; initialDelay: number;
}

const ExpandableContext = createContext<ExpandableContextType>({
  isExpanded: false, toggleExpand: () => {},
  expandDirection: "vertical", expandBehavior: "replace",
  transitionDuration: 0.3, easeType: "easeInOut", initialDelay: 0,
});
const useExpandable = () => useContext(ExpandableContext);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ANIMATION_PRESETS: Record<string, { initial: any; animate: any; exit: any }> = {
  "slide-up":  { initial: { opacity: 0, y: 20 },  animate: { opacity: 1, y: 0 },  exit: { opacity: 0, y: 20 } },
  "blur-md":   { initial: { opacity: 0, filter: "blur(8px)" }, animate: { opacity: 1, filter: "blur(0px)" }, exit: { opacity: 0, filter: "blur(8px)" } },
  "fade":      { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } },
};

const ExpandableComponent = React.forwardRef<HTMLDivElement, {
  children: React.ReactNode | ((props: { isExpanded: boolean }) => React.ReactNode);
  expanded?: boolean; onToggle?: () => void; transitionDuration?: number; easeType?: string;
  expandDirection?: "vertical" | "horizontal" | "both"; expandBehavior?: "replace" | "push";
  initialDelay?: number;
}>(({
  children, expanded, onToggle, transitionDuration = 0.3, easeType = "easeInOut",
  expandDirection = "vertical", expandBehavior = "replace", initialDelay = 0,
}, ref) => {
  const [isExpandedInternal, setIsExpandedInternal] = useState(false);
  const isExpanded = expanded !== undefined ? expanded : isExpandedInternal;
  const toggleExpand = onToggle || (() => setIsExpandedInternal((prev) => !prev));
  return (
    <ExpandableContext.Provider value={{ isExpanded, toggleExpand, expandDirection, expandBehavior, transitionDuration, easeType, initialDelay }}>
      <motion.div ref={ref} initial={false}
        transition={{ duration: transitionDuration, ease: easeType as any, delay: initialDelay }}>
        {typeof children === "function" ? children({ isExpanded }) : children}
      </motion.div>
    </ExpandableContext.Provider>
  );
});
ExpandableComponent.displayName = "ExpandableComponent";

const ExpandableContent = React.forwardRef<HTMLDivElement, {
  children: React.ReactNode; preset?: keyof typeof ANIMATION_PRESETS;
  stagger?: boolean; staggerChildren?: number; keepMounted?: boolean;
}>(({ children, preset, stagger = false, staggerChildren = 0.1, keepMounted = false }, ref) => {
  const { isExpanded, transitionDuration, easeType } = useExpandable();
  const [measureRef, { height: measuredHeight }] = useMeasure();
  const animatedHeight = useMotionValue(0);
  const smoothHeight = useSpring(animatedHeight, springConfig);
  useEffect(() => { animatedHeight.set(isExpanded ? measuredHeight : 0); }, [isExpanded, measuredHeight]);
  const presetAnim = preset ? ANIMATION_PRESETS[preset] : { initial: {}, animate: {}, exit: {} };
  return (
    <motion.div ref={ref} style={{ height: smoothHeight, overflow: "hidden" }}
      transition={{ duration: transitionDuration, ease: easeType as any }}>
      <AnimatePresence initial={false}>
        {(isExpanded || keepMounted) && (
          <motion.div ref={measureRef} initial={presetAnim.initial} animate={presetAnim.animate} exit={presetAnim.exit}
            transition={{ duration: transitionDuration, ease: easeType as any }}>
            {stagger ? (
              <motion.div variants={{ hidden: {}, visible: { transition: { staggerChildren } } }} initial="hidden" animate="visible">
                {React.Children.map(children as React.ReactNode, (child, index) => (
                  <motion.div key={index} variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>{child}</motion.div>
                ))}
              </motion.div>
            ) : children}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
});
ExpandableContent.displayName = "ExpandableContent";

const ExpandableCard = React.forwardRef<HTMLDivElement, {
  children: React.ReactNode; className?: string;
  collapsedSize?: { width?: number; height?: number };
  expandedSize?: { width?: number; height?: number };
  hoverToExpand?: boolean; expandDelay?: number; collapseDelay?: number;
}>(({ children, className = "", collapsedSize = { width: 320, height: 211 },
  expandedSize = { width: 480, height: undefined }, hoverToExpand = false,
  expandDelay = 0, collapseDelay = 0 }, ref) => {
  const { isExpanded, toggleExpand, expandDirection } = useExpandable();
  const [measureRef, { width, height }] = useMeasure();
  const animatedWidth  = useMotionValue(collapsedSize.width  || 0);
  const animatedHeight = useMotionValue(collapsedSize.height || 0);
  const smoothWidth  = useSpring(animatedWidth,  springConfig);
  const smoothHeight = useSpring(animatedHeight, springConfig);
  useEffect(() => {
    if (isExpanded) { animatedWidth.set(expandedSize.width || width); animatedHeight.set(expandedSize.height || height); }
    else            { animatedWidth.set(collapsedSize.width || width); animatedHeight.set(collapsedSize.height || height); }
  }, [isExpanded, width, height]);
  return (
    <motion.div ref={ref} className={cn("cursor-pointer", className)}
      style={{
        width:  expandDirection === "vertical"   ? collapsedSize.width  : smoothWidth,
        height: expandDirection === "horizontal" ? collapsedSize.height : smoothHeight,
      }}
      transition={springConfig}
      onHoverStart={() => { if (hoverToExpand && !isExpanded) setTimeout(toggleExpand, expandDelay); }}
      onHoverEnd={() =>   { if (hoverToExpand && isExpanded) setTimeout(toggleExpand, collapseDelay); }}>
      <div className={cn("grid grid-cols-1 rounded-2xl border", className)}
        style={{ background: C.surface, borderColor: "rgba(200,169,110,0.15)" }}>
        <div className="grid grid-cols-1 rounded-2xl p-1.5">
          <div className="rounded-xl p-4 overflow-hidden" style={{ background: "#111" }}>
            <div ref={measureRef} className="flex flex-col h-full">{children}</div>
          </div>
        </div>
      </div>
    </motion.div>
  );
});
ExpandableCard.displayName = "ExpandableCard";

const ExpandableTrigger = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ children, ...props }, ref) => {
    const { toggleExpand } = useExpandable();
    return <div ref={ref} onClick={toggleExpand} className="cursor-pointer" {...props}>{children}</div>;
  }
);
ExpandableTrigger.displayName = "ExpandableTrigger";

const ExpandableCardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => (
    <div ref={ref} className={cn("flex flex-col space-y-1.5 p-4", className)} {...props}>
      <motion.div layout className="flex justify-between items-start">{children}</motion.div>
    </div>
  )
);
ExpandableCardHeader.displayName = "ExpandableCardHeader";

const ExpandableCardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => (
    <div ref={ref} className={cn("p-4 pt-0 overflow-hidden flex-grow", className)} {...props}>
      <motion.div layout>{children}</motion.div>
    </div>
  )
);
ExpandableCardContent.displayName = "ExpandableCardContent";

// =========================================================
// 10. FLOATING HEADER — Floating Header (21st.dev)
// =========================================================
function CenereHeader() {
  const [open, setOpen] = useState(false);
  const links = [
    { label: "Cocktail", href: "#cocktail" },
    { label: "Cucina",   href: "#cucina"   },
    { label: "Dessert",  href: "#dessert"  },
    { label: "Chi siamo", href: "#storia"  },
  ];
  return (
    <header className="sticky top-4 z-50 mx-auto w-full max-w-3xl rounded-xl border px-1.5 shadow-lg"
      style={{ background: "rgba(10,10,10,0.85)", backdropFilter: "blur(16px)", borderColor: "rgba(200,169,110,0.15)" }}>
      <nav className="flex items-center justify-between p-2">
        <div className="flex items-center gap-2 px-2 py-1 cursor-pointer">
          <span className="font-bold text-lg tracking-[0.3em] uppercase"
            style={{ color: C.gold, fontFamily: "var(--font-playfair), serif" }}>
            CENERE
          </span>
        </div>
        <div className="hidden items-center gap-1 lg:flex">
          {links.map((link) => (
            <a key={link.label} href={link.href}
              className="px-3 py-1.5 rounded-lg text-sm font-medium transition-colors duration-200 hover:text-amber-300"
              style={{ color: C.muted, fontFamily: "var(--font-dm-sans), sans-serif" }}>
              {link.label}
            </a>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <a href="#prenotazione"
            className="hidden lg:inline-flex items-center px-4 py-1.5 rounded-lg text-sm font-medium border transition-colors duration-200"
            style={{ color: C.gold, borderColor: "rgba(200,169,110,0.4)", background: "rgba(200,169,110,0.06)", fontFamily: "var(--font-dm-sans), sans-serif" }}>
            Prenota
          </a>
          <button onClick={() => setOpen(!open)} className="lg:hidden p-2 rounded-lg"
            style={{ color: C.muted }}>
            {open ? <X size={18} /> : <MenuIcon size={18} />}
          </button>
        </div>
      </nav>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }}
            className="overflow-hidden border-t lg:hidden"
            style={{ borderColor: "rgba(200,169,110,0.1)" }}>
            <div className="flex flex-col gap-1 px-4 py-3">
              {links.map((link) => (
                <a key={link.label} href={link.href} onClick={() => setOpen(false)}
                  className="py-2 px-3 rounded-lg text-sm transition-colors"
                  style={{ color: C.text, fontFamily: "var(--font-dm-sans), sans-serif" }}>
                  {link.label}
                </a>
              ))}
              <a href="#prenotazione" onClick={() => setOpen(false)}
                className="mt-2 py-2 px-3 rounded-lg text-sm text-center border"
                style={{ color: C.gold, borderColor: "rgba(200,169,110,0.3)" }}>
                Prenota un tavolo
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

// =========================================================
// DATI CENERE
// =========================================================
const COCKTAIL = [
  {
    name: "Cenere Negroni",
    price: "€16",
    description: "Gin torbato, Campari fumé, vermouth rosso invecchiato. Note di carbone e agrumi amari.",
    image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=800&h=600&fit=crop",
    category: "Signature",
  },
  {
    name: "Velo Bianco",
    price: "€14",
    description: "Vodka infusa al fiore di sambuco, lychee, limone, schiuma al bergamotto.",
    image: "https://images.unsplash.com/photo-1563223771-375783ee91ad?w=800&h=600&fit=crop",
    category: "Signature",
  },
  {
    name: "Corallo Rosso",
    price: "€15",
    description: "Mezcal, Aperol, pompelmo rosa, sciroppo al pepe di Sichuan, sale affumicato.",
    image: "https://images.unsplash.com/photo-1551538827-9c037cb4f32a?w=800&h=600&fit=crop",
    category: "Signature",
  },
  {
    name: "Ossidiana",
    price: "€17",
    description: "Whisky torbato, liquore al carbone attivo, miele di castagno, angostura al cacao.",
    image: "https://images.unsplash.com/photo-1582106245687-cbb466a9f07f?w=800&h=600&fit=crop",
    category: "Dark",
  },
];

const CUCINA = [
  {
    name: "Tartare di Wagyu",
    price: "€28",
    description: "Wagyu A4, tuorlo d'uovo marinato, capperi di Pantelleria, polvere di funghi porcini.",
    image: "https://images.unsplash.com/photo-1615361200141-f45040f367be?w=800&h=600&fit=crop",
    category: "Crudo",
  },
  {
    name: "Polpo Bruciato",
    price: "€22",
    description: "Polpo alla brace, crema di patate viola, 'nduja, olio al prezzemolo.",
    image: "https://images.unsplash.com/photo-1559847844-5315695dadae?w=800&h=600&fit=crop",
    category: "Mare",
  },
  {
    name: "Uovo Cenere",
    price: "€18",
    description: "Uovo 63° su burro affumicato, tartufo nero, chips di pane al carbone.",
    image: "https://images.unsplash.com/photo-1569670037616-2e43d83a534e?w=800&h=600&fit=crop",
    category: "Signature",
  },
];

const DESSERT = [
  {
    name: "Fondente Nero",
    price: "€12",
    description: "Cioccolato 85%, gelato alla panna acida, sale di Maldon.",
    image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=800&h=600&fit=crop",
    category: "Dolce",
  },
  {
    name: "Tiramisù al Fumo",
    price: "€10",
    description: "Mascarpone affumicato al legno di ciliegio, espresso freddo, cacao.",
    image: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=800&h=600&fit=crop",
    category: "Classici",
  },
];

// =========================================================
// COMPONENTI SEZIONE
// =========================================================
function MenuCard({ item }: { item: typeof COCKTAIL[0] }) {
  return (
    <CardHoverReveal className="h-[320px] w-full rounded-2xl">
      <CardHoverRevealMain>
        <img src={item.image} alt={item.name}
          className="inline-block size-full max-h-full max-w-full object-cover align-middle" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        <div className="absolute bottom-4 left-4">
          <span className="text-xs tracking-widest uppercase px-2 py-0.5 rounded-full"
            style={{ color: C.gold, background: "rgba(200,169,110,0.1)", border: "1px solid rgba(200,169,110,0.3)" }}>
            {item.category}
          </span>
        </div>
      </CardHoverRevealMain>
      <CardHoverRevealContent className="rounded-xl" style={{ background: "rgba(10,10,10,0.92)", backdropFilter: "blur(16px)" }}>
        <div className="space-y-3">
          <div className="flex justify-between items-start">
            <h3 className="text-base font-semibold" style={{ color: C.cream, fontFamily: "var(--font-playfair), serif" }}>
              {item.name}
            </h3>
            <span className="text-sm font-bold ml-2" style={{ color: C.gold }}>{item.price}</span>
          </div>
          <p className="text-xs leading-relaxed" style={{ color: C.muted, fontFamily: "var(--font-dm-sans), sans-serif" }}>
            {item.description}
          </p>
        </div>
      </CardHoverRevealContent>
    </CardHoverReveal>
  );
}

function MenuSection({ items }: { items: typeof COCKTAIL }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {items.map((item) => <MenuCard key={item.name} item={item} />)}
    </div>
  );
}

function FeaturedCocktail() {
  return (
    <ExpandableComponent expandDirection="both" expandBehavior="replace" initialDelay={0.1}>
      {(({ isExpanded }: { isExpanded: boolean }) => (
        <ExpandableTrigger>
          <ExpandableCard collapsedSize={{ width: 340, height: 260 }} expandedSize={{ width: 480, height: 420 }}
            hoverToExpand={false} expandDelay={150} collapseDelay={300}>
            <ExpandableCardHeader>
              <div className="flex justify-between items-start w-full">
                <div>
                  <span className="text-xs tracking-widest uppercase" style={{ color: C.gold }}>Cocktail del momento</span>
                  <h3 className="text-xl font-semibold mt-1" style={{ color: C.cream, fontFamily: "var(--font-playfair), serif" }}>
                    Cenere Negroni
                  </h3>
                </div>
                <span className="text-lg font-bold" style={{ color: C.gold }}>€16</span>
              </div>
            </ExpandableCardHeader>
            <ExpandableCardContent>
              <img src={COCKTAIL[0].image} alt="Cenere Negroni"
                className="w-full h-28 object-cover rounded-lg mb-3" style={{ opacity: isExpanded ? 1 : 0.8 }} />
              <ExpandableContent preset="blur-md">
                <p className="text-sm leading-relaxed" style={{ color: C.muted, fontFamily: "var(--font-dm-sans), sans-serif" }}>
                  {COCKTAIL[0].description}
                </p>
                <ExpandableContent preset="slide-up">
                  <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                    <div className="rounded-lg p-2.5 text-center" style={{ background: "rgba(200,169,110,0.06)", border: "1px solid rgba(200,169,110,0.15)" }}>
                      <div className="font-semibold" style={{ color: C.cream }}>Intensità</div>
                      <div style={{ color: C.muted }}>Alta</div>
                    </div>
                    <div className="rounded-lg p-2.5 text-center" style={{ background: "rgba(200,169,110,0.06)", border: "1px solid rgba(200,169,110,0.15)" }}>
                      <div className="font-semibold" style={{ color: C.cream }}>Note</div>
                      <div style={{ color: C.muted }}>Fumé · Amaro</div>
                    </div>
                  </div>
                  <button className="mt-4 w-full py-2.5 rounded-lg text-sm font-medium transition-colors"
                    style={{ background: C.gold, color: C.bg, fontFamily: "var(--font-dm-sans), sans-serif" }}>
                    Ordina al tavolo
                  </button>
                </ExpandableContent>
              </ExpandableContent>
            </ExpandableCardContent>
          </ExpandableCard>
        </ExpandableTrigger>
      )) as unknown as React.ReactNode}
    </ExpandableComponent>
  );
}

// =========================================================
// PAGE ASSEMBLY
// =========================================================
const tabs: ExpandedTabItem[] = [
  { title: "Cocktail", icon: Wine },
  { title: "Cucina",   icon: UtensilsCrossed },
  { title: "Dessert",  icon: Dessert },
];

const tabContent = [COCKTAIL, CUCINA, DESSERT];

export default function CenerePage() {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<number | null>(0);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 2200);
    return () => clearTimeout(t);
  }, []);

  return (
    <>
      {/* ── LOADING SCREEN ── */}
      <AnimatePresence>
        {loading && (
          <motion.div
            key="loader"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center gap-6"
            style={{ background: C.bg }}
          >
            <AnimatedSpinner size="7rem" />
            <TextScramble
              className="text-sm tracking-[0.4em] uppercase"
              style={{ color: C.gold, fontFamily: "var(--font-dm-sans), sans-serif" } as React.CSSProperties}
              duration={1.5}
              speed={0.03}
            >
              CENERE
            </TextScramble>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── MAIN CONTENT ── */}
      <ReactLenis root>
        <main style={{ background: C.bg, minHeight: "100vh" }}>

          {/* NAV */}
          <div className="px-4 pt-4">
            <CenereHeader />
          </div>

          {/* HERO */}
          <HeroGeometric
            badge="Cocktail Bar · Milano"
            title1="CENERE"
            title2="Dove ogni sera brucia"
          />

          {/* STORIA — scroll text reveal */}
          <section id="storia" className="relative overflow-hidden" style={{ background: C.bg }}>
            <div className="max-w-5xl mx-auto px-4">
              <TextRevealByWord
                text="Cenere nasce nel 2019 in un ex magazzino industriale di Via Tortona. Ogni cocktail racconta una storia. Ogni piatto porta il segno del fuoco. Non veniamo a cenare. Veniamo a bruciare lentamente."
              />
            </div>
          </section>

          {/* MENU */}
          <section id="cocktail" className="relative py-24 px-4 md:px-8">
            <div className="max-w-6xl mx-auto">
              <div className="mb-12 flex flex-col items-center gap-6 text-center">
                <TextScramble
                  as="h2"
                  className="text-4xl md:text-5xl font-bold"
                  style={{ color: C.cream, fontFamily: "var(--font-playfair), serif" } as React.CSSProperties}
                  duration={1.2}
                >
                  Il Menu
                </TextScramble>
                <ExpandedTabs
                  tabs={tabs}
                  defaultSelected={0}
                  onChange={(i) => setActiveTab(i)}
                />
              </div>
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab ?? "none"}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.35 }}
                >
                  {activeTab !== null && <MenuSection items={tabContent[activeTab] as typeof COCKTAIL} />}
                </motion.div>
              </AnimatePresence>
            </div>
          </section>

          {/* COCKTAIL FEATURED + PARALLAX FOTO */}
          <section className="relative py-24 overflow-hidden" style={{ background: "#0d0d0d" }}>
            <div className="max-w-6xl mx-auto px-4 flex flex-col lg:flex-row items-center gap-16">
              {/* Parallax photo wall */}
              <div className="relative w-full lg:w-1/2 h-[500px] flex-shrink-0">
                <Floating sensitivity={-0.8}>
                  <FloatingElement depth={0.5} className="top-[5%] left-[10%]">
                    <motion.img initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
                      src="https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=400&h=300&fit=crop"
                      alt="bar" className="w-40 h-28 object-cover rounded-xl hover:scale-105 transition-transform cursor-pointer"
                      style={{ boxShadow: "0 8px 32px rgba(0,0,0,0.5)" }} />
                  </FloatingElement>
                  <FloatingElement depth={2} className="top-[15%] right-[5%]">
                    <motion.img initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }}
                      src="https://images.unsplash.com/photo-1544145945-f90425340c7e?w=300&h=400&fit=crop"
                      alt="cocktail" className="w-28 h-40 object-cover rounded-xl hover:scale-105 transition-transform cursor-pointer"
                      style={{ boxShadow: "0 8px 32px rgba(0,0,0,0.5)" }} />
                  </FloatingElement>
                  <FloatingElement depth={1} className="top-[45%] left-[5%]">
                    <motion.img initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
                      src="https://images.unsplash.com/photo-1525373698358-041e3a460346?w=400&h=300&fit=crop"
                      alt="ambiente" className="w-48 h-32 object-cover rounded-xl hover:scale-105 transition-transform cursor-pointer"
                      style={{ boxShadow: "0 8px 32px rgba(0,0,0,0.5)" }} />
                  </FloatingElement>
                  <FloatingElement depth={3} className="bottom-[10%] right-[10%]">
                    <motion.img initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.65 }}
                      src="https://images.unsplash.com/photo-1536935338788-846bb9981813?w=300&h=250&fit=crop"
                      alt="dettaglio" className="w-36 h-24 object-cover rounded-xl hover:scale-105 transition-transform cursor-pointer"
                      style={{ boxShadow: "0 8px 32px rgba(0,0,0,0.5)" }} />
                  </FloatingElement>
                  <FloatingElement depth={1.5} className="bottom-[25%] left-[30%]">
                    <motion.img initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}
                      src="https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=350&h=250&fit=crop"
                      alt="serata" className="w-32 h-24 object-cover rounded-xl hover:scale-105 transition-transform cursor-pointer"
                      style={{ boxShadow: "0 8px 32px rgba(0,0,0,0.5)" }} />
                  </FloatingElement>
                </Floating>
              </div>
              {/* Featured cocktail */}
              <div className="flex flex-col items-center lg:items-start gap-6">
                <p className="text-xs tracking-widest uppercase" style={{ color: C.gold }}>Tocca per scoprire</p>
                <FeaturedCocktail />
              </div>
            </div>
          </section>

          {/* FOOTER */}
          <footer className="relative py-20 px-4 border-t text-center overflow-hidden"
            style={{ borderColor: "rgba(200,169,110,0.1)", background: C.bg }}>
            <Noise patternRefreshInterval={4} patternAlpha={8} />
            <div className="relative z-10 max-w-lg mx-auto space-y-4">
              <TextScramble
                as="h3"
                className="text-3xl font-bold tracking-widest uppercase"
                style={{ color: C.gold, fontFamily: "var(--font-playfair), serif" } as React.CSSProperties}
                duration={1.0}
              >
                CENERE
              </TextScramble>
              <p className="text-sm" style={{ color: C.muted, fontFamily: "var(--font-dm-sans), sans-serif" }}>
                Via Tortona 14 · Milano · Aperto mar–dom 18:00–02:00
              </p>
              <p className="text-xs tracking-widest uppercase" style={{ color: `${C.muted}88` }}>
                Reservations · +39 02 1234 5678
              </p>
            </div>
          </footer>

        </main>
      </ReactLenis>
    </>
  );
}

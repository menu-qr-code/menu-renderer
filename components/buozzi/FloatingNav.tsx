"use client";
import React from "react";
import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";

const navItems = [
  { name: "Menu", href: "#menu" },
  { name: "Il Locale", href: "#manifesto" },
  { name: "Prenota", href: "#contatti" },
];

export const FloatingNav = () => {
  const [menuState, setMenuState] = React.useState(false);
  const [isScrolled, setIsScrolled] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header>
      <nav
        data-state={menuState ? "active" : undefined}
        className="fixed left-0 top-0 w-full z-50 px-4"
      >
        <div
          className={cn(
            "mx-auto mt-3 max-w-6xl px-6 transition-all duration-300",
            isScrolled &&
              "max-w-4xl rounded-2xl border border-[#3D2218] backdrop-blur-lg",
          )}
          style={{
            background: isScrolled ? "rgba(28,15,10,0.88)" : "transparent",
          }}
        >
          <div className="relative flex flex-wrap items-center justify-between py-3 gap-6">
            {/* Logo */}
            <a
              href="/"
              className="font-bold text-2xl tracking-[0.12em] uppercase"
              style={{ color: "#F2E8D9", fontFamily: "Georgia, serif", letterSpacing: "0.1em" }}
            >
              BUOZZI
            </a>

            {/* Desktop nav */}
            <ul className="hidden md:flex gap-8 text-sm">
              {navItems.map((item) => (
                <li key={item.name}>
                  <a
                    href={item.href}
                    style={{
                      color: "#9C8472",
                      fontSize: 13,
                      fontWeight: 600,
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      textDecoration: "none",
                      transition: "color 0.2s",
                    }}
                    onMouseEnter={(e) =>
                      ((e.target as HTMLElement).style.color = "#F2E8D9")
                    }
                    onMouseLeave={(e) =>
                      ((e.target as HTMLElement).style.color = "#9C8472")
                    }
                  >
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>

            {/* Mobile toggle */}
            <button
              onClick={() => setMenuState(!menuState)}
              aria-label={menuState ? "Chiudi menu" : "Apri menu"}
              className="flex md:hidden p-2"
              style={{ background: "transparent", border: "none", cursor: "pointer", color: "#F2E8D9" }}
            >
              {menuState ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>

          {/* Mobile menu */}
          {menuState && (
            <div
              className="md:hidden pb-4"
              style={{ borderTop: "1px solid #3D2218" }}
            >
              <ul className="flex flex-col gap-4 pt-4">
                {navItems.map((item) => (
                  <li key={item.name}>
                    <a
                      href={item.href}
                      onClick={() => setMenuState(false)}
                      style={{
                        color: "#9C8472",
                        fontSize: 14,
                        fontWeight: 600,
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                        textDecoration: "none",
                        display: "block",
                      }}
                    >
                      {item.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
};

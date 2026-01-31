"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";

const navLinks = [
  { href: "/", label: "About" },
  { href: "/projects", label: "Projects" },
  { href: "/personality-miner", label: "Personality Miner" },
];

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check auth status on mount and route changes
    async function checkAuth() {
      try {
        const res = await fetch("/api/auth/status");
        const data = await res.json();
        setIsLoggedIn(data.authenticated);
      } catch {
        setIsLoggedIn(false);
      }
    }
    checkAuth();
  }, [pathname]);

  async function handleLogout() {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      setIsLoggedIn(false);
      router.push("/");
      router.refresh();
    } catch {
      console.error("Logout failed");
    }
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-[5%] py-6"
      style={{
        background: `linear-gradient(
          to top,
          rgba(18, 20, 19, 0.001) 0%,
          rgba(18, 20, 19, 0.98) 20%,
          rgb(200, 230, 209) 95%
        )`,
      }}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="font-[family-name:var(--font-display)] text-xl md:text-2xl font-bold text-[rgb(18,20,19)]"
        >
          Tommy Larsin
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8 font-[family-name:var(--font-display)]">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`font-medium px-4 py-2 transition-colors duration-200 ${
                pathname === link.href || pathname.startsWith(link.href + "/")
                  ? "text-[var(--color-accent-primary)]"
                  : "text-[rgb(18,20,19)] hover:text-[var(--color-accent-primary)]"
              }`}
            >
              {link.label}
            </Link>
          ))}
          
          {isLoggedIn ? (
            <div className="flex items-center gap-4">
              <Link
                href="/personality-miner/profile"
                className="px-4 py-2 text-[rgb(18,20,19)] hover:text-[var(--color-accent-primary)] transition-colors"
              >
                <i className="fas fa-user mr-2" />
                Profile
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="px-4 py-2 rounded-lg border border-[rgb(18,20,19)] text-[rgb(18,20,19)] font-medium transition-all duration-200 hover:bg-[rgb(18,20,19)] hover:text-[var(--color-accent-secondary)]"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <Link
              href="/auth/login"
              className="px-4 py-2 rounded-lg border border-[rgb(18,20,19)] text-[rgb(18,20,19)] font-medium transition-all duration-200 hover:bg-[rgb(18,20,19)] hover:text-[var(--color-accent-secondary)]"
            >
              Sign In
            </Link>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <button
          type="button"
          className="md:hidden p-2 text-[rgb(18,20,19)]"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          <i className={`fas ${mobileMenuOpen ? "fa-times" : "fa-bars"} text-xl transition-transform duration-300`} />
        </button>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <nav 
          className="md:hidden absolute top-full right-0 w-[65%] rounded-bl-lg"
          style={{ background: "rgba(51, 65, 51, 0.98)" }}
        >
          <div className="py-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`block px-8 py-4 text-center font-medium transition-colors duration-200 border-b border-[rgba(200,230,209,0.2)] ${
                  pathname === link.href || pathname.startsWith(link.href + "/")
                    ? "text-[var(--color-accent-primary)]"
                    : "text-[var(--color-text-primary)] hover:text-[var(--color-accent-primary)]"
                }`}
                style={{ background: "rgba(200, 230, 209, 0.1)" }}
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            
            {isLoggedIn ? (
              <>
                <Link
                  href="/personality-miner/profile"
                  className="block px-8 py-4 text-center text-[var(--color-text-primary)] font-medium border-b border-[rgba(200,230,209,0.2)]"
                  style={{ background: "rgba(200, 230, 209, 0.1)" }}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <i className="fas fa-user mr-2" />
                  Profile
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className="block w-full px-8 py-4 text-center text-[var(--color-text-primary)] font-medium"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <Link
                href="/auth/login"
                className="block px-8 py-4 text-center text-[var(--color-text-primary)] font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Sign In
              </Link>
            )}
          </div>
        </nav>
      )}
    </header>
  );
}

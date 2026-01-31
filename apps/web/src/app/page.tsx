import Link from "next/link";
import { SkillsGrid } from "@/components/ui/SkillsGrid";
import Image from "next/image";

export default function HomePage() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center px-6 pt-24">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--color-bg-primary)] via-[var(--color-bg-secondary)] to-[var(--color-bg-primary)]" />
        
        {/* Grid pattern overlay */}
        <div 
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `linear-gradient(var(--color-accent-primary) 1px, transparent 1px),
                              linear-gradient(90deg, var(--color-accent-primary) 1px, transparent 1px)`,
            backgroundSize: '50px 50px',
          }}
        />
        
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <div className="inline-block mb-6 px-4 py-2 rounded-full border border-[var(--color-border)] bg-[var(--color-bg-tertiary)]">
            <span className="text-sm text-[var(--color-text-secondary)]">
              Söker för nuvarande LIA och extraknäck
            </span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold font-[family-name:var(--font-display)] mb-6">
            <span className="text-gradient">Tommy Larsin</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-[var(--color-accent-secondary)] mb-4 font-[family-name:var(--font-handwritten)] leading-relaxed">
            Dagsläget...
          </p>
          
          <p className="text-lg text-[var(--color-text-primary)] mb-8 max-w-2xl mx-auto font-[family-name:var(--font-handwritten)] leading-relaxed">
            Tommy är student med inriktning Javautvecklare på Teknikhögkolan i
            Göteborg, med ett kreativt sinne och förståelse för individens behov
            så löser han problemen utan att krångla till det.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/projects"
              className="inline-flex items-center justify-center px-8 py-4 rounded-lg bg-[var(--color-accent-primary)] text-[var(--color-bg-primary)] font-semibold transition-all duration-300 hover:bg-[var(--color-accent-secondary)] hover:scale-105"
            >
              View Projects
              <i className="fas fa-arrow-right ml-2" />
            </Link>
            
            <Link
              href="/personality-miner"
              className="inline-flex items-center justify-center px-8 py-4 rounded-lg border border-[var(--color-border)] text-[var(--color-text-primary)] font-semibold transition-all duration-300 hover:border-[var(--color-accent-primary)] hover:text-[var(--color-accent-primary)]"
            >
              Try Personality Miner
              <i className="fas fa-brain ml-2" />
            </Link>
          </div>
        </div>
        
        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <i className="fas fa-chevron-down text-[var(--color-text-muted)]" />
        </div>
      </section>

      {/* Skills Section */}
      <section className="py-24 px-6 bg-[var(--color-bg-secondary)]">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold font-[family-name:var(--font-display)] text-center mb-12">
            <span className="text-gradient">Tech Stack</span>
          </h2>
          
          <SkillsGrid />
        </div>
      </section>

      {/* Featured Project Teaser */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-block mb-4 px-3 py-1 rounded-full border border-[var(--color-accent-primary)] text-[var(--color-accent-primary)] text-sm">
            Featured Project
          </div>
          
          <h2 className="text-4xl font-bold font-[family-name:var(--font-display)] mb-6">
            <span className="text-gradient">Personality Miner</span>
          </h2>
          
          <p className="text-lg text-[var(--color-text-secondary)] mb-8 max-w-2xl mx-auto">
            An AI-powered self-discovery tool using CBT/ACT methodologies. 
            Answer personalized questions and receive a mirror context that helps you understand your patterns.
          </p>
          
          <Link
            href="/personality-miner"
            className="inline-flex items-center justify-center px-8 py-4 rounded-lg border-glow bg-transparent text-[var(--color-accent-primary)] font-semibold transition-all duration-300 hover:bg-[var(--color-accent-primary)] hover:text-[var(--color-bg-primary)]"
          >
            Start Your Journey
            <i className="fas fa-arrow-right ml-2" />
          </Link>
        </div>
      </section>
    </>
  );
}

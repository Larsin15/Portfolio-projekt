import Link from "next/link";
import { ProjectCard } from "@/components/ui/ProjectCard";

// This will come from the database later
const projects = [
  {
    slug: "personality-miner",
    title: "Personality Miner",
    description:
      "AI-powered self-discovery tool using CBT/ACT methodologies. Generates personalized questions and creates a mirror context for self-understanding.",
    techStack: [
      { name: "React", iconClass: "fab fa-react" },
      { name: "Node.js", iconClass: "fab fa-node-js" },
      { name: "PostgreSQL", iconClass: "fas fa-database" },
      { name: "Docker", iconClass: "fab fa-docker" },
    ],
    demoType: "personality_miner" as const,
    isFeatured: true,
    githubUrl: "https://github.com/Larsin15",
  },
  {
    slug: "staysphere",
    title: "StaySphere",
    description:
      "Vi är en grupp på tre som gjort vår tolkning på hur vi skulle vilja se en framtida uthyrningstjänst för hotel och privata boenden i ett. Vi ska precis påbörja frontend delen av projektet. Jag har främst ansvarat för booking samt availability delarna i listing, men annars har vi som grupp jobbat mycket tajt framförallt genom discord och code with me i IntelliJ.",
    techStack: [
      { name: "Java", iconClass: "fab fa-java" },
      { name: "PostgreSQL", iconClass: "fas fa-database" },
      { name: "JavaScript", iconClass: "fab fa-js" },
      { name: "Docker", iconClass: "fab fa-docker" },
    ],
    demoType: "static" as const,
    isFeatured: true,
    thumbnailUrl: "/img/StaySphere.png",
    githubUrl: "https://github.com/Larsin15/StaySphere-Project-Portfolio",
  },
];

export default function ProjectsPage() {
  const featuredProjects = projects.filter((p) => p.isFeatured);
  const otherProjects = projects.filter((p) => !p.isFeatured);

  return (
    <div className="min-h-screen pt-24 pb-16 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold font-[family-name:var(--font-display)] mb-4">
            <span className="text-gradient">Mina Projekt</span>
          </h1>
          <p className="text-lg text-[var(--color-text-secondary)] max-w-2xl mx-auto">
            Utvalda tekniska lösningar
          </p>
        </div>

        {/* Featured Projects */}
        {featuredProjects.length > 0 && (
          <section className="mb-16">
            <div className="grid gap-6">
              {featuredProjects.map((project) => (
                <ProjectCard key={project.slug} project={project} featured />
              ))}
            </div>
          </section>
        )}

        {/* Other Projects */}
        {otherProjects.length > 0 && (
          <section>
            <h2 className="text-sm uppercase tracking-wider text-[var(--color-text-muted)] mb-6">
              More Projects
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {otherProjects.map((project) => (
                <ProjectCard key={project.slug} project={project} />
              ))}
            </div>
          </section>
        )}

        {/* Skills Section at bottom like original */}
        <section className="mt-24">
          <div className="flex flex-wrap justify-center gap-12">
            {[
              { name: "Java", iconClass: "fab fa-java" },
              { name: "Node.js", iconClass: "fab fa-node-js" },
              { name: "Docker", iconClass: "fab fa-docker" },
              { name: "MongoDB", iconClass: "fas fa-database" },
              { name: "JavaScript", iconClass: "fab fa-js" },
              { name: "Spring Boot", iconClass: "fas fa-leaf" },
              { name: "IntelliJ", iconClass: "fas fa-laptop-code" },
              { name: "Maven", iconClass: "fas fa-terminal" },
              { name: "VS Code", iconClass: "fas fa-code-branch" },
            ].map((skill) => (
              <div
                key={skill.name}
                className="group flex flex-col items-center gap-2 transition-transform duration-300 hover:scale-110"
              >
                <i
                  className={`${skill.iconClass} text-4xl text-[var(--color-accent-primary)] transition-all duration-300 group-hover:text-[var(--color-accent-secondary)] group-hover:scale-110`}
                />
                <span className="text-sm text-[var(--color-text-primary)] opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {skill.name}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <div className="mt-16 text-center">
          <p className="text-[var(--color-text-secondary)] mb-4">
            Interested in collaborating?
          </p>
          <Link
            href="mailto:tommy.larsin@hotmail.com"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-[var(--color-border)] text-[var(--color-text-primary)] font-medium transition-all duration-200 hover:border-[var(--color-accent-primary)] hover:text-[var(--color-accent-primary)]"
          >
            Get in touch
            <i className="fas fa-envelope" />
          </Link>
        </div>
      </div>
    </div>
  );
}

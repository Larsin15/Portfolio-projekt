import Link from "next/link";
import Image from "next/image";

interface Project {
  slug: string;
  title: string;
  description: string;
  techStack: Array<{ name: string; iconClass: string }>;
  demoType: "static" | "interactive" | "personality_miner";
  isFeatured: boolean;
  thumbnailUrl?: string;
  githubUrl?: string;
}

interface ProjectCardProps {
  project: Project;
  featured?: boolean;
}

export function ProjectCard({ project, featured = false }: ProjectCardProps) {
  const href =
    project.demoType === "personality_miner" || project.slug === "personality-miner"
      ? "/personality-miner"
      : `/projects/${project.slug}`;

  if (featured) {
    return (
      <div className="group p-6 rounded-xl bg-[var(--color-bg-secondary)] border border-[var(--color-border)] transition-all duration-300 hover:border-[var(--color-accent-primary)]">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Thumbnail */}
          {project.thumbnailUrl && (
            <div className="relative w-full md:w-64 aspect-video rounded-lg overflow-hidden">
              <Image
                src={project.thumbnailUrl}
                alt={project.title}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-110"
              />
            </div>
          )}
          
          {/* Content */}
          <div className="flex-1">
            <h3 className="text-2xl font-bold font-[family-name:var(--font-display)] text-[var(--color-text-primary)] mb-3 group-hover:text-[var(--color-accent-primary)] transition-colors">
              {project.title}
            </h3>

            {/* Tech Stack with Font Awesome icons */}
            <div className="flex flex-wrap gap-4 mb-4">
              {project.techStack.map((tech) => (
                <i
                  key={tech.name}
                  className={`${tech.iconClass} text-xl text-[var(--color-accent-primary)] transition-colors duration-300 hover:text-[var(--color-accent-secondary)]`}
                  title={tech.name}
                />
              ))}
            </div>

            <p className="text-[var(--color-text-secondary)] mb-6 leading-relaxed">
              {project.description}
            </p>

            {/* Action buttons */}
            <div className="flex gap-4">
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-[var(--color-accent-primary)] text-[var(--color-bg-primary)] font-bold transition-all duration-300 hover:bg-[var(--color-accent-secondary)]"
                >
                  <i className="fab fa-github text-xl" />
                  <span>Repository</span>
                </a>
              )}
              
              <Link
                href={href}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-[var(--color-border)] text-[var(--color-text-primary)] font-semibold transition-all duration-300 hover:border-[var(--color-accent-primary)] hover:text-[var(--color-accent-primary)]"
              >
                View Details
                <i className="fas fa-arrow-right" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="group p-6 rounded-xl bg-[var(--color-bg-secondary)] border border-[var(--color-border)] transition-all duration-300 hover:border-[var(--color-accent-primary)] hover:translate-y-[-4px]">
      {/* Thumbnail */}
      {project.thumbnailUrl && (
        <div className="relative w-full aspect-video rounded-lg overflow-hidden mb-4">
          <Image
            src={project.thumbnailUrl}
            alt={project.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-115"
          />
        </div>
      )}
      
      <h3 className="text-lg font-bold font-[family-name:var(--font-display)] text-[var(--color-text-primary)] mb-3 group-hover:text-[var(--color-accent-primary)] transition-colors">
        {project.title}
      </h3>

      {/* Tech Stack */}
      <div className="flex flex-wrap gap-4 mb-4">
        {project.techStack.map((tech) => (
          <i
            key={tech.name}
            className={`${tech.iconClass} text-lg text-[var(--color-accent-primary)] transition-colors duration-300 hover:text-[var(--color-accent-secondary)]`}
            title={tech.name}
          />
        ))}
      </div>

      <p className="text-sm text-[var(--color-text-secondary)] mb-4 line-clamp-3">
        {project.description}
      </p>

      {/* Action */}
      {project.githubUrl && (
        <a
          href={project.githubUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--color-accent-primary)] text-[var(--color-bg-primary)] font-bold text-sm transition-all duration-300 hover:bg-[var(--color-accent-secondary)]"
        >
          <i className="fab fa-github" />
          <span>Repository</span>
        </a>
      )}
    </div>
  );
}

"use client";

const skills = [
  { name: "Java", iconClass: "fab fa-java" },
  { name: "Node.js", iconClass: "fab fa-node-js" },
  { name: "Docker", iconClass: "fab fa-docker" },
  { name: "PostgreSQL", iconClass: "fas fa-database" },
  { name: "JavaScript", iconClass: "fab fa-js" },
  { name: "Spring Boot", iconClass: "fas fa-leaf" },
  { name: "React", iconClass: "fab fa-react" },
  { name: "TypeScript", iconClass: "fab fa-js-square" },
  { name: "Git", iconClass: "fab fa-git-alt" },
];

export function SkillsGrid() {
  return (
    <div className="flex flex-wrap justify-center gap-12">
      {skills.map((skill) => (
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
  );
}

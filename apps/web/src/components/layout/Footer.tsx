import Link from "next/link";

const socialLinks = [
  {
    name: "LinkedIn",
    href: "https://www.linkedin.com/in/tommy-larsin-b88036150/",
    iconClass: "fab fa-linkedin",
  },
  {
    name: "GitHub",
    href: "https://github.com/Larsin15",
    iconClass: "fab fa-github",
  },
  {
    name: "Email",
    href: "mailto:tommy.larsin@hotmail.com",
    iconClass: "fas fa-envelope",
  },
];

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className="py-7 px-[5%] text-center font-bold"
      style={{
        background: `linear-gradient(
          to bottom,
          #141414 0%,
          #353b37 1%,
          #141414 2%,
          rgb(200, 230, 209) 99%
        )`,
        color: "rgba(0, 0, 0, 0.5)",
      }}
    >
      <p>© {currentYear} Tommy Larsin</p>
      
      {/* Social Links */}
      <div className="flex items-center justify-center gap-6 mt-4 text-3xl">
        {socialLinks.map((link) => (
          <a
            key={link.name}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#333] transition-transform duration-300 hover:scale-125"
            aria-label={link.name}
          >
            <i className={link.iconClass} />
          </a>
        ))}
      </div>

      {/* Location */}
      <div className="mt-4">
        <p className="text-sm">
          <i className="fas fa-map-marker-alt mr-2" />
          Göteborg, Sweden
        </p>
      </div>
    </footer>
  );
}

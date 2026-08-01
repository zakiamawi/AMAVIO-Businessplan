import Link from "next/link";
import { BrandMark } from "@/components/brand-mark";
import { company } from "@/lib/content";

const navItems = [
  ["Wohnen", "/wohnen"],
  ["Arbeitgeber", "/arbeitgeber"],
  ["Bewohner", "/bewohner"],
  ["Immobilienpartner", "/immobilienpartner"],
  ["So funktioniert es", "/so-funktioniert-es"],
  ["Standorte", "/standorte"],
  ["Kontakt", "/kontakt"],
];

type SectionLink = {
  label: string;
  href: `#${string}`;
};

export function PageHeader({
  actionHref = "/wohnen",
  actionLabel = "Wohnraum finden",
  sectionLinks = [],
}: {
  actionHref?: string;
  actionLabel?: string;
  sectionLinks?: readonly SectionLink[];
}) {
  return (
    <>
      <header className="site-header">
        <BrandMark />
        <nav aria-label="Hauptnavigation">
          {navItems.map(([label, href]) => (
            <Link href={href} key={href}>
              {label}
            </Link>
          ))}
        </nav>
        <Link className="nav-action" href={actionHref}>
          {actionLabel}
        </Link>
      </header>
      {sectionLinks.length > 0 ? (
        <nav className="home-section-nav" aria-label="Bereiche auf dieser Seite">
          {sectionLinks.map((link) => (
            <a href={link.href} key={link.href}>
              {link.label}
            </a>
          ))}
        </nav>
      ) : null}
    </>
  );
}

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <BrandMark />
      <p>
        {company.legalName} · {company.location}. Vollständige Anbieterangaben
        folgen erst nach Prüfung der verbindlichen Registerdaten.
      </p>
      <nav aria-label="Rechtliche Informationen">
        <Link href="/so-funktioniert-es">So funktioniert es</Link>
        <Link href="/impressum">Impressum</Link>
        <Link href="/datenschutz">Datenschutz</Link>
      </nav>
    </footer>
  );
}

export function PageHero({
  eyebrow,
  title,
  text,
}: {
  eyebrow: string;
  title: string;
  text: string;
}) {
  return (
    <section className="page-hero">
      <p className="eyebrow">{eyebrow}</p>
      <h1>{title}</h1>
      <p>{text}</p>
    </section>
  );
}

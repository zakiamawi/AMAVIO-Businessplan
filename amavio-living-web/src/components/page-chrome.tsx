import Link from "next/link";
import { BrandMark } from "@/components/brand-mark";

const navItems = [
  ["Wohnen", "/wohnen"],
  ["Arbeitgeber", "/arbeitgeber"],
  ["Bewohner", "/bewohner"],
  ["Immobilienpartner", "/immobilienpartner"],
  ["Standorte", "/standorte"],
  ["Kontakt", "/kontakt"],
];

export function PageHeader() {
  return (
    <header className="site-header">
      <BrandMark />
      <nav aria-label="Hauptnavigation">
        {navItems.map(([label, href]) => (
          <Link href={href} key={href}>
            {label}
          </Link>
        ))}
      </nav>
      <Link className="nav-action" href="/wohnen">
        Wohnraum finden
      </Link>
    </header>
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

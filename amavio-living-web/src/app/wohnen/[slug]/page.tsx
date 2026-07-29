import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/page-chrome";
import { housingConcepts } from "@/lib/content";

export function generateStaticParams() {
  return housingConcepts.map((concept) => ({ slug: concept.slug }));
}

export default async function HousingDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const concept = housingConcepts.find((item) => item.slug === slug);

  if (!concept) {
    notFound();
  }

  return (
    <main>
      <PageHeader />
      <section className="detail-hero">
        <div>
          <p className="eyebrow">{concept.badge}</p>
          <h1>{concept.title}</h1>
          <p>{concept.description}</p>
          <Link className="primary-action" href="/kontakt">
            Verfügbarkeit anfragen
          </Link>
        </div>
        <aside>
          <strong>{concept.location}</strong>
          <span>{concept.audience}</span>
          <p>
            Konzeptdarstellung. Keine reale Einheit, kein garantierter Standort
            und kein Buchungsversprechen ohne AMAVIO-Prüfung.
          </p>
        </aside>
      </section>
      <section className="feature-list">
        {concept.features.map((feature) => (
          <span key={feature}>{feature}</span>
        ))}
      </section>
    </main>
  );
}

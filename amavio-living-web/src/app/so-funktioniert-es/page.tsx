import { PageHeader, PageHero } from "@/components/page-chrome";
import { operatingSteps } from "@/lib/content";

export default function SoFunktioniertEsPage() {
  return (
    <main>
      <PageHeader />
      <PageHero
        eyebrow="So funktioniert es"
        title="Ein digital geführter Weg vom Bedarf bis zur Zugehörigkeit."
        text="AMAVIO trennt frühe Anfrage, geprüfte Entscheidung, Umsetzung und Stabilisierung, damit Menschen und Arbeitgeber nicht in ungeklärte Prozesse laufen."
      />
      <ol className="step-rail subpage-steps">
        {operatingSteps.map((step, index) => (
          <li key={step}>
            <span>{String(index + 1).padStart(2, "0")}</span>
            {step}
          </li>
        ))}
      </ol>
    </main>
  );
}

"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { company } from "@/lib/content";

const heroStagger = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.09, delayChildren: 0.12 },
  },
};

const heroRise = {
  hidden: { opacity: 0, y: 28 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as const },
  },
};

type RoleKey = "Arbeitgeber" | "Bewohner" | "Partner" | "Security";

const roleDeck: Record<
  RoleKey,
  {
    eyebrow: string;
    title: string;
    body: string;
  }
> = {
  Arbeitgeber: {
    eyebrow: "Cohort Command",
    title: "Kohorten starten, bevor Wohnraum zum Recruiting-Risiko wird.",
    body: "AMAVIO verbindet Bedarf, Standort, Budget, Einzug, 90-Tage-Startphase und Begleitung bis Tag 180 zu einem geführten Delivery-System für HR, Kliniken und Recruitingpartner.",
  },
  Bewohner: {
    eyebrow: "Arrival Journey",
    title: "Ankommen fühlt sich einfacher an, wenn jeder nächste Schritt sichtbar ist.",
    body: "Bewohner sehen Orientierung, Wohnen, Community und offene Schritte als klare Reise statt als Papierchaos zwischen Vertrag, Stadt und Alltag.",
  },
  Partner: {
    eyebrow: "Supply Network",
    title: "Aus lokalen Partnern wird eine belastbare Lieferfähigkeit.",
    body: "Vermieter, Betreiber, Makler, Handwerk, Möblierung und Internet werden in Rollen, Kapazitäten und Übergabepunkte gegliedert.",
  },
  Security: {
    eyebrow: "Trust Control",
    title: "Sicherheit, Datenschutz und Freigaben sind Teil des Produkts.",
    body: "Anfragen, Rollen, Daten, Webhook-Logik und Governance werden als Kontrollschicht geführt, bevor Prozesse skaliert werden.",
  },
};

const navLinks = [
  { href: "#arbeitgeber", label: "Arbeitgeber" },
  { href: "#bewohner", label: "Bewohner" },
  { href: "#partner", label: "Partner" },
  { href: "#sicherheit", label: "Sicherheit" },
];

export function AmavioOperatingStage() {
  const [activeRole, setActiveRole] = useState<RoleKey>("Arbeitgeber");
  const reducedMotion = useReducedMotion();
  const role = roleDeck[activeRole];

  return (
    <section className="amavio-os-stage" aria-label="AMAVIO Arrival Operating System">
      <div className="amavio-os-stage__media" aria-hidden="true">
        <Image
          src="/images/amavio-hero-os.png"
          alt=""
          fill
          priority
          sizes="100vw"
          className="amavio-os-stage__image"
        />
      </div>
      <div className="amavio-os-stage__shade" aria-hidden="true" />

      <header className="amavio-os-stage__nav">
        <Link className="amavio-os-stage__brand" href="/" aria-label={`${company.brand} Startseite`}>
          <span>A</span>
          <strong>{company.brand}</strong>
        </Link>
        <nav aria-label="Startseitenbereiche">
          {navLinks.map((item) => (
            <Link key={item.href} href={item.href}>
              {item.label}
            </Link>
          ))}
        </nav>
        <Link className="amavio-os-stage__nav-action" href="/kontakt">
          Anfrage
        </Link>
      </header>

      <div className="amavio-os-stage__grid">
        <motion.div
          className="amavio-os-stage__copy"
          variants={heroStagger}
          initial={reducedMotion ? false : "hidden"}
          animate="show"
        >
          <motion.p variants={heroRise} className="amavio-os-stage__eyebrow">
            {role.eyebrow}
          </motion.p>
          <motion.h1 variants={heroRise}>
            <span>Arrival</span>
            <span>Operating System</span>
          </motion.h1>
          <motion.p variants={heroRise} className="amavio-os-stage__descriptor">
            {company.descriptor}
          </motion.p>
          <motion.p variants={heroRise} className="amavio-os-stage__claim">
            {role.title}
          </motion.p>
          <motion.p variants={heroRise} className="amavio-os-stage__text">
            {role.body}
          </motion.p>

          <motion.div
            variants={heroRise}
            className="amavio-os-stage__actions"
            aria-label="Primäre Aktionen"
          >
            <Link href="/kontakt">Readiness Discovery</Link>
            <Link href="#plattform">System erkunden</Link>
          </motion.div>

          <motion.div
            variants={heroRise}
            className="amavio-os-stage__role-dock"
            role="tablist"
            aria-label="AMAVIO Rollen"
          >
            {(Object.keys(roleDeck) as RoleKey[]).map((key) => (
              <button
                key={key}
                type="button"
                role="tab"
                aria-selected={activeRole === key}
                className={activeRole === key ? "is-active" : ""}
                onClick={() => setActiveRole(key)}
              >
                <span>{key.slice(0, 2).toUpperCase()}</span>
                {key}
              </button>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

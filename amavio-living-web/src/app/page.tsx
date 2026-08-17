import type { Metadata } from "next";
import { AmavioCommandCenter } from "@/components/amavio-command-center";
import { AmavioOperatingStage } from "@/components/amavio-operating-stage";
import { AmavioPremiumSections } from "@/components/amavio-premium-sections";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default function Home() {
  return (
    <main id="top" className="premium-home" data-amavio-home="arrival-os-command-center">
      <AmavioOperatingStage />
      <AmavioCommandCenter />
      <AmavioPremiumSections />
    </main>
  );
}

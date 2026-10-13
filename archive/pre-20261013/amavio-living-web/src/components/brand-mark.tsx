import Link from "next/link";

export function BrandMark({ light = false }: { light?: boolean }) {
  return (
    <Link
      className={`brand-mark${light ? " brand-mark-light" : ""}`}
      href="/"
      aria-label="AMAVIO Living Startseite"
    >
      <span className="brand-symbol" aria-hidden="true">
        A
      </span>
      <span>
        <strong>AMAVIO</strong>
        <small>LIVING</small>
      </span>
    </Link>
  );
}

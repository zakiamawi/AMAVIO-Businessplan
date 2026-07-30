type SectionLabelProps = {
  eyebrow: string;
  title: string;
  text?: string;
};

export function SectionLabel({ eyebrow, title, text }: SectionLabelProps) {
  return (
    <div className="section-label">
      <p>{eyebrow}</p>
      <h2>{title}</h2>
      {text ? <span>{text}</span> : null}
    </div>
  );
}

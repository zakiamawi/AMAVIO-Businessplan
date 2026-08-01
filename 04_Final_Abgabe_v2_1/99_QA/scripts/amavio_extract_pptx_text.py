from __future__ import annotations

import argparse
import json
import re
import zipfile
from pathlib import Path
from xml.etree import ElementTree as ET


NS = {
    "a": "http://schemas.openxmlformats.org/drawingml/2006/main",
}


RISK_PATTERNS = [
    "v1.7",
    "v1_7",
    "92.000",
    "garantiert",
    "Garantie",
    "verfügbar",
    "Verfügbarkeit",
    "sofort verfügbar",
    "100%",
]


def natural_key(name: str) -> tuple[int, str]:
    match = re.search(r"(\d+)", name)
    return (int(match.group(1)) if match else 999999, name)


def extract_text(xml_bytes: bytes) -> str:
    root = ET.fromstring(xml_bytes)
    parts: list[str] = []
    for node in root.findall(".//a:t", NS):
        if node.text:
            parts.append(node.text)
    return "\n".join(parts)


def extract_deck(pptx_path: Path) -> dict:
    slides = []
    notes = []
    with zipfile.ZipFile(pptx_path, "r") as archive:
        slide_names = sorted(
            [name for name in archive.namelist() if re.fullmatch(r"ppt/slides/slide\d+\.xml", name)],
            key=natural_key,
        )
        note_names = sorted(
            [name for name in archive.namelist() if re.fullmatch(r"ppt/notesSlides/notesSlide\d+\.xml", name)],
            key=natural_key,
        )

        for name in slide_names:
            slides.append({"name": name, "text": extract_text(archive.read(name))})

        for name in note_names:
            notes.append({"name": name, "text": extract_text(archive.read(name))})

    full_text = "\n".join([item["text"] for item in slides + notes])
    risks = {pattern: full_text.count(pattern) for pattern in RISK_PATTERNS if pattern in full_text}
    return {
        "path": str(pptx_path),
        "slide_count": len(slides),
        "notes_count": len(notes),
        "slides": slides,
        "notes": notes,
        "risks": risks,
    }


def write_markdown(deck: dict, out_path: Path) -> None:
    lines = [
        f"# PPTX Text Extract: {Path(deck['path']).name}",
        "",
        f"- Slides: {deck['slide_count']}",
        f"- Notes: {deck['notes_count']}",
        f"- Risk hits: `{json.dumps(deck['risks'], ensure_ascii=False)}`",
        "",
        "## Visible slide text",
        "",
    ]
    for idx, slide in enumerate(deck["slides"], start=1):
        lines.extend([f"### Slide {idx}", "", "```text", slide["text"].strip(), "```", ""])

    lines.extend(["## Speaker notes text", ""])
    for idx, note in enumerate(deck["notes"], start=1):
        lines.extend([f"### Notes {idx}", "", "```text", note["text"].strip(), "```", ""])

    out_path.write_text("\n".join(lines), encoding="utf-8")


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--out-dir", type=Path, required=True)
    parser.add_argument("pptx", nargs="+", type=Path)
    args = parser.parse_args()

    args.out_dir.mkdir(parents=True, exist_ok=True)
    summary = []
    for pptx in args.pptx:
        deck = extract_deck(pptx.resolve())
        stem = pptx.stem
        json_path = args.out_dir / f"{stem}_text_extract.json"
        md_path = args.out_dir / f"{stem}_text_extract.md"
        json_path.write_text(json.dumps(deck, indent=2, ensure_ascii=False), encoding="utf-8")
        write_markdown(deck, md_path)
        summary.append(
            {
                "file": str(pptx),
                "slides": deck["slide_count"],
                "notes": deck["notes_count"],
                "risks": deck["risks"],
                "json": str(json_path),
                "markdown": str(md_path),
            }
        )

    print(json.dumps(summary, indent=2, ensure_ascii=False))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

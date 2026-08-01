from __future__ import annotations

import argparse
import json
from pathlib import Path

from pypdf import PdfReader


RISK_PATTERNS = [
    "v1.7",
    "v1_7",
    "92.000",
    "Mehrmodell",
    "93.500",
    "269.000",
    "442.000",
    "25.000",
    "29.500",
]


def audit_pdf(path: Path) -> dict:
    reader = PdfReader(str(path))
    page_texts = []
    for idx, page in enumerate(reader.pages, start=1):
        text = page.extract_text() or ""
        page_texts.append({"page": idx, "chars": len(text), "text": text})

    full_text = "\n".join(item["text"] for item in page_texts)
    hits = {}
    for pattern in RISK_PATTERNS:
        pages = [item["page"] for item in page_texts if pattern in item["text"]]
        if pages:
            hits[pattern] = pages

    return {
        "path": str(path),
        "page_count": len(reader.pages),
        "text_chars": len(full_text),
        "empty_text_pages": [item["page"] for item in page_texts if item["chars"] == 0],
        "risk_hits": hits,
    }


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--out", type=Path, required=True)
    parser.add_argument("pdf", nargs="+", type=Path)
    args = parser.parse_args()

    results = [audit_pdf(path.resolve()) for path in args.pdf]
    args.out.parent.mkdir(parents=True, exist_ok=True)
    args.out.write_text(json.dumps(results, indent=2, ensure_ascii=False), encoding="utf-8")
    print(json.dumps(results, indent=2, ensure_ascii=False))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

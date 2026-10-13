from __future__ import annotations

import argparse
import json
import re
import zipfile
from pathlib import Path
from xml.etree import ElementTree as ET


NS = {"w": "http://schemas.openxmlformats.org/wordprocessingml/2006/main"}

RISK_PATTERNS = [
    "v1.7",
    "v1_7",
    "Mehrmodell",
    "92.000",
    "Finanzmodell v1.8",
    "93.500",
    "269.000",
    "442.000",
    "25.000",
    "29.500",
]


def extract_docx_text(path: Path) -> str:
    parts: list[str] = []
    with zipfile.ZipFile(path, "r") as archive:
        names = [
            "word/document.xml",
            *sorted(name for name in archive.namelist() if name.startswith("word/header") and name.endswith(".xml")),
            *sorted(name for name in archive.namelist() if name.startswith("word/footer") and name.endswith(".xml")),
            *sorted(name for name in archive.namelist() if name.startswith("word/footnotes") and name.endswith(".xml")),
            *sorted(name for name in archive.namelist() if name.startswith("word/endnotes") and name.endswith(".xml")),
        ]
        for name in names:
            if name not in archive.namelist():
                continue
            root = ET.fromstring(archive.read(name))
            for node in root.findall(".//w:t", NS):
                if node.text:
                    parts.append(node.text)
            parts.append("\n")
    return " ".join(parts)


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--out", type=Path, required=True)
    parser.add_argument("docx", type=Path)
    args = parser.parse_args()

    path = args.docx.resolve()
    text = extract_docx_text(path)
    words = re.findall(r"\S+", text)
    hits = {pattern: text.count(pattern) for pattern in RISK_PATTERNS if pattern in text}
    result = {
        "path": str(path),
        "size_bytes": path.stat().st_size,
        "text_chars": len(text),
        "word_like_tokens": len(words),
        "risk_hits": hits,
    }
    args.out.parent.mkdir(parents=True, exist_ok=True)
    args.out.write_text(json.dumps(result, indent=2, ensure_ascii=False), encoding="utf-8")
    print(json.dumps(result, indent=2, ensure_ascii=False))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

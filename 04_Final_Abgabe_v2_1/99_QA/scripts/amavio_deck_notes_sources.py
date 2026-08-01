from __future__ import annotations

import argparse
import datetime as dt
import shutil
import sys
import zipfile
from pathlib import Path


REPLACEMENTS = {
    "Businessplan v1.7": "Businessplan v2.2",
    "Finanzmodell v1.7": "Finanzmodell v1.8",
    "Businessplan_Master_v1.7": "Businessplan_Master_v2.2",
    "Finanzmodell_36_Monate_v1_7": "Finanzmodell_36_Monate_v1_8",
    "v1.7": "v1.8",
}


def iter_text_entries(pptx_path: Path):
    with zipfile.ZipFile(pptx_path, "r") as archive:
        for info in archive.infolist():
            name = info.filename
            if not name.startswith("ppt/"):
                continue
            if not name.endswith(".xml"):
                continue
            data = archive.read(name)
            try:
                text = data.decode("utf-8")
            except UnicodeDecodeError:
                continue
            yield name, text


def entry_kind(name: str) -> str:
    if name.startswith("ppt/notesSlides/"):
        return "notes"
    if name.startswith("ppt/slides/"):
        return "visible-slide"
    return "other"


def context(text: str, needle: str, width: int = 90) -> str:
    idx = text.find(needle)
    if idx < 0:
        return ""
    start = max(0, idx - width)
    end = min(len(text), idx + len(needle) + width)
    return " ".join(text[start:end].replace("\n", " ").split())


def scan(pptx_paths: list[Path]) -> int:
    hits = 0
    for pptx_path in pptx_paths:
        print(f"\n## {pptx_path}")
        if not pptx_path.exists():
            print("MISSING")
            hits += 1
            continue
        file_hits = 0
        for name, text in iter_text_entries(pptx_path):
            if "v1.7" not in text and "v1_7" not in text:
                continue
            file_hits += 1
            hits += 1
            print(f"- {entry_kind(name)} | {name}")
            for needle in ("v1.7", "v1_7", "Businessplan v1.7", "Finanzmodell v1.7"):
                if needle in text:
                    print(f"  {needle}: {context(text, needle)}")
        if not file_hits:
            print("OK: no v1.7/v1_7 occurrences in ppt XML")
    return 1 if hits else 0


def backup_path_for(pptx_path: Path, backup_root: Path) -> Path:
    backup_root.mkdir(parents=True, exist_ok=True)
    return backup_root / pptx_path.name


def fix_one(pptx_path: Path, backup_root: Path) -> int:
    if not pptx_path.exists():
        raise FileNotFoundError(pptx_path)

    backup_path = backup_path_for(pptx_path, backup_root)
    if not backup_path.exists():
        shutil.copy2(pptx_path, backup_path)

    temp_path = pptx_path.with_suffix(pptx_path.suffix + ".tmp")
    changed_entries = 0

    with zipfile.ZipFile(pptx_path, "r") as src, zipfile.ZipFile(temp_path, "w") as dst:
        for info in src.infolist():
            data = src.read(info.filename)
            if info.filename.startswith("ppt/notesSlides/") and info.filename.endswith(".xml"):
                try:
                    text = data.decode("utf-8")
                except UnicodeDecodeError:
                    text = None
                if text is not None:
                    new_text = text
                    for old, new in REPLACEMENTS.items():
                        new_text = new_text.replace(old, new)
                    if new_text != text:
                        data = new_text.encode("utf-8")
                        changed_entries += 1
            dst.writestr(info, data)

    if changed_entries:
        temp_path.replace(pptx_path)
    else:
        temp_path.unlink(missing_ok=True)
    return changed_entries


def fix(pptx_paths: list[Path], backup_root: Path) -> int:
    total = 0
    for pptx_path in pptx_paths:
        changed = fix_one(pptx_path, backup_root)
        total += changed
        print(f"{pptx_path}: changed notes XML entries={changed}")
    print(f"Backup root: {backup_root}")
    return 0


def main(argv: list[str]) -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("mode", choices=["scan", "fix"])
    parser.add_argument("pptx", nargs="+", type=Path)
    parser.add_argument("--backup-root", type=Path)
    args = parser.parse_args(argv)

    pptx_paths = [path.resolve() for path in args.pptx]
    if args.mode == "scan":
        return scan(pptx_paths)

    stamp = dt.datetime.now().strftime("%Y%m%d_%H%M%S")
    backup_root = (args.backup_root or Path("04_Final_Abgabe_v2_1/_backups") / f"deck_notes_sources_{stamp}").resolve()
    return fix(pptx_paths, backup_root)


if __name__ == "__main__":
    raise SystemExit(main(sys.argv[1:]))

from __future__ import annotations

import argparse
import hashlib
import json
import zipfile
from pathlib import Path


def sha256(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()


def compare_zip(before: Path, after: Path) -> dict:
    with zipfile.ZipFile(before, "r") as z_before, zipfile.ZipFile(after, "r") as z_after:
        before_names = set(z_before.namelist())
        after_names = set(z_after.namelist())
        added = sorted(after_names - before_names)
        removed = sorted(before_names - after_names)
        common = sorted(before_names & after_names)
        changed = []
        for name in common:
            before_hash = sha256(z_before.read(name))
            after_hash = sha256(z_after.read(name))
            if before_hash != after_hash:
                changed.append(name)

    visible_sensitive = [
        name
        for name in changed + added + removed
        if name.startswith(("ppt/slides/", "ppt/slideLayouts/", "ppt/slideMasters/", "ppt/media/", "ppt/theme/"))
    ]
    notes_only = bool(changed) and not added and not removed and not visible_sensitive and all(
        name.startswith("ppt/notesSlides/") for name in changed
    )
    return {
        "before": str(before),
        "after": str(after),
        "added": added,
        "removed": removed,
        "changed": changed,
        "visible_sensitive_changes": visible_sensitive,
        "notes_only": notes_only,
    }


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--backup-dir", type=Path, required=True)
    parser.add_argument("--out", type=Path, required=True)
    parser.add_argument("current", nargs="+", type=Path)
    args = parser.parse_args()

    results = []
    for current in args.current:
        before = args.backup_dir / current.name
        results.append(compare_zip(before.resolve(), current.resolve()))

    args.out.parent.mkdir(parents=True, exist_ok=True)
    args.out.write_text(json.dumps(results, indent=2, ensure_ascii=False), encoding="utf-8")
    print(json.dumps(results, indent=2, ensure_ascii=False))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

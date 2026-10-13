from __future__ import annotations

import argparse
import hashlib
import json
from pathlib import Path


def sha256(path: Path) -> str:
    h = hashlib.sha256()
    with path.open("rb") as handle:
        for chunk in iter(lambda: handle.read(1024 * 1024), b""):
            h.update(chunk)
    return h.hexdigest()


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--out", type=Path, required=True)
    parser.add_argument("files", nargs="+", type=Path)
    args = parser.parse_args()

    rows = []
    for path in args.files:
        resolved = path.resolve()
        rows.append(
            {
                "path": str(path),
                "absolute_path": str(resolved),
                "exists": resolved.exists(),
                "size_bytes": resolved.stat().st_size if resolved.exists() else None,
                "sha256": sha256(resolved) if resolved.exists() else None,
            }
        )

    args.out.parent.mkdir(parents=True, exist_ok=True)
    args.out.write_text(json.dumps(rows, indent=2, ensure_ascii=False), encoding="utf-8")
    print(json.dumps(rows, indent=2, ensure_ascii=False))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

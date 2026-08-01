from __future__ import annotations

import math
import sys
from pathlib import Path

from PIL import Image, ImageDraw


def main() -> int:
    if len(sys.argv) != 3:
        print("Usage: amavio_make_contact_sheets.py <png_dir> <out_prefix>", file=sys.stderr)
        return 2
    src = Path(sys.argv[1])
    out_prefix = Path(sys.argv[2])
    paths = sorted(src.glob("page-*.png"))
    if not paths:
        raise FileNotFoundError(f"No page-*.png files found in {src}")

    per_sheet = 12
    cols = 3
    thumb_w = 360
    pad = 24
    label_h = 24

    for sheet_idx in range(math.ceil(len(paths) / per_sheet)):
        batch = paths[sheet_idx * per_sheet : (sheet_idx + 1) * per_sheet]
        thumbs = []
        for path in batch:
            img = Image.open(path).convert("RGB")
            ratio = thumb_w / img.width
            thumb_h = int(img.height * ratio)
            img = img.resize((thumb_w, thumb_h))
            thumbs.append((path, img))
        rows = math.ceil(len(thumbs) / cols)
        thumb_h_max = max(img.height for _, img in thumbs)
        sheet_w = cols * thumb_w + (cols + 1) * pad
        sheet_h = rows * (thumb_h_max + label_h) + (rows + 1) * pad
        sheet = Image.new("RGB", (sheet_w, sheet_h), "white")
        draw = ImageDraw.Draw(sheet)
        for idx, (path, img) in enumerate(thumbs):
            col = idx % cols
            row = idx // cols
            x = pad + col * (thumb_w + pad)
            y = pad + row * (thumb_h_max + label_h + pad)
            draw.text((x, y), path.stem, fill=(30, 30, 30))
            sheet.paste(img, (x, y + label_h))
        out = out_prefix.with_name(f"{out_prefix.name}-{sheet_idx + 1:02d}.jpg")
        sheet.save(out, quality=88)
        print(out)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

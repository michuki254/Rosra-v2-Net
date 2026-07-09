#!/usr/bin/env python3
"""Render each page of a PDF to PNG files for document QA."""

from __future__ import annotations

import argparse
import sys
from pathlib import Path

sys.path.insert(0, "/tmp/rosra_render_py")

import pypdfium2 as pdfium


def render_pdf(pdf_path: Path, output_dir: Path, scale: float) -> int:
    output_dir.mkdir(parents=True, exist_ok=True)
    pdf = pdfium.PdfDocument(str(pdf_path))
    for index in range(len(pdf)):
        page = pdf[index]
        bitmap = page.render(scale=scale)
        image = bitmap.to_pil()
        image.save(output_dir / f"page-{index + 1:03d}.png")
        page.close()
    return len(pdf)


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("pdf", type=Path)
    parser.add_argument("--output_dir", type=Path, required=True)
    parser.add_argument("--scale", type=float, default=2.0)
    args = parser.parse_args()

    count = render_pdf(args.pdf, args.output_dir, args.scale)
    print(f"Rendered {count} pages to {args.output_dir}")


if __name__ == "__main__":
    main()

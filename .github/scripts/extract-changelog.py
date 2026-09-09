#!/usr/bin/env python3
"""Extract one version section from Version.md into a release notes file."""
from __future__ import annotations

import argparse
import re
from pathlib import Path


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--version", required=True)
    ap.add_argument("--tag", required=True)
    ap.add_argument("--repo", required=True)
    ap.add_argument("--version-md", default="Version.md")
    ap.add_argument("--out", default="release-notes.md")
    args = ap.parse_args()

    path = Path(args.version_md)
    out = Path(args.out)
    if not path.is_file():
        raise SystemExit(f"missing {path}")

    text = path.read_text(encoding="utf-8")
    pat = re.compile(rf"(?m)^##\s+{re.escape(args.version)}(?:\s|\(|$)")
    m = pat.search(text)
    if not m:
        body = (
            f"## {args.version}\n\n"
            f"_Version.md 中未找到该版本章节，已回退为占位说明。_\n\n"
            f"**Tag:** `{args.tag}`\n"
        )
    else:
        start = m.start()
        nxt = re.search(r"(?m)^##\s+", text[m.end() :])
        end = m.end() + nxt.start() if nxt else len(text)
        body = text[start:end].rstrip() + "\n"

    body += (
        "\n---\n\n"
        f"完整版本日志见仓库 [`Version.md`](https://github.com/{args.repo}/blob/{args.tag}/Version.md)。\n"
    )
    out.write_text(body, encoding="utf-8")
    print(body)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

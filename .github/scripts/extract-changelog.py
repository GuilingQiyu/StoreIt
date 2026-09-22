#!/usr/bin/env python3
"""Extract one version section from Version.md for a GitHub Release body."""
from __future__ import annotations

import argparse
import re
from pathlib import Path


def extract_section(text: str, version: str) -> str:
    pat = re.compile(rf"(?m)^##\s+{re.escape(version)}(?:\s|\(|$)")
    match = pat.search(text)
    if not match:
        raise SystemExit(
            f"Version.md 中没有版本 {version} 的章节（标题需为 '## {version}'）"
        )
    nxt = re.search(r"(?m)^##\s+", text[match.end() :])
    end = match.end() + nxt.start() if nxt else len(text)
    return text[match.start() : end].rstrip() + "\n"


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--version", required=True)
    parser.add_argument("--tag", required=True)
    parser.add_argument("--repo", required=True)
    parser.add_argument("--version-md", default="Version.md")
    parser.add_argument("--out", default="release-notes.md")
    args = parser.parse_args()

    path = Path(args.version_md)
    if not path.is_file():
        raise SystemExit(f"找不到 {path}")

    body = extract_section(path.read_text(encoding="utf-8"), args.version)
    body += (
        "\n---\n\n"
        f"完整版本日志见仓库 [`Version.md`](https://github.com/{args.repo}/blob/{args.tag}/Version.md)。\n"
    )
    Path(args.out).write_text(body, encoding="utf-8")
    print(body, end="")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

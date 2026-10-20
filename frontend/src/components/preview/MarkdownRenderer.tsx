"use client";

import React, { useState, useMemo } from "react";
import {
  Check,
  Copy,
  Info,
  Lightbulb,
  AlertTriangle,
  AlertOctagon,
  Sparkles,
  ListTree,
  ChevronRight,
  ChevronDown,
} from "lucide-react";
import { copyToClipboard, getPreviewUrl } from "@/lib/utils";

export interface TocHeading {
  id: string;
  level: number;
  text: string;
}

interface MarkdownRendererProps {
  content: string;
  basePath?: string;
  showToc?: boolean;
}

function slugifyHeading(text: string, index: number): string {
  const clean = text
    .replace(/[`*_~=#<>[\]()!]/g, "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-");
  return `md-h-${index}-${clean || index}`;
}

function resolveRelativePath(baseFilePath: string | undefined, relUrl: string): string {
  if (!relUrl) return "";
  if (
    relUrl.startsWith("http://") ||
    relUrl.startsWith("https://") ||
    relUrl.startsWith("data:") ||
    relUrl.startsWith("blob:") ||
    relUrl.startsWith("/")
  ) {
    return relUrl;
  }
  const baseDir =
    baseFilePath && baseFilePath.includes("/")
      ? baseFilePath.slice(0, baseFilePath.lastIndexOf("/"))
      : "";
  const combined = baseDir ? `${baseDir}/${relUrl}` : relUrl;
  const parts = combined.split("/");
  const resolved: string[] = [];
  for (const part of parts) {
    if (!part || part === ".") continue;
    if (part === "..") {
      resolved.pop();
    } else {
      resolved.push(part);
    }
  }
  return getPreviewUrl(resolved.join("/"));
}

const LATEX_SYMBOLS: Record<string, string> = {
  "\\alpha": "α",
  "\\beta": "β",
  "\\gamma": "γ",
  "\\delta": "δ",
  "\\epsilon": "ε",
  "\\zeta": "ζ",
  "\\eta": "η",
  "\\theta": "θ",
  "\\lambda": "λ",
  "\\mu": "μ",
  "\\pi": "π",
  "\\rho": "ρ",
  "\\sigma": "σ",
  "\\tau": "τ",
  "\\phi": "φ",
  "\\omega": "ω",
  "\\Delta": "Δ",
  "\\Sigma": "Σ",
  "\\Omega": "Ω",
  "\\Pi": "Π",
  "\\infty": "∞",
  "\\pm": "±",
  "\\mp": "∓",
  "\\times": "×",
  "\\div": "÷",
  "\\cdot": "·",
  "\\neq": "≠",
  "\\ne": "≠",
  "\\leq": "≤",
  "\\le": "≤",
  "\\geq": "≥",
  "\\ge": "≥",
  "\\approx": "≈",
  "\\equiv": "≡",
  "\\propto": "∝",
  "\\sum": "∑",
  "\\prod": "∏",
  "\\int": "∫",
  "\\partial": "∂",
  "\\nabla": "∇",
  "\\forall": "∀",
  "\\exists": "∃",
  "\\in": "∈",
  "\\notin": "∉",
  "\\subset": "⊂",
  "\\subseteq": "⊆",
  "\\cup": "∪",
  "\\cap": "∩",
  "\\rightarrow": "→",
  "\\to": "→",
  "\\leftarrow": "←",
  "\\Rightarrow": "⇒",
  "\\Leftarrow": "⇐",
  "\\leftrightarrow": "↔",
  "\\Leftrightarrow": "⇔",
};

function formatMathExpression(expr: string): React.ReactNode {
  let text = expr.trim();
  text = text.replace(/\\frac\{([^{}]+)\}\{([^{}]+)\}/g, "($1)/($2)");
  text = text.replace(/\\sqrt\{([^{}]+)\}/g, "√($1)");
  text = text.replace(/\\text\{([^{}]+)\}/g, "$1");
  for (const [cmd, sym] of Object.entries(LATEX_SYMBOLS)) {
    text = text.split(cmd).join(sym);
  }
  const parts: React.ReactNode[] = [];
  const tokenRegex = /(\^\{([^{}]+)\}|\^([a-zA-Z0-9+-])|_\{([^{}]+)\}|_([a-zA-Z0-9+-]))/g;
  let lastIdx = 0;
  let match: RegExpExecArray | null;
  let key = 0;
  while ((match = tokenRegex.exec(text)) !== null) {
    if (match.index > lastIdx) {
      parts.push(text.slice(lastIdx, match.index));
    }
    const supContent = match[2] || match[3];
    const subContent = match[4] || match[5];
    if (supContent !== undefined) {
      parts.push(
        <sup key={`m_${key++}`} className="text-[0.75em] font-semibold">
          {supContent}
        </sup>
      );
    } else if (subContent !== undefined) {
      parts.push(
        <sub key={`m_${key++}`} className="text-[0.75em]">
          {subContent}
        </sub>
      );
    }
    lastIdx = tokenRegex.lastIndex;
  }
  if (lastIdx < text.length) {
    parts.push(text.slice(lastIdx));
  }
  return parts;
}

function highlightCodeLine(line: string): React.ReactNode {
  const trimmed = line.trimStart();
  if (trimmed.startsWith("//") || trimmed.startsWith("#") || trimmed.startsWith("--")) {
    return <span className="text-[#6c7086] italic">{line}</span>;
  }
  const tokenRegex =
    /("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|`(?:\\.|[^`\\])*`|\b(?:import|from|export|default|function|return|const|let|var|if|else|for|while|switch|case|break|continue|class|interface|type|extends|implements|new|try|catch|finally|throw|async|await|public|private|protected|static|final|void|int|long|double|boolean|true|false|null|undefined|def|elif|None|True|False|SELECT|FROM|WHERE|INSERT|UPDATE|DELETE|JOIN|GROUP|ORDER|BY|LIMIT)\b|\b\d+(?:\.\d+)?\b)/g;

  const nodes: React.ReactNode[] = [];
  let lastIndex = 0;
  let m: RegExpExecArray | null;
  let k = 0;
  while ((m = tokenRegex.exec(line)) !== null) {
    if (m.index > lastIndex) {
      nodes.push(line.slice(lastIndex, m.index));
    }
    const tok = m[0];
    if (tok.startsWith('"') || tok.startsWith("'") || tok.startsWith("`")) {
      nodes.push(
        <span key={k++} className="text-[#a6e3a1]">
          {tok}
        </span>
      );
    } else if (/^\d/.test(tok)) {
      nodes.push(
        <span key={k++} className="text-[#fab387]">
          {tok}
        </span>
      );
    } else {
      nodes.push(
        <span key={k++} className="text-[#cba6f7] font-semibold">
          {tok}
        </span>
      );
    }
    lastIndex = tokenRegex.lastIndex;
  }
  if (lastIndex < line.length) {
    nodes.push(line.slice(lastIndex));
  }
  return nodes;
}

function CodeBlockView({ lang, code }: { lang: string; code: string }) {
  const [copied, setCopied] = useState(false);
  const [showLineNums, setShowLineNums] = useState(true);
  const lines = useMemo(() => code.split("\n"), [code]);
  const normalizedLang = (lang || "text").toLowerCase();

  const handleCopy = async () => {
    if (await copyToClipboard(code)) {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    }
  };

  if (normalizedLang === "math" || normalizedLang === "latex" || normalizedLang === "katex") {
    return (
      <div className="my-3 p-4 rounded-xl bg-indigo-950/5 border border-indigo-500/20 text-center font-serif text-base overflow-x-auto">
        {lines.map((l, i) => (
          <div key={i} className="py-0.5">
            {formatMathExpression(l)}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="my-3.5 rounded-xl overflow-hidden border border-white/10 bg-[#1e1e2e] text-[#cdd6f4] shadow-sm">
      <div className="flex items-center justify-between px-3.5 py-1.5 bg-[#181825] border-b border-white/10 text-[11px] text-[#a6adc8] select-none">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 font-mono uppercase tracking-wider text-[#89b4fa] font-semibold">
            {normalizedLang}
          </span>
          <span className="text-white/20">·</span>
          <span>{lines.length} 行</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowLineNums((v) => !v)}
            className="px-1.5 py-0.5 rounded hover:bg-white/10 transition-colors"
          >
            {showLineNums ? "隐藏行号" : "显示行号"}
          </button>
          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-white/10 hover:bg-white/15 text-[#cdd6f4] transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-3 h-3 text-emerald-400" /> 已复制
              </>
            ) : (
              <>
                <Copy className="w-3 h-3" /> 复制代码
              </>
            )}
          </button>
        </div>
      </div>
      <div className="p-3.5 overflow-x-auto font-mono text-xs leading-relaxed">
        {lines.map((l, i) => (
          <div key={i} className="table-row hover:bg-white/[0.03]">
            {showLineNums && (
              <span className="table-cell pr-4 text-right select-none text-[#585b70] w-8">
                {i + 1}
              </span>
            )}
            <span className="table-cell whitespace-pre">{highlightCodeLine(l)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function parseTableCells(row: string): string[] {
  let trimmed = row.trim();
  if (trimmed.startsWith("|")) trimmed = trimmed.slice(1);
  if (trimmed.endsWith("|")) trimmed = trimmed.slice(0, -1);
  const cells: string[] = [];
  let current = "";
  for (let i = 0; i < trimmed.length; i++) {
    if (trimmed[i] === "\\" && i + 1 < trimmed.length && trimmed[i + 1] === "|") {
      current += "|";
      i++;
    } else if (trimmed[i] === "|") {
      cells.push(current.trim());
      current = "";
    } else {
      current += trimmed[i];
    }
  }
  cells.push(current.trim());
  return cells;
}

export function MarkdownRenderer({
  content,
  basePath,
  showToc = true,
}: MarkdownRendererProps) {
  const [tocCollapsed, setTocCollapsed] = useState(false);

  const { elements, headings, footnotes } = useMemo(() => {
    const rawLines = (content || "").split(/\r?\n/);
    const tocList: TocHeading[] = [];
    const footnoteMap = new Map<string, string>();
    const bodyLines: string[] = [];

    // 1. Parse optional YAML frontmatter at top
    let frontmatter: Record<string, string> | null = null;
    let startLine = 0;
    if (rawLines[0]?.trim() === "---") {
      let endFm = -1;
      for (let i = 1; i < Math.min(rawLines.length, 40); i++) {
        if (rawLines[i].trim() === "---" || rawLines[i].trim() === "...") {
          endFm = i;
          break;
        }
      }
      if (endFm > 0) {
        const fmData: Record<string, string> = {};
        for (let i = 1; i < endFm; i++) {
          const m = rawLines[i].match(/^([A-Za-z0-9_-]+)\s*:\s*(.*)$/);
          if (m) {
            fmData[m[1]] = m[2].replace(/^["']|["']$/g, "").trim();
          }
        }
        if (Object.keys(fmData).length > 0) {
          frontmatter = fmData;
        }
        startLine = endFm + 1;
      }
    }

    // 2. Collect footnote definitions [^id]: text
    for (let i = startLine; i < rawLines.length; i++) {
      const fnMatch = rawLines[i].match(/^\[\^([^\]]+)\]:\s*(.+)$/);
      if (fnMatch) {
        footnoteMap.set(fnMatch[1], fnMatch[2].trim());
      } else {
        bodyLines.push(rawLines[i]);
      }
    }

    const renderInline = (text: string, keyPrefix = "in"): React.ReactNode => {
      if (!text) return null;

      // Tokenize inline markdown constructs:
      // 1. Inline code `...`
      // 2. Inline math $...$
      // 3. Images ![alt](url)
      // 4. Links [text](url)
      // 5. Footnote ref [^id]
      // 6. Keyboard [[key]] or <kbd>key</kbd>
      // 7. Bold+Italic ***...***
      // 8. Bold **...** or __...__
      // 9. Italic *...* or _..._
      // 10. Strikethrough ~~...~~
      // 11. Highlight ==...==
      // 12. Superscript ^...^
      // 13. Subscript ~...~
      // 14. Autolink https?://[^\s<)]+
      const inlineRegex =
        /(`[^`]+`|\$(?!\s)[^$\n]+(?<!\s)\$|!\[[^\]]*\]\([^)]+\)|\[[^\]]+\]\([^)]+\)|\[\^[^\]]+\]|\[\[[^\]]+\]\]|<kbd>[^<]+<\/kbd>|\*\*\*[^*]+\*\*\*|\*\*[^*]+\*\*|__[^_]+__|~~[^~]+~~|==[^=]+==|\^[^^\s]+\^|~[^~\s]+~|\*(?!\s)[^*]+(?<!\s)\*|https?:\/\/[^\s<)]+)/g;

      const out: React.ReactNode[] = [];
      let lastIdx = 0;
      let match: RegExpExecArray | null;
      let tokenIdx = 0;

      while ((match = inlineRegex.exec(text)) !== null) {
        if (match.index > lastIdx) {
          out.push(text.slice(lastIdx, match.index));
        }
        const token = match[0];
        const k = `${keyPrefix}_${tokenIdx++}`;

        if (token.startsWith("`") && token.endsWith("`")) {
          out.push(
            <code
              key={k}
              className="px-1.5 py-0.5 mx-0.5 rounded-md bg-brand-primary/10 text-brand-primary font-mono text-[0.88em] font-medium"
            >
              {token.slice(1, -1)}
            </code>
          );
        } else if (token.startsWith("$") && token.endsWith("$")) {
          out.push(
            <span
              key={k}
              className="px-1 py-0.5 mx-0.5 rounded bg-indigo-500/10 text-indigo-900 font-serif italic"
            >
              {formatMathExpression(token.slice(1, -1))}
            </span>
          );
        } else if (token.startsWith("![")) {
          const imgMatch = token.match(/^!\[([^\]]*)\]\(([^)\s]+)(?:\s+"([^"]*)")?\)$/);
          if (imgMatch) {
            const alt = imgMatch[1];
            const src = resolveRelativePath(basePath, imgMatch[2]);
            const title = imgMatch[3];
            out.push(
              <span key={k} className="inline-block my-2 max-w-full">
                <img
                  src={src}
                  alt={alt}
                  title={title || alt}
                  className="max-h-96 max-w-full rounded-xl border shadow-sm object-contain mx-auto"
                />
                {alt && (
                  <span className="block text-center text-[11px] text-muted-foreground mt-1">
                    {alt}
                  </span>
                )}
              </span>
            );
          } else {
            out.push(token);
          }
        } else if (token.startsWith("[^") && token.endsWith("]")) {
          const fnId = token.slice(2, -1);
          out.push(
            <sup key={k} className="ml-0.5">
              <a
                href={`#fn-def-${fnId}`}
                id={`fn-ref-${fnId}`}
                className="text-[11px] font-semibold text-brand-primary hover:underline px-0.5 rounded bg-brand-primary/10"
                title={footnoteMap.get(fnId) || `脚注 ${fnId}`}
              >
                [{fnId}]
              </a>
            </sup>
          );
        } else if (token.startsWith("[[") && token.endsWith("]]")) {
          out.push(
            <kbd
              key={k}
              className="px-1.5 py-0.5 text-[11px] font-mono font-semibold bg-muted border border-b-2 rounded-md text-foreground shadow-sm"
            >
              {token.slice(2, -2)}
            </kbd>
          );
        } else if (token.startsWith("<kbd>") && token.endsWith("</kbd>")) {
          out.push(
            <kbd
              key={k}
              className="px-1.5 py-0.5 text-[11px] font-mono font-semibold bg-muted border border-b-2 rounded-md text-foreground shadow-sm"
            >
              {token.slice(5, -6)}
            </kbd>
          );
        } else if (token.startsWith("[")) {
          const linkMatch = token.match(/^\[([^\]]+)\]\(([^)\s]+)(?:\s+"([^"]*)")?\)$/);
          if (linkMatch) {
            const label = linkMatch[1];
            const rawHref = linkMatch[2];
            const title = linkMatch[3];
            const safeHref = /^(https?:\/\/|mailto:|#|\/)/i.test(rawHref) ? rawHref : "#";
            out.push(
              <a
                key={k}
                href={safeHref}
                title={title}
                target={safeHref.startsWith("#") ? undefined : "_blank"}
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-700 underline underline-offset-2 font-medium"
              >
                {renderInline(label, `${k}_lbl`)}
              </a>
            );
          } else {
            out.push(token);
          }
        } else if (token.startsWith("***") && token.endsWith("***")) {
          out.push(
            <strong key={k} className="font-bold italic">
              {renderInline(token.slice(3, -3), k)}
            </strong>
          );
        } else if (
          (token.startsWith("**") && token.endsWith("**")) ||
          (token.startsWith("__") && token.endsWith("__"))
        ) {
          out.push(
            <strong key={k} className="font-bold text-foreground">
              {renderInline(token.slice(2, -2), k)}
            </strong>
          );
        } else if (token.startsWith("~~") && token.endsWith("~~")) {
          out.push(
            <del key={k} className="line-through text-muted-foreground">
              {renderInline(token.slice(2, -2), k)}
            </del>
          );
        } else if (token.startsWith("==") && token.endsWith("==")) {
          out.push(
            <mark
              key={k}
              className="bg-amber-200/80 text-amber-950 px-1 py-0.2 rounded font-medium"
            >
              {renderInline(token.slice(2, -2), k)}
            </mark>
          );
        } else if (token.startsWith("^") && token.endsWith("^") && token.length > 2) {
          out.push(
            <sup key={k} className="text-[0.75em]">
              {token.slice(1, -1)}
            </sup>
          );
        } else if (token.startsWith("~") && token.endsWith("~") && token.length > 2) {
          out.push(
            <sub key={k} className="text-[0.75em]">
              {token.slice(1, -1)}
            </sub>
          );
        } else if (token.startsWith("*") && token.endsWith("*")) {
          out.push(
            <em key={k} className="italic">
              {renderInline(token.slice(1, -1), k)}
            </em>
          );
        } else if (/^https?:\/\//i.test(token)) {
          out.push(
            <a
              key={k}
              href={token}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-700 underline underline-offset-2 break-all"
            >
              {token}
            </a>
          );
        } else {
          out.push(token);
        }

        lastIdx = inlineRegex.lastIndex;
      }

      if (lastIdx < text.length) {
        out.push(text.slice(lastIdx));
      }
      return out;
    };

    const renderedBlocks: React.ReactNode[] = [];

    if (frontmatter) {
      renderedBlocks.push(
        <div
          key="frontmatter"
          className="mb-4 p-3 rounded-xl bg-muted/50 border text-xs flex flex-wrap gap-x-4 gap-y-1.5"
        >
          {Object.entries(frontmatter).map(([k, v]) => (
            <div key={k} className="flex items-center gap-1.5">
              <span className="font-mono text-muted-foreground">{k}:</span>
              <span className="font-semibold text-brand-primary">{v}</span>
            </div>
          ))}
        </div>
      );
    }

    let i = 0;
    while (i < bodyLines.length) {
      const line = bodyLines[i];
      const trimmed = line.trim();

      // Blank line
      if (!trimmed) {
        i++;
        continue;
      }

      // Fenced Code Block ``` or ~~~
      const fenceMatch = trimmed.match(/^(`{3,}|~{3,})(.*)$/);
      if (fenceMatch) {
        const fence = fenceMatch[1];
        const lang = (fenceMatch[2] || "").trim();
        const codeLines: string[] = [];
        i++;
        while (i < bodyLines.length && !bodyLines[i].trim().startsWith(fence)) {
          codeLines.push(bodyLines[i]);
          i++;
        }
        if (i < bodyLines.length) i++;
        renderedBlocks.push(
          <CodeBlockView key={`code_${i}`} lang={lang} code={codeLines.join("\n")} />
        );
        continue;
      }

      // Block Math $$ ... $$
      if (trimmed.startsWith("$$")) {
        if (trimmed.endsWith("$$") && trimmed.length > 4) {
          const expr = trimmed.slice(2, -2);
          renderedBlocks.push(
            <div
              key={`math_${i}`}
              className="my-3 p-3.5 rounded-xl bg-indigo-950/5 border border-indigo-500/20 text-center font-serif text-base overflow-x-auto"
            >
              {formatMathExpression(expr)}
            </div>
          );
          i++;
          continue;
        }
        const mathLines: string[] = [];
        if (trimmed.slice(2).trim()) mathLines.push(trimmed.slice(2));
        i++;
        while (i < bodyLines.length && !bodyLines[i].trim().endsWith("$$")) {
          mathLines.push(bodyLines[i]);
          i++;
        }
        if (i < bodyLines.length) {
          const closing = bodyLines[i].trim().slice(0, -2).trim();
          if (closing) mathLines.push(closing);
          i++;
        }
        renderedBlocks.push(
          <div
            key={`math_blk_${i}`}
            className="my-3 p-3.5 rounded-xl bg-indigo-950/5 border border-indigo-500/20 text-center font-serif text-base overflow-x-auto"
          >
            {mathLines.map((ml, idx) => (
              <div key={idx}>{formatMathExpression(ml)}</div>
            ))}
          </div>
        );
        continue;
      }

      // Container Directives :::note / :::tip / :::warning / :::caution / :::details
      const directiveMatch = trimmed.match(/^:::\s*([a-zA-Z]+)(?:\s+(.*))?$/);
      if (directiveMatch) {
        const dirType = directiveMatch[1].toLowerCase();
        const dirTitle = directiveMatch[2] || "";
        const innerLines: string[] = [];
        i++;
        while (i < bodyLines.length && bodyLines[i].trim() !== ":::") {
          innerLines.push(bodyLines[i]);
          i++;
        }
        if (i < bodyLines.length) i++;
        if (dirType === "details") {
          renderedBlocks.push(
            <details
              key={`details_${i}`}
              className="my-3 rounded-xl border bg-muted/20 p-3 text-sm group"
            >
              <summary className="font-semibold cursor-pointer select-none text-brand-primary">
                {dirTitle || "点击展开详情"}
              </summary>
              <div className="mt-2 pt-2 border-t text-foreground space-y-1.5">
                {innerLines.map((il, idx) => (
                  <p key={idx}>{renderInline(il, `det_${i}_${idx}`)}</p>
                ))}
              </div>
            </details>
          );
        } else {
          renderedBlocks.push(
            renderAdmonition(dirType.toUpperCase(), dirTitle, innerLines, `dir_${i}`, renderInline)
          );
        }
        continue;
      }

      // Horizontal Rule
      if (/^(?:-{3,}|\*{3,}|_{3,})$/.test(trimmed)) {
        renderedBlocks.push(<hr key={`hr_${i}`} className="my-4 border-t border-border" />);
        i++;
        continue;
      }

      // Headings # .. ######
      const headingMatch = line.match(/^(#{1,6})\s+(.+)$/);
      if (headingMatch) {
        const level = headingMatch[1].length;
        const rawHeadingText = headingMatch[2].replace(/\s+#+\s*$/, "").trim();
        const id = slugifyHeading(rawHeadingText, tocList.length);
        tocList.push({ id, level, text: rawHeadingText });

        const headingClasses: Record<number, string> = {
          1: "text-2xl font-extrabold text-brand-primary mt-5 mb-2.5 pb-1.5 border-b",
          2: "text-xl font-bold text-brand-primary mt-4 mb-2 pb-1 border-b border-border/60",
          3: "text-lg font-bold text-brand-primary mt-3.5 mb-1.5",
          4: "text-base font-semibold text-brand-primary mt-3 mb-1",
          5: "text-sm font-semibold text-brand-primary mt-2.5 mb-1",
          6: "text-xs font-semibold uppercase tracking-wider text-muted-foreground mt-2 mb-1",
        };
        const Tag = (`h${level}` as unknown) as React.ElementType;
        renderedBlocks.push(
          <Tag key={`h_${i}`} id={id} className={headingClasses[level]}>
            {renderInline(rawHeadingText, `h_${i}`)}
          </Tag>
        );
        i++;
        continue;
      }

      // GFM Table (Header row + separator row `| --- | :---: |`)
      if (
        line.includes("|") &&
        i + 1 < bodyLines.length &&
        /^\s*\|?(?:\s*:?-{3,}:?\s*\|)+\s*:?-{3,}:?\s*\|?\s*$/.test(bodyLines[i + 1])
      ) {
        const headerCells = parseTableCells(bodyLines[i]);
        const alignCells = parseTableCells(bodyLines[i + 1]);
        const alignments = alignCells.map((c) => {
          const t = c.trim();
          if (t.startsWith(":") && t.endsWith(":")) return "center";
          if (t.endsWith(":")) return "right";
          return "left";
        });
        i += 2;
        const rows: string[][] = [];
        while (i < bodyLines.length && bodyLines[i].trim() && bodyLines[i].includes("|")) {
          rows.push(parseTableCells(bodyLines[i]));
          i++;
        }
        renderedBlocks.push(
          <div key={`tbl_${i}`} className="my-3.5 overflow-x-auto rounded-xl border shadow-sm">
            <table className="w-full border-collapse text-xs">
              <thead>
                <tr className="bg-muted/60 border-b text-brand-primary font-semibold">
                  {headerCells.map((cell, cIdx) => (
                    <th
                      key={cIdx}
                      style={{ textAlign: (alignments[cIdx] || "left") as any }}
                      className="px-3.5 py-2.5 border-r last:border-r-0"
                    >
                      {renderInline(cell, `th_${i}_${cIdx}`)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y">
                {rows.map((row, rIdx) => (
                  <tr key={rIdx} className="hover:bg-muted/30 transition-colors">
                    {headerCells.map((_h, cIdx) => (
                      <td
                        key={cIdx}
                        style={{ textAlign: (alignments[cIdx] || "left") as any }}
                        className="px-3.5 py-2 border-r last:border-r-0"
                      >
                        {renderInline(row[cIdx] || "", `td_${i}_${rIdx}_${cIdx}`)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
        continue;
      }

      // Blockquote & GitHub Alerts `> [!NOTE]`, `> [!TIP]`, `> [!IMPORTANT]`, `> [!WARNING]`, `> [!CAUTION]`
      if (trimmed.startsWith(">")) {
        const quoteLines: string[] = [];
        while (i < bodyLines.length && bodyLines[i].trim().startsWith(">")) {
          quoteLines.push(bodyLines[i].trim().replace(/^>\s?/, ""));
          i++;
        }
        const alertMatch = quoteLines[0]?.match(
          /^\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\](?:\s+(.*))?$/i
        );
        if (alertMatch) {
          const alertType = alertMatch[1].toUpperCase();
          const customTitle = alertMatch[2] || "";
          renderedBlocks.push(
            renderAdmonition(
              alertType,
              customTitle,
              quoteLines.slice(1),
              `alert_${i}`,
              renderInline
            )
          );
        } else {
          renderedBlocks.push(
            <blockquote
              key={`bq_${i}`}
              className="my-3 border-l-4 border-brand-secondary/60 bg-muted/30 rounded-r-xl pl-4 pr-3 py-2 text-muted-foreground italic space-y-1"
            >
              {quoteLines.map((ql, qIdx) => (
                <p key={qIdx}>{renderInline(ql, `bq_${i}_${qIdx}`)}</p>
              ))}
            </blockquote>
          );
        }
        continue;
      }

      // Lists (Task list `- [ ]` / `- [x]`, Unordered `- / * / +`, Ordered `1.`)
      if (/^\s*(?:[-*+]|\d+\.)\s+/.test(line)) {
        const listItems: {
          indent: number;
          ordered: boolean;
          orderNum?: string;
          taskState: "checked" | "unchecked" | null;
          text: string;
        }[] = [];

        while (i < bodyLines.length && /^\s*(?:[-*+]|\d+\.)\s+/.test(bodyLines[i])) {
          const rawL = bodyLines[i];
          const indentMatch = rawL.match(/^(\s*)/);
          const indent = indentMatch ? Math.floor(indentMatch[1].length / 2) : 0;
          const orderedMatch = rawL.match(/^\s*(\d+)\.\s+(.*)$/);
          const unorderedMatch = rawL.match(/^\s*[-*+]\s+(.*)$/);
          const itemBody = orderedMatch ? orderedMatch[2] : unorderedMatch ? unorderedMatch[1] : rawL;
          const taskMatch = itemBody.match(/^\[([ xX])\]\s+(.*)$/);

          listItems.push({
            indent,
            ordered: Boolean(orderedMatch),
            orderNum: orderedMatch ? orderedMatch[1] : undefined,
            taskState: taskMatch
              ? taskMatch[1].toLowerCase() === "x"
                ? "checked"
                : "unchecked"
              : null,
            text: taskMatch ? taskMatch[2] : itemBody,
          });
          i++;
        }

        renderedBlocks.push(
          <div key={`list_${i}`} className="my-2.5 space-y-1.5">
            {listItems.map((li, lIdx) => (
              <div
                key={lIdx}
                style={{ paddingLeft: `${li.indent * 18}px` }}
                className="flex items-start gap-2 leading-relaxed"
              >
                {li.taskState !== null ? (
                  <span
                    className={`mt-1 w-4 h-4 rounded flex items-center justify-center border shrink-0 ${
                      li.taskState === "checked"
                        ? "bg-emerald-600 border-emerald-600 text-white"
                        : "border-muted-foreground/40 bg-white"
                    }`}
                  >
                    {li.taskState === "checked" && <Check className="w-3 h-3" />}
                  </span>
                ) : li.ordered ? (
                  <span className="text-brand-secondary font-mono text-xs font-semibold min-w-[1.25rem] pt-0.5 shrink-0">
                    {li.orderNum}.
                  </span>
                ) : (
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-secondary mt-2 shrink-0 ml-1" />
                )}
                <span
                  className={`flex-1 ${
                    li.taskState === "checked" ? "line-through text-muted-foreground" : ""
                  }`}
                >
                  {renderInline(li.text, `li_${i}_${lIdx}`)}
                </span>
              </div>
            ))}
          </div>
        );
        continue;
      }

      // Definition List (`Term` followed by `: Definition`)
      if (i + 1 < bodyLines.length && /^:\s+.+/.test(bodyLines[i + 1])) {
        const term = bodyLines[i].trim();
        i++;
        const defs: string[] = [];
        while (i < bodyLines.length && /^:\s+.+/.test(bodyLines[i])) {
          defs.push(bodyLines[i].replace(/^:\s+/, "").trim());
          i++;
        }
        renderedBlocks.push(
          <dl key={`dl_${i}`} className="my-2.5 pl-3 border-l-2 border-brand-primary/30">
            <dt className="font-bold text-brand-primary">{renderInline(term, `dt_${i}`)}</dt>
            {defs.map((d, dIdx) => (
              <dd key={dIdx} className="ml-4 mt-0.5 text-muted-foreground">
                {renderInline(d, `dd_${i}_${dIdx}`)}
              </dd>
            ))}
          </dl>
        );
        continue;
      }

      // Standard Paragraph
      renderedBlocks.push(
        <p key={`p_${i}`} className="my-2 leading-relaxed">
          {renderInline(line, `p_${i}`)}
        </p>
      );
      i++;
    }

    return {
      elements: renderedBlocks,
      headings: tocList,
      footnotes: Array.from(footnoteMap.entries()),
    };
  }, [content, basePath]);

  return (
    <div className="flex flex-col lg:flex-row gap-4 text-sm text-foreground">
      <div className="flex-1 min-w-0 space-y-1">
        {elements}

        {footnotes.length > 0 && (
          <div className="mt-6 pt-3 border-t text-xs text-muted-foreground space-y-1.5">
            <p className="font-semibold text-foreground">脚注引用</p>
            {footnotes.map(([fnId, fnText]) => (
              <div key={fnId} id={`fn-def-${fnId}`} className="flex items-start gap-2">
                <a
                  href={`#fn-ref-${fnId}`}
                  className="font-mono text-brand-primary font-semibold hover:underline shrink-0"
                >
                  [{fnId}]
                </a>
                <span className="flex-1">{fnText}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {showToc && headings.length >= 2 && (
        <aside className="lg:w-52 shrink-0 border-t lg:border-t-0 lg:border-l pt-3 lg:pt-0 lg:pl-3 select-none">
          <button
            type="button"
            onClick={() => setTocCollapsed((c) => !c)}
            className="flex items-center justify-between w-full text-xs font-semibold text-brand-primary mb-2 hover:opacity-80"
          >
            <span className="inline-flex items-center gap-1.5">
              <ListTree className="w-3.5 h-3.5 text-brand-secondary" />
              文档大纲 ({headings.length})
            </span>
            {tocCollapsed ? (
              <ChevronRight className="w-3.5 h-3.5" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5" />
            )}
          </button>
          {!tocCollapsed && (
            <nav className="space-y-1 max-h-72 overflow-y-auto pr-1">
              {headings.map((h) => (
                <a
                  key={h.id}
                  href={`#${h.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    const el = document.getElementById(h.id);
                    el?.scrollIntoView({ behavior: "smooth", block: "start" });
                  }}
                  style={{ paddingLeft: `${Math.max(0, h.level - 1) * 10}px` }}
                  className="block text-xs text-muted-foreground hover:text-brand-primary truncate py-0.5 transition-colors"
                  title={h.text}
                >
                  {h.text}
                </a>
              ))}
            </nav>
          )}
        </aside>
      )}
    </div>
  );
}

function renderAdmonition(
  type: string,
  customTitle: string,
  lines: string[],
  key: string,
  renderInline: (text: string, keyPrefix?: string) => React.ReactNode
): React.ReactNode {
  const styles: Record<
    string,
    { label: string; box: string; titleColor: string; icon: React.ReactNode }
  > = {
    NOTE: {
      label: "提示 (Note)",
      box: "bg-blue-50/80 border-blue-300 text-blue-950",
      titleColor: "text-blue-700",
      icon: <Info className="w-4 h-4 text-blue-600 shrink-0" />,
    },
    TIP: {
      label: "技巧 (Tip)",
      box: "bg-emerald-50/80 border-emerald-300 text-emerald-950",
      titleColor: "text-emerald-700",
      icon: <Lightbulb className="w-4 h-4 text-emerald-600 shrink-0" />,
    },
    IMPORTANT: {
      label: "重要 (Important)",
      box: "bg-purple-50/80 border-purple-300 text-purple-950",
      titleColor: "text-purple-700",
      icon: <Sparkles className="w-4 h-4 text-purple-600 shrink-0" />,
    },
    WARNING: {
      label: "警告 (Warning)",
      box: "bg-amber-50/80 border-amber-300 text-amber-950",
      titleColor: "text-amber-700",
      icon: <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />,
    },
    CAUTION: {
      label: "危险 (Caution)",
      box: "bg-rose-50/80 border-rose-300 text-rose-950",
      titleColor: "text-rose-700",
      icon: <AlertOctagon className="w-4 h-4 text-rose-600 shrink-0" />,
    },
    DANGER: {
      label: "危险 (Danger)",
      box: "bg-rose-50/80 border-rose-300 text-rose-950",
      titleColor: "text-rose-700",
      icon: <AlertOctagon className="w-4 h-4 text-rose-600 shrink-0" />,
    },
  };

  const cfg = styles[type] || styles.NOTE;

  return (
    <div key={key} className={`my-3 p-3.5 rounded-xl border-l-4 border ${cfg.box} space-y-1.5`}>
      <div className={`flex items-center gap-1.5 font-semibold text-xs ${cfg.titleColor}`}>
        {cfg.icon}
        <span>{customTitle || cfg.label}</span>
      </div>
      <div className="text-xs leading-relaxed space-y-1">
        {lines.map((l, idx) => (
          <p key={idx}>{renderInline(l, `${key}_${idx}`)}</p>
        ))}
      </div>
    </div>
  );
}

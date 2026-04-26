"use client";

import React from "react";

interface TipTapRendererProps {
  contentHtml?: string | null;
  content?: Record<string, any> | null;
  title?: string;
}

export default function TipTapRenderer({ contentHtml, content, title }: TipTapRendererProps) {
  return (
    <article className="w-full max-w-2xl mx-auto">
      {title && (
        <h1 className="mb-8 text-3xl font-extrabold text-zinc-900 leading-tight">{title}</h1>
      )}

      <div className="reading-body">
        {contentHtml ? (
          <div
            className="content-rendered"
            dangerouslySetInnerHTML={{ __html: contentHtml }}
          />
        ) : content ? (
          <div>{renderTipTapJSON(content)}</div>
        ) : (
          <p className="text-zinc-400 italic">No content available for this chapter.</p>
        )}
      </div>

      <style>{`
        .reading-body {
          font-size: 1.0625rem;
          line-height: 1.85;
          color: #18181b;
          word-break: break-word;
        }

        .content-rendered p,
        .reading-body p {
          margin-bottom: 1.35em;
        }

        .content-rendered h2,
        .reading-body h2 {
          font-size: 1.5rem;
          font-weight: 700;
          line-height: 1.25;
          color: #09090b;
          margin-top: 2.5em;
          margin-bottom: 0.75em;
        }

        .content-rendered h3,
        .reading-body h3 {
          font-size: 1.2rem;
          font-weight: 600;
          color: #18181b;
          margin-top: 2em;
          margin-bottom: 0.5em;
        }

        .content-rendered strong,
        .reading-body strong { font-weight: 700; }

        .content-rendered em,
        .reading-body em { font-style: italic; }

        .content-rendered u,
        .reading-body u { text-decoration: underline; text-underline-offset: 2px; }

        .content-rendered s,
        .reading-body s { text-decoration: line-through; }

        .content-rendered ul,
        .reading-body ul {
          list-style-type: disc;
          padding-left: 1.75em;
          margin-bottom: 1.25em;
        }

        .content-rendered ol,
        .reading-body ol {
          list-style-type: decimal;
          padding-left: 1.75em;
          margin-bottom: 1.25em;
        }

        .content-rendered li,
        .reading-body li {
          margin-bottom: 0.4em;
          line-height: 1.7;
        }

        .content-rendered blockquote,
        .reading-body blockquote {
          border-left: 3px solid #d4d4d8;
          padding: 0.25em 0 0.25em 1.25rem;
          margin: 1.5em 0;
          color: #71717a;
          font-style: italic;
        }

        .content-rendered code,
        .reading-body code {
          background: #f4f4f5;
          border-radius: 0.25rem;
          padding: 0.15em 0.4em;
          font-family: ui-monospace, 'Cascadia Code', Consolas, monospace;
          font-size: 0.875em;
          color: #3f3f46;
        }

        .content-rendered pre,
        .reading-body pre {
          background: #18181b;
          color: #f4f4f5;
          border-radius: 0.625rem;
          padding: 1rem 1.25rem;
          overflow-x: auto;
          font-family: ui-monospace, 'Cascadia Code', Consolas, monospace;
          font-size: 0.875em;
          margin: 1.5em 0;
          line-height: 1.65;
        }

        .content-rendered pre code,
        .reading-body pre code {
          background: none;
          padding: 0;
          color: inherit;
          font-size: inherit;
          border-radius: 0;
        }

        .content-rendered hr,
        .reading-body hr {
          border: none;
          border-top: 1.5px solid #e4e4e7;
          margin: 2.5em 0;
        }

        .content-rendered a,
        .reading-body a {
          color: #27272a;
          text-decoration: underline;
          text-decoration-thickness: 1px;
          text-underline-offset: 2px;
        }

        .content-rendered a:hover,
        .reading-body a:hover {
          color: #71717a;
        }
      `}</style>
    </article>
  );
}

function renderTipTapJSON(content: Record<string, any>): React.ReactNode {
  if (!content.content || !Array.isArray(content.content)) return null;
  return content.content.map((node: any, i: number) => (
    <React.Fragment key={i}>{renderNode(node)}</React.Fragment>
  ));
}

function renderNode(node: any): React.ReactNode {
  switch (node.type) {
    case "paragraph":
      return <p style={{ marginBottom: "1.35em" }}>{renderMarks(node.content)}</p>;

    case "heading": {
      const level = node.attrs?.level || 2;
      const style = level === 2
        ? { fontSize: "1.5rem", fontWeight: 700, marginTop: "2.5em", marginBottom: "0.75em", lineHeight: 1.25, color: "#09090b" }
        : { fontSize: "1.2rem", fontWeight: 600, marginTop: "2em", marginBottom: "0.5em", color: "#18181b" };
      const Tag = `h${level}` as React.ElementType;
      return <Tag style={style}>{renderMarks(node.content)}</Tag>;
    }

    case "bulletList":
      return (
        <ul style={{ listStyleType: "disc", paddingLeft: "1.75em", marginBottom: "1.25em" }}>
          {node.content?.map((item: any, i: number) => <React.Fragment key={i}>{renderNode(item)}</React.Fragment>)}
        </ul>
      );

    case "orderedList":
      return (
        <ol style={{ listStyleType: "decimal", paddingLeft: "1.75em", marginBottom: "1.25em" }}>
          {node.content?.map((item: any, i: number) => <React.Fragment key={i}>{renderNode(item)}</React.Fragment>)}
        </ol>
      );

    case "listItem":
      return <li style={{ marginBottom: "0.4em" }}>{renderMarks(node.content)}</li>;

    case "blockquote":
      return (
        <blockquote style={{ borderLeft: "3px solid #d4d4d8", paddingLeft: "1.25rem", margin: "1.5em 0", color: "#71717a", fontStyle: "italic" }}>
          {renderMarks(node.content)}
        </blockquote>
      );

    case "codeBlock":
      return (
        <pre style={{ background: "#18181b", color: "#f4f4f5", borderRadius: "0.625rem", padding: "1rem 1.25rem", overflow: "auto", margin: "1.5em 0" }}>
          <code style={{ fontFamily: "ui-monospace, Consolas, monospace", fontSize: "0.875em" }}>
            {node.content?.[0]?.text || ""}
          </code>
        </pre>
      );

    case "horizontalRule":
      return <hr style={{ border: "none", borderTop: "1.5px solid #e4e4e7", margin: "2.5em 0" }} />;

    case "hardBreak":
      return <br />;

    default:
      return null;
  }
}

function renderMarks(content?: any[]): React.ReactNode {
  if (!content?.length) return null;
  return content.map((mark: any, i: number) => {
    let el: React.ReactNode = mark.text ?? "";
    if (mark.marks?.length) {
      for (const m of mark.marks) {
        switch (m.type) {
          case "bold":      el = <strong key={`${i}-b`}>{el}</strong>; break;
          case "italic":    el = <em key={`${i}-i`}>{el}</em>; break;
          case "underline": el = <u key={`${i}-u`}>{el}</u>; break;
          case "strike":    el = <s key={`${i}-s`}>{el}</s>; break;
          case "code":
            el = <code key={`${i}-c`} style={{ background: "#f4f4f5", padding: "0.15em 0.4em", borderRadius: "0.25rem", fontSize: "0.875em", color: "#3f3f46" }}>{el}</code>;
            break;
          case "link":
            el = <a key={`${i}-a`} href={m.attrs?.href || "#"} target="_blank" rel="noopener noreferrer" style={{ color: "#27272a", textDecoration: "underline", textUnderlineOffset: "2px" }}>{el}</a>;
            break;
        }
      }
    }
    return <span key={i}>{el}</span>;
  });
}

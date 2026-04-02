"use client";

import React from "react";

interface TipTapRendererProps {
  contentHtml?: string | null;
  content?: Record<string, any> | null;
  title?: string;
}

export default function TipTapRenderer({
  contentHtml,
  content,
  title,
}: TipTapRendererProps) {
  return (
    <article className="w-full max-w-3xl mx-auto">
      {title && (
        <div className="mb-8 border-b border-zinc-200 pb-6">
          <h1 className="text-4xl font-extrabold text-zinc-900">
            {title}
          </h1>
        </div>
      )}

      {/* Main Content Area */}
      <div className="prose prose-sm md:prose-base max-w-none text-zinc-900">
        {contentHtml ? (
          // Render HTML content
          <div
            className="content-rendered space-y-4 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: contentHtml }}
            style={{
              fontSize: "1.0625rem",
              lineHeight: "1.8",
              wordSpacing: "0.1em",
            }}
          />
        ) : content ? (
          // Render JSON content from TipTap
          <div className="space-y-4 leading-relaxed" style={{
            fontSize: "1.0625rem",
            lineHeight: "1.8",
            wordSpacing: "0.1em",
          }}>
            {renderTipTapJSON(content)}
          </div>
        ) : (
          <p className="text-zinc-500 italic">No content available for this chapter</p>
        )}
      </div>

      {/* CSS for formatting */}
      <style>{`
        .content-rendered {
          overflow-wrap: break-word;
          word-wrap: break-word;
        }

        .content-rendered p {
          margin-bottom: 1.25rem;
          text-align: justify;
          hyphens: auto;
        }

        .content-rendered h2 {
          font-size: 1.875rem;
          font-weight: 700;
          margin-top: 2rem;
          margin-bottom: 1rem;
          line-height: 1.2;
        }

        .content-rendered h3 {
          font-size: 1.5rem;
          font-weight: 600;
          margin-top: 1.5rem;
          margin-bottom: 0.75rem;
        }

        .content-rendered strong,
        .content-rendered b {
          font-weight: 600;
          color: inherit;
        }

        .content-rendered em,
        .content-rendered i {
          font-style: italic;
        }

        .content-rendered u {
          text-decoration: underline;
          text-decoration-thickness: 1px;
          text-underline-offset: 2px;
        }

        .content-rendered ul,
        .content-rendered ol {
          margin-left: 1.5rem;
          margin-bottom: 1.25rem;
        }

        .content-rendered li {
          margin-bottom: 0.5rem;
        }

        .content-rendered blockquote {
          border-left: 4px solid #f97316;
          padding-left: 1.5rem;
          margin-left: 0;
          margin-right: 0;
          margin-bottom: 1.25rem;
          font-style: italic;
          color: #666;
        }

        .content-rendered code {
          background: #f3f4f6;
          padding: 0.125rem 0.375rem;
          border-radius: 4px;
          font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
          font-size: 0.9em;
          color: #dc2626;
        }

        .content-rendered pre {
          background: #f3f4f6;
          padding: 1rem;
          border-radius: 6px;
          overflow-x: auto;
          margin-bottom: 1.25rem;
        }

        .content-rendered pre code {
          background: none;
          padding: 0;
          color: #1f2937;
        }

        .content-rendered hr {
          border: none;
          border-top: 1px solid #e5e7eb;
          margin: 2rem 0;
        }

        .content-rendered a {
          color: #f97316;
          text-decoration: underline;
          text-decoration-thickness: 1px;
          text-underline-offset: 2px;
          transition: color 0.2s;
        }

        .content-rendered a:hover {
          color: #ea580c;
        }
      `}</style>
    </article>
  );
}

/**
 * Render TipTap JSON content structure
 */
function renderTipTapJSON(
  content: Record<string, any>
): React.ReactNode {
  if (!content.content || !Array.isArray(content.content)) {
    return <p>No content available</p>;
  }

  return content.content.map((node: any, index: number) => (
    <div key={index}>{renderNode(node)}</div>
  ));
}

/**
 * Recursively render a TipTap node
 */
function renderNode(
  node: any,
  index?: number
): React.ReactNode {
  const key = index !== undefined ? `node-${index}` : undefined;

  switch (node.type) {
    case "paragraph":
      return (
        <p key={key} style={{ marginBottom: "1.25rem" }}>
          {renderMarks(node.content)}
        </p>
      );

    case "heading":
      const HeadingTag = `h${node.attrs?.level || 2}` as React.ElementType;
      return (
        <HeadingTag
          key={key}
          style={{
            marginBottom: "1rem",
            marginTop: node.attrs?.level === 2 ? "2rem" : "1.5rem",
          }}
        >
          {renderMarks(node.content)}
        </HeadingTag>
      );

    case "bulletList":
      return (
        <ul key={key} style={{ marginLeft: "1.5rem", marginBottom: "1.25rem" }}>
          {node.content?.map((item: any, i: number) =>
            renderNode(item, i)
          )}
        </ul>
      );

    case "orderedList":
      return (
        <ol key={key} style={{ marginLeft: "1.5rem", marginBottom: "1.25rem" }}>
          {node.content?.map((item: any, i: number) =>
            renderNode(item, i)
          )}
        </ol>
      );

    case "listItem":
      return (
        <li key={key} style={{ marginBottom: "0.5rem" }}>
          {renderMarks(node.content)}
        </li>
      );

    case "blockquote":
      return (
        <blockquote
          key={key}
          style={{
            borderLeft: "4px solid #f97316",
            paddingLeft: "1.5rem",
            marginBottom: "1.25rem",
            fontStyle: "italic",
            color: "#666",
          }}
        >
          {renderMarks(node.content)}
        </blockquote>
      );

    case "codeBlock":
      return (
        <pre
          key={key}
          style={{
            background: "#f3f4f6",
            padding: "1rem",
            borderRadius: "6px",
            marginBottom: "1.25rem",
            overflow: "auto",
          }}
        >
          <code>{node.content?.[0]?.text || ""}</code>
        </pre>
      );

    case "horizontalRule":
      return <hr key={key} style={{ margin: "2rem 0" }} />;

    case "hardBreak":
      return <br key={key} />;

    default:
      return null;
  }
}

/**
 * Render marks (text formatting) within content
 */
function renderMarks(content?: any[]): React.ReactNode {
  if (!content || !Array.isArray(content)) {
    return null;
  }

  return content.map((mark: any, index: number) => {
    let element: React.ReactNode = mark.text || "";

    // Apply marks in order
    if (mark.marks && Array.isArray(mark.marks)) {
      for (const m of mark.marks) {
        switch (m.type) {
          case "bold":
            element = <strong key={`${index}-bold`}>{element}</strong>;
            break;
          case "italic":
            element = <em key={`${index}-italic`}>{element}</em>;
            break;
          case "underline":
            element = <u key={`${index}-underline`}>{element}</u>;
            break;
          case "strike":
            element = (
              <s key={`${index}-strike`} style={{ textDecoration: "line-through" }}>
                {element}
              </s>
            );
            break;
          case "code":
            element = (
              <code
                key={`${index}-code`}
                style={{
                  background: "#f3f4f6",
                  padding: "0.125rem 0.375rem",
                  borderRadius: "4px",
                  color: "#dc2626",
                  fontFamily: "'Monaco', 'Menlo', 'Ubuntu Mono', monospace",
                }}
              >
                {element}
              </code>
            );
            break;
          case "link":
            element = (
              <a
                key={`${index}-link`}
                href={m.attrs?.href || "#"}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: "#f97316",
                  textDecoration: "underline",
                }}
              >
                {element}
              </a>
            );
            break;
        }
      }
    }

    return (
      <span key={`mark-${index}`}>
        {element}
      </span>
    );
  });
}

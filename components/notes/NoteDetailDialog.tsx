"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Tables } from "@/types/supabase";
import { useState } from "react";
import { Eye, Code } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";

type Note = Tables<"Note">;

export default function NoteDetailDialog({
  note,
  open,
  onOpenChange,
}: {
  note: Note | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [viewMode, setViewMode] = useState<"preview" | "raw">("preview");

  if (!note) return null;

  const markdownToHtml = (markdown: string | null): string => {
    if (!markdown) return "";

    let html = markdown;
    const codeBlockPlaceholders: string[] = [];
    const inlineCodePlaceholders: string[] = [];

    html = html.replace(
      /^```(\w+)?\n([\s\S]*?)\n```/gm,
      (match, lang, code) => {
        const escaped = code
          .replace(/&/g, "&amp;")
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;");
        const placeholder = `__CODE_BLOCK_${codeBlockPlaceholders.length}__`;
        const langClass = lang ? `language-${lang}` : "";
        codeBlockPlaceholders.push(
          `<pre class="bg-muted p-3 rounded-lg overflow-x-auto my-2"><code class="text-sm font-mono ${langClass}">${escaped}</code></pre>`
        );
        return placeholder;
      }
    );

    html = html.replace(/`([^`\n]+?)`/g, (match, code) => {
      const escaped = code
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
      const placeholder = `__INLINE_CODE_${inlineCodePlaceholders.length}__`;
      inlineCodePlaceholders.push(
        `<code class="bg-muted px-1.5 py-0.5 rounded text-sm font-mono">${escaped}</code>`
      );
      return placeholder;
    });

    html = html
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");

    html = html.replace(
      /^### (.*$)/gim,
      "<h3 class='text-lg font-semibold mt-4 mb-2'>$1</h3>"
    );
    html = html.replace(
      /^## (.*$)/gim,
      "<h2 class='text-xl font-semibold mt-4 mb-2'>$1</h2>"
    );
    html = html.replace(
      /^# (.*$)/gim,
      "<h1 class='text-2xl font-bold mt-4 mb-2'>$1</h1>"
    );

    html = html.replace(
      /\*\*(.*?)\*\*/gim,
      "<strong class='font-semibold'>$1</strong>"
    );
    html = html.replace(
      /__(.*?)__/gim,
      "<strong class='font-semibold'>$1</strong>"
    );

    html = html.replace(
      /(?<!\*)\*(?!\*)([^*]+?)(?<!\*)\*(?!\*)/gim,
      "<em>$1</em>"
    );
    html = html.replace(/(?<!_)_(?!_)([^_]+?)(?<!_)_(?!_)/gim, "<em>$1</em>");

    html = html.replace(
      /\[([^\]]+)\]\(([^)]+)\)/gim,
      '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-primary underline hover:text-primary/80">$1</a>'
    );

    html = html.replace(
      /^&gt; (.*$)/gim,
      "<blockquote class='border-l-4 border-muted-foreground pl-4 italic my-2 text-muted-foreground'>$1</blockquote>"
    );

    html = html.replace(
      /^(---|\*\*\*)$/gim,
      "<hr class='my-4 border-border' />"
    );

    const lines = html.split("\n");
    let processedLines: string[] = [];
    let inUl = false,
      inOl = false;

    lines.forEach((line) => {
      const ulMatch = line.match(/^[\*\-\+] (.*)/);
      const olMatch = line.match(/^\d+\. (.*)/);

      if (ulMatch) {
        if (inOl) {
          processedLines.push("</ol>");
          inOl = false;
        }
        if (!inUl) {
          processedLines.push("<ul class='list-disc my-2 ml-4 space-y-1'>");
          inUl = true;
        }
        processedLines.push(`<li>${ulMatch[1]}</li>`);
      } else if (olMatch) {
        if (inUl) {
          processedLines.push("</ul>");
          inUl = false;
        }
        if (!inOl) {
          processedLines.push("<ol class='list-decimal my-2 ml-4 space-y-1'>");
          inOl = true;
        }
        processedLines.push(`<li>${olMatch[1]}</li>`);
      } else {
        if (inUl) {
          processedLines.push("</ul>");
          inUl = false;
        }
        if (inOl) {
          processedLines.push("</ol>");
          inOl = false;
        }
        processedLines.push(line);
      }
    });
    if (inUl) processedLines.push("</ul>");
    if (inOl) processedLines.push("</ol>");
    html = processedLines.join("\n");

    inlineCodePlaceholders.forEach((code, index) => {
      html = html.replace(`__INLINE_CODE_${index}__`, code);
    });
    codeBlockPlaceholders.forEach((block, index) => {
      html = html.replace(`__CODE_BLOCK_${index}__`, block);
    });

    html = html
      .split(/\n\n+/)
      .filter((p) => p.trim())
      .map((p) => {
        if (p.match(/^<(h[1-6]|ul|ol|pre|blockquote|hr)/)) {
          return p;
        }
        return `<p class='my-2'>${p.replace(/\n/g, "<br />")}</p>`;
      })
      .join("");

    return `<div class='space-y-2'>${html}</div>`;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{note.title}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Tabs
            value={viewMode}
            onValueChange={(v) => setViewMode(v as "preview" | "raw")}
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="preview" className="flex items-center gap-2">
                <Eye className="w-4 h-4" />
                Preview
              </TabsTrigger>
              <TabsTrigger value="raw" className="flex items-center gap-2">
                <Code className="w-4 h-4" />
                Raw Markdown
              </TabsTrigger>
            </TabsList>
            <TabsContent value="preview" className="mt-4">
              <div
                className="p-4 border rounded-lg min-h-[400px] bg-card overflow-auto"
                dangerouslySetInnerHTML={{
                  __html: markdownToHtml(note.content),
                }}
              />
            </TabsContent>
            <TabsContent value="raw" className="mt-4">
              <pre className="p-4 border rounded-lg min-h-[400px] bg-muted font-mono text-sm overflow-auto whitespace-pre-wrap">
                {note.content}
              </pre>
            </TabsContent>
          </Tabs>
          <div className="text-xs text-muted-foreground">
            Created:{" "}
            {new Date(note.created_at).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

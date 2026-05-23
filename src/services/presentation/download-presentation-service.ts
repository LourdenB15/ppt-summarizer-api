import PDFDocument from "pdfkit";
import { Document, Paragraph, TextRun, Packer, HeadingLevel } from "docx";

// ── PDF ────────────────────────────────────────────────────────────────────

export async function generatePdf(
  fileName: string,
  summary: string,
): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 50 });
    const chunks: Buffer[] = [];

    doc.on("data", (chunk) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    // Title
    doc.fontSize(20).font("Helvetica-Bold").text(fileName.replace(".pptx", ""));
    doc.moveDown(1.5);

    for (const rawLine of summary.split("\n")) {
      const line = rawLine.trimEnd();

      if (!line.trim()) {
        doc.moveDown(0.4);
        continue;
      }

      const trimmed = line.trimStart();
      const indentSpaces = line.length - trimmed.length;
      const indentPx = (indentSpaces / 2) * 15;

      // Bullet line
      if (trimmed.startsWith("* ") || trimmed.startsWith("- ")) {
        const content = trimmed.slice(2);
        doc.fontSize(11);
        writePdfLine(doc, `• ${content}`, indentPx);
        continue;
      }

      // Full-line heading: **text**
      const heading = trimmed.match(/^\*\*(.+)\*\*$/);
      if (heading) {
        doc.moveDown(0.3);
        doc
          .fontSize(13)
          .font("Helvetica-Bold")
          .text(heading[1], { lineGap: 3 });
        continue;
      }

      // Regular paragraph with possible inline bold
      doc.fontSize(11);
      writePdfLine(doc, trimmed, indentPx);
    }

    doc.end();
  });
}

function writePdfLine(
  doc: PDFKit.PDFDocument,
  line: string,
  indent: number = 0,
) {
  // Split on **...** to handle inline bold
  const parts = line.split(/(\*\*[^*]+\*\*)/);

  if (parts.length === 1) {
    doc.font("Helvetica").text(stripMarkdown(line), { indent, lineGap: 2 });
    return;
  }

  for (let i = 0; i < parts.length; i++) {
    const part = parts[i];
    const isLast = i === parts.length - 1;
    const opts = {
      continued: !isLast,
      indent: i === 0 ? indent : 0,
      lineGap: 2,
    };

    if (part.startsWith("**") && part.endsWith("**")) {
      doc.font("Helvetica-Bold").text(part.slice(2, -2), opts);
    } else if (part) {
      doc.font("Helvetica").text(part, opts);
    }
  }

  doc.font("Helvetica");
}

// ── DOCX ───────────────────────────────────────────────────────────────────

export async function generateDocx(
  fileName: string,
  summary: string,
): Promise<Buffer> {
  const children: Paragraph[] = [
    new Paragraph({
      text: fileName.replace(".pptx", ""),
      heading: HeadingLevel.TITLE,
    }),
    new Paragraph({ text: "" }),
  ];

  for (const rawLine of summary.split("\n")) {
    const line = rawLine.trimEnd();

    if (!line.trim()) {
      children.push(new Paragraph({ text: "" }));
      continue;
    }

    const trimmed = line.trimStart();
    const indentLevel = Math.floor((line.length - trimmed.length) / 2);

    // Bullet line
    if (trimmed.startsWith("* ") || trimmed.startsWith("- ")) {
      const content = trimmed.slice(2);
      children.push(
        new Paragraph({
          children: parseInlineBold(content),
          bullet: { level: indentLevel },
        }),
      );
      continue;
    }

    // Full-line heading: **text**
    const heading = trimmed.match(/^\*\*(.+)\*\*$/);
    if (heading) {
      children.push(
        new Paragraph({
          text: heading[1],
          heading: HeadingLevel.HEADING_2,
        }),
      );
      continue;
    }

    // Regular paragraph with possible inline bold
    children.push(new Paragraph({ children: parseInlineBold(trimmed) }));
  }

  const doc = new Document({ sections: [{ children }] });
  return await Packer.toBuffer(doc);
}

function parseInlineBold(text: string): TextRun[] {
  const parts = text.split(/(\*\*[^*]+\*\*)/);
  return parts
    .filter((p) => p.length > 0)
    .map((part) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return new TextRun({ text: part.slice(2, -2), bold: true });
      }
      return new TextRun({ text: part });
    });
}

function stripMarkdown(text: string): string {
  return text.replace(/\*\*([^*]+)\*\*/g, "$1").replace(/\*([^*]+)\*/g, "$1");
}

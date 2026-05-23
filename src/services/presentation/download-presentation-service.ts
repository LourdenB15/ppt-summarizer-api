import PDFDocument from "pdfkit";
import { Document, Paragraph, TextRun, Packer, HeadingLevel } from "docx";

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

    doc.fontSize(20).font("Helvetica-Bold").text(fileName.replace(".pptx", ""));
    doc.moveDown();
    doc.fontSize(12).font("Helvetica").text(summary, { lineGap: 4 });
    doc.end();
  });
}

export async function generateDocx(
  fileName: string,
  summary: string,
): Promise<Buffer> {
  const doc = new Document({
    sections: [
      {
        children: [
          new Paragraph({
            text: fileName.replace(".pptx", ""),
            heading: HeadingLevel.HEADING_1,
          }),
          new Paragraph({ text: "" }),
          ...summary.split("\n").map(
            (line) =>
              new Paragraph({
                children: [new TextRun({ text: line })],
              }),
          ),
        ],
      },
    ],
  });

  return await Packer.toBuffer(doc);
}

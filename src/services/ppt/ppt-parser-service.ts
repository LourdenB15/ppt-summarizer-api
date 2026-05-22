import OfficeParser from "officeparser";

export async function parsePptx(fileBuffer: Buffer): Promise<string> {
  const ast = await OfficeParser.parseOffice(fileBuffer);
  return ast.toText();
}

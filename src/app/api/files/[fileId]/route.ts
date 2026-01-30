import { type NextRequest, NextResponse } from "next/server";
import { getManual } from "@/actions/manuals";
import { getFile } from "@/lib/files";

function sanitizeFilename(filename: string): string {
  // Remove characters that could cause header injection
  const sanitized = filename.replace(/[\r\n"]/g, "");
  // Check if filename contains non-ASCII characters (code points > 127)
  const hasNonAscii = [...sanitized].some((char) => char.charCodeAt(0) > 127);
  if (hasNonAscii) {
    // Use RFC 5987 encoding for non-ASCII characters
    return `filename*=UTF-8''${encodeURIComponent(sanitized)}`;
  }
  return `filename="${sanitized}"`;
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ fileId: string }> },
) {
  const { fileId } = await params;

  const manual = await getManual(fileId);
  if (!manual) {
    return new NextResponse("Not found", { status: 404 });
  }

  const fileBuffer = getFile(manual.filePath);
  if (!fileBuffer) {
    return new NextResponse("File not found", { status: 404 });
  }

  return new NextResponse(new Uint8Array(fileBuffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; ${sanitizeFilename(manual.filename)}`,
      "Content-Length": fileBuffer.length.toString(),
    },
  });
}

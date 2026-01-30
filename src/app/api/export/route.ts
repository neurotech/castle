import { NextResponse } from "next/server";
import { exportAllData } from "@/actions/export";

export async function GET() {
  try {
    const data = await exportAllData();

    return new NextResponse(JSON.stringify(data, null, 2), {
      headers: {
        "Content-Type": "application/json",
        "Content-Disposition": `attachment; filename="castle-export-${new Date().toISOString().split("T")[0]}.json"`,
      },
    });
  } catch {
    return new NextResponse("Failed to export data", { status: 500 });
  }
}

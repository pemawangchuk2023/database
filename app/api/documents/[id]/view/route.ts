import { NextRequest, NextResponse } from "next/server";
import { downloadDocument } from "@/actions/document.action";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const result = await downloadDocument(id);

        if (!result.success || !result.data) {
            return NextResponse.json(
                { error: result.error || "Document not found" },
                { status: 404 }
            );
        }

        const { fileName, fileType, fileData } = result.data;

        // Convert Buffer to Uint8Array for response
        const buffer = Buffer.from(fileData);

        return new NextResponse(buffer, {
            headers: {
                "Content-Type": fileType,
                "Content-Disposition": "inline", // inline instead of attachment for viewing
                "Content-Length": buffer.length.toString(),
            },
        });
    } catch (error) {
        console.error("View error:", error);
        return NextResponse.json(
            { error: "Failed to load document" },
            { status: 500 }
        );
    }
}

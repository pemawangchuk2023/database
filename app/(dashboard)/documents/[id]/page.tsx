import { getDocumentById } from "@/actions/document.action";
import { notFound } from "next/navigation";
import DocumentDetailsClient from "./client";

export default async function DocumentPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const result = await getDocumentById(id);

    if (!result.success || !result.data) {
        notFound();
    }

    // Remove file_data to avoid serialization error (Uint8Array cannot be passed to client)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { file_data, ...documentWithoutFile } = result.data;

    return <DocumentDetailsClient document={documentWithoutFile} />;
}


import { getDocuments } from "@/actions/document.action";
import { mockDocumentTypes } from "@/types";
import DocumentsClient from "./client";


export default async function DocumentsPage() {
    // Fetch real documents from database
    const result = await getDocuments();
    const documents = result.success ? result.data : [];

    return <DocumentsClient documents={documents} documentTypes={mockDocumentTypes} />;
}

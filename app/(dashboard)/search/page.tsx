
import { getDocuments } from "@/actions/document.action";
import { mockDocumentTypes } from "@/types";
import SearchClient from "./client";


export default async function SearchPage() {
    // Fetch all documents for search
    const result = await getDocuments();
    const documents = result.success ? result.data : [];

    return <SearchClient documents={documents} documentTypes={mockDocumentTypes} />;
}

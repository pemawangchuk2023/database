import { getPendingDocuments } from "@/actions/document.action";
import { DocumentTypes } from "@/types";
import PendingDocumentsClient from "./client";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";

export default async function PendingDocumentsPage() {
	// Check if user is admin
	const session = await getSession();
	if (!session || session.role !== "admin") {
		redirect("/dashboard");
	}

	const result = await getPendingDocuments();
	const pendingDocuments = result.success ? result.data : [];

	return (
		<PendingDocumentsClient
			documents={pendingDocuments}
			documentTypes={DocumentTypes}
		/>
	);
}

import { getDocuments } from "@/actions/document.action";
import { getUserRole } from "@/actions/user.action";
import { DocumentTypes } from "@/types";
import DocumentsClient from "./client";

const Documents = async () => {
	// Fetch real documents from database
	const result = await getDocuments();
	const documents = result.success ? result.data : [];

	// Get user role for permission checks
	const userRole = await getUserRole();

	return (
		<DocumentsClient
			documents={documents}
			documentTypes={DocumentTypes}
			userRole={userRole}
		/>
	);
};

export default Documents;

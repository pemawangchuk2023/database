import { getDocuments } from "@/actions/document.action";
import { DocumentTypes } from "@/types";
import SearchClient from "./client";

const Search = async () => {
	const result = await getDocuments();
	const documents = result.success ? result.data : [];

	return <SearchClient documents={documents} documentTypes={DocumentTypes} />;
};
export default Search;

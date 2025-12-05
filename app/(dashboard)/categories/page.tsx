import { getCategories } from "@/actions/category.action";
import { getDocumentStats } from "@/actions/document.action";
import { getSession } from "@/actions/auth";
import CategoriesClient from "./client";

const Categories = async () => {
	const session = await getSession();
	const statsResult = await getDocumentStats();
	const categoriesResult = await getCategories();

	const stats = statsResult.success ? statsResult.data : null;
	const categories = categoriesResult.success ? categoriesResult.data : [];
	const userRole = (session?.role || "staff") as "admin" | "staff";

	return <CategoriesClient categories={categories} stats={stats} userRole={userRole} />;
};

export default Categories;

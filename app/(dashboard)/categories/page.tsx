import { getCategories } from "@/actions/category.action";
import { getDocumentStats } from "@/actions/document.action";
import CategoriesClient from "./client";

export default async function CategoriesPage() {
    // Fetch real data
    const statsResult = await getDocumentStats();
    const categoriesResult = await getCategories();

    const stats = statsResult.success ? statsResult.data : null;
    const categories = categoriesResult.success ? categoriesResult.data : [];

    return <CategoriesClient categories={categories} stats={stats} />;
}

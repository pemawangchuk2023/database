"use client";

import { useState } from "react";
import { FileText, Download, Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import PaginationComponent from "@/components/shared/pagination-component";

interface DashboardDocumentsProps {
  documents: any[];
  itemsPerPage?: number;
}

const DashboardDocuments = ({
  documents,
  itemsPerPage = 5,
}: DashboardDocumentsProps) => {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(documents.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentDocuments = documents.slice(startIndex, endIndex);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20";
      case "pending":
        return "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20";
      case "rejected":
        return "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20";
      default:
        return "";
    }
  };

  if (documents.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <FileText className="h-12 w-12 mx-auto mb-2 opacity-50" />
        <p>No documents yet</p>
        <p className="text-xs mt-1">
          Upload your first document to get started
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="space-y-4">
        {currentDocuments.map((doc: any, index: number) => (
          <Link
            key={doc.document_id}
            href={`/documents/${doc.document_id}`}
            className="flex items-center gap-4 p-3 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-all duration-300 ease-in-out cursor-pointer border border-transparent hover:border-blue-200 dark:hover:border-blue-800"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-indigo-500 text-white shadow-lg flex-shrink-0">
              <FileText className="h-5 w-5" />
            </div>
            <div className="flex-1 space-y-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="text-sm font-medium leading-none truncate">
                  {doc.title}
                </p>
                {doc.status && doc.status !== "approved" && (
                  <Badge
                    variant="outline"
                    className={`text-xs ${getStatusColor(doc.status)}`}
                  >
                    {doc.status}
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-3 text-xs text-amber-500 font-bold italic">
                <span>{doc.uploader_name || "Unknown"}</span>
                <span>•</span>
                <span>
                  {formatDistanceToNow(new Date(doc.created_at), {
                    addSuffix: true,
                  })}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-4 text-xs text-muted-foreground flex-shrink-0">
              <div className="flex items-center gap-1">
                <Eye className="h-3 w-3" />
                <span>{doc.views || 0}</span>
              </div>
              <div className="flex items-center gap-1">
                <Download className="h-3 w-3" />
                <span>{doc.downloads || 0}</span>
              </div>
            </div>
            <Badge
              variant="outline"
              className="text-xs border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/30 flex-shrink-0"
            >
              {doc.type}
            </Badge>
          </Link>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center pt-4">
          <PaginationComponent
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      )}
    </div>
  );
};

export default DashboardDocuments;

"use client";

import { useState } from "react";
import { FileText, CheckCircle, XCircle, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { toast } from "sonner";
import { approveDocument, rejectDocument } from "@/actions/document.action";
import { useRouter } from "next/navigation";

interface PendingDocumentsClientProps {
	documents: any[];
	documentTypes: any[];
}

const PendingDocumentsClient = ({
	documents: initialDocuments,
	documentTypes,
}: PendingDocumentsClientProps) => {
	const router = useRouter();
	const [documents, setDocuments] = useState(initialDocuments);
	const [processingIds, setProcessingIds] = useState<Set<number>>(new Set());

	const handleApprove = async (id: number) => {
		setProcessingIds((prev) => new Set(prev).add(id));
		const result = await approveDocument(id.toString());

		if (result.success) {
			toast.success("Document approved successfully");
			setDocuments(documents.filter((doc) => doc.document_id !== id));
		} else {
			toast.error(result.error || "Failed to approve document");
		}

		setProcessingIds((prev) => {
			const next = new Set(prev);
			next.delete(id);
			return next;
		});
		router.refresh();
	};

	const handleReject = async (id: number) => {
		setProcessingIds((prev) => new Set(prev).add(id));
		const result = await rejectDocument(id.toString());

		if (result.success) {
			toast.success("Document rejected");
			setDocuments(documents.filter((doc) => doc.document_id !== id));
		} else {
			toast.error(result.error || "Failed to reject document");
		}

		setProcessingIds((prev) => {
			const next = new Set(prev);
			next.delete(id);
			return next;
		});
		router.refresh();
	};

	const formatFileSize = (bytes: number) => {
		if (bytes < 1024) return bytes + " B";
		if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
		return (bytes / (1024 * 1024)).toFixed(1) + " MB";
	};

	const getDocumentTypeName = (typeId: string) => {
		const type = documentTypes.find((t) => t.id === typeId);
		return type?.name || typeId;
	};

	return (
		<div className='space-y-6 animate-in fade-in duration-500'>
			{/* Page Header */}
			<div className='flex items-center justify-between'>
				<div>
					<h1 className='text-3xl font-bold tracking-tight'>
						Pending Documents
					</h1>
					<p className='text-muted-foreground mt-1'>
						Review and approve documents uploaded by users
					</p>
				</div>
				<Badge variant='outline' className='text-lg px-4 py-2'>
					<Clock className='h-4 w-4 mr-2' />
					{documents.length} Pending
				</Badge>
			</div>

			{/* Empty State */}
			{documents.length === 0 && (
				<Card className='bg-card/95 backdrop-blur-sm border shadow-lg'>
					<CardContent className='p-12 text-center'>
						<CheckCircle className='h-12 w-12 mx-auto mb-4 text-green-500' />
						<h3 className='text-lg font-semibold mb-2'>All caught up!</h3>
						<p className='text-muted-foreground'>
							There are no pending documents to review at this time.
						</p>
					</CardContent>
				</Card>
			)}

			{/* Pending Documents Grid */}
			{documents.length > 0 && (
				<div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
					{documents.map((doc, index) => (
						<Card
							key={doc.document_id}
							className='transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-xl bg-card/95 backdrop-blur-sm border shadow-lg'
							style={{ animationDelay: `${index * 50}ms` }}
						>
							<CardContent className='p-6'>
								<div className='flex items-start justify-between mb-4'>
									<div className='flex h-12 w-12 items-center justify-center rounded-lg bg-yellow-500/10 text-yellow-600 dark:text-yellow-400'>
										<FileText className='h-6 w-6' />
									</div>
									<Badge
										variant='outline'
										className='bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20'
									>
										Pending
									</Badge>
								</div>
								<h3 className='font-semibold mb-2 line-clamp-2'>{doc.title}</h3>
								<p className='text-sm text-muted-foreground mb-4 line-clamp-2'>
									{doc.description || "No description"}
								</p>
								<div className='flex items-center gap-2 mb-3'>
									<Badge variant='secondary' className='text-xs'>
										{getDocumentTypeName(doc.type)}
									</Badge>
									<span className='text-xs text-muted-foreground'>
										{formatFileSize(doc.file_size)}
									</span>
								</div>
								<div className='flex items-center justify-between text-xs text-muted-foreground border-t border-border pt-3 mb-4'>
									<span>{doc.uploader_name || "Unknown"}</span>
									<span>
										{formatDistanceToNow(new Date(doc.created_at), {
											addSuffix: true,
										})}
									</span>
								</div>
								<div className='flex gap-2'>
									<Button
										size='sm'
										className='flex-1 gap-1 bg-green-600 hover:bg-green-700'
										onClick={() => handleApprove(doc.document_id)}
										disabled={processingIds.has(doc.document_id)}
									>
										<CheckCircle className='h-3 w-3' />
										Approve
									</Button>
									<Button
										size='sm'
										variant='outline'
										className='flex-1 gap-1 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20'
										onClick={() => handleReject(doc.document_id)}
										disabled={processingIds.has(doc.document_id)}
									>
										<XCircle className='h-3 w-3' />
										Reject
									</Button>
								</div>
							</CardContent>
						</Card>
					))}
				</div>
			)}
		</div>
	);
};

export default PendingDocumentsClient;

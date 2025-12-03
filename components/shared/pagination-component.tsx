"use client";

import {
	Pagination,
	PaginationContent,
	PaginationItem,
	PaginationLink,
	PaginationPrevious,
	PaginationNext,
} from "@/components/ui/pagination";

interface PaginationProps {
	currentPage: number;
	totalPages: number;
	onPageChange: (page: number) => void;
}
const PaginationComponent = ({
	currentPage,
	totalPages,
	onPageChange,
}: PaginationProps) => {
	return (
		<div className='flex justify-center mt-8'>
			<Pagination>
				<PaginationContent>
					{/* Previous Button */}
					<PaginationItem>
						<PaginationPrevious
							href='#'
							onClick={(e) => {
								e.preventDefault();
								if (currentPage > 1) onPageChange(currentPage - 1);
							}}
							className={
								currentPage === 1 ? "pointer-events-none opacity-50" : ""
							}
						/>
					</PaginationItem>

					{/* Page Numbers */}
					{Array.from({ length: totalPages }, (_, index) => (
						<PaginationItem key={index}>
							<PaginationLink
								href='#'
								isActive={index + 1 === currentPage}
								onClick={(e) => {
									e.preventDefault();
									onPageChange(index + 1);
								}}
							>
								{index + 1}
							</PaginationLink>
						</PaginationItem>
					))}

					{/* Next Button */}
					<PaginationItem>
						<PaginationNext
							href='#'
							onClick={(e) => {
								e.preventDefault();
								if (currentPage < totalPages) onPageChange(currentPage + 1);
							}}
							className={
								currentPage === totalPages
									? "pointer-events-none opacity-50"
									: ""
							}
						/>
					</PaginationItem>
				</PaginationContent>
			</Pagination>
		</div>
	);
};

export default PaginationComponent;

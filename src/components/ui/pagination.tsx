'use client';

import { ArrowLeft2, ArrowRight2 } from "iconsax-reactjs";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

type Props = {
    currentPage: number;
    totalPages: number;
};

export default function Pagination({ currentPage, totalPages }: Props) {
    const searchParams = useSearchParams();

    // Utility to create the page link with query params
    const createPageLink = (page: number) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("page", page.toString());
        return `?${params.toString()}`;
    };

    // If there's only one page, no pagination needed
    if (totalPages <= 1) return null;

    // Ellipsis logic: Show pages around the current page with ellipses for other pages
    const visiblePages = 5; // How many page numbers to show at once
    const start = Math.max(2, currentPage - Math.floor(visiblePages / 2));
    const end = Math.min(totalPages - 1, currentPage + Math.floor(visiblePages / 2));

    // Ensure that we always show at least the first and last pages
    const pages = [];

    // Always show page 1
    pages.push(1);

    if (start > 2) {
        // If there are gaps before the current page, show ellipsis
        pages.push('...');
    }

    // Add the pages before and after the current page
    for (let i = start; i <= end; i++) {
        pages.push(i);
    }

    if (end < totalPages - 1) {
        // If there are gaps after the current page, show ellipsis
        pages.push('...');
    }

    // Always show the last page
    if (totalPages > 1) {
        pages.push(totalPages);
    }

    return (
        <div className="flex items-center gap-8">
            {/* Previous Button */}
            <Link
                href={createPageLink(currentPage - 1)}
                aria-disabled={currentPage === 1}
                className={`size-8 flex items-center justify-center bg-white rounded-[5px] ${currentPage === 1 ? "pointer-events-none text-[#8C8C8C]" : "hover:shadow-[0px_0px_0px_1px_var(--primary)] hover:text-primary transition-all duration-200"}`}
            >
                <ArrowRight2 size={16} color="currentColor" className="[html[dir=ltr]_&]:rotate-180" />
            </Link>
            <div className="flex items-center gap-2">
                {/* Page Numbers with Ellipsis */}
                {pages.map((page, index) => {
                    if (page === '...') {
                        return (
                            <span key={`ellipsis-${index}`} className="text-sm font-semibold text-secondary p-2">...</span>
                        );
                    }

                    const isActive = page === currentPage;

                    return (
                        <Link
                            key={`page-${page}`} // Ensure unique key by adding 'page-' prefix
                            href={createPageLink(Number(page))}
                            className={`text-sm font-semibold p-2 hover:text-primary ${isActive ? "text-primary" : "text-secondary"}`}
                        >
                            {page}
                        </Link>
                    );
                })}
            </div>

            {/* Next Button */}
            <Link
                href={createPageLink(currentPage + 1)}
                aria-disabled={currentPage === totalPages}
                className={`size-8 flex items-center justify-center bg-white rounded-[5px] ${currentPage === totalPages ? "pointer-events-none text-[#8C8C8C]" : "hover:shadow-[0px_0px_0px_1px_var(--primary)] hover:text-primary transition-all duration-200"}`}
            >
                <ArrowLeft2 size={16} color="currentColor" className="[html[dir=ltr]_&]:rotate-180" />
            </Link>
        </div>
    );
}

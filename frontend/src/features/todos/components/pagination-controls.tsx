"use client";

import { Button } from "@/components/ui/button";
import { type Pagination } from "../types";

export function PaginationControls({
  pagination,
  onPrevious,
  onNext,
}: {
  pagination: Pagination;
  onPrevious: () => void;
  onNext: () => void;
}) {
  return (
    <div className="flex items-center justify-between gap-3 text-sm">
      <Button
        variant="secondary"
        onClick={onPrevious}
        disabled={!pagination.hasPreviousPage}
      >
        ← Previous
      </Button>

      <span className="text-zinc-600 dark:text-zinc-400">
        Page {pagination.page} of {Math.max(pagination.totalPages, 1)} (
        {pagination.total} total)
      </span>

      <Button
        variant="secondary"
        onClick={onNext}
        disabled={!pagination.hasNextPage}
      >
        Next →
      </Button>
    </div>
  );
}

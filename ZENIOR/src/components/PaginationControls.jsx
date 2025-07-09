"use client";
import PropTypes from "prop-types";
import { useRouter } from "next/router";
import { useSearchParams } from "next/navigation";

const PaginationArrows = ({ hasNextPage, hasPrevPage }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const page = searchParams.get("page") ?? "1";
  const per_page = searchParams.get("per_page") ?? "6";

  return (
    <div className="flex gap-2">
      <button
        disabled={!hasPrevPage}
        onClick={() => {
          router.push(`/?page=${Number(page) - 1} & per_page = ${per_page}`);
        }}
      >
        Prev.
      </button>

      <div>{page}</div>

      <button
        disabled={!hasNextPage}
        onClick={() => {
          router.push(`/?page = ${Number(page) + 1} & per_page = ${per_page}`);
        }}
      >
        Next
      </button>
    </div>
  );
};

PaginationArrows.propTypes = {
  hasNextPage: PropTypes.bool.isRequired,
  hasPrevPage: PropTypes.bool.isRequired,
};

export default PaginationArrows;

"use client";

import { SidebarProvider } from "@/components/ui/sidebar";
import { ArchiveSidebar } from "@/components/sidebar/archive-sidebar";
import { useState, useEffect } from "react";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

import { getTheses } from "@/lib/server/scholar-commons";
import { getThesesWithDepartments } from "@/lib/server/scholar-commons";

export default function Archives() {
  const [departments, setSelectedItems] = useState([]);
  const [allRows, setAllRows] = useState(null);
  const [filteredRows, setFilteredRows] = useState(null);
  const [page, setPage] = useState(0);
  const [maxPages, setMaxPages] = useState(0);

  useEffect(() => {
    //fetch archived projects from db with applied filters
    const fetchFilteredArchives = async () => {
      var results;
      if (departments.length === 0) {
        results = await getTheses(0);
      } else {
        results = await getThesesWithDepartments(departments, page);
      }
      setAllRows(results);
      setMaxPages(Math.ceil(results.length / 5));
      setFilteredRows(results.slice(0, 5));
    };
    fetchFilteredArchives();
  }, [departments]);

  useEffect(() => {
    if (allRows) {
      setFilteredRows(allRows.slice(page, page + 5));
    }
  }, [page]);

  if (!filteredRows) {
    return <p>Loading..</p>;
  }

  return (
    <div className="sm:px-8 m-9">
      <div className="flex flex-row">
        <div>
          <SidebarProvider className="pr-8">
            <ArchiveSidebar
              departments={departments}
              setSelectedItems={setSelectedItems}
            />
          </SidebarProvider>
        </div>

        <div className="sm:w-[calc(100vw-288px-64px)]">
          <h1 className="pb-6 text-3xl font-black">Project Archive</h1>

          <TableContainer
            component={Paper}
            sx={{ display: "block", overflow: "hidden", maxWidth: "100%" }}
          >
            <Table sx={{ display: "block", maxWidth: "100%" }}>
              <TableBody sx={{ display: "block" }}>
                {filteredRows.map((row) => (
                  <TableRow
                    key={row.context_key}
                    sx={{
                      display: "block",
                      "&:last-child td, &last-child th": { border: 0 },
                    }}
                  >
                    <TableCell
                      sx={{ display: "block" }}
                      align="left"
                      colSpan={4}
                    >
                      <div className="flex flex-col p-4 rounded-lg space-y2">
                        <a
                          href={`/archive/${row.context_key}`}
                          className="mb-2 text-xl font-bold underline text-[#b30738]"
                        >
                          {row.title}
                        </a>
                        <div
                          className="max-w-full [&>*]:line-clamp-2 [&>*:not(:first-child)]:hidden"
                          dangerouslySetInnerHTML={{
                            __html: row.abstract,
                          }}
                        ></div>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </div>

      <div className="mt-2">
        <Pagination className="content-center">
          <PaginationContent>
            <PaginationItem className="cursor-pointer">
              <PaginationPrevious
                disabled={page === 0}
                className={page === 0 ? "cursor-not-allowed" : ""}
                onClick={() => {
                  setPage((prev) => Math.max(prev - 5, 0));
                }}
              />
            </PaginationItem>
            <p>
              Page {page / 5 + 1} / {maxPages}
            </p>
            <PaginationItem className="cursor-pointer">
              <PaginationNext
                disabled={maxPages <= Math.ceil((page + 5) / 5)}
                className={
                  maxPages <= Math.ceil((page + 5) / 5)
                    ? "cursor-not-allowed"
                    : ""
                }
                onClick={() => {
                  if (maxPages > Math.ceil((page + 5) / 5)) {
                    setPage((prev) => prev + 5);
                  }
                }}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}

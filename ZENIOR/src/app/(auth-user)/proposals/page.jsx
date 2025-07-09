"use client";

import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import Link from "next/link";
import { Plus } from "lucide-react";
import { useState, useEffect } from "react";
import { countProposals, proposals } from "@/lib/server/proposals";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import InterestedButton from "@/components/InterestedButton";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

export default function Proposals() {
  const [selectedItems, setSelectedItems] = useState([]);
  const [radioSelections, setRadioSelections] = useState({
    "Interdisciplinary?": null,
    "Openings for additional members?": 9,
    "Has an advisor already?": null,
  });
  const [filteredRows, setFilteredRows] = useState(null);
  const [page, setPage] = useState(0);
  const [maxPages, setMaxPages] = useState(0);

  useEffect(() => {
    //fetch proposals from db with applied filters
    const fetchFilteredProposals = async () => {
      const filters = {
        departmentIds: selectedItems.length ? selectedItems : undefined,
        isInterdisciplinary: radioSelections["Interdisciplinary?"] === 7,
        hasOpenings: radioSelections["Openings for additional members?"] === 9,
        hasAdvisor: radioSelections["Has an advisor already?"] === 11,
      };

      const results = await proposals(page, 5, filters);
      setFilteredRows(results);
    };
    fetchFilteredProposals();
  }, [selectedItems, radioSelections, page]);

  useEffect(() => {
    const fetchCountProposals = async () => {
      const count = await countProposals();
      setMaxPages(Math.ceil(count / 5));
    };
    fetchCountProposals();
  }, []);

  if (!filteredRows) {
    return <div>Loading...</div>;
  }

  return (
    <div className="sm:px-8 m-9">
      <div className="flex flex-row">
        <SidebarProvider className="pr-8">
          <AppSidebar
            selectedItems={selectedItems}
            setSelectedItems={setSelectedItems}
            radioSelections={radioSelections}
            setRadioSelections={setRadioSelections}
          />
        </SidebarProvider>

        <div>
          <h1 className="pb-6 text-3xl font-black">Project Proposals</h1>
          <div className="flex flex-row">
            <p className="pr-4 pb-8">Add Your Own Proposal</p>
            <Link href={`/proposal-form`}>
              <Plus size="20" color={"#b30738"} />
            </Link>
          </div>

          <TableContainer component={Paper}>
            <Table>
              <TableBody>
                {filteredRows.map((row) => (
                  <TableRow
                    key={row.id}
                    sx={{ "&:last-child td, &last-child th": { border: 0 } }}
                  >
                    <TableCell align="left" colSpan={4}>
                      <div className="flex flex-col p-4 rounded-lg space-y-2">
                        <div className="flex justify-between">
                          <a
                            href={`/proposals/${row.id}`}
                            className="text-xl font-bold underline text-[#b30738]"
                          >
                            {row.title}
                          </a>
                          <InterestedButton projectId={row.id} />
                        </div>
                        <div>
                          {row.description.length > 280 ? (
                            <>
                              {row.description.slice(0, 280)}...
                              <a
                                href={`/proposals/${row.id}`}
                                className="underline text-[#b30738]"
                              >
                                Read more
                              </a>
                            </>
                          ) : (
                            row.description
                          )}
                        </div>
                        <br />
                        <div className="flex items-center space-x-4">
                          {row.advisor ? (
                            <>
                              <span className="font-semibold">Advisor</span>:{" "}
                              <span>
                                {row.advisor.firstName} {row.advisor.lastName}
                              </span>
                            </>
                          ) : (
                            <span className="font-semibold">No Advisor</span>
                          )}
                        </div>
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

"use server";
import { prisma } from "@/lib/prisma";

// Function returns array of m projects that are currently proposed starting at the
// nth record.
// Parameters:
// - n: Index to start result from query to return
// - m: Number of results to return.
// - filters: Filters to apply to query
// Example:
// const results = proposals(2, 2);
// Returns: The 2nd and 3rd projects proposed.
export async function proposals(n, m, filters) {
  return await prisma.project.findMany({
    skip: n,
    take: m,
    where: {
      status: {
        equals: "proposed",
      },
      // departmentID: filters.departmentIds ? { in: filters.departmentIds } : undefined,
      // isInterdisciplinary: filters.isInterdisciplinary !== null ? filters.isInterdisciplinary : undefined,
      groupOpen: filters.hasOpenings !== null ? filters.hasOpenings : undefined,
      // hasAdvisor: filters.hasAdvisor !== null ? filters.hasAdvisor : undefined,
    },
    include: {
      advisor: true,
      coAdvisor: true,
    },
  });
}

export async function countProposals() {
  const proposals = await prisma.project.findMany();
  return proposals.length;
}

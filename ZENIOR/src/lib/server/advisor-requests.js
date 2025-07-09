"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export const requestToAdvise = async (studentId, projectId, facultyId) => {
  const session = await auth();
  if (!session) return;

  const existingRequest = await prisma.AdvisorRequest.findFirst({
    where: {
      projectId,
      facultyId,
    },
  });

  if (existingRequest) {
    throw new Error("Faculty already requested to advise this project");
  }

  await prisma.AdvisorRequest.create({
    data: {
      studentId,
      projectId,
      facultyId,
    },
  });

  revalidatePath(`/advisor-directory/${facultyId}`);
  revalidatePath(`/my-team`);
  revalidatePath(`/requests`);
};

export const getRequests = async (facultyId) => {
  const requests = await prisma.AdvisorRequest.findMany({
    where: {
      facultyId,
    },
    include: {
      student: {
        include: {
          user: true,
        },
      },
      project: {
        include: {
          skills: true,
          advisor: true,
          coAdvisor: true,
          members: {
            include: {
              student: true,
            },
          },
          AdvisorRequest: true,
        },
      },
    },
  });

  return requests;
};

export const acceptRequest = async (requestId) => {
  const request = await prisma.AdvisorRequest.findFirst({
    where: {
      id: requestId,
    },
    include: {
      project: true,
    },
  });

  if (!request) {
    throw new Error("Request not found");
  }

  await prisma.AdvisorRequest.delete({
    where: {
      id: requestId,
    },
  });

  const project = request.project;

  if (!project) {
    throw new Error("Project not found");
  }

  if (project.advisorId && project.coAdvisorId) {
    throw new Error("Project already has an advisor and co-advisor");
  }

  const data = {};

  if (!project.advisorId) {
    data.advisorId = request.facultyId;
  } else {
    data.coAdvisorId = request.facultyId;
  }

  await prisma.Project.update({
    where: {
      id: request.projectId,
    },
    data,
  });

  revalidatePath(`/my-team`);
  revalidatePath(`/requests`);
};

export const rejectRequest = async (requestId) => {
  await prisma.AdvisorRequest.delete({
    where: {
      id: requestId,
    },
  });

  revalidatePath(`/requests`);
};

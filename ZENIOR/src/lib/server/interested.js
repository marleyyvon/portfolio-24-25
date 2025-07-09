import { prisma } from "@/lib/prisma";

export const getInterestStatus = async (userId, projectId) => {
  const interest = await prisma.interestedIn.findUnique({
    where: { userId_projectId: { userId, projectId } },
  });
  return !!interest;
};

export const toggleInterestStatus = async (userId, projectId, isInterested) => {
  if (!userId || !projectId) {
    throw new Error("User ID and Project ID are required.");
  }

  try {
    if (isInterested) {
      await prisma.interestedIn.create({
        data: { userId, projectId },
      });
    } else {
      await prisma.interestedIn.delete({
        where: { userId_projectId: { userId, projectId } },
      });
    }
  } catch (error) {
    console.error("Error in toggleInterestStatus:", error);
    throw new Error("Database operation failed");
  }
};

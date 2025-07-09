import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const getRole = (email) => {
  const superAdminEmails = new Set([]);
  const adminEmails = new Set(["jcisneros@scu.edu"]);
  const facultyEmails = new Set(["klukoff@scu.edu"]);

  if (superAdminEmails.has(email)) {
    return "super_admin";
  }

  if (adminEmails.has(email)) {
    return "admin";
  }

  if (facultyEmails.has(email)) {
    return "faculty";
  }

  return "student";
};

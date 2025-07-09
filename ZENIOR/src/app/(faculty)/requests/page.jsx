import { AdvisorRequests } from "@/components/Requests";
import { auth } from "@/lib/auth";
import { user } from "@/lib/server/actions";
import { getRequests } from "@/lib/server/advisor-requests";
import { redirect } from "next/navigation";

export default async function Advisees() {
  const session = await auth();
  if (!session) {
    console.error("No session found");
    redirect("/");
  }
  const users = await user.get({ email: session.user.email });
  const faculty = users[0].faculty;
  if (!faculty) {
    console.error("No faculty found");
    redirect("/");
  }

  const requests = (await getRequests(faculty.id)) || [];
  return <AdvisorRequests requests={requests} />;
}

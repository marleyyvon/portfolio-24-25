import ProposalForm from "@/components/ProjectProposalForm/Proposal";
import { user, skill } from "@/lib/server/actions";
import { auth } from "@/lib/auth";
import { redirect } from "next/dist/server/api-utils";

export default async function Proposal() {
  const session = await auth();
  const users = await user.get({ email: session.user.email });
  if (!session || !users) {
    redirect("/");
  }
  const allSkills = await skill.get();
  return (
    <section>
      <ProposalForm user={users[0]} skillSet={allSkills} />
    </section>
  );
}

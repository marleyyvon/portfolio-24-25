import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

const Success = async () => {
  const session = await auth();
  const userEmail = session?.user?.email;

  const user = await prisma.user.findUnique({
    where: { email: userEmail },
  });

  if (user.new) {
    redirect("/success/new-user");
  } else {
    redirect("/");
  }
};

export default Success;

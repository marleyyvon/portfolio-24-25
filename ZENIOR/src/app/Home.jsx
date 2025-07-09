import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import LoginCard from "@/components/LoginCard";

export default async function Home() {
  const session = await auth();
  const user = session?.user;

  if (!user) {
    return (
      <main className="flex items-center justify-center flex-grow bg-white">
        <LoginCard />
      </main>
    );
  }

  switch (user.role) {
    case "admin":
      redirect("/admin");
      break;
    case "faculty":
      redirect("/faculty");
      break;
    case "student":
      redirect("/student");
      break;
    case "super_admin":
      redirect("/super-admin");
      break;
    default:
      redirect("/");
      break;
  }
}

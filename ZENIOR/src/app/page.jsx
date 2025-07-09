import { auth } from "@/lib/auth";
import Home from "./Home";

export default async function HomePageWrapper() {
  const session = await auth();

  return <Home session={session} />;
}

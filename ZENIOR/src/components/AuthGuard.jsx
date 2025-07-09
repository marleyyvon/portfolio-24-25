import { auth } from "@/lib/auth";
import PropTypes from "prop-types";
import LoginCard from "@/components/LoginCard";

export default async function AuthGuard({ requiredRole = "any", children }) {
  const session = await auth();
  const user = session?.user;

  if (!user) {
    return (
      <main className="flex items-center justify-center min-h-screen bg-white">
        <LoginCard />
      </main>
    );
  }

  if (requiredRole !== "any" && user.role !== requiredRole) {
    return (
      <main className="flex items-center justify-center min-h-screen bg-white">
        <p className="text-center text-red-500 text-lg">
          You do not have permission to view this page.
        </p>
      </main>
    );
  }

  return <>{children}</>;
}

AuthGuard.propTypes = {
  requiredRole: PropTypes.oneOf([
    "student",
    "faculty",
    "admin",
    "super_admin",
    "any",
  ]),
  children: PropTypes.node.isRequired,
};

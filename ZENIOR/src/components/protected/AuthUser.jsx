import PropTypes from "prop-types";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

const Layout = async ({ children }) => {
  const session = await auth();
  const user = session?.user;
  const roles = ["super_admin", "admin", "faculty", "student"];

  if (!roles.includes(user?.role)) {
    //!@note: Redirects if user failed to submit new user form
    redirect("/");
  }

  return <>{children}</>;
};

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Layout;

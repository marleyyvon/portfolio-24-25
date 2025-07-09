import PropTypes from "prop-types";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

const Layout = async ({ children }) => {
  const session = await auth();
  const user = session?.user;
  const roles = ["super_admin", "admin", "student"];

  if (!roles.includes(user?.role)) {
    //!@note: Should occur when faculty access this route group
    redirect("/");
  }

  return <>{children}</>;
};

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Layout;

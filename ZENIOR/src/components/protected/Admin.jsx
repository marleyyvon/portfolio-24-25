import PropTypes from "prop-types";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

const Layout = async ({ children }) => {
  const session = await auth();
  const user = session?.user;
  const roles = ["admin", "super_admin"];

  if (!roles.includes(user?.role)) {
    //!@note: Unauthorized access by non-admin user
    redirect("/");
  }

  return <>{children}</>;
};

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Layout;

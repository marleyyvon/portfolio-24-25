import { auth } from "@/lib/auth";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Login, Logout } from "@/components/Navbar/AuthButtons";

const Navbar = async () => {
  const session = await auth();
  const role = session?.user?.role;

  const studentLinks = [
    { label: "Projects", href: "/proposals" },
    { label: "Faculty Directory", href: "/advisor-directory" },
    { label: "Archive", href: "/archive" },
  ];

  const facultyLinks = [
    { label: "Projects", href: "/proposals" },
    { label: "Requests", href: "/requests" },
    { label: "Archive", href: "/archive" },
  ];

  const adminLinks = [
    { label: "Dashboard", href: "/admin/dashboard" },
    { label: "Projects", href: "/proposals" },
    { label: "Faculty Directory", href: "/advisor-directory" },
    { label: "Archive", href: "/archive" },
  ];

  const superAdminLinks = [
    { label: "Dashboard", href: "/superadmin/dashboard" },
    { label: "Projects", href: "/proposals" },
    { label: "Faculty Directory", href: "/advisor-directory" },
    { label: "Archive", href: "/archive" },
  ];

  const navLinks =
    role === "student"
      ? studentLinks
      : role === "faculty"
        ? facultyLinks
        : role === "admin"
          ? adminLinks
          : role === "super_admin"
            ? superAdminLinks
            : [];

  return (
    <nav className="bg-[#b30738] text-white">
      <div className="max-w-screen-xl mx-auto px-4 py-4 flex flex-col md:flex-row items-center justify-between">
        {/* Logo Section */}
        <div className="flex flex-col items-center md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-2">
          <a href="/" className="flex items-center space-x-2">
            <Image
              src="/images/square-whitetree-nobg.png"
              alt="Zenior Logo"
              width={42}
              height={42}
            />
            <span className="text-3xl font-semibold text-center md:text-left">
              Zenior
            </span>
          </a>
        </div>

        {/* Navigation Links */}
        <div className="flex items-center space-x-4 mt-4 md:mt-0">
          {session ? (
            navLinks.map((link) => (
              <Button
                key={link.href}
                variant="ghost"
                asChild
                className="hover:text-[#9e1b32] transition-colors text-base font-medium"
              >
                <Link className="text-center sm:text-left" href={link.href}>
                  {link.label}
                </Link>
              </Button>
            ))
          ) : (
            <Login />
          )}

          {/* Profile or Sign-In Button */}
          {session && (
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Image
                  src={session.user.image || "/images/default-avatar.png"}
                  width={40}
                  height={40}
                  alt={session.user.name + " photo" || "default avatar"}
                  className="rounded-full transition duration-100 hover:opacity-80"
                />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-48">
                <DropdownMenuLabel>
                  <span className="block text-sm font-medium">
                    {session.user.name}
                  </span>
                  <span className="block text-sm text-gray-500 truncate">
                    {session.user.email}
                  </span>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild className="cursor-pointer">
                  <Link href="/my-profile">My Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="cursor-pointer">
                  <Link href="/my-team">
                    {role === "student" ? "My Team" : "My Projects"}
                  </Link>
                </DropdownMenuItem>
                <Logout />
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

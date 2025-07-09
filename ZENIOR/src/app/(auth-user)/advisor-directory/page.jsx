import { faculty } from "@/lib/server/actions";
import { SidebarProvider } from "@/components/ui/sidebar";
import { DirectorySidebar } from "@/components/sidebar/directory-sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Image from "next/image";

export default async function Directory() {
  const advisors = await faculty.get();

  if (!advisors || !advisors.length) {
    return <h1>No faculty found</h1>;
  }

  return (
    <div className="sm:px-8 m-9">
      <div className="flex flex-row">
        <div>
          <SidebarProvider className="pr-8">
            <DirectorySidebar />
          </SidebarProvider>
        </div>

        <div>
          <h1 className="pb-6 text-3xl font-black">
            Faculty Advisor Directory
          </h1>
          <TableContainer component={Paper}>
            <Table>
              <TableBody>
                {advisors.map((advisor) => (
                  <TableRow
                    key={advisor.id}
                    sx={{ "&:last-child td, &last-child th": { border: 0 } }}
                  >
                    <TableCell align="left" colSpan={4}>
                      <div className="flex flex-col p-4 rounded-lg space-y2">
                        <div className="flex items-center">
                          <Avatar className="w-12 h-12">
                            <AvatarImage
                              src={advisor.user.profilePictureUrl}
                              alt={`${advisor.firstName} ${advisor.lastName}`}
                            />
                            <AvatarFallback>
                              <Image
                                src={
                                  advisor.user.profilePictureUrl ||
                                  "/images/default-avatar.png"
                                }
                                width={50}
                                height={50}
                                alt={`${advisor.firstName} ${advisor.lastName}`}
                              />
                            </AvatarFallback>
                          </Avatar>
                          <h2 className="pl-2 text-xl font-bold underline text-[#b30738]">
                            <Link
                              href={`/advisor-directory/${advisor.id}`}
                              className="hover:text-[#b30738]"
                            >
                              {advisor.firstName} {advisor.lastName}
                            </Link>
                          </h2>
                        </div>
                        <br></br>
                        <p>
                          <span className="font-semibold">Department: </span>
                          {advisor.department}
                        </p>
                        <p>
                          <span className="font-semibold">
                            Special interests:{" "}
                          </span>
                          {advisor.skills.map((skill, idx) => (
                            <span key={skill.skillId}>
                              {skill.skill.name}
                              {idx !== advisor.skills.length - 1 && ", "}
                            </span>
                          ))}
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </div>
    </div>
  );
}

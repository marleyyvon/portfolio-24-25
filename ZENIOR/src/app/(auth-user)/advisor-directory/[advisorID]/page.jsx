import PropTypes from "prop-types";
import { faculty, user } from "@/lib/server/actions";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Image from "next/image";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { RequestAdvisorButtons } from "@/components/Requests";
import { getFacultyPreviousProjects } from "@/lib/server/scholar-commons";

export default async function AdvisorDetails({ params }) {
  const urlParams = await params;
  const advisorID = urlParams.advisorID;
  const advisors = await faculty.get({ id: advisorID });

  const advisor = advisors[0];
  const session = await auth();
  if (!session) {
    redirect("/");
  }

  const users = await user.get({ email: session.user.email });
  const currentUser = users[0];

  const projects = [];

  if (currentUser.student) {
    const projectsParticipates = currentUser.student.projects;
    projectsParticipates.map((current) => {
      const alreadyAdvising =
        current.project.advisorId === advisorID ||
        current.project.coAdvisorId === advisorID;
      !alreadyAdvising && projects.push(current.project);
    });
  }

  if (!advisor) {
    return <h1>No faculty with id {advisorID} was found</h1>;
  }
  const advisorName = "" + advisor.firstName + " " + advisor.lastName;
  const previousProjects = await getFacultyPreviousProjects(advisorName, 5);

  return (
    <div className="p-6 my-2 bg-gray-50 rounded-md border-2 border-gray-200 w-[640px]">
      <Link
        className="block mb-4 underline cursor-pointer text-[#b30738]"
        href="/advisor-directory"
      >
        Back to directory
      </Link>
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <Avatar className="w-20 h-20">
            <AvatarImage
              src={advisor.user.profilePictureUrl}
              alt={`${advisor.firstName} ${advisor.lastName}`}
            />
            <AvatarFallback>
              <Image
                src={
                  advisor.user.profilePictureUrl || "/images/default-avatar.png"
                }
                width={80}
                height={80}
                alt={`${advisor.firstName} ${advisor.lastName}`}
              />
            </AvatarFallback>
          </Avatar>
          <h1 className="ml-4 text-3xl font-bold">
            {advisor.firstName} {advisor.lastName}
          </h1>
        </div>
        {currentUser.student && (
          <RequestAdvisorButtons
            studentId={currentUser.student.id}
            projects={projects}
            facultyId={advisorID}
          />
        )}
        <p className="text-gray-600">{advisor.email}</p>
      </div>
      <h2 className="mt-4 text-xl font-semibold">Department</h2>
      <p className="text-gray-600 capitalize">{advisor.department}</p>
      <h2 className="mt-4 text-xl font-semibold">Bio</h2>
      <p className="p-4 mt-2 bg-white rounded-lg border">
        {advisor.bio || "No bio available"}
      </p>
      <h2 className="mt-4 text-xl font-semibold">Research Interests</h2>
      <p className="text-gray-600">{advisor.researchInterests}</p>
      <h2 className="mt-4 text-xl font-semibold">Expertise Areas</h2>
      <p className="text-gray-600">{advisor.expertiseAreas}</p>
      {advisor.advisedProjects.map((project) => (
        <>
          <h2 className="mt-4 text-xl font-semibold">
            Currently Advised Projects
          </h2>
          <div key={project.id} className="p-4 mt-2 bg-white rounded-lg border">
            <h3 className="font-bold">{project.title}</h3>
            <p>{project.description}</p>
          </div>
        </>
      ))}
      {advisor.coAdvisedProjects.map((project) => (
        <>
          <h2 className="mt-4 text-xl font-semibold">
            Currently Co-Advised Projects
          </h2>
          <div key={project.id} className="p-4 mt-2 bg-white rounded-lg border">
            <h3 className="font-bold">{project.title}</h3>
            <p>{project.description}</p>
          </div>
        </>
      ))}
      {advisor.skills.length > 0 && (
        <>
          <h2 className="mt-4 text-xl font-semibold">Skills</h2>
          <ul className="list-disc list-inside">
            {advisor.skills.map((skill) => (
              <li key={skill.skillId} className="text-gray-600">
                {skill.skill.name}
              </li>
            ))}
          </ul>
        </>
      )}
      <h2 className="mt-4 mb-4 text-xl font-semibold">
        Previously Advised Projects
      </h2>
      {previousProjects.length > 0 ? (
        previousProjects.map((project) => (
          <div className="flex flex-col" key={project.context_key}>
            <a
              href={`/archive/${project.context_key}`}
              className="text-xl font-bold underline truncate text-[#b30738]"
            >
              {project.title}
            </a>
            <div
              className="max-w-full mb-4 [&>*]:line-clamp-2 [&>*:not(:first-child)]:hidden"
              dangerouslySetInnerHTML={{
                __html: project.abstract,
              }}
            ></div>
          </div>
        ))
      ) : (
        <p>No previous Projects</p>
      )}
    </div>
  );
}

AdvisorDetails.propTypes = {
  params: PropTypes.object.isRequired,
};

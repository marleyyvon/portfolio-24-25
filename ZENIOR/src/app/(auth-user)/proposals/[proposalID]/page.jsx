import PropTypes from "prop-types";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { projects } from "@/lib/server/actions";
import { auth } from "@/lib/auth";
import ProjectJoinButton from "@/components/ProjectJoinButton";
import InterestedButton from "@/components/InterestedButton";

export default async function ProposalDetails({ params }) {
  const currParams = await params;
  const proposals = await projects.get({ id: currParams.proposalID });

  if (!proposals[0]) {
    return <div>Proposal was deleted or couldn&apos;t be found</div>;
  }

  const session = await auth();
  const user = session.user;

  const {
    title,
    description,
    members,
    advisor,
    coAdvisor,
    department,
    skills,
    GroupRequest,
  } = proposals[0];

  const joined = members.some(
    (member) => member.student.user.email === user.email
  );
  const requested = GroupRequest.some(
    (request) => request.user.email === user.email
  );
  const willDeleteOnLeave = members.length === 1 && !advisor && !coAdvisor;

  return (
    <div className="m-6 p-2">
      <main className="items-start bg-gray-100">
        <div className="p-6 bg-gray-100 rounded-lg shadow-md">
          <h1 className="text-2xl pb-2 font-bold">{title}</h1>
          <div className="py-2">
            <span className="font-semibold">Project Members:</span>{" "}
            {members.length === 0 ? "None yet" : ""}
            {members.map((member) => (
              <span key={member.student.id}>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger className="text-[#b30738] mr-1 underline decoration-solid">
                      {member.student.firstName} {member.student.lastName}
                    </TooltipTrigger>
                    <TooltipContent>
                      <div>
                        <ul>
                          <li className="font-bold">
                            {member.student.firstName} {member.student.lastName}
                          </li>
                          <li>
                            <span className="font-semibold">Major:</span>{" "}
                            {member.student.major}
                          </li>
                          <li>
                            <span className="font-semibold">Minor:</span>{" "}
                            {member.student.minor}
                          </li>
                          <li>
                            <span className="font-semibold">Email:</span>{" "}
                            <a
                              className="text-blue-500 underline"
                              href={`mailto:${member.student.user.email}`}
                            >
                              {member.student.user.email}
                            </a>
                          </li>
                        </ul>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </span>
            ))}
            <br />
            <span className="font-semibold">Advisor:</span>{" "}
            {!advisor && !coAdvisor ? "None yet" : ""}
            {advisor && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger className="text-[#b30738] underline decoration-solid">
                    {advisor.firstName} {advisor.lastName}
                  </TooltipTrigger>
                  <TooltipContent>
                    <div>
                      <ul>
                        <li className="font-bold">
                          {advisor.firstName} {advisor.lastName}
                        </li>
                        <li>
                          <span className="font-semibold">Department:</span>{" "}
                          {advisor.department}
                        </li>
                        <li>
                          <span className="font-semibold">Email:</span>{" "}
                          <a
                            className="text-blue-500 underline"
                            href={`mailto:${advisor.user.email}`}
                          >
                            {advisor.user.email}
                          </a>
                        </li>
                      </ul>
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
            {coAdvisor && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger className="text-[#b30738] underline decoration-solid">
                    {coAdvisor.firstName} {coAdvisor.lastName}
                  </TooltipTrigger>
                  <TooltipContent>
                    <div>
                      <ul>
                        <li className="font-bold">
                          {coAdvisor.firstName} {coAdvisor.lastName}
                        </li>
                        <li>
                          <span className="font-semibold">Email:</span>{" "}
                          <a
                            className="text-blue-500 underline"
                            href={`mailto:${coAdvisor.user.email}`}
                          >
                            {coAdvisor.user.email}
                          </a>
                        </li>
                      </ul>
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
            <br />
            <span className="font-semibold">Department:</span>{" "}
            {department ? department : "None yet"}
            <br />
          </div>
          <br />
          <h2 className="text-lg font-semibold">Description:</h2>
          <p>{description}</p>
          <br />
          <h3 className="font-semibold">Desired Skillsets</h3>
          <ul className="list-disc pl-8 pb-4">
            {skills.map((skill) => (
              <li key={skill.skill.id}>{skill.skill.name}</li>
            ))}
          </ul>
          <div className="flex items-center space-x-4 mt-4">
            <ProjectJoinButton
              member={joined}
              requested={requested}
              projectId={currParams.proposalID}
              willDeleteOnLeave={willDeleteOnLeave}
            />
            <InterestedButton projectId={currParams.proposalID} />
          </div>
        </div>
      </main>
    </div>
  );
}

ProposalDetails.propTypes = {
  params: PropTypes.shape({
    proposalID: PropTypes.string.isRequired,
  }).isRequired,
};

"use client";

import styles from "@/styles/StudentOverview.module.css";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import PropTypes from "prop-types";
import Link from "next/link";
import { toast } from "@/hooks/use-toast";
import { LeaveProjectButton, WithdrawRequestButton } from "./ProjectJoinButton";
import Image from "next/image";
import { actOnRequestToJoinProject } from "@/lib/server/project-requests";

// UI component for group request
const GroupRequest = ({ grouprequests, setGroupRequests }) => {
  return (
    <div className={styles.groupRequestContainer}>
      <h2 className="mb-4 text-xl font-semibold">Group Request</h2>
      {grouprequests.length > 0 ? (
        <>
          <p className="mb-4">You have asked to join the following group(s):</p>
          {grouprequests.map((request, index) => (
            <div
              key={index}
              className={
                request.status === "approved"
                  ? styles.groupBoxApproved
                  : request.status === "pending"
                    ? styles.groupBoxPending
                    : styles.groupBoxDenied
              }
            >
              <div className="flex justify-between items-center">
                <span>{request.name}</span>
                <span
                  className={`font-bold ${request.status === "approved"
                      ? "text-green-600"
                      : request.status === "pending"
                        ? "text-yellow-600"
                        : "text-red-600"
                    }`}
                >
                  {request.status === "approved"
                    ? "approved ✓"
                    : request.status === "pending"
                      ? "pending ⌛"
                      : "denied ❌ "}
                </span>
              </div>
              <div className="flex gap-4 justify-end mt-2">
                {request.status === "approved" && (
                  <>
                    <Button variant="custom" className="text-white">
                      Accept Request
                    </Button>
                    <Button
                      variant="custom"
                      className="text-white"
                      onClick={() => {
                        if (window.confirm("Are you sure you want to reject?"));
                      }}
                    >
                      Reject Request
                    </Button>
                  </>
                )}
                {request.status === "pending" && (
                  <WithdrawRequestButton
                    projectId={request.projectId}
                    callback={() =>
                      setGroupRequests((requests) =>
                        requests.filter((req) => req.id !== request.id),
                      )
                    }
                    noIcon={true}
                    className="hover:bg-red-700 bg-[#9e1b32]"
                  />
                )}
              </div>
            </div>
          ))}
        </>
      ) : (
        <p className="text-center bold text-black-700">
          You didn&apos;t ask to join any groups yet.
        </p>
      )}
    </div>
  );
};

GroupRequest.propTypes = {
  grouprequests: PropTypes.array.isRequired,
  setGroupRequests: PropTypes.func.isRequired,
};

// UI component for team member requests
const TeamRequest = ({ teamrequests, handleAccept, handleReject }) => {
  return (
    <div className={styles.teamRequestContainer}>
      <h2 className="mb-4 text-xl font-semibold">New Requests</h2>
      {teamrequests.length > 0 ? (
        teamrequests.map((request, index) => (
          <div
            key={index}
            className="block p-4 mb-3 bg-white border-gray-100 rounded-s"
          >
            <h3 className="mb-1 text-xl font-bold">{request.title}</h3>
            <p className="mb-3">{request.type} request</p>
            <div className="flex items-center">
              <Avatar className="w-10 h-10">
                <AvatarImage src={request.picture} alt={request.name} />
                <AvatarFallback>
                  <Image
                    src={request.picture || "/images/default-avatar.png"}
                    width={40}
                    height={40}
                    alt={request.name}
                  />
                </AvatarFallback>
              </Avatar>
              <div className={styles.requestInfo}>
                <h4 className="text-lg font-semibold text-red-700">
                  {request.name}
                </h4>
                <p className="text-black-600">
                  {request.type === "Advisor" ? "Department" : "Major"}:{" "}
                  {request.major}
                </p>
              </div>
              <div className="flex gap-2 justify-end ml-8">
                <button
                  onClick={() => handleAccept(request.id)}
                  className="flex justify-center items-center w-8 h-8 text-white bg-green-500 rounded"
                >
                  ✓
                </button>
                <button
                  onClick={() => handleReject(request.id)}
                  className="flex justify-center items-center w-8 h-8 text-white bg-red-500 rounded"
                >
                  ✗
                </button>
              </div>
            </div>
          </div>
        ))
      ) : (
        <p className="text-center text-black-500">
          No new requests to join any of your groups.
        </p>
      )}
    </div>
  );
};

TeamRequest.propTypes = {
  teamrequests: PropTypes.array.isRequired,
  handleAccept: PropTypes.func.isRequired,
  handleReject: PropTypes.func.isRequired,
};

// project dashboard fields
const Overview = ({ user, deleteProject, saveProject, skills }) => {
  const [projects, setProjects] = useState(() => {
    if (user.student) {
      return user.student.projects.map((project) => project.project);
    }

    if (user.faculty) {
      return [
        ...user.faculty.advisedProjects,
        ...user.faculty.coAdvisedProjects,
      ];
    }
  });

  const [teamRequests, setTeamRequests] = useState(() => {
    const requests = [];
    projects.map((project) => {
      project.GroupRequest.map((request) => {
        if (request.type === "join") {
          let name, major, type;
          if (request.user.Student) {
            name = `${request.user.Student.firstName} ${request.user.Student.lastName}`;
            major = request.user.Student.major;
            type = "Team member";
          } else if (request.user.Faculty) {
            name = `${request.user.Faculty.firstName} ${request.user.Faculty.lastName}`;
            major = request.user.Faculty.department;
            type = "Advisor";
          }
          requests.push({
            id: request.id,
            name,
            major,
            picture: request.user.profilePictureUrl,
            type,
            title: project.title,
          });
        }
      });
    });
    return requests;
  });

  const [groupRequests, setGroupRequests] = useState(() => {
    const requests = [];
    user.GroupRequest.map((request) => {
      requests.push({
        id: request.id,
        name: request.project.title,
        status: request.status,
      });
    });
    return requests;
  });

  const handleAccept = async (id) => {
    console.log("Accepted request ID:", id);
    toast({
      title: "Member Accepted",
      description:
        "You have succesfully added them to your team! They will appear after you refresh the page.",
      variant: "default",
    });
    await actOnRequestToJoinProject(id, "accept");
    setTeamRequests(teamRequests.filter((request) => request.id !== id));
  };

  const handleReject = async (id) => {
    console.log("Rejection request ID:", id);
    toast({
      title: "Member Rejected",
      description: "You have succesfully rejected them from your team.",
      variant: "default",
    });
    await actOnRequestToJoinProject(id, "reject");
    setTeamRequests(teamRequests.filter((request) => request.id !== id));
  };

  const handleInputChange = (e, project) => {
    const { name, value } = e.target;
    const updatedProjects = projects.map((proj) =>
      proj.id === project.id ? { ...proj, [name]: value } : proj,
    );
    setProjects(updatedProjects);
  };

  const handleCheckboxChange = (e, project) => {
    const { name, checked } = e.target;
    const updatedProjects = projects.map((proj) =>
      proj.id === project.id ? { ...proj, [name]: checked } : proj,
    );
    setProjects(updatedProjects);
  };

  return (
    <div className={styles.container}>
      <GroupRequest
        grouprequests={groupRequests}
        setGroupRequests={setGroupRequests}
      />
      <TeamRequest
        teamrequests={teamRequests}
        handleAccept={handleAccept}
        handleReject={handleReject}
      />
      <div className={styles.formCard}>
        <div className="p-6 text-center">
          {projects.length < 1 ? (
            <div>
              <h2 className="mb-4 text-2xl font-bold">
                You are not a project member yet.
              </h2>
              <div className="flex justify-around mb-8">
                <div className="flex flex-col items-center">
                  <p className="mb-2">Have a project idea?</p>
                  <Button variant="custom" asChild>
                    <Link href="/proposal-form">Post a Project Proposal</Link>
                  </Button>
                </div>
              </div>

              <div>
                <p className="mb-4">No project ideas yet? No problem!</p>
                <div className={styles.buttonGrid}>
                  <Button variant="custom" asChild>
                    <Link href="/proposals">
                      Explore Student Project Proposals
                    </Link>
                  </Button>
                  <Button variant="custom" asChild>
                    <Link href="/archive">Explore Past Projects</Link>
                  </Button>
                  <Button variant="custom" asChild>
                    <Link href="/advisor-directory">
                      Explore Faculty Advisors
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            projects.map((project) => {
              return (
                <div key={project.id}>
                  <h2 className="mb-4 text-3xl font-bold">Project Title:</h2>
                  <Input
                    name="title"
                    placeholder="Title Here"
                    value={project.title}
                    onChange={(e) => handleInputChange(e, project)}
                    className="p-2 mb-4 rounded border border-gray-300"
                  />

                  <h2 className="mb-4 text-3xl font-bold">
                    Project Description:
                  </h2>
                  <textarea
                    name="description"
                    placeholder="Enter project description here..."
                    value={project.description}
                    onChange={(e) => handleInputChange(e, project)}
                    className="p-2 mb-4 w-full h-32 rounded border border-gray-300"
                  />

                  <h2 className="mb-4 text-3xl font-bold">Team Members:</h2>
                  <div className="mb-4">
                    {project.members.length ? (
                      project.members.map((member) => (
                        <span key={member.student.id} className="mr-2 text-lg">
                          {member.student.firstName} {member.student.lastName}
                        </span>
                      ))
                    ) : (
                      <span className="text-lg">No team members yet</span>
                    )}
                  </div>

                  <div className="flex items-center mb-4">
                    <label className="mr-4 text-lg">
                      Do you want additional team member(s)?
                      <input
                        className="ml-2"
                        type="checkbox"
                        name="groupOpen"
                        defaultChecked={project.groupOpen === true}
                        onChange={(e) => handleCheckboxChange(e, project)}
                      />
                    </label>
                  </div>
                  <Skills
                    data={project.skills}
                    key={project.id}
                    setProjects={setProjects}
                    project={project}
                    skillList={skills}
                  />
                  <h2 className="mb-4 text-3xl font-bold">Advisor(s):</h2>
                  <div className="flex items-center mb-4">
                    <span className="flex items-center text-lg">
                      {project.advisor
                        ? `${project.advisor.firstName} ${project.advisor.lastName}`
                        : "No Advisor Yet"}
                      {project.coAdvisor && (
                        <span className="ml-4">
                          {project.coAdvisor.firstName}{" "}
                          {project.coAdvisor.lastName}
                        </span>
                      )}
                    </span>
                    {!project.advisor && (
                      <Button variant="custom" className="ml-4" asChild>
                        <Link href="/advisor-directory">Find an Advisor</Link>
                      </Button>
                    )}
                  </div>
                  <div className="flex justify-evenly pt-8 pb-4 mb-6 border-b-2 border-b-gray-800">
                    <Button
                      variant="custom"
                      onClick={(e) => {
                        e.preventDefault();
                        if (
                          confirm(
                            `Are you sure you want to delete ${project.title}?`,
                          )
                        ) {
                          deleteProject(project.id, window.location.pathname);
                          setProjects(
                            projects.filter((proj) => proj.id !== project.id),
                          );
                        }
                      }}
                    >
                      Delete Project
                    </Button>
                    <LeaveProjectButton
                      projectId={project.id}
                      willDeleteOnLeave={
                        project.members.length === 1 &&
                        !project.advisor &&
                        !project.coAdvisor
                      }
                      noIcon={true}
                      callback={() => {
                        setProjects(
                          projects.filter((proj) => proj.id !== project.id),
                        );
                      }}
                    />
                    <Button
                      onClick={(e) => {
                        e.preventDefault();
                        saveProject(
                          project.id,
                          project,
                          window.location.pathname,
                        );
                      }}
                      variant="custom"
                    >
                      Save Changes
                    </Button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

Overview.propTypes = {
  user: PropTypes.object.isRequired,
  deleteProject: PropTypes.func.isRequired,
  saveProject: PropTypes.func.isRequired,
  skills: PropTypes.array.isRequired,
};

export default Overview;

const Skills = ({ data = [], project, setProjects, skillList = [] }) => {
  const [skillInput, setSkillInput] = useState("");
  const [skills, setSkills] = useState(data.map((skill) => skill.skill));

  const handleSkillInputChange = (e) => {
    setSkillInput(e.target.value); // fix to update skillInput state
  };

  // add the skill to the list when "Enter" is pressed
  const handleSkillKeyDown = (e) => {
    if (e.key === "Enter" && skillInput.trim() !== "") {
      e.preventDefault(); // prevent form submission
      const newSkill = { id: skills.length, name: skillInput };
      setSkills([...skills, newSkill]);
      setSkillInput(""); // clear the input after adding
      const updatedProject = {
        ...project,
        skills: [...skills, newSkill],
      };
      setProjects((projects) =>
        projects.map((proj) =>
          proj.id === project.id ? updatedProject : proj,
        ),
      );
    }
  };

  // remove a skill with the 'x'
  const handleRemoveSkill = (skillToRemove) => {
    setSkills(skills.filter((skill) => skill !== skillToRemove));
    const updatedProject = {
      ...project,
      skills: skills.filter((skill) => skill !== skillToRemove),
    };
    setProjects((projects) =>
      projects.map((proj) => (proj.id === project.id ? updatedProject : proj)),
    );
  };

  return (
    <div className="mb-4">
      <label className="block text-lg">
        What skill sets should the additional team member(s) have?
      </label>
      <Input
        name="skills"
        placeholder="Type desired skills for the project and press Enter"
        value={skillInput}
        onChange={handleSkillInputChange}
        onKeyDown={handleSkillKeyDown}
        className="p-2 mb-2 w-full rounded border border-gray-300"
        list="skills"
      />
      <datalist id="skills">
        {skillList.map((skill) => (
          <option key={skill.id} value={skill.name} />
        ))}
      </datalist>

      <div className="flex flex-wrap gap-2">
        {skills.map((skill) => (
          <div
            key={skill.id}
            className="flex items-center p-1 text-white bg-red-500 rounded"
          >
            {skill.name}
            <span
              onClick={() => handleRemoveSkill(skill)}
              className="ml-2 cursor-pointer"
            >
              x
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

Skills.propTypes = {
  data: PropTypes.array.isRequired,
  project: PropTypes.object.isRequired,
  setProjects: PropTypes.func.isRequired,
  skillList: PropTypes.array.isRequired,
};

"use client";

import { useState } from "react";
import PropTypes from "prop-types";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";
import {
  requestToAdvise,
  acceptRequest,
  rejectRequest,
} from "@/lib/server/advisor-requests";

const AdvisorRequests = ({ requests }) => {
  const [projects, setProjects] = useState(() =>
    requests.map((request) => request.project),
  );
  const [loading, setLoading] = useState(false);

  const [activeTabs, setActiveTabs] = useState(
    projects.map(() => "description"),
  );

  const handleTabClick = (index, tab) => {
    const updatedTabs = [...activeTabs];
    updatedTabs[index] = tab;
    setActiveTabs(updatedTabs);
  };

  const handleRequest = async (projectId, action) => {
    setLoading(action);
    const requestId = requests.find(
      (request) => request.projectId === projectId,
    ).id;

    try {
      if (action === "accept") {
        await acceptRequest(requestId);
      } else {
        await rejectRequest(requestId);
      }
      setProjects((prevProjects) =>
        prevProjects.filter((project) => project.id !== projectId),
      );
    } catch (error) {
      if (
        [
          "Request not found",
          "Project not found",
          "Project already has an advisor and co-advisor",
        ].includes(error.message)
      ) {
        alert(error.message);
      }
    }
    setLoading(false);
  };

  return (
    <section className="px-8 m-9">
      {projects.length > 0 ? (
        <>
          <h1 className="pb-2 text-2xl font-bold">
            The following Senior Design teams have requested you as a faculty
            advisor.
          </h1>
          <h2 className="pb-2 mb-6 text-xl font-bold">
            Read the project description, then click the Manage tab to accept or
            deny the request.
          </h2>
        </>
      ) : (
        <h1 className="pb-2 text-2xl font-bold">
          No Senior Design teams have requested you as a faculty advisor yet.
        </h1>
      )}
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        {projects.map((project, index) => (
          <div
            key={project.id}
            className="w-full rounded-lg border border-gray-200 shadow bg-whitie"
          >
            <ul className="flex flex-wrap text-sm font-medium text-center text-gray-500 bg-gray-50 rounded-t-lg border-b border-gray-200">
              <li className="me-2">
                <button
                  id={`description-tab-${project.id}`}
                  type="button"
                  role="tab"
                  aria-controls={`description-${project.id}`}
                  aria-selected={activeTabs[index] === "description"}
                  className={`inline-block p-4 hover:bg-gray-100 ${activeTabs[index] === "description" ? "text-gray-900 border-b-2 border-gray-900" : ""}`}
                  onClick={() => handleTabClick(index, "description")}
                >
                  Project description
                </button>
              </li>
              <li className="me-2">
                <button
                  id={`manage-tab-${project.id}`}
                  type="button"
                  role="tab"
                  aria-controls={`manage-${project.id}`}
                  aria-selected={activeTabs[index] === "manage"}
                  className={
                    'inline-block p-4 hover:bg-gray-100 ${activeTabs[index] === "manage" ? "text-gray-900 border-b-2 border-gray-900" : ""}'
                  }
                  onClick={() => handleTabClick(index, "manage")}
                >
                  Manage
                </button>
              </li>
            </ul>

            {/* Tab Content */}
            <div>
              {activeTabs[index] === "description" && (
                <div
                  className="p-4 bg-white rounded-lg md:p-8"
                  id={`description-${project.id}`}
                  role="tabpanel"
                >
                  <h2 className="mb-3 text-2xl font-bold tracking-tight text-gray-900">
                    {project.title}
                  </h2>
                  <p className="mb-3 text-gray-500">{project.description}</p>
                </div>
              )}
              {activeTabs[index] === "manage" && (
                <div
                  className="p-4 bg-white rounded-lg md:p-8"
                  id={`manage-${project.id}`}
                  role="tabpanel"
                >
                  <h3 className="font-bold">
                    {" "}
                    Manage Project: <br></br>
                    {project.title}
                  </h3>
                  <br></br>
                  <h3>Project Members:</h3>
                  <p>
                    {project.members.map((current, idx) => {
                      return `${current.student.firstName} ${current.student.lastName}${idx === project.members.length - 1 ? "" : ", "}`;
                    })}
                  </p>
                  <button
                    onClick={() => handleRequest(project.id, "accept")}
                    className="py-2 px-4 m-4 text-white cursor-pointer bg-[#07B31B]"
                  >
                    {loading === "accept"
                      ? "Accepting request..."
                      : "Advise this Project"}
                  </button>
                  <button
                    onClick={() => handleRequest(project.id, "reject")}
                    className="py-2 px-4 m-4 text-white cursor-pointer bg-[#b30738]"
                  >
                    {loading === "reject"
                      ? "Rejecting request..."
                      : "Do NOT Advise this Project"}
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

AdvisorRequests.propTypes = {
  requests: PropTypes.array,
};

const RequestAdvisorButtons = ({ studentId, projects, facultyId }) => {
  const [loading, setLoading] = useState(false);
  const handleClick = async (projectId) => {
    setLoading(true);
    try {
      await requestToAdvise(studentId, projectId, facultyId);
    } catch (error) {
      if (
        error.message === "Faculty already requested to advise this project"
      ) {
        alert("Faculty already requested to advise this project");
      }
    }
    setLoading(false);
  };
  return (
    <DropdownMenu className="items-end">
      <DropdownMenuTrigger asChild>
        <Button variant="custom">
          {loading ? "Sending request..." : "Request as Advisor"}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>
          {projects.length > 0
            ? "Which project proposal would you like to pitch to this faculty member?"
            : "This faculty member is already advising all of your projects"}
        </DropdownMenuLabel>
        {projects.length > 0 && <DropdownMenuSeparator />}
        <DropdownMenuRadioGroup>
          {projects.map((project) => (
            <DropdownMenuRadioItem
              className="max-w-full cursor-pointer"
              key={project.id}
              onClick={() => handleClick(project.id)}
            >
              {project.title}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

RequestAdvisorButtons.propTypes = {
  studentId: PropTypes.string,
  projects: PropTypes.array,
  facultyId: PropTypes.string,
};

export { AdvisorRequests, RequestAdvisorButtons };

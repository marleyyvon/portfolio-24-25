"use client";

import { useState } from "react";
import PropTypes from "prop-types";
import { Button } from "@/components/ui/button";
import { UserPlus, UserMinus } from "lucide-react";
import {
  requestToJoinProject,
  withdrawRequestToJoinProject,
  leaveProject,
} from "@/lib/server/project-requests";
import { cn } from "@/lib/utils";

const useLoading = () => {
  const [loading, setLoading] = useState(false);
  const toggleLoading = () => setLoading((prev) => !prev);
  return { loading, toggleLoading };
};

const handleClick = async (
  projectId,
  action,
  loading,
  toggleLoading,
  callback,
) => {
  if (loading) return;
  toggleLoading();
  try {
    await action(projectId);
    if (callback) {
      callback();
    }
  } catch (error) {
    error.message === "This project already has an advisor and a co-advisor." &&
      alert(error.message);
    toggleLoading();
  }
};

const ProjectJoinButton = ({
  member,
  requested,
  projectId,
  willDeleteOnLeave,
}) => {
  if (member) {
    return (
      <LeaveProjectButton
        projectId={projectId}
        willDeleteOnLeave={willDeleteOnLeave}
      />
    );
  }
  if (requested) {
    return <WithdrawRequestButton projectId={projectId} />;
  }
  return <RequestToJoinButton projectId={projectId} />;
};

ProjectJoinButton.propTypes = {
  member: PropTypes.bool,
  requested: PropTypes.bool,
  projectId: PropTypes.string,
  willDeleteOnLeave: PropTypes.bool,
};

export const RequestToJoinButton = ({ projectId }) => {
  const { loading, toggleLoading } = useLoading();
  return (
    <Button
      variant="custom"
      className="object-right"
      onClick={() =>
        handleClick(projectId, requestToJoinProject, loading, toggleLoading)
      }
    >
      <span className="pr-2">{loading ? "Loading..." : "Request to Join"}</span>{" "}
      <UserPlus size="20" />
    </Button>
  );
};

RequestToJoinButton.propTypes = {
  projectId: PropTypes.string,
};

export const WithdrawRequestButton = ({
  projectId,
  callback,
  noIcon,
  className,
}) => {
  const { loading, toggleLoading } = useLoading();
  return (
    <Button
      variant="custom"
      className={cn(
        "object-right bg-orange-400 hover:bg-orange-500",
        className,
      )}
      onClick={() =>
        handleClick(
          projectId,
          withdrawRequestToJoinProject,
          loading,
          toggleLoading,
          callback,
        )
      }
    >
      <span>{loading ? "Loading..." : "Withdraw Request"}</span>{" "}
      {!noIcon && <UserMinus size="20" className="ml-2" />}
    </Button>
  );
};

WithdrawRequestButton.propTypes = {
  projectId: PropTypes.string,
  callback: PropTypes.func,
  noIcon: PropTypes.bool,
  className: PropTypes.string,
};

export const LeaveProjectButton = ({
  projectId,
  willDeleteOnLeave,
  noIcon,
  callback,
}) => {
  const { loading, toggleLoading } = useLoading();
  return (
    <Button
      variant="custom"
      className="object-right"
      onClick={() => {
        let text = "Are you sure you want to leave?";
        if (willDeleteOnLeave) {
          text += " This project will be deleted if you leave.";
        } else {
          text += " To join again you will need to submit a request.";
        }
        if (!loading && !confirm(text)) {
          return;
        }
        handleClick(projectId, leaveProject, loading, toggleLoading, callback);
      }}
    >
      <span>{loading ? "Loading..." : "Leave Project"}</span>
      {!noIcon && <UserMinus size="20" className="ml-2" />}
    </Button>
  );
};

LeaveProjectButton.propTypes = {
  projectId: PropTypes.string,
  willDeleteOnLeave: PropTypes.bool,
  noIcon: PropTypes.bool,
  callback: PropTypes.func,
};

export default ProjectJoinButton;

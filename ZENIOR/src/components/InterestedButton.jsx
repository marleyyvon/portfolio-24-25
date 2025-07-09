"use client";

import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import { useState, useEffect } from "react";
import PropTypes from "prop-types";

export default function InterestedButton({ projectId }) {
  const [isInterested, setIsInterested] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInterestState = async () => {
      try {
        if (!projectId) {
          throw new Error("No projectId provided to InterestedButton");
        }

        console.log("Fetching interest state for projectId:", projectId);

        const response = await fetch(
          `/api/interested-in?projectId=${projectId}`,
        );
        if (!response.ok) {
          const errorDetails = await response.text();
          throw new Error(`API error: ${response.status} ${errorDetails}`);
        }

        const data = await response.json();
        console.log("Interest state fetched:", data);
        setIsInterested(data.interested);
      } catch (error) {
        console.error("Error in fetchInterestState:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchInterestState();
  }, [projectId]);

  const handleClick = async () => {
    setLoading(true);
    try {
      if (!projectId) {
        throw new Error(
          "No projectId provided to handleClick in InterestedButton",
        );
      }

      const response = await fetch(`/api/interested-in`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId, isInterested: !isInterested }),
      });

      if (!response.ok) {
        const errorDetails = await response.text();
        throw new Error(`API error: ${response.status} ${errorDetails}`);
      }

      console.log("Toggled interest state successfully.");
      setIsInterested((prev) => !prev); // Optimistic update
    } catch (error) {
      console.error("Error toggling interest state:", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      variant="custom"
      onClick={handleClick}
      disabled={loading}
      className={`flex px-2 min-w-fit ml-2 items-center bg-[#b30738] text-white hover:bg-[#9e1b32] transition-colors ${loading ? "opacity-50 cursor-not-allowed" : ""
        }`}
    >
      <Star
        className={
          isInterested ? "text-yellow-500 fill-yellow-500" : "text-yellow-500"
        }
        size={20}
      />
    </Button>
  );
}

InterestedButton.propTypes = {
  projectId: PropTypes.string.isRequired,
};

"use client";

import React from "react";
import PropTypes from "prop-types";
import { signIn, signOut, useSession } from "next-auth/react";
import { useToast } from "@/hooks/use-toast";
import { FcGoogle } from "react-icons/fc";

const AuthButton = ({ className }) => {
  const { data: session } = useSession();
  const { toast } = useToast();
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);

  const handleSignIn = async () => {
    setLoading(true);
    setError(null);
    try {
      await signIn("google", { redirectTo: "/success" });
      toast({ title: "Signing in", description: "Redirecting to sign in" });
    } catch (err) {
      setError("There was an issue signing in. Please try again.");
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    setLoading(true);
    try {
      await signOut();
      toast({ title: "Signed out", description: "You have been signed out" });
    } catch (err) {
      setError("Error signing out. Please try again.");
      setLoading(false);
    }
  };

  return session ? (
    <button
      onClick={handleSignOut}
      className={`flex items-center justify-center w-full p-3 bg-white text-black font-bold rounded-md transition-colors hover:bg-secondaryRed hover:text-white ${className}`}
      disabled={loading}
    >
      {loading ? "Loading..." : "Sign out"}
    </button>
  ) : (
    <>
      {error && <p className="text-danger font-bold text-sm text-center mb-4">{error}</p>}
      <button
        onClick={handleSignIn}
        className={`flex items-center justify-center w-full p-3 bg-white text-black font-bold rounded-md transition-colors hover:bg-secondaryRed hover:text-white ${className}`}
        disabled={loading}
      >
        {loading ? (
          "Loading..."
        ) : (
          <>
            <FcGoogle className="mr-2" /> Sign in with Google
          </>
        )}
      </button>
    </>
  );
};

AuthButton.propTypes = {
  className: PropTypes.string,
};

export default AuthButton;
 
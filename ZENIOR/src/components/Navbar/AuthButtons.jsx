"use client";

import { signIn, signOut } from "next-auth/react";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export const Login = () => {
  const { toast } = useToast();

  const handleSignIn = async () => {
    try {
      toast({
        title: "Signing in",
        description: "Redirecting to sign in...",
      });
      await signIn("google", { redirectTo: "/success" });
    } catch (err) {
      toast({
        title: "Error signing in",
        description: "Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Button
      variant="ghost"
      className="hover:text-[#9e1b32] transition-colors text-base font-medium"
      onClick={handleSignIn}
    >
      Login
    </Button>
  );
};

export const Logout = () => {
  const { toast } = useToast();

  const handleSignOut = async () => {
    try {
      toast({
        title: "Signing out",
        description: "Redirecting to goodbye page...",
      });
      await signOut({ redirectTo: "/goodbye" });
    } catch (err) {
      toast({
        title: "Error signing out",
        description: "Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <DropdownMenuItem
      onClick={handleSignOut}
      className="cursor-pointer"
    >
      Sign out
    </DropdownMenuItem>
  );
};

import LoginCard from "@/components/LoginCard";
import { LogOut } from "lucide-react";

import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";

export default function Goodbye() {
  return (
    <div className="flex flex-col items-center justify-center bg-white-100 text-gray-800 p-6">
      <div className="w-full max-w-lg">
        <Alert>
          <LogOut className="h-6 w-6" style={{ color: "#9e1b32" }} />
          <div>
            <AlertTitle className="text-xl font-bold">Alert!</AlertTitle>
            <AlertDescription className="text-lg mt-1">
              You are not logged in.
            </AlertDescription>
          </div>
        </Alert>
      </div>
      <div className="mt-8 w-full max-w-md">
        <LoginCard />
      </div>
    </div>
  );
}

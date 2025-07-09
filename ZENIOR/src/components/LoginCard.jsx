import PropTypes from "prop-types";
import Image from "next/image";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import AuthButton from "@/components/AuthButton";

const LoginCard = ({ user }) => {
  return (
    <Card className="w-96 bg-[#b30738] shadow-md rounded-lg p-4 text-white transform transition-transform duration-200 hover:scale-105 hover:shadow-lg">
      <CardHeader>
        <CardTitle className="text-center text-xl font-bold mb-3">
          Welcome to Zenior
        </CardTitle>
        <div className="flex justify-center mb-3">
          <Image
            src="/images/SCUseal.png"
            alt="Santa Clara University Seal"
            width={100}
            height={100}
            className="object-contain"
          />
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {user ? (
          <p className="text-center text-base font-medium">
            You&apos;re a <strong>{user.role}</strong> signed in as{" "}
            <strong>{user.email}</strong>
          </p>
        ) : (
          <p className="text-center text-base font-medium">
            You&apos;re not signed in.
          </p>
        )}
      </CardContent>
      <CardFooter className="flex justify-center mt-3">
        <AuthButton
          className="w-3/4 py-2 hover:bg-[#93052c] transition-colors"
          aria-label="Sign in or sign out"
        />
      </CardFooter>
    </Card>
  );
};

LoginCard.propTypes = {
  user: PropTypes.object,
};

export default LoginCard;

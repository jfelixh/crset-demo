import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Link } from "@tanstack/react-router";
import ConfettiExplosion from "react-confetti-explosion";

const LoanApplicationConfirmation = () => {
  return (
    <div className="flex justify-center items-center py-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl">Loan Application Submitted</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            Your loan application has been successfully submitted. We will
            review your application and get back to you shortly.
          </p>
        </CardContent>
        <CardFooter className="justify-end">
          <Button asChild>
            <Link to="/" className="[&.active]:font-bold">
              Go back to Home
            </Link>
          </Button>
        </CardFooter>
      </Card>
      <ConfettiExplosion
        {...{
          force: 0.8,
          duration: 3000,
          particleCount: 250,
          width: 1600,
        }}
      />
    </div>
  );
};

export default LoanApplicationConfirmation;

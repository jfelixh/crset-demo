import { cn } from "@/lib/utils";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const Header = ({
  pathname,
  isUnpublished,
}: {
  pathname: string;
  isUnpublished: boolean;
}) => {
  const router = useRouter();

  return (
    <header className="bg-blue-900 text-white py-2 px-16">
      <nav className="flex justify-between items-center">
        <div className="flex gap-4 items-center">
          <Button
            onClick={() => router.push("/")}
            variant="ghost"
            className={cn(
              "text-white hover:text-white hover:bg-blue-800",
              pathname === "/" && "bg-blue-950"
            )}
          >
            Home
          </Button>

          <Button
            onClick={() => router.push("/credentialIssuance")}
            variant="ghost"
            className={cn(
              "text-white hover:text-white hover:bg-blue-800",
              pathname === "/credentialIssuance" && "bg-blue-950"
            )}
          >
            Verifiable Credential Issuance
          </Button>

          <Button
            onClick={() => router.push("/employees")}
            variant="ghost"
            className={cn(
              "text-white hover:text-white hover:bg-blue-800",
              pathname === "/employees" && "bg-blue-950"
            )}
          >
            <div className={`flex items-center ${isUnpublished ? "animate-pulse" : ""}`}>
              {isUnpublished && <AlertCircle className="h-5 w-5 mr-2" />}
              Employee List
            </div>
          </Button>

          <Button
            onClick={() => router.push("/dashboard")}
            variant="ghost"
            className={cn(
              "text-white hover:text-white hover:bg-blue-800",
              pathname === "/dashboard" && "bg-blue-950"
            )}
          >
            Dashboard
          </Button>
        </div>
      </nav>
    </header>
  );
};

export default Header;

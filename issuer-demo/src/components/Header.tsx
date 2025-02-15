import Link from "next/link";
import { cn } from "@/lib/utils";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const Header = ({
  showLinks,
  pathname,
  isUnpublished,
}: {
  showLinks: boolean;
  pathname: string;
  isUnpublished: boolean;
}) => {
  const router = useRouter();
  return (
    <>
      <header className="bg-blue-900 text-white py-2 px-16">
        <nav className="flex justify-between items-center">
          <div className="flex gap-4 items-center">
            <Button
              onClick={() => {
                router.push("/");
              }}
              variant="ghost"
              className={cn(
                "bg-blue-90 text-white",
                pathname && pathname === "/",
              )}
            >
              Home
            </Button>
            {showLinks && (
              <Button
                onClick={() => {
                  router.push("/credentialIssuance");
                }}
                variant="ghost"
                className={cn(
                  "bg-blue-90 text-white",
                  pathname && pathname === "/credentialIssuance",
                )}
              >
                Verifiable Credential Issuance
              </Button>
            )}
            {showLinks && (
              <Button
                variant="ghost"
                onClick={() => {
                  router.push("/employees");
                }}
                className={cn(
                  "bg-blue-90 text-white",
                  pathname && pathname === "/employees",
                )}
              >
                <div
                  className={`flex flex-row items-center ${isUnpublished ? "animate-pulse" : ""}`}
                >
                  {isUnpublished && (
                    <AlertCircle className="h-5 w-5 text-white" />
                  )}
                  <span className="ml-2">Employee List</span>
                </div>
              </Button>
            )}
            {showLinks && (
              <Link href="/dashboard" passHref>
                <Button
                  variant="ghost"
                  className={cn(
                    "text-white",
                    pathname === "/dashboard" && "underline",
                  )}
                >
                  Dashboard
                </Button>
              </Link>
            )}
          </div>
        </nav>
      </header>
    </>
  );
};
export default Header;

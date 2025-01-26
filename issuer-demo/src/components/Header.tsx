import Link from "next/link";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation";

const Header = ({
  showLinks,
  pathname,
  logout,
  isUnpublished,
}: {
  showLinks: boolean;
  pathname: string;
  logout: () => void;
  isUnpublished: boolean;
}) => {
  const router=useRouter();
  return (
    <>
      <header className="bg-blue-900 text-white py-2 px-16">
        <nav className="flex justify-between items-center">
          <div className="flex gap-4 items-center">
            <Link href="/">
              <Image
                src="/images/logoVC.png"
                alt="Company Logo"
                width={55}
                height={22}
              />
            </Link>

            {showLinks && (
              <Button
                  onClick={() => {
                    router.push("/credentialIssuance");
                  }}
                  variant="ghost"

                className={cn(
                  "bg-blue-90 text-white",
                  pathname && pathname === "/credentialIssuance"
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
                  pathname && pathname === "/employees"
                )}
              >
                <div className="flex flexDirection-row items-center">
                  <div className={isUnpublished ? "animate-pulse" : ""}>
                    Employee List
                  </div>
                </div>
              </Button>
            )}
            {showLinks && (
                <Link href="/dashboards" passHref>
                  <Button
                      variant="ghost"
                      className={cn(
                          "text-white",
                          pathname === "/dashboards" && "underline"
                      )}
                  >
                    Dashboards
                  </Button>
                </Link>
            )}
          </div>
          {showLinks && (
            <div className="mr-4">
              <Link
                href="/"
                onClick={logout}
                className="text-white flex items-center space-x-2 group"
              >
                <LogOut className="w-6 h-6" />
                <span className="opacity-0 group-hover:opacity-90">
                  Log Out
                </span>
              </Link>
            </div>
          )}
        </nav>
      </header>
    </>
  );
};
export default Header;

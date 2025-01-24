import Link from "next/link";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { LogOut } from "lucide-react";

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
  return (
    <>
      <header className="bg-black text-white py-2 px-16">
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
              <Link
                href="/credentialIssuance"
                className={cn(
                  "text-white",
                  pathname && pathname === "/credentialIssuance" && "underline"
                )}
              >
                Verifiable Credential Issuance
              </Link>
            )}
            {showLinks && (
              <Link
                href="/employees"
                className={cn(
                  "text-white",
                  pathname && pathname === "/employees" && "underline"
                )}
              >
                <div className="flex flexDirection-row items-center">
                  <div className={isUnpublished ? "animate-pulse" : ""}>
                    Employee List
                  </div>
                </div>
              </Link>
            )}
            {showLinks && (
              <Link
                href="/dashboards"
                className={cn(
                  "text-white",
                  pathname && pathname === "/dashboards" && "underline"
                )}
              >
                Dashboards
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

import Link from "next/link";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { LogOut } from "lucide-react";

const Header = ({
  showLinks,
  pathname,
}: {
  showLinks: boolean;
  pathname: string;
}) => {
  return (
    <>
      <header className="bg-black text-white p-4">
        <nav className="flex justify-between items-center">
          <div className="flex gap-4 items-center">
            <Image
              src="/images/logoVC.png"
              alt="Company Logo"
              width={75}
              height={30}
            />
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
                Employee List
              </Link>
            )}
          </div>
          {showLinks && (
            <div className="mr-4">
              <Link
                href="/"
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

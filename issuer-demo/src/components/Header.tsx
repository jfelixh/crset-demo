import Link from "next/link";
import { cn } from "@/lib/utils";
import Image from "next/image";

const Header = ({
  showLinks,
  pathname,
}: {
  showLinks: boolean;
  pathname: string;
}) => {
  return (
    <>
      {showLinks && (
        <header className="bg-white text-black p-4 border-b">
          <nav className="flex justify-between items-center">
            <div className="flex gap-4 items-center">
              <Image
                src="/images/bmw-logo-2020.jpg"
                alt="Company Logo"
                width={100}
                height={50}
              />
              <Link
                href="/credentialIssuance"
                className={cn(
                  "text-black",
                  pathname && pathname === "/credentialIssuance" && "underline"
                )}
              >
                Verifiable Credential Issuance
              </Link>
              <Link
                href="/employees"
                className={cn(
                  "text-black",
                  pathname && pathname === "/employees" && "underline"
                )}
              >
                Employee List
              </Link>
            </div>
            <div className="mr-4">
              <Link href="/logIn" className={cn("text-black")}>
                Log Out
              </Link>
            </div>
          </nav>
        </header>
      )}
    </>
  );
};
export default Header;

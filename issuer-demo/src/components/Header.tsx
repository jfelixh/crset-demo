import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";


const Header = ({ showLinks }: { showLinks: boolean }) => (
    <header className="bg-gray-800 text-white p-4">
      <nav className="flex gap-4">
        {showLinks && (
            <>
              <Link
                  href="/credentialIssuance"
                  className={cn(buttonVariants({ variant: "ghost" }), "text-white")}
              >
                Verifiable Credential Issuance
              </Link>
              <Link
                  href="/employees"
                  className={cn(buttonVariants({ variant: "ghost" }), "text-white")}
              >
                Employee List
              </Link>
            </>
        )}
          {!showLinks && (
              <>
                  <Link
                      href="/logIn"
                      className={cn(buttonVariants({ variant: "ghost" }), "text-white")}
                  >
                      Log In
                  </Link>
              </>
          )}
      </nav>
    </header>
);

export default Header;

import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { Logo } from "./navbar";

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto py-8 px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-6 md:mb-0">
            <Logo />
          </div>
          <nav className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 mb-6 md:mb-0">
            <Button variant="ghost" asChild className="text-primary-foreground">
              <Link to="/">Home</Link>
            </Button>
            <Button variant="ghost" asChild className="text-primary-foreground">
              <Link to="/dashboard">Dashboard</Link>
            </Button>
            <Button variant="ghost" asChild className="text-primary-foreground">
              <Link href="/apply-for-loan">Apply for Loan</Link>
            </Button>
          </nav>
        </div>
        <div className="mt-8 text-center text-sm">
          <p>
            &copy; {new Date().getFullYear()} M26 Bank. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

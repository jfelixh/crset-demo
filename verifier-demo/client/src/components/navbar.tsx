import { useAuth } from "@/hooks/useAuth";
import { Link } from "@tanstack/react-router";
import { LoginModal } from "./modals/loginModal";
import { LogoutModal } from "./modals/logoutModal";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

export const NavBar = () => {
  const { isAuthenticated, givenName, familyName } = useAuth();

  const getInitials = (givenName?: string, familyName?: string) => {
    return `${givenName?.[0] ?? ""}${familyName?.[0] ?? ""}`;
  };

  return (
    <nav className="flex justify-between py-4 border-b-[0.5px]">
      <div className="grid grid-cols-[1fr_10fr_1fr] w-full">
        <div className="col-start-2 flex justify-between">
          <div className="flex space-x-4">
            <Link to="/">
              <Logo />
            </Link>
            <div>
              {isAuthenticated && (
                <Button asChild variant="ghost">
                  <Link to="/dashboard" className="[&.active]:font-bold">
                    Dashboard
                  </Link>
                </Button>
              )}
            </div>
          </div>
          <div className="flex space-x-4">
            {!isAuthenticated ? (
              <LoginModal />
            ) : (
              <>
                <LogoutModal />
                <Avatar>
                  <AvatarImage />
                  <AvatarFallback>
                    {getInitials(givenName, familyName)}
                  </AvatarFallback>
                </Avatar>
              </>
            )}

            {!isAuthenticated && (
              <>
                <Button asChild>
                  <Link to="/apply-for-loan">Apply for loan now!</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export const Logo = () => (
  <h1 className="font-medium text-2xl hover:scale-105 duration-300 transition-all">
    <span className="underline">
      <span className="overline">M</span>
    </span>
    26
  </h1>
);

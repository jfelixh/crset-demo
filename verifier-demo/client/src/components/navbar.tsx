import { useAuth } from "@/hooks/useAuth";
import { Link } from "@tanstack/react-router";
import { LoginModal } from "./modals/loginModal";
import { LogoutModal } from "./modals/logoutModal";
import { Button } from "./ui/button";

export const NavBar = () => {
  const { isAuthenticated } = useAuth();

  return (
    <nav className="flex justify-between py-4 border-b-[0.5px]">
      <div className="grid grid-cols-[1fr_10fr_1fr] w-full">
        <div className="col-start-2 flex justify-between">
          <div className="flex space-x-4">
            <Link to="/">
              <Logo />
            </Link>
            <div>
              <Button asChild variant="ghost">
                <Link to="/" className="[&.active]:font-bold">
                  Home
                </Link>
              </Button>
              <Button asChild variant="ghost">
                <Link to="/user-homepage" className="[&.active]:font-bold">
                  Dashboard
                </Link>
              </Button>

              <Button asChild variant="ghost">
                <Link to="/about" className="[&.active]:font-bold">
                  About
                </Link>
              </Button>
            </div>
          </div>
          <div className="space-x-4">
            {!isAuthenticated ? <LoginModal /> : <LogoutModal />}

            <Button asChild>
              <Link to="/apply-for-loan">Apply for loan now!</Link>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

const Logo = () => (
  <h1 className="font-medium text-2xl hover:scale-105 duration-300 transition-all">
    <span className="underline">
      <span className="overline">M</span>
    </span>
    26
  </h1>
);

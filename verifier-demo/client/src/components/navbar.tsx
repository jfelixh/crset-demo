import { Link } from "@tanstack/react-router";

export const NavBar = () => {
  return (
    <nav className="flex justify-between py-4 border-b-[0.5px]">
      <div className="grid grid-cols-[1fr_10fr_1fr] w-full">
        <div className="col-start-2 flex justify-between">
          <div className="flex space-x-4">
            <Link to="/">
              <Logo />
            </Link>
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

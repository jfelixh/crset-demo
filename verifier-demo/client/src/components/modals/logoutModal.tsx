import { AuthContext } from "@/context/authContext";
import { AuthContextType } from "@/context/authContextProvider";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useState, useContext } from "react";
import { Button } from "../ui/button";
import { DialogHeader, DialogFooter } from "../ui/dialog";

export const LogoutModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { onLogout } = useContext(AuthContext) as AuthContextType;

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline">Log out</Button>
      </DialogTrigger>
      <DialogContent className="!max-w-screen-md">
        <DialogHeader>
          <DialogTitle>You will be logged out.</DialogTitle>
          <DialogDescription>
            Are you sure you want to log out?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="destructive" onClick={onLogout}>
            {" "}
            Confirm log out
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

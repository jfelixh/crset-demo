import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";
import { Button } from "../ui/button";
import { DialogFooter, DialogHeader } from "../ui/dialog";
import { useNavigate } from "@tanstack/react-router";

export const LogoutModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { onLogout } = useAuth();
  const navigate = useNavigate();

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
  };

  const handleLogout = () => {
    onLogout();
    setIsOpen(false);
    navigate({ to: "/" });
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
          <Button variant="destructive" onClick={handleLogout}>
            {" "}
            Confirm log out
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

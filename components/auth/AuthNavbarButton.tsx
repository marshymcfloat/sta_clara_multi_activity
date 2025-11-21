"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Loader2, LogOut, Trash2 } from "lucide-react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useMutation } from "@tanstack/react-query";
import { deleteAccountAction, logoutAction } from "@/lib/actions/authActions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function AuthNavbarButton() {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const router = useRouter();

  const { mutate: deleteAccount, isPending: deletePending } = useMutation({
    mutationFn: deleteAccountAction,
    onSuccess: (data) => {
      if (!data.success) {
        toast.error(data.error || "Failed to delete account");
        setIsDeleteDialogOpen(false);
        return;
      }

      toast.success(data.message || "Account deleted successfully");
      setIsDeleteDialogOpen(false);
      logout();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete account");
      setIsDeleteDialogOpen(false);
    },
  });

  const { mutate: logout, isPending: logoutPending } = useMutation({
    mutationFn: logoutAction,
    onSuccess: (data) => {
      if (!data.success) {
        toast.error(data.error || "Failed to logout");
        return;
      }
      toast.success(data.message || "Logged out successfully");
      router.push("/");
    },
  });

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem
            className="text-red-500 hover:text-red-500!"
            onSelect={(e) => {
              e.preventDefault();
              setIsDeleteDialogOpen(true);
            }}
          >
            <Trash2 color="red" />
            Delete Account
          </DropdownMenuItem>

          <AlertDialog
            open={isDeleteDialogOpen}
            onOpenChange={setIsDeleteDialogOpen}
          >
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete
                  your account and remove your data from our servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel disabled={deletePending}>
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  className="bg-destructive hover:bg-destructive/70"
                  disabled={deletePending}
                  onClick={() => deleteAccount()}
                >
                  {deletePending ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      Deleting...
                    </>
                  ) : (
                    "Continue"
                  )}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <DropdownMenuItem onClick={() => logout()} disabled={logoutPending}>
            {logoutPending ? (
              <Loader2 className="animate-spin" />
            ) : (
              <LogOut className="" />
            )}
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}

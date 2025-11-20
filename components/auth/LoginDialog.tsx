"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import AuthLoginForm from "./AuthLoginForm";
import AuthRegisterForm from "./AuthRegisterForm";

export default function LoginDialog() {
  const [content, setContent] = useState<"LOGIN" | "REGISTER">("LOGIN");

  return (
    <Dialog>
      <DialogTrigger asChild className="absolute top-4 right-4">
        <Button
          variant="outline"
          className="font-medium text-sm bg-white/70 hover:bg-white/90 cursor-pointer"
        >
          Get Started
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader className="mb-4">
          <DialogTitle>Sta. Clara</DialogTitle>
          <DialogDescription>
            Make your life easier with Sta. Clara
          </DialogDescription>
        </DialogHeader>

        {content === "LOGIN" ? (
          <AuthLoginForm setContent={setContent} />
        ) : (
          <AuthRegisterForm setContent={setContent} />
        )}
      </DialogContent>
    </Dialog>
  );
}

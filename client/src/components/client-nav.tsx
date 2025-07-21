"use client";
import { signOut, useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";

export default function ClientNav() {
  const { data: session } = useSession();
  if (!session?.user) return null;
  return (
    <nav className="w-full flex justify-end items-center p-4">
      <Button variant="outline" onClick={() => signOut({ callbackUrl: "/" })} aria-label="Logout">
        Logout
      </Button>
    </nav>
  );
} 
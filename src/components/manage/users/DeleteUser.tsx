"use client";

import { Button } from "@/components/ui/button";
import { Trash2, X } from "lucide-react";
import { useState } from "react";

interface User {
  userId: string;
}

const DeleteUser = ({ userId }: User) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      {!isOpen ? (
        <Button onClick={() => setIsOpen(true)} className="w-21.5">Delete</Button>
      ) : (
        <>
          <div className="space-x-1.5">
            <Button onClick={() => setIsOpen(false)}>
              <X className="h-4 w-4" />
            </Button>
            <Button
              variant="destructive"
              className="dark:bg-red-600"
              onClick={() => setIsOpen(true)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </>
      )}
    </>
  );
};

export default DeleteUser;

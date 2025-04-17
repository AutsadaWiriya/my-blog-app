"use client";

import { Button } from "@/components/ui/button";
import { Trash2, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface User {
  userId: string;
  currentId: string;
  onDelete: () => void;
}

const DeleteUser = ({ userId, currentId, onDelete }: User) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleDelete = async () => {
    const response = await fetch(`/api/manageuser`, {
      method: "DELETE",
      body: JSON.stringify({ userId }),
    });
    const data = await response.json();

    if (response.ok) {
      toast.success("User deleted successfully");
      onDelete();
      setIsOpen(false);
    } else {
      toast.error("Failed to delete user", {
        description: data.error,
      });
    }
  };

  return (
    <>
      {currentId === userId ? (
        <Button disabled className="w-21.5"> 
          DELETE
        </Button>
      ) : (
        <>
          {!isOpen ? (
            <Button onClick={() => setIsOpen(true)} className="w-21.5">
              DELETE
            </Button>
          ) : (
            <>
              <div className="space-x-1.5">
                <Button onClick={() => setIsOpen(false)}>
                  <X className="h-4 w-4" />
                </Button>
                <Button
                  variant="destructive"
                  className="dark:bg-red-600"
                  onClick={handleDelete}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </>
          )}
        </>
      )}
    </>
  );
};

export default DeleteUser;

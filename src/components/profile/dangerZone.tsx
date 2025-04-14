"use client";

import { AlertTriangle, Loader2, Trash2, X } from "lucide-react";
import { Card } from "../ui/card";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useState } from "react";

interface User {
  email: string;
}

export default function DangerZone({ email }: User) {
  const [error, setError] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");

  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== email) {
      setError("Please enter your email correctly to confirm deletion");
      return;
    }
    setDeleteLoading(true);

    try {
      const response = await fetch("/api/users", {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete account.");
      }

      window.location.href = "/";
    } catch (error) {
      setError("Failed to delete account. Please try again later.");
      setDeleteLoading(false);
    }
  };

  return (
    <>
      {/* Danger Zone */}
      <Card className="mt-8 shadow-md rounded-xl overflow-hidden py-0">
        <div className="bg-red-50 dark:bg-red-700 px-6 py-4 border-b border-red-100 dark:border-red-800">
          <h3 className="text-lg font-medium text-red-800 dark:text-red-200 flex items-center">
            <AlertTriangle className="h-5 w-5 mr-2" />
            Danger Zone
          </h3>
        </div>

        <div className="p-6">
          <p className="mb-6">
            Deleting your account is permanent. All your data will be
            permanently removed and cannot be recovered.
          </p>

          {showDeleteConfirm ? (
            <div className="bg-red-50 border border-red-200 dark:bg-red-200 dark:border-red-800 rounded-lg p-4 mb-4">
              <h4 className="text-red-800 font-medium mb-2 flex items-center">
                <AlertTriangle className="h-5 w-5 mr-2" />
                Confirm Account Deletion
              </h4>
              <p className="text-red-700 text-sm mb-4">
                This action cannot be undone. Please type your email{" "}
                <strong>{email}</strong> to confirm.
              </p>
              <div className="bg-white rounded-md mb-4">
                <Input
                  type="text"
                  value={deleteConfirmText}
                  onChange={(e) => setDeleteConfirmText(e.target.value)}
                  placeholder="Enter your email to confirm"
                  className="border-red-300 text-black"
                />
              </div>
              <div className="flex gap-3">
                <Button
                  onClick={handleDeleteAccount}
                  disabled={deleteLoading || deleteConfirmText !== email}
                  variant="destructive"
                  className="flex items-center justify-center dark:bg-red-600"
                >
                  {deleteLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    <>
                      <Trash2 className="h-4 w-4 mr-2" />
                      Permanently Delete Account
                    </>
                  )}
                </Button>
                <Button
                  onClick={() => {
                    setShowDeleteConfirm(false);
                    setDeleteConfirmText("");
                    setError(null);
                  }}
                  variant="outline"
                  className="flex items-center justify-center dark:bg-white dark:text-neutral-800"
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <Button
              onClick={() => setShowDeleteConfirm(true)}
              variant="outline"
              className="border-red-300 text-red-600 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Account
            </Button>
          )}
        </div>
      </Card>
    </>
  );
}

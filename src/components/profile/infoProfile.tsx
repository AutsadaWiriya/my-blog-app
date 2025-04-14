"use client";
import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  AlertTriangle,
  Calendar,
  CheckCircle,
  Edit,
  Loader2,
  Mail,
  Save,
  Shield,
  User,
  X,
} from "lucide-react";
import { Card } from "../ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

interface User {
  name: string;
  email: string;
  role: string;
  image: string;
  createdAt: string;
}

export default function InfoProfile({
  name,
  email,
  role,
  image,
  createdAt,
}: User) {
  const [edit, setEdit] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<User>({
    name,
    email,
    role,
    image,
    createdAt,
  });

  const handleCancel = () => {
    setEdit(false);
    setUser({
      name,
      email,
      role,
      image,
      createdAt,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSaveSuccess(false);

    try {
      // Here you would make an actual API call
      const response = await fetch("/api/users", {
        method: "PUT",
        body: JSON.stringify({
          name: user.name,
          image: user.image,
        }),
      });
      if (!response.ok) {
        throw new Error("Failed to update profile.");
      }

      setError(null);
      setSaveSuccess(true);

      // Clear success message after 3 seconds
      setTimeout(() => {
        setSaveSuccess(false);
      }, 3000);
      setEdit(false);
    } catch (error) {
      setError(
        "Failed to update profile. Please check your inputs and try again."
      );
    }

    setLoading(false);
  };

  return (
    <>
      {/* Success Message */}
      {saveSuccess && (
        <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center justify-between">
          <div className="flex items-center">
            <CheckCircle className="h-5 w-5 mr-2" />
            <span>Profile updated successfully!</span>
          </div>
          <button
            onClick={() => setSaveSuccess(false)}
            className="text-green-500 hover:text-green-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center justify-between">
          <div className="flex items-center">
            <AlertTriangle className="h-5 w-5 mr-2" />
            <span>{error}</span>
          </div>
          <button
            onClick={() => setError(null)}
            className="text-red-500 hover:text-red-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      )}

      <Card className="overflow-hidden py-0">
        {/* Profile Header with Avatar */}
        <div className="relative h-40 bg-gradient-to-r from-violet-500 to-indigo-600 dark:from-violet-800 dark:to-indigo-900">
          <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2">
            <div className="relative">
              <Avatar className="w-32 h-32 shadow-lg">
                <AvatarImage
                  src={user.image || "/placeholder.svg"}
                  alt={user.name || "Profile"}
                />
                <AvatarFallback className="text-5xl">
                  {user.name?.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              {!edit && (
                <button
                  onClick={() => setEdit(true)}
                  className="absolute bottom-0 right-0 bg-indigo-500 hover:bg-indigo-600 dark:bg-indigo-800 dark:hover:bg-indigo-600  text-white p-2 rounded-full transition-colors"
                >
                  <Edit className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Profile Content */}
        <div className="pt-20 px-6 pb-8">
          {edit ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <Label className="flex items-center">
                    <Mail className="h-4 w-4 mr-2 text-gray-500" />
                    Email
                  </Label>
                  <Input
                    type="email"
                    value={user.email}
                    disabled
                    className="bg-gray-100 cursor-not-allowed text-gray-500"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Email cannot be changed
                  </p>
                </div>

                <div className="space-y-1.5">
                  <Label className="flex items-center">
                    <User className="h-4 w-4 mr-2 text-gray-500" />
                    Name
                  </Label>
                  <Input
                    type="text"
                    value={user.name}
                    onChange={(e) => setUser({ ...user, name: e.target.value })}
                    placeholder="Your name"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="flex items-center">
                    <User className="h-4 w-4 mr-2 text-gray-500" />
                    Profile Image URL
                  </Label>
                  <Input
                    type="text"
                    value={user.image}
                    onChange={(e) =>
                      setUser({ ...user, image: e.target.value })
                    }
                    placeholder="https://example.com/your-image.jpg"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Enter a valid image URL
                  </p>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button type="submit" disabled={loading} className="flex-1">
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </>
                  )}
                </Button>
                <Button
                  type="button"
                  onClick={handleCancel}
                  variant="outline"
                  className="flex-1"
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
              </div>
            </form>
          ) : (
            <div className="space-y-6">
              {/* User Info */}
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold">
                  {user.name || "Unnamed User"}
                </h2>
                <p className="text-gray-500 dark:text-gray-400">{user.email}</p>
              </div>

              {/* User Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 dark:bg-neutral-900 p-4 rounded-lg border">
                  <div className="flex items-center">
                    <Shield className="h-5 w-5 text-indigo-600 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Account Type
                      </p>
                      <p className="font-medium capitalize">{user.role}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-neutral-900 p-4 rounded-lg border">
                  <div className="flex items-center">
                    <Calendar className="h-5 w-5 text-indigo-600 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Member Since
                      </p>
                      <p className="font-medium">{user.createdAt}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Edit Button */}
              <div className="pt-6">
                <Button onClick={() => setEdit(true)} className="w-full py-6">
                  <Edit className="h-5 w-5 mr-2" />
                  Edit Profile
                </Button>
              </div>
            </div>
          )}
        </div>
      </Card>
    </>
  );
}

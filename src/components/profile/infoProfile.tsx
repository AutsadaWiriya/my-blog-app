"use client";
import { useState } from "react";
import { CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

interface User {
  name: string;
  email: string;
  role: string;
  image: string;
}

export default function InfoProfile({ name, email, role, image }: User) {
  const [edit, setEdit] = useState(false);
  const [user, setUser] = useState<User>({
    name,
    email,
    role,
    image,
  });
  return (
    <>
      <CardContent className="mt-20 text-center pb-8 space-y-6">
        {!edit ? (
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
              {name}
            </h2>
            <p className="text-gray-600 dark:text-gray-300">{email}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              Role: {role || "member"}
            </p>
            <Button className="mt-6" onClick={() => setEdit(true)}>
              Edit
            </Button>
          </div>
        ) : (
          <>
            <div className="space-y-1.5">
              <Label>Email</Label>
              <Input
                name="email"
                type="email"
                value={user.email}
                onChange={(e) => setUser({ ...user, email: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Name</Label>
              <Input
                name="name"
                type="text"
                value={user.name}
                onChange={(e) => setUser({ ...user, name: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Image</Label>
              <Input
                name="image"
                type="url"
                value={user.image}
                onChange={(e) => setUser({ ...user, image: e.target.value })}
              />
            </div>
            <div className="space-x-2">
              <Button onClick={() => setEdit(false)}>Cancel</Button>
              <Button>Submiit</Button>
            </div>
          </>
        )}

        <div className="px-6">
          <div className="h-1 w-full bg-gradient-to-r from-violet-500 to-indigo-600 dark:from-violet-700 dark:to-indigo-800 rounded-full"></div>
        </div>
      </CardContent>
    </>
  );
}

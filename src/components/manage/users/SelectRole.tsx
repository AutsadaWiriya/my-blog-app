import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { ShieldAlert, ShieldCheck, User } from "lucide-react";
import { cn } from "@/lib/utils";

interface Data {
  userId: string;
  userRole: string;
  currentId: string;
  onUpdateRole: () => void;
}

const SelectRole = ({ userId, userRole, currentId, onUpdateRole }: Data) => {
  const handleChangeRole = async (value: string) => {
    try {
      const res = await fetch("/api/manageuser", {
        method: "PUT",
        body: JSON.stringify({ userId, newRole: value }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("User role updated successfully");
        onUpdateRole();
      } else {
        toast.error("Failed to update user role", {
          description: data.error,
        });
      }
    } catch (error) {
      console.error("Error updating user role:", error);
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "admin":
        return <ShieldAlert className="h-3.5 w-3.5 mr-2" />;
      case "manager":
        return <ShieldCheck className="h-3.5 w-3.5 mr-2" />;
      default:
        return <User className="h-3.5 w-3.5 mr-2" />;
    }
  };

  const getRoleStyles = (role: string) => {
    switch (role) {
      case "admin":
        return "text-red-600 dark:text-red-400";
      case "manager":
        return "text-blue-600 dark:text-blue-400";
      default:
        return "text-green-600 dark:text-green-400";
    }
  };
  
  return (
    <Select
      value={userRole as string}
      disabled={userId === currentId}
      onValueChange={handleChangeRole}
    >
      <SelectTrigger 
        className={cn(
          "w-28 h-8 text-xs font-medium",
          userId === currentId && "opacity-80"
        )}
      >
        <SelectValue>
          <div className="flex items-center">
            {getRoleIcon(userRole)}
            <span className={getRoleStyles(userRole)}>{userRole}</span>
          </div>
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="member" className="flex items-center">
          <div className="flex items-center">
            <User className="h-3.5 w-3.5 mr-2 text-green-600 dark:text-green-400" />
            <span>member</span>
          </div>
        </SelectItem>
        <SelectItem value="manager" className="flex items-center">
          <div className="flex items-center">
            <ShieldCheck className="h-3.5 w-3.5 mr-2 text-blue-600 dark:text-blue-400" />
            <span>manager</span>
          </div>
        </SelectItem>
        <SelectItem value="admin" className="flex items-center">
          <div className="flex items-center">
            <ShieldAlert className="h-3.5 w-3.5 mr-2 text-red-600 dark:text-red-400" />
            <span>admin</span>
          </div>
        </SelectItem>
      </SelectContent>
    </Select>
  );
};

export default SelectRole;

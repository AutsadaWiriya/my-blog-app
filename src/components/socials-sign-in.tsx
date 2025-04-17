import { Button } from "./ui/button";
import { signIn } from "@/lib/auth";

import { Github, Google } from '@/components/ui/socials-icon';


const GoogleSignIn = () => {
  return (
    <form action={ async () => {
      "use server"
      await signIn("google")
    }}>
      <Button variant="outline" className="w-full">
        <Google />
        Google
      </Button>
    </form>
  );
};


const GithubSignIn = () => {
  return (
    <form action={ async () => {
      "use server"
      await signIn("github")
    }}>
      <Button variant="outline" className="w-full">
        <Github className="dark:fill-white" />
        GitHub
      </Button>
    </form>
  );
};

export { GoogleSignIn, GithubSignIn };

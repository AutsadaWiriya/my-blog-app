import { auth } from "@/lib/auth";
import MainPage from "@/components/post/main-page";

const page = async () => {
  const session = await auth();

  return (
    <>
      <MainPage currentId={session?.user?.id ?? ''} />
    </>
  )
};

export default page;
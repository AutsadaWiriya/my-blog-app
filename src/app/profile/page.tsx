import { auth } from "@/lib/auth";

const Page = async () => {
  const session = await auth();

  return (
    <>
      Profile
    </>
  )
}

export default Page;
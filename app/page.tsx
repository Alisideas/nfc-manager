// app/page.tsx


import HomeClient from "@/components/HomeClient";
import getCurrentUser from "./actions/getCurrentUser";
import Login from "./login/page";

export default async function HomePage() {

  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return <Login />;
  }

  return <HomeClient />;
}

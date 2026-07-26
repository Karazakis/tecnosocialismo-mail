import { getSuiteUser } from "@/lib/session";
import { MailApp } from "./mail-app";

export const dynamic = "force-dynamic";

export default async function Home() {
  const user = await getSuiteUser();
  return <MailApp user={user} />;
}

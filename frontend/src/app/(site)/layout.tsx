import { Nav } from "@/components/site/nav";
import { Footer } from "@/components/site/footer";
import { getProfile } from "@/lib/data";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const profile = await getProfile();
  return (
    <>
      <Nav scholarUrl={profile.scholarUrl} />
      <main className="grain">{children}</main>
      <Footer profile={profile} />
    </>
  );
}

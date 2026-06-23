import { LandingPageClient } from "@/components/LandingPageClient";
import { LocaleProvider } from "@/components/LocaleProvider";

export default function Home() {
  return (
    <LocaleProvider>
      <LandingPageClient />
    </LocaleProvider>
  );
}

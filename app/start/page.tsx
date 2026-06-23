import { StartPageClient } from "@/components/StartPageClient";
import { LocaleProvider } from "@/components/LocaleProvider";

export default function StartPage() {
  return (
    <LocaleProvider>
      <StartPageClient />
    </LocaleProvider>
  );
}

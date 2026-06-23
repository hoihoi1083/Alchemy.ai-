import { HowPageClient } from "@/components/HowPageClient";
import { LocaleProvider } from "@/components/LocaleProvider";

export default function HowPage() {
  return (
    <LocaleProvider>
      <HowPageClient />
    </LocaleProvider>
  );
}

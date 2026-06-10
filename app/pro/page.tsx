import { LocaleProvider } from "@/components/LocaleProvider";
import { ProPageClient } from "@/components/ProPageClient";

export default function ProPage() {
  return (
    <LocaleProvider>
      <ProPageClient />
    </LocaleProvider>
  );
}

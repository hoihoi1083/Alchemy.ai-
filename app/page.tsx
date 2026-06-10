import { AppHeader } from "@/components/AppHeader";
import { LocaleProvider } from "@/components/LocaleProvider";
import { StudioWizard } from "@/components/StudioWizard";

export default function Home() {
  return (
    <LocaleProvider>
      <main className="mx-auto min-h-screen max-w-2xl px-4 py-10 pb-24">
        <AppHeader />
        <StudioWizard />
      </main>
    </LocaleProvider>
  );
}

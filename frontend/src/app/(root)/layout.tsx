import { AppSidebar } from "@/components/AppSidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="bg-neutral-950">
        <div className="sticky top-0 z-30 flex h-12 items-center border-b border-neutral-800 bg-neutral-950 px-3">
          <SidebarTrigger className="text-neutral-400 transition hover:text-white" />
        </div>
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}

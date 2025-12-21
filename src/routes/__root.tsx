import { TanStackDevtools } from "@tanstack/react-devtools";
import { formDevtoolsPlugin } from "@tanstack/react-form-devtools";
import type { QueryClient } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import {
  createRootRouteWithContext,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import AppHeader from "@/components/AppHeader";
import AppSidebar from "@/components/AppSidebar";
import PageContainer from "@/components/PageContainer";
import { SidebarProvider } from "@/components/ui/sidebar";
import appCss from "../styles.css?url";

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient;
}>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Dashboard Playground TanStack Start" },
    ],
    links: [{ rel: "stylesheet", href: appCss }],
  }),
  shellComponent: RootDocument,
});

interface RootDocumentProps {
  children: React.ReactNode;
}

function RootDocument({ children }: RootDocumentProps) {
  return (
    <html lang="en">
      {/* biome-ignore lint/style/noHeadElement: TanStack Start requires <head> element */}
      <head>
        <HeadContent />
      </head>
      <body>
        <SidebarProvider>
          <AppSidebar />
          <main className="w-full">
            <AppHeader />
            <PageContainer>{children}</PageContainer>
          </main>
        </SidebarProvider>
        <TanStackDevtools
          config={{ position: "bottom-right" }}
          plugins={[
            {
              name: "Tanstack Router",
              render: <TanStackRouterDevtoolsPanel />,
            },
            formDevtoolsPlugin(),
          ]}
        />
        <Scripts />
        <ReactQueryDevtools buttonPosition="bottom-left" />
      </body>
    </html>
  );
}

// component import
import { Main } from "@/components";

// context import
import { SidebarContextProvider } from "@/context";

// css import
import "@/styles/globals.css";
import { Toaster } from "react-hot-toast";

export const metadata = {
  title: "StoreKool",
  description: "Multiple Woo-commerce store management system",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <SidebarContextProvider>
          <Main>{children}</Main>
        </SidebarContextProvider>
        <Toaster position="top right" />
      </body>
    </html>
  );
}

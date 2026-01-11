import { Poppins } from "next/font/google";
import "bootstrap/dist/css/bootstrap.min.css";
// import "./styles/lib/bootstrap.rtl.min.css";
import BootstrapClient from "@/components/BootstrapClient";
import "./styles/lib/all.min.css";

// react-date-range
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

import "./globals.scss";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100","200","300","400","500","600","700","800","900"],
  style: ["normal","italic"],
  variable: "--font-poppins",
});

export const metadata = {
  title: "Skybridgecrm",
  description: "Skybridge CRM",
  icons: {
    icon: "/fav.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={poppins.variable}>
        <BootstrapClient />
        {children}
      </body>
    </html>
  );
}

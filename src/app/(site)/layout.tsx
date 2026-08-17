import Navbar from "@/components/Navbar";
import MobileNavbar from "@/components/MobileNavbar";
import Footer from "@/components/Footer";
import { MatrixWrapper } from "@/components/background/MatrixWrapper";

export default function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <MatrixWrapper>
      <MobileNavbar />
      <Navbar />
      <main>{children}</main>
      <Footer />
    </MatrixWrapper>
  );
}

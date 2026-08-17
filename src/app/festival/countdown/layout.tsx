import { MatrixWrapper } from "@/components/background/MatrixWrapper";

export default function CountdownLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <MatrixWrapper scale={1.4} glow>
      <main className="h-dvh overflow-hidden">{children}</main>
    </MatrixWrapper>
  );
}

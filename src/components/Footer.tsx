import Link from "next/link";
import BrandName from "@/components/BrandName";
import FooterSubscribe from "@/components/FooterSubscribe";

export default function Footer() {
  return (
    <footer className="relative z-10 border-t border-line/10 py-12 px-6">
      <div className="max-w-[1200px] mx-auto flex flex-col-reverse md:flex-row gap-8">
        <div className="flex-1 flex flex-col items-center md:items-start gap-4 text-center md:text-left">
          <div className="flex flex-wrap justify-center md:justify-start items-center gap-3 sm:gap-6 text-xs text-text-muted">
            <Link href="/" className="hover:text-text transition-colors uppercase tracking-wider">Altar</Link>
            <Link href="/revelations" className="hover:text-text transition-colors uppercase tracking-wider">Revelations</Link>
            <Link href="/creed" className="hover:text-text transition-colors uppercase tracking-wider">Creed</Link>
            <a href="/feed/feed.xml" className="hover:text-text transition-colors uppercase tracking-wider">RSS</a>
          </div>
          <p className="text-[10px] text-text-muted max-w-2xl leading-relaxed">
            <BrandName /> is the faith of heroes. These words are for those who still have ears for the unheard.
          </p>
          <p className="text-[10px] text-text-muted">
            &copy; {new Date().getFullYear()} <BrandName />
          </p>
        </div>

        <div className="md:w-80 flex-shrink-0">
          <FooterSubscribe />
        </div>
      </div>
    </footer>
  );
}

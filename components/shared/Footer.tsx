import { profile } from "@/data/profile";
import Year from "./Year";

export default function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-5 py-8 text-sm text-soft md:px-10">
        <p>
          © <Year /> {profile.name}. {profile.tagline}.
        </p>
        <a href="#top" className="transition-colors hover:text-accent">Back to top</a>
      </div>
    </footer>
  );
}

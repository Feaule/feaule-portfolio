import { rootVariant } from "@/config/site";
import StyleA from "@/components/variants/style-a";
import StyleB from "@/components/variants/style-b";

// Which concept "/" shows is set in config/site.ts (or NEXT_PUBLIC_ROOT_VARIANT).
export default function Home() {
  return rootVariant === "b" ? <StyleB /> : <StyleA />;
}
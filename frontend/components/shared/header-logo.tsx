import Image from "next/image";
import { Link } from "@/i18n/navigation";

/** Both logos are rendered and CSS picks one, so SSR and the browser agree. */
export const HeaderLogo = () => (
  <Link href="/">
    <Image src="/logo.png" alt="Maf Logo" width={60} height={40} className="dark:hidden" />
    <Image src="/logo-w.png" alt="Maf Logo" width={60} height={40} className="hidden dark:block" />
  </Link>
);

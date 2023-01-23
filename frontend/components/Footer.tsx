import Link from "next/link";
import footerStyles from "../styles/Footer.module.css";

export function Footer() {
  return (
    <footer className={footerStyles.container}>
      <i>
        Made by{" "}
        <Link
          style={{ textDecoration: "underline" }}
          href="https://github.com/mhborthwick"
          target="_blank"
        >
          Mike Borthwick
        </Link>
      </i>
    </footer>
  );
}

import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Skyling School",
  description: "Skyling School - английский с ИИ-преподавателем",
  icons: {
    icon: "/images/skyling-logo.jpeg",
    shortcut: "/images/skyling-logo.jpeg",
    apple: "/images/skyling-logo.jpeg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  );
}

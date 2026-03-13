import type { Metadata } from "next";
import { DM_Sans, Plus_Jakarta_Sans, Space_Grotesk, Anton } from "next/font/google";
import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta-sans",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const anton = Anton({
  variable: "--font-anton",
  subsets: ["latin"],
  weight: ["400"],
});

export const metadata: Metadata = {
  title: "Tymor Technologies",
  description: "Advanced AI Solutions by Tymor Technologies",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link 
          href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" 
          rel="stylesheet" 
        />
        <link 
          href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.css" 
          rel="stylesheet" 
        />
        <link 
          href="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css" 
          rel="stylesheet" 
        />
      </head>
      <body
        className={`${dmSans.variable} ${plusJakartaSans.variable} ${spaceGrotesk.variable} ${anton.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}

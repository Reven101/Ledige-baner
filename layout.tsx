import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Ledig Bane | Finn ledig tid på fotballbanene",
  description: "Finn ledig tid for løkkefotball på Grunerløkka, Torshov og Sagene. Se ledige tider på Mølleparken, Dælenga, Muselunden og Nordre Åsen.",
  keywords: ["fotball", "løkkefotball", "ledig bane", "Oslo", "Grunerløkka", "Torshov", "Sagene", "booking"],
  authors: [{ name: "Ledig Bane" }],
  openGraph: {
    title: "Ledig Bane | Finn ledig tid på fotballbanene",
    description: "Finn ledig tid for løkkefotball på Grunerløkka, Torshov og Sagene.",
    type: "website",
    locale: "nb_NO",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0a1f0a",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="no">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link 
          href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Oswald:wght@400;500;600;700&display=swap" 
          rel="stylesheet" 
        />
      </head>
      <body className="antialiased">
        <div className="min-h-screen pitch-pattern grass-texture">
          {children}
        </div>
      </body>
    </html>
  );
}

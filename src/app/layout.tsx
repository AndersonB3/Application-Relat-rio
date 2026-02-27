import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "ISIBA | Relatorio de Atendimentos",
  description:
    "Relatorio Anual de Atendimentos - ISIBA. Dados transparentes sobre a gestao em saude publica.",
  icons: { icon: "/favicon.ico" },
  robots: {
    index: true,
    follow: true,
    noarchive: true, // Impede cache em buscadores
  },
  other: {
    "format-detection": "telephone=no", // Impede detecção automática de telefone
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="scroll-smooth">
      <body className={`${inter.variable} ${poppins.variable} font-(family-name:--font-inter) antialiased`}>
        {children}
      </body>
    </html>
  );
}

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,

  // Esconde o header "X-Powered-By: Next.js" — evita fingerprinting
  poweredByHeader: false,

  // Headers de segurança HTTP
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          // Impede que o site seja carregado em iframes de terceiros (clickjacking)
          { key: "X-Frame-Options", value: "DENY" },

          // Bloqueia sniffing de MIME type pelo navegador
          { key: "X-Content-Type-Options", value: "nosniff" },

          // Controla quais informações de referrer são enviadas
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },

          // Força HTTPS por 1 ano, incluindo subdomínios
          {
            key: "Strict-Transport-Security",
            value: "max-age=31536000; includeSubDomains; preload",
          },

          // Desabilita APIs perigosas do navegador que não são necessárias
          {
            key: "Permissions-Policy",
            value:
              "camera=(), microphone=(), geolocation=(), interest-cohort=()",
          },

          // Content Security Policy — restringe origens permitidas
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline'",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com data:",
              "img-src 'self' data: blob: https:",
              "connect-src 'self' https://*.supabase.co",
              "frame-ancestors 'none'",
              "base-uri 'self'",
              "form-action 'self'",
              "object-src 'none'",
            ].join("; "),
          },

          // Proteção contra XSS (legacy — ainda útil em navegadores antigos)
          { key: "X-XSS-Protection", value: "1; mode=block" },

          // Impede DNS prefetching para domínios não autorizados
          { key: "X-DNS-Prefetch-Control", value: "on" },

          // Cross-Origin policies
          { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
          { key: "Cross-Origin-Resource-Policy", value: "same-origin" },
        ],
      },
    ];
  },
};

export default nextConfig;
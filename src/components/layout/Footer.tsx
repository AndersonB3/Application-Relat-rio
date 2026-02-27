import Image from "next/image";
import { Heart, Mail, Phone, MapPin, Building2, Instagram, MessageCircle } from "lucide-react";

export function Footer() {
  return (
    <footer id="footer" className="bg-linear-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Logo e descricao */}
          <div className="space-y-4">
            <Image
              src="/logomarca superior.png"
              alt="ISIBA"
              width={160}
              height={44}
              className="h-11 w-40 object-contain"
            />
            <p className="text-slate-400 text-sm leading-relaxed">
              Gestao humanizada em saude publica. Transformando vidas atraves do cuidado e da eficiencia.
            </p>
            <div className="flex items-center gap-2 text-emerald-400 text-sm">
              <Heart className="w-4 h-4" />
              <span>Cuidando de quem cuida</span>
            </div>
          </div>

          {/* Salvador */}
          <div className="space-y-4">
            <h4 className="text-white font-semibold text-lg">Salvador - BA</h4>
            <ul className="space-y-3 text-slate-400 text-sm">
              <li className="flex items-start gap-2">
                <Building2 className="w-4 h-4 mt-0.5 text-blue-400 shrink-0" />
                <span>Edificio Guimaraes Trade</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-0.5 text-blue-400 shrink-0" />
                <span>Av. Tancredo Neves, 1189 - Sala 503 a 505, Caminho das Arvores - CEP: 41.870-021</span>
              </li>
            </ul>
          </div>

          {/* Sao Paulo */}
          <div className="space-y-4">
            <h4 className="text-white font-semibold text-lg">Sao Paulo - SP</h4>
            <ul className="space-y-3 text-slate-400 text-sm">
              <li className="flex items-start gap-2">
                <Building2 className="w-4 h-4 mt-0.5 text-blue-400 shrink-0" />
                <span>Edificio Palacio das Americas</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-0.5 text-blue-400 shrink-0" />
                <span>Av. Brigadeiro Faria Lima, 1811 - Sala 918 - CEP: 01452-001</span>
              </li>
            </ul>
          </div>

          {/* Contato */}
          <div className="space-y-4">
            <h4 className="text-white font-semibold text-lg">Contato</h4>
            <ul className="space-y-3 text-slate-400 text-sm">
              <li>
                <a href="tel:+557121377396" className="flex items-center gap-2 hover:text-white transition-colors">
                  <Phone className="w-4 h-4 text-blue-400" />
                  (71) 2137.7396
                </a>
              </li>
              <li>
                <a href="mailto:contato@isiba.org.br" className="flex items-center gap-2 hover:text-white transition-colors">
                  <Mail className="w-4 h-4 text-blue-400" />
                  contato@isiba.org.br
                </a>
              </li>
            </ul>
            <div className="flex gap-3 pt-2">
              <a
                href="https://www.instagram.com/isibasaude"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center text-slate-400 hover:bg-blue-500 hover:text-white transition-all"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="https://api.whatsapp.com/send/?phone=557121377396"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center text-slate-400 hover:bg-emerald-500 hover:text-white transition-all"
              >
                <MessageCircle className="w-5 h-5" />
              </a>
              <a
                href="mailto:contato@isiba.org.br"
                className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center text-slate-400 hover:bg-red-500 hover:text-white transition-all"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-slate-500 text-sm">
            &copy; {new Date().getFullYear()} ISIBA. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}

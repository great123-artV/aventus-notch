import { createContext, useContext, useState, ReactNode } from "react";

const translations: Record<string, Record<string, string>> = {
  en: {
    "nav.home": "Home",
    "nav.markets": "Markets",
    "nav.invest": "Invest",
    "nav.portfolio": "Portfolio",
    "nav.profile": "Profile",
    "hero.title": "Invest Smarter. Grow Without Limits.",
    "hero.subtitle": "One platform for stocks, crypto, forex, real estate, and retirement. Build wealth with institutional-grade tools designed for everyone.",
    "hero.aiInsights": "Now with AI-Powered Portfolio Insights",
    "hero.getStarted": "Get Started Free",
    "hero.exploreMarkets": "Explore Markets",
    "categories.title": "Every Asset Class. One Platform.",
    "categories.subtitle": "Diversify across the world's most profitable markets from a single, high-performance dashboard.",
    "cta.title": "Ready to Build Your Wealth?",
    "cta.button": "Create Your Free Account",
    "auth.login": "Log In",
    "auth.signup": "Sign Up",
    "auth.email": "Email",
    "auth.password": "Password",
    "auth.firstName": "First Name",
    "auth.lastName": "Last Name",
    "dashboard.welcome": "Welcome back",
    "dashboard.balance": "Portfolio Balance",
    "settings.language": "Language",
    "settings.appearance": "Appearance",
    "settings.dark": "Dark",
    "settings.light": "Light",
    "settings.system": "System",
  },
  es: {
    "nav.home": "Inicio",
    "nav.markets": "Mercados",
    "nav.invest": "Invertir",
    "nav.portfolio": "Portafolio",
    "nav.profile": "Perfil",
    "hero.title": "Invierte Más Inteligente. Crece Sin Límites.",
    "hero.subtitle": "Una plataforma para acciones, cripto, forex, bienes raíces y jubilación. Construye riqueza con herramientas de grado institucional diseñadas para todos.",
    "hero.getStarted": "Comienza Gratis",
    "hero.exploreMarkets": "Explorar Mercados",
    "categories.title": "Toda Clase de Activo. Una Plataforma.",
    "categories.subtitle": "Diversifica en los mercados más rentables del mundo desde un solo panel de alto rendimiento.",
    "cta.title": "¿Listo para Construir Tu Riqueza?",
    "cta.button": "Crea Tu Cuenta Gratis",
    "auth.login": "Iniciar Sesión",
    "auth.signup": "Registrarse",
    "auth.email": "Correo Electrónico",
    "auth.password": "Contraseña",
    "auth.firstName": "Nombre",
    "auth.lastName": "Apellido",
    "dashboard.welcome": "Bienvenido de nuevo",
    "dashboard.balance": "Balance del Portafolio",
    "settings.language": "Idioma",
    "settings.appearance": "Apariencia",
    "settings.dark": "Oscuro",
    "settings.light": "Claro",
    "settings.system": "Sistema",
  },
  fr: {
    "nav.home": "Accueil",
    "nav.markets": "Marchés",
    "nav.invest": "Investir",
    "nav.portfolio": "Portefeuille",
    "nav.profile": "Profil",
    "hero.title": "Investissez Plus Intelligemment. Grandissez Sans Limites.",
    "hero.subtitle": "Une plateforme pour les actions, la crypto, le forex, l'immobilier et la retraite. Construisez votre patrimoine avec des outils institutionnels conçus pour tous.",
    "hero.getStarted": "Commencer Gratuitement",
    "hero.exploreMarkets": "Explorer les Marchés",
    "categories.title": "Toutes Classes d'Actifs. Une Plateforme.",
    "categories.subtitle": "Diversifiez sur les marchés les plus rentables du monde depuis un tableau de bord haute performance.",
    "cta.title": "Prêt à Construire Votre Patrimoine ?",
    "cta.button": "Créer Votre Compte Gratuit",
    "auth.login": "Connexion",
    "auth.signup": "S'inscrire",
    "auth.email": "E-mail",
    "auth.password": "Mot de passe",
    "auth.firstName": "Prénom",
    "auth.lastName": "Nom",
    "dashboard.welcome": "Bon retour",
    "dashboard.balance": "Solde du Portefeuille",
    "settings.language": "Langue",
    "settings.appearance": "Apparence",
    "settings.dark": "Sombre",
    "settings.light": "Clair",
    "settings.system": "Système",
  },
  de: {
    "nav.home": "Startseite",
    "nav.markets": "Märkte",
    "nav.invest": "Investieren",
    "nav.portfolio": "Portfolio",
    "nav.profile": "Profil",
    "hero.title": "Smarter Investieren. Grenzenlos Wachsen.",
    "hero.subtitle": "Eine Plattform für Aktien, Krypto, Forex, Immobilien und Altersvorsorge. Vermögen aufbauen mit professionellen Tools für jeden.",
    "hero.getStarted": "Kostenlos Starten",
    "hero.exploreMarkets": "Märkte Erkunden",
    "categories.title": "Jede Anlageklasse. Eine Plattform.",
    "categories.subtitle": "Diversifizieren Sie über die profitabelsten Märkte der Welt von einem einzigen Hochleistungs-Dashboard.",
    "cta.title": "Bereit Ihr Vermögen Aufzubauen?",
    "cta.button": "Kostenloses Konto Erstellen",
    "auth.login": "Anmelden",
    "auth.signup": "Registrieren",
    "auth.email": "E-Mail",
    "auth.password": "Passwort",
    "auth.firstName": "Vorname",
    "auth.lastName": "Nachname",
    "dashboard.welcome": "Willkommen zurück",
    "dashboard.balance": "Portfolio-Saldo",
    "settings.language": "Sprache",
    "settings.appearance": "Erscheinungsbild",
    "settings.dark": "Dunkel",
    "settings.light": "Hell",
    "settings.system": "System",
  },
  it: {
    "nav.home": "Home",
    "nav.markets": "Mercati",
    "nav.invest": "Investi",
    "nav.portfolio": "Portafoglio",
    "nav.profile": "Profilo",
    "hero.title": "Investi in modo più intelligente. Cresci senza limiti.",
    "hero.subtitle": "Un'unica piattaforma per azioni, cripto, forex, immobiliare e pensione. Costruisci ricchezza con strumenti di livello istituzionale progettati per tutti.",
    "hero.getStarted": "Inizia gratuitamente",
    "hero.exploreMarkets": "Esplora i mercati",
    "categories.title": "Ogni classe di attività. Un'unica piattaforma.",
    "categories.subtitle": "Diversifica nei mercati più redditizi del mondo da un'unica dashboard ad alte prestazioni.",
    "cta.title": "Pronto a costruire la tua ricchezza?",
    "cta.button": "Crea il tuo account gratuito",
    "auth.login": "Accedi",
    "auth.signup": "Iscriviti",
    "auth.email": "E-mail",
    "auth.password": "Password",
    "auth.firstName": "Nome",
    "auth.lastName": "Cognome",
    "dashboard.welcome": "Bentornato",
    "dashboard.balance": "Saldo del portafoglio",
    "settings.language": "Lingua",
    "settings.appearance": "Aspetto",
    "settings.dark": "Scuro",
    "settings.light": "Chiaro",
    "settings.system": "Sistema",
  },
  pt: {
    "nav.home": "Início",
    "nav.markets": "Mercados",
    "nav.invest": "Investir",
    "nav.portfolio": "Portfólio",
    "nav.profile": "Perfil",
    "hero.title": "Invista de forma mais inteligente. Cresça sem limites.",
    "hero.subtitle": "Uma única plataforma para ações, cripto, forex, imobiliário e reforma. Construa riqueza com ferramentas de nível institucional projetadas para todos.",
    "hero.getStarted": "Comece gratuitamente",
    "hero.exploreMarkets": "Explorar mercados",
    "categories.title": "Cada classe de ativos. Uma plataforma.",
    "categories.subtitle": "Diversifique nos mercados mais lucrativos do mundo a partir de um único painel de alto desempenho.",
    "cta.title": "Pronto para construir sua riqueza?",
    "cta.button": "Crie sua conta gratuita",
    "auth.login": "Entrar",
    "auth.signup": "Cadastrar-se",
    "auth.email": "E-mail",
    "auth.password": "Senha",
    "auth.firstName": "Nome",
    "auth.lastName": "Sobrenome",
    "dashboard.welcome": "Bem-vindo de volta",
    "dashboard.balance": "Saldo do portfólio",
    "settings.language": "Idioma",
    "settings.appearance": "Aparência",
    "settings.dark": "Escuro",
    "settings.light": "Claro",
    "settings.system": "Sistema",
  },
};

interface LanguageContextType {
  lang: string;
  setLang: (lang: string) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType>({
  lang: "en",
  setLang: () => {},
  t: (key) => key,
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState(() => localStorage.getItem("app-lang") || "en");

  const setLang = (newLang: string) => {
    setLangState(newLang);
    localStorage.setItem("app-lang", newLang);

    // Attempt to update Google Translate if it's already on the page
    const googleTranslateDropdown = document.querySelector(".goog-te-combo") as HTMLSelectElement;
    if (googleTranslateDropdown && googleTranslateDropdown.value !== newLang) {
      googleTranslateDropdown.value = newLang;
      googleTranslateDropdown.dispatchEvent(new Event("change"));
    }
  };

  const t = (key: string) => translations[lang]?.[key] || translations.en?.[key] || key;

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}

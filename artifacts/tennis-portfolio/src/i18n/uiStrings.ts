export const SUPPORTED_LOCALES = ["en", "fr", "it", "de", "es"] as const;
export type Locale = (typeof SUPPORTED_LOCALES)[number];
export const SOURCE_LOCALE: Locale = "en";

export const LOCALE_LABELS: Record<Locale, string> = {
  en: "EN",
  fr: "FR",
  it: "IT",
  de: "DE",
  es: "ES",
};

export const LOCALE_FULL: Record<Locale, string> = {
  en: "English",
  fr: "Français",
  it: "Italiano",
  de: "Deutsch",
  es: "Español",
};

interface UIStrings {
  nav: {
    profile: string;
    story: string;
    training: string;
    gallery: string;
    vision: string;
    partners: string;
    contact: string;
  };
  contactForm: {
    name: string;
    email: string;
    message: string;
    send: string;
    sending: string;
    successTitle: string;
    successDesc: string;
    errorTitle: string;
  };
  footer: {
    rights: string;
    admin: string;
  };
}

export const UI: Record<Locale, UIStrings> = {
  en: {
    nav: {
      profile: "Profile",
      story: "Story",
      training: "Training",
      gallery: "Gallery",
      vision: "Vision",
      partners: "Partners",
      contact: "Contact",
    },
    contactForm: {
      name: "Name",
      email: "Email",
      message: "Message",
      send: "Send Message",
      sending: "Sending...",
      successTitle: "Message sent",
      successDesc: "Thanks — we will be in touch shortly.",
      errorTitle: "Could not send message",
    },
    footer: {
      rights: "All rights reserved",
      admin: "Admin",
    },
  },
  fr: {
    nav: {
      profile: "Profil",
      story: "Histoire",
      training: "Entraînement",
      gallery: "Galerie",
      vision: "Vision",
      partners: "Partenaires",
      contact: "Contact",
    },
    contactForm: {
      name: "Nom",
      email: "E-mail",
      message: "Message",
      send: "Envoyer le message",
      sending: "Envoi…",
      successTitle: "Message envoyé",
      successDesc: "Merci — nous vous répondrons sous peu.",
      errorTitle: "Échec de l'envoi du message",
    },
    footer: {
      rights: "Tous droits réservés",
      admin: "Admin",
    },
  },
  it: {
    nav: {
      profile: "Profilo",
      story: "Storia",
      training: "Allenamento",
      gallery: "Galleria",
      vision: "Visione",
      partners: "Partner",
      contact: "Contatti",
    },
    contactForm: {
      name: "Nome",
      email: "E-mail",
      message: "Messaggio",
      send: "Invia messaggio",
      sending: "Invio in corso…",
      successTitle: "Messaggio inviato",
      successDesc: "Grazie — risponderemo a breve.",
      errorTitle: "Invio del messaggio non riuscito",
    },
    footer: {
      rights: "Tutti i diritti riservati",
      admin: "Admin",
    },
  },
  de: {
    nav: {
      profile: "Profil",
      story: "Geschichte",
      training: "Training",
      gallery: "Galerie",
      vision: "Vision",
      partners: "Partner",
      contact: "Kontakt",
    },
    contactForm: {
      name: "Name",
      email: "E-Mail",
      message: "Nachricht",
      send: "Nachricht senden",
      sending: "Senden…",
      successTitle: "Nachricht gesendet",
      successDesc: "Danke — wir melden uns in Kürze.",
      errorTitle: "Nachricht konnte nicht gesendet werden",
    },
    footer: {
      rights: "Alle Rechte vorbehalten",
      admin: "Admin",
    },
  },
  es: {
    nav: {
      profile: "Perfil",
      story: "Historia",
      training: "Entrenamiento",
      gallery: "Galería",
      vision: "Visión",
      partners: "Socios",
      contact: "Contacto",
    },
    contactForm: {
      name: "Nombre",
      email: "Correo",
      message: "Mensaje",
      send: "Enviar mensaje",
      sending: "Enviando…",
      successTitle: "Mensaje enviado",
      successDesc: "Gracias — te responderemos en breve.",
      errorTitle: "No se pudo enviar el mensaje",
    },
    footer: {
      rights: "Todos los derechos reservados",
      admin: "Admin",
    },
  },
};

export function isLocale(value: unknown): value is Locale {
  return typeof value === "string" && (SUPPORTED_LOCALES as readonly string[]).includes(value);
}

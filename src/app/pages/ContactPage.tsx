import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { ContactAnimatedCard } from "../components/ContactAnimatedCard";
import { Footer } from "../components/Footer";
import { StickyNav } from "../components/StickyNav";
import { CustomCursor, setCursorState } from "../components/CustomCursor";
import { ContactBeamsBackground } from "../components/ui/ContactBeamsBackground";
import { ProjectShinyButton } from "../components/ui/project-shiny-button";

const SANS = "'Space Grotesk', sans-serif";
const MONO = "'JetBrains Mono', monospace";
const ACCENT = "#FC1235";
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const WEB3FORMS_ENDPOINT = "https://api.web3forms.com/submit";
const WEB3FORMS_ACCESS_KEY = "b4a797af-fc9e-45c9-a180-17ffa74bc745";
const WEB3FORMS_SUBJECT = "Nouveau message depuis le portfolio d'Evans";

const PRICING_ITEMS = [
  { label: "Landing page", price: "à partir de 600 €" },
  { label: "Site vitrine", price: "à partir de 1 000 €" },
  { label: "Shopify / e-commerce", price: "à partir de 1 500 €" },
] as const;

type FormValues = {
  nom: string;
  email: string;
  message: string;
};

type FormErrors = Partial<Record<keyof FormValues, string>>;

type ContactApiResponse = {
  success?: boolean;
  message?: string;
};

function PricingBlock() {
  return (
    <section
      aria-label="Tarifs indicatifs"
      style={{
        marginTop: "clamp(1.75rem, 4vw, 2.5rem)",
        paddingTop: "clamp(1.35rem, 3vw, 1.8rem)",
        borderTop: "1px solid rgba(255,255,255,0.08)",
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: "0.7rem" }}>
        <h2
          style={{
            margin: 0,
            fontFamily: MONO,
            fontSize: "0.58rem",
            color: ACCENT,
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            lineHeight: 1.4,
          }}
        >
          Tarifs indicatifs
        </h2>
        <p
          style={{
            margin: 0,
            fontFamily: SANS,
            fontSize: "clamp(0.96rem, 2.2vw, 1rem)",
            lineHeight: 1.7,
            color: "#969696",
            maxWidth: "58ch",
            letterSpacing: "-0.01em",
          }}
        >
          Chaque projet dépend du besoin, du niveau de personnalisation et du nombre de pages.
        </p>
      </div>

      <div
        style={{
          borderRadius: "22px",
          border: "1px solid rgba(255,255,255,0.07)",
          background: "linear-gradient(180deg, rgba(255,255,255,0.022) 0%, rgba(255,255,255,0.01) 100%)",
          boxShadow: "inset 0 1px 0 rgba(255,255,255,0.02)",
          padding: "clamp(1rem, 3vw, 1.35rem)",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "0.15rem" }}>
          {PRICING_ITEMS.map((item, index) => (
            <div
              key={item.label}
              className="flex flex-col gap-1.5 py-3 sm:flex-row sm:items-center sm:justify-between"
              style={{
                borderBottom: index < PRICING_ITEMS.length - 1 ? "1px solid rgba(255,255,255,0.06)" : "none",
              }}
            >
              <span
                style={{
                  fontFamily: SANS,
                  fontSize: "clamp(0.98rem, 2.2vw, 1.02rem)",
                  fontWeight: 500,
                  color: "#F2F2F2",
                  letterSpacing: "-0.015em",
                  lineHeight: 1.4,
                }}
              >
                {item.label}
              </span>
              <span
                style={{
                  fontFamily: MONO,
                  fontSize: "0.5rem",
                  color: "#C9C9C9",
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  lineHeight: 1.6,
                }}
              >
                {item.price}
              </span>
            </div>
          ))}
        </div>
      </div>

      <p
        style={{
          margin: 0,
          fontFamily: SANS,
          fontSize: "0.95rem",
          lineHeight: 1.65,
          color: "#B8B8B8",
          letterSpacing: "-0.01em",
        }}
      >
        Pour un devis précis, le plus simple reste d’en discuter.
      </p>
    </section>
  );
}

function ContactForm() {
  const [values, setValues] = useState<FormValues>({ nom: "", email: "", message: "" });
  const [honeypot, setHoneypot] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [feedbackTone, setFeedbackTone] = useState<"success" | "error" | null>(null);

  const updateField = (field: keyof FormValues, value: string) => {
    setValues((prev) => ({ ...prev, [field]: value }));

    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }

    if (feedbackTone) {
      setFeedback("");
      setFeedbackTone(null);
    }
  };

  const validate = ({ nom, email, message }: FormValues) => {
    const nextErrors: FormErrors = {};

    if (!nom.trim()) nextErrors.nom = "Indiquez votre nom.";
    if (!email.trim()) nextErrors.email = "Indiquez votre email.";
    else if (!EMAIL_RE.test(email.trim())) nextErrors.email = "Entrez une adresse email valide.";
    if (!message.trim()) nextErrors.message = "Décrivez votre besoin.";
    else if (message.trim().length < 10) nextErrors.message = "Votre message doit contenir au moins 10 caractères.";

    return nextErrors;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isSubmitting) return;

    const formValues: FormValues = {
      nom: values.nom.trim(),
      email: values.email.trim(),
      message: values.message.trim(),
    };

    const nextErrors = validate(formValues);

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      setFeedback("");
      setFeedbackTone(null);
      return;
    }

    setErrors({});
    setFeedback("");
    setFeedbackTone(null);
    setIsSubmitting(true);

    try {
      const response = await fetch(WEB3FORMS_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          access_key: WEB3FORMS_ACCESS_KEY,
          name: formValues.nom,
          email: formValues.email,
          message: formValues.message,
          subject: WEB3FORMS_SUBJECT,
          botcheck: honeypot,
        }),
      });

      const result = (await response.json().catch(() => null)) as ContactApiResponse | null;

      if (!response.ok || result?.success !== true) {
        console.error("[contact-form] Web3Forms submission failed", {
          status: response.status,
          response: result,
        });

        setFeedbackTone("error");
        setFeedback("Une erreur est survenue. Réessayez.");
        return;
      }

      setValues({ nom: "", email: "", message: "" });
      setHoneypot("");
      setFeedbackTone("success");
      setFeedback("Message envoyé ✓");
    } catch (error) {
      console.error("[contact-form] Network error", error);
      setFeedbackTone("error");
      setFeedback("Une erreur est survenue. Réessayez.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const buttonLabel = isSubmitting
    ? "Envoi en cours..."
    : feedbackTone === "success"
      ? "Message envoyé ✓"
      : "Envoyer le message";

  return (
    <form onSubmit={handleSubmit} noValidate style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          left: "-9999px",
          width: "1px",
          height: "1px",
          overflow: "hidden",
        }}
      >
        <label htmlFor="contact-company">Entreprise</label>
        <input
          id="contact-company"
          name="botcheck"
          type="text"
          value={honeypot}
          onChange={(event) => setHoneypot(event.target.value)}
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        <label
          htmlFor="contact-nom"
          style={{
            fontFamily: MONO,
            fontSize: "0.5rem",
            color: errors.nom ? ACCENT : "#7E7E7E",
            letterSpacing: "0.28em",
            textTransform: "uppercase",
          }}
        >
          Nom
        </label>
        <input
          id="contact-nom"
          name="nom"
          type="text"
          value={values.nom}
          onChange={(event) => updateField("nom", event.target.value)}
          aria-invalid={Boolean(errors.nom)}
          aria-describedby={errors.nom ? "contact-nom-error" : undefined}
          required
          autoComplete="name"
          className="w-full rounded-[20px] border border-white/10 bg-white/[0.03] px-5 py-4 text-white outline-none transition-all duration-300 placeholder:text-white/25 focus:border-[#FC1235]/60 focus:bg-[#FC1235]/[0.04] focus:ring-2 focus:ring-[#FC1235]/10"
          placeholder="Votre nom"
          style={{ fontFamily: SANS, fontSize: "1rem", letterSpacing: "-0.01em" }}
        />
        {errors.nom && (
          <span
            id="contact-nom-error"
            role="alert"
            style={{
              fontFamily: MONO,
              fontSize: "0.46rem",
              color: ACCENT,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
            }}
          >
            {errors.nom}
          </span>
        )}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        <label
          htmlFor="contact-email"
          style={{
            fontFamily: MONO,
            fontSize: "0.5rem",
            color: errors.email ? ACCENT : "#7E7E7E",
            letterSpacing: "0.28em",
            textTransform: "uppercase",
          }}
        >
          Email
        </label>
        <input
          id="contact-email"
          name="email"
          type="email"
          value={values.email}
          onChange={(event) => updateField("email", event.target.value)}
          aria-invalid={Boolean(errors.email)}
          aria-describedby={errors.email ? "contact-email-error" : undefined}
          required
          autoComplete="email"
          className="w-full rounded-[20px] border border-white/10 bg-white/[0.03] px-5 py-4 text-white outline-none transition-all duration-300 placeholder:text-white/25 focus:border-[#FC1235]/60 focus:bg-[#FC1235]/[0.04] focus:ring-2 focus:ring-[#FC1235]/10"
          placeholder="vous@entreprise.com"
          style={{ fontFamily: SANS, fontSize: "1rem", letterSpacing: "-0.01em" }}
        />
        {errors.email && (
          <span
            id="contact-email-error"
            role="alert"
            style={{
              fontFamily: MONO,
              fontSize: "0.46rem",
              color: ACCENT,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
            }}
          >
            {errors.email}
          </span>
        )}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        <label
          htmlFor="contact-message"
          style={{
            fontFamily: MONO,
            fontSize: "0.5rem",
            color: errors.message ? ACCENT : "#7E7E7E",
            letterSpacing: "0.28em",
            textTransform: "uppercase",
          }}
        >
          Message
        </label>
        <textarea
          id="contact-message"
          name="message"
          value={values.message}
          onChange={(event) => updateField("message", event.target.value)}
          aria-invalid={Boolean(errors.message)}
          aria-describedby={errors.message ? "contact-message-error" : undefined}
          required
          rows={6}
          className="w-full rounded-[20px] border border-white/10 bg-white/[0.03] px-5 py-4 text-white outline-none transition-all duration-300 placeholder:text-white/25 focus:border-[#FC1235]/60 focus:bg-[#FC1235]/[0.04] focus:ring-2 focus:ring-[#FC1235]/10"
          placeholder="Décrivez votre besoin."
          style={{
            fontFamily: SANS,
            fontSize: "1rem",
            letterSpacing: "-0.01em",
            lineHeight: 1.6,
            resize: "vertical",
            minHeight: "160px",
          }}
        />
        {errors.message && (
          <span
            id="contact-message-error"
            role="alert"
            style={{
              fontFamily: MONO,
              fontSize: "0.46rem",
              color: ACCENT,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
            }}
          >
            {errors.message}
          </span>
        )}
      </div>

      {feedback && (
        <p
          aria-live="polite"
          role={feedbackTone === "error" ? "alert" : "status"}
          style={{
            margin: 0,
            fontFamily: MONO,
            fontSize: "0.48rem",
            color: feedbackTone === "error" ? ACCENT : "#B8B8B8",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            lineHeight: 1.8,
          }}
        >
          {feedback}
        </p>
      )}

      <ProjectShinyButton
        type="submit"
        disabled={isSubmitting}
        aria-busy={isSubmitting}
        className="project-shiny-button--wide mt-1 w-full"
        icon={
          <svg width="11" height="11" viewBox="0 0 13 13" fill="none">
            <path
              d="M1 12L12 1M12 1H5M12 1V8"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        }
      >
        {buttonLabel}
      </ProjectShinyButton>
    </form>
  );
}

export function ContactPage() {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
    setCursorState("default");

    return () => {
      setCursorState("default");
    };
  }, []);

  return (
    <div className="min-h-screen bg-black overflow-x-hidden" style={{ fontFamily: SANS }}>
      <CustomCursor sleepWhenIdle />
      <StickyNav />

      <main>
        <section
          className="relative overflow-hidden bg-black"
          style={{
            paddingTop: "clamp(7.5rem, 16vw, 10.5rem)",
            paddingBottom: "clamp(4.5rem, 10vw, 6.5rem)",
          }}
        >
          <ContactBeamsBackground />

          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              left: "50%",
              top: "20%",
              width: "560px",
              height: "320px",
              transform: "translateX(-50%)",
              background: "radial-gradient(ellipse, rgba(252,18,53,0.055) 0%, rgba(252,18,53,0.022) 34%, transparent 72%)",
              pointerEvents: "none",
            }}
          />

          <div className="relative z-10 mx-auto px-5 sm:px-6 md:px-10 lg:px-12" style={{ maxWidth: "960px" }}>
            <ContactAnimatedCard className="mx-auto w-full max-w-[720px]">
              <div style={{ padding: "clamp(1.5rem, 4vw, 2.5rem)" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem", marginBottom: "clamp(1.5rem, 3vw, 2rem)" }}>
                  <span
                    style={{
                      fontFamily: MONO,
                      fontSize: "0.5rem",
                      color: ACCENT,
                      letterSpacing: "0.34em",
                      textTransform: "uppercase",
                      lineHeight: 1,
                    }}
                  >
                    Contact
                  </span>
                  <h1
                    style={{
                      margin: 0,
                      fontFamily: SANS,
                      fontSize: "clamp(2.2rem, 6vw, 4rem)",
                      fontWeight: 700,
                      lineHeight: 0.96,
                      letterSpacing: "-0.05em",
                      color: "#FFFFFF",
                    }}
                  >
                    Parlons de votre projet
                  </h1>
                </div>

                <ContactForm />
                <PricingBlock />
              </div>
            </ContactAnimatedCard>
          </div>
        </section>
      </main>

      <Footer disableSignatureParallax disableEmailMailto />
    </div>
  );
}

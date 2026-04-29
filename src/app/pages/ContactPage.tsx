import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { Footer } from "../components/Footer";
import { StickyNav } from "../components/StickyNav";
import { CustomCursor, setCursorState } from "../components/CustomCursor";

const SANS = "'Space Grotesk', sans-serif";
const MONO = "'JetBrains Mono', monospace";
const ACCENT = "#FC1235";
const MAIL_SUBJECT = "Projet — Evans Bilong";
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const FORMSPREE_ENDPOINT = (
  ((import.meta as unknown as { env?: Record<string, string | undefined> }).env?.VITE_FORMSPREE_ENDPOINT) ?? ""
).trim();

type FormValues = {
  nom: string;
  email: string;
  message: string;
};

type FormErrors = Partial<Record<keyof FormValues, string>>;

function buildMailtoUrl({ nom, email, message }: FormValues) {
  const body = encodeURIComponent(`Nom : ${nom}\nEmail : ${email}\n\nMessage :\n${message}`);
  return `mailto:bilongevans@gmail.com?subject=${encodeURIComponent(MAIL_SUBJECT)}&body=${body}`;
}

function ContactForm() {
  const [values, setValues] = useState<FormValues>({ nom: "", email: "", message: "" });
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

    return nextErrors;
  };

  const openMailtoFallback = (formValues: FormValues) => {
    setFeedbackTone("success");
    setFeedback("Votre message est prêt.");

    window.setTimeout(() => {
      window.location.href = buildMailtoUrl(formValues);
    }, 0);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

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

    if (!FORMSPREE_ENDPOINT) {
      openMailtoFallback(formValues);
      setIsSubmitting(false);
      return;
    }

    try {
      const payload = new FormData();
      payload.append("nom", formValues.nom);
      payload.append("email", formValues.email);
      payload.append("message", formValues.message);
      payload.append("_subject", MAIL_SUBJECT);

      const response = await fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: payload,
      });

      const result = await response.json().catch(() => null);

      if (!response.ok) {
        const serverMessage =
          Array.isArray(result?.errors) && typeof result.errors[0]?.message === "string"
            ? result.errors[0].message
            : "Une erreur est survenue. Réessayez ou envoyez-moi un email.";

        setFeedbackTone("error");
        setFeedback(serverMessage);
        return;
      }

      setValues({ nom: "", email: "", message: "" });
      setFeedbackTone("success");
      setFeedback("Message envoyé.");
    } catch {
      openMailtoFallback(formValues);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
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
          className="w-full rounded-[20px] border border-white/10 bg-white/[0.03] px-5 py-4 text-white outline-none transition-all duration-300 placeholder:text-white/25 focus:border-[#FC1235]/60 focus:bg-[#FC1235]/[0.04] focus:ring-2 focus:ring-[#FC1235]/10"
          placeholder="Votre nom"
          style={{ fontFamily: SANS, fontSize: "1rem", letterSpacing: "-0.01em" }}
        />
        {errors.nom && (
          <span
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
          className="w-full rounded-[20px] border border-white/10 bg-white/[0.03] px-5 py-4 text-white outline-none transition-all duration-300 placeholder:text-white/25 focus:border-[#FC1235]/60 focus:bg-[#FC1235]/[0.04] focus:ring-2 focus:ring-[#FC1235]/10"
          placeholder="vous@entreprise.com"
          style={{ fontFamily: SANS, fontSize: "1rem", letterSpacing: "-0.01em" }}
        />
        {errors.email && (
          <span
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

      <button
        type="submit"
        disabled={isSubmitting}
        className="group inline-flex w-full items-center justify-between rounded-full bg-white px-6 py-4 text-black transition-all duration-500 hover:bg-[#FC1235] hover:text-white disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
        style={{
          border: "1px solid rgba(252,18,53,0.18)",
          boxShadow: "0 14px 40px rgba(255,255,255,0.06), 0 0 0 1px rgba(252,18,53,0.12)",
        }}
      >
        <span
          style={{
            fontFamily: SANS,
            fontSize: "1rem",
            fontWeight: 600,
            letterSpacing: "-0.015em",
            lineHeight: 1,
          }}
        >
          {isSubmitting ? "Envoi en cours…" : "Envoyer le message"}
        </span>
        <span
          className="ml-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-black text-white transition-all duration-500 group-hover:translate-x-1 group-hover:bg-white/20"
        >
          <svg width="11" height="11" viewBox="0 0 13 13" fill="none">
            <path
              d="M1 12L12 1M12 1H5M12 1V8"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </button>
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
      <CustomCursor />
      <StickyNav />

      <main>
        <section
          className="relative"
          style={{
            paddingTop: "clamp(7.5rem, 16vw, 10.5rem)",
            paddingBottom: "clamp(4.5rem, 10vw, 6.5rem)",
          }}
        >
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              left: "50%",
              top: "20%",
              width: "560px",
              height: "320px",
              transform: "translateX(-50%)",
              background: "radial-gradient(ellipse, rgba(252,18,53,0.08) 0%, transparent 68%)",
              filter: "blur(56px)",
              pointerEvents: "none",
            }}
          />

          <div className="relative z-10 mx-auto px-5 sm:px-6 md:px-10 lg:px-12" style={{ maxWidth: "960px" }}>
            <div
              className="mx-auto w-full max-w-[720px]"
              style={{
                borderRadius: "28px",
                border: "1px solid rgba(255,255,255,0.08)",
                background: "linear-gradient(180deg, rgba(255,255,255,0.025) 0%, rgba(255,255,255,0.012) 100%)",
                boxShadow: "0 30px 80px rgba(0,0,0,0.42), inset 0 1px 0 rgba(255,255,255,0.03)",
                backdropFilter: "blur(10px)",
                WebkitBackdropFilter: "blur(10px)",
                padding: "clamp(1.5rem, 4vw, 2.5rem)",
              }}
            >
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
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

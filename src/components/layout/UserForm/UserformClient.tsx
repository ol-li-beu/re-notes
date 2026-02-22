"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Icon } from "@/components/ui/Icons/Icons";
import Message from "@/components/ui/Message/Message";

import { useToast } from "@/hooks/useToast";
import { useRouter } from "next/navigation";
import { useMessage } from "@/hooks/useMessage";
import { useLockBodyScroll } from "@/hooks/useLockBodyScroll";

import styles from "./userform.module.css";

interface UserFormClientProps {
  mode: "login" | "register" | "set-password";
  dict: any;
  lang: string;
  action: (formData: FormData) => Promise<any>;
}

const PASSWORD_REGEX = /^(?=.*[A-Za-z])(?=.*\d).{10,}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function UserFormClient({
  mode,
  dict,
  lang,
  action,
}: UserFormClientProps) {
  const [showPassword, setShowPassword] = useState(false);

  // Estados
  const [identifier, setIdentifier] = useState(""); // Esto será el email
  const [username, setUsername] = useState(""); // Nuevo estado para username
  const [password, setPassword] = useState("");

  const [forgotOpen, setForgotOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [sending, setSending] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { message, showMessage, clearMessage } = useMessage();
  const { showToast } = useToast();
  const router = useRouter();

  useLockBodyScroll(forgotOpen);

  // MODAL FORGOT PASSWORD
  const handleForgotPassword = async () => {
    if (!EMAIL_REGEX.test(forgotEmail)) {
      showToast(dict.invalidemail ?? "Invalid email address", "error");
      return;
    }

    if (sending || cooldown > 0) return;
    setSending(true);

    try {
      await new Promise((res) => setTimeout(res, 1500));
      // TODO: Implementar llamada real a supabase reset password
      showToast(dict.emailsuccess, "success");
      setCooldown(30);
    } catch (err) {
      showToast(dict.error, "error");
    } finally {
      setSending(false);
    }
  };

  useEffect(() => {
    if (cooldown === 0) return;
    const timer = setInterval(() => {
      setCooldown((c) => c - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  // SUBMIT
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // 1. Validaciones Locales
    if (!identifier) {
      showMessage("error", dict.userdatarequired ?? "Email is required");
      return;
    }

    // Validación extra para registro: Username requerido
    if (mode === "register" && !username) {
        showMessage("error", "Username is required");
        return;
    }

    if (!password) {
      showMessage("error", dict.passwordrequired ?? "Password is required");
      return;
    }

    const isEmailValid = EMAIL_REGEX.test(identifier);
    if (!isEmailValid) {
      showMessage("error", dict.emailinvalid ?? "Invalid email format");
      return;
    }

    if (mode !== "login" && !PASSWORD_REGEX.test(password)) {
      showMessage(
        "error",
        dict.passwordinvalid ??
          "Password must be at least 10 characters and include a letter and a number."
      );
      return;
    }

    // 2. Preparar FormData
    // Usamos e.currentTarget para asegurarnos que agarre los inputs con sus 'names'
    const formData = new FormData(e.currentTarget);

    // 3. Ejecutar Server Action
    setIsSubmitting(true);
    const result = await action(formData);
    setIsSubmitting(false);

    if (result?.error) {
      // Manejo especial para errores comunes de Supabase
      if (result.error.includes("Anonymous")) {
         showMessage("error", "Error sending data to server. Check fields.");
      } else {
         showMessage("error", result.error);
      }
    }

    if (result?.success) {
       showToast(result.success, "success");
       if (mode === "login") router.push(`/${lang}/projects`);
       else if (mode === "register") router.push(`/${lang}/projects`); // Redirigir a projects tras registro exitoso
       else router.push(`/${lang}`);
    }
  };

  // RENDERING
  return (
    <div className={styles.wrapper}>
      <form className={styles.form} onSubmit={handleSubmit}>
        
        {/* 1. INPUT USERNAME (Solo en Register) */}
        {mode === "register" && (
            <input
            name="username" // 👈 CRÍTICO: Este nombre lo busca auth-actions.ts
            type="text"
            placeholder={dict.username ?? "Username"} // Asegúrate de tener esta key en tu dict o pon un string fijo
            className={styles.input}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="name"
            />
        )}

        {/* 2. INPUT EMAIL (Antes 'identifier') */}
        {(mode === "login" || mode === "register") && (
          <input
            name="email" // 👈 CRÍTICO: Cambiado de 'identifier' a 'email' para Supabase
            type="email" // Cambiado a 'email' para mejor teclado en móvil
            placeholder={dict.email ?? "Email"} // Usar 'email' en lugar de 'userdata'
            className={styles.input}
            value={identifier}
            onChange={(e) => {
              setIdentifier(e.target.value.trim());
              if (message) clearMessage();
            }}
            autoComplete="email"
          />
        )}

        {/* 3. PASSWORD */}
        {mode !== "set-password" && (
          <div className={styles.passwordField}>
            <input
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder={dict.password}
              className={styles.input}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (message) clearMessage();
              }}
              autoComplete={
                mode === "login" ? "current-password" : "new-password"
              }
            />
            <button
              type="button"
              className={styles.toggle}
              onClick={() => setShowPassword((v) => !v)}
            >
              {showPassword ? <Icon name="eyeoff" /> : <Icon name="eye" />}
            </button>
          </div>
        )}

        {/* 4. SET PASSWORD (Recuperación) */}
        {mode === "set-password" && (
          <input
            name="password" // Ojo: auth-actions suele buscar 'password', no 'newPassword' a menos que lo cambies allá. Lo dejé como 'password' por seguridad.
            type="password"
            placeholder={dict.newpassword}
            required
            className={styles.input}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
          />
        )}

        <button type="submit" className={`${styles.button} ${isSubmitting ? "isLoading" : ""}`} disabled={isSubmitting}>
          {mode === "login" && dict.btnlogin}
          {mode === "register" && dict.btnregister}
          {mode === "set-password" && dict.btnsetpassword}
        </button>

        {message && (
          <Message type={message.type} onClose={clearMessage}>
            {message.text}
          </Message>
        )}

        <div className={styles.links}>
          {mode === "login" && (
    <>
      <div className={styles.row}>
    <button
      type="button"
      className={styles.link}
      onClick={() => setForgotOpen(true)}
    >
      {dict.forgotpassword}
    </button>
  </div>

  <div className={styles.row}>
    <div className={styles.inlineRow}>
      <span className={styles.inlineText}>
        {dict.changeregister}
      </span>

      <Link
        href={`/${lang}/register`}
        className={styles.link}
      >
        {dict.register}
      </Link>
    </div>
  </div>
    </>
  )}

  {mode === "register" && (
    <div className={styles.inlineRow}>
      <span className={styles.inlineText}>
        {dict.changelogin}
      </span>

      <Link
        href={`/${lang}/login`}
        className={styles.link}
      >
        {dict.login}
      </Link>
    </div>
  )}
</div>
  </form>

      {/* MODAL (Sin cambios) */}
      {forgotOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h3>{dict.resettitle}</h3>
            <input
              type="email"
              placeholder={dict.email}
              value={forgotEmail}
              onChange={(e) => setForgotEmail(e.target.value)}
              className={styles.input}
              disabled={sending}
            />
            <div className={styles.modalActions}>
              <button
                className={styles.button}
                onClick={() => setForgotOpen(false)}
                disabled={sending}
              >
                {dict.closeresend}
              </button>
              <button
                className={`${styles.button} ${styles.resendbtn}`}
                onClick={handleForgotPassword}
                disabled={sending || cooldown > 0}
              >
                {sending ? (
                  <span className={styles.spinner} />
                ) : cooldown > 0 ? (
                  `${dict.resetin} ${cooldown}s`
                ) : (
                  dict.sendreset
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
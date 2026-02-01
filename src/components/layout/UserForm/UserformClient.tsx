"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import styles from "./userform.module.css";
import { Icon } from "@/components/ui/Icons/Icons";
import { useToast } from "@/hooks/useToast";
import { useRouter } from "next/navigation";

interface UserFormClientProps {
  mode: "login" | "register" | "set-password";
  dict: any;
  lang: string;
  action: (formData: FormData) => Promise<any>;
}

const PASSWORD_REGEX = /^(?=.*[A-Za-z])(?=.*\d).{10,}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function UserFormClient({ mode, dict, lang, action,}: UserFormClientProps) {
  const [showPassword, setShowPassword] = useState(false);

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");

  const [forgotOpen, setForgotOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [sending, setSending] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  const { showToast } = useToast();
  const router = useRouter();

  // FORGOT PASSWORD
  const handleForgotPassword = async () => {
    if (!EMAIL_REGEX.test(forgotEmail)) {
      showToast(dict.invalidemail ?? "Invalid email address", "error");
      return;
    }

    if (sending || cooldown > 0) return;

    setSending(true);

    try {
      await new Promise((res) => setTimeout(res, 1500));
    // TODO TBD: supabase reset
      const error = null;  // use this
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
  


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();

  const looksLikeEmail = identifier.includes("@");
  const isEmailValid =
    !looksLikeEmail || EMAIL_REGEX.test(identifier);

  if (!isEmailValid) {
    showToast(dict.emailinvalid ?? "Invalid email format", "error");
    return;
  }

  if (!PASSWORD_REGEX.test(password)) {
    showToast(
      dict.passwordinvalid ??
        "Password must be at least 10 characters and include a letter and a number.",
      "error"
    );
    return;
  }

  const formData = new FormData(e.currentTarget);

  const result = await action(formData);


  if (result?.error) {
    showToast(result.error, "error"); //TBD lib supabase try send error or {}, if it works set up auth, 
  }

  // TBD from database receive success or not after auth

  if (result?.success) {
    router.push(`/${lang}/projects`);
  }
};

// REndering

  return (
    <div className={styles.wrapper}>
      <form className={styles.form} onSubmit={handleSubmit}>
        {(mode === "login" || mode === "register") && (
          <input
            name="identifier"
            type="text"
            placeholder={dict.userdata} // "Email or username"
            required
            className={styles.input}
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value.trim())}
            autoComplete="username"
          />
        )}

        {mode !== "set-password" && (
          <div className={styles.passwordField}>
            <input
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder={dict.password}
              required
              className={styles.input}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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

        {mode === "set-password" && (
          <input
            name="newPassword"
            type="password"
            placeholder={dict.newpassword}
            required
            className={styles.input}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
          />
        )}

        <button
          type="submit"
          className={styles.button}
        >
          {mode === "login" && dict.btnlogin}
          {mode === "register" && dict.btnregister}
          {mode === "set-password" && dict.btnsetpassword}
        </button>

        <div className={styles.links}>
          {mode === "login" && (
            <>
              <button
                type="button"
                className={styles.link}
                onClick={() => setForgotOpen(true)}
              >
                {dict.forgotpassword}
              </button>

              <span>
                {dict.changeregister}{" "}
                <Link href={`/${lang}/register`} className={styles.link}>
                  {dict.register}
                </Link>
              </span>
            </>
          )}

          {mode === "register" && (
            <span>
              {dict.changelogin}{" "}
              <Link href={`/${lang}/login`} className={styles.link}>
                {dict.login}
              </Link>
            </span>
          )}
        </div>
      </form>

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
                className={styles.resendbtn}
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
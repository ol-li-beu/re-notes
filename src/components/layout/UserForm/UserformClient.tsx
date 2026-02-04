"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Icon } from "@/components/ui/Icons/Icons";
import Message from "@/components/ui/Message/Message";

import { useToast } from "@/hooks/useToast";
import { useRouter } from "next/navigation";
import { useMessage } from "@/hooks/useMessage";

import styles from "./userform.module.css";


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

  const { message, showMessage, clearMessage } = useMessage();
  const { showToast } = useToast();
  const router = useRouter();


  // ANTI Scroll ON MODAL
  useEffect(() => {
  if (forgotOpen) {
    document.body.style.overflow = "hidden";
  } else {
    document.body.style.overflow = "";
  }

  return () => {
    document.body.style.overflow = "";
  };
  }, [forgotOpen]);




  // BCK 
  // MODAL FORGOT PASSWORD para mandar mail custom supabase
  const handleForgotPassword = async () => {
    if (!EMAIL_REGEX.test(forgotEmail)) {
      showToast(dict.invalidemail ?? "Invalid email address", "error");
      return;
    }

    if (sending || cooldown > 0) return;

    setSending(true);

    try {
      // ELIMINAR AWAIT
      await new Promise((res) => setTimeout(res, 1500));
      
      // THROW ERROR si no funcitona
      const error = null;  // BCK function supabase send email de reset password llamar

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



// SUBMIT for reset password, login, sign up

const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  
  if (!identifier) {
    showMessage("error", dict.userdatarequired ?? "Email or username is required");
    return;
  }

  if (!password) {
    showMessage("error", dict.passwordrequired ?? "Password is required");
    return;
  }



  
  const looksLikeEmail = identifier.includes("@");
  const isEmailValid = !looksLikeEmail || EMAIL_REGEX.test(identifier);

  if (!isEmailValid) {
    showMessage("error", dict.emailinvalid ?? "Invalid email format");
    return;
  }

  if (mode !== "login" && !PASSWORD_REGEX.test(password)) {
    showMessage( "error",
    dict.passwordinvalid ?? "Password must be at least 10 characters and include a letter and a number.");
    return;
  }

  
  const formData = new FormData(e.currentTarget);


  const result = await action(formData); // ACTION VARIES DEPENDING ON PAGE 
  
  // formData.identifier, etc. 
  // result = {success : "message from dict"} or {error : "messagefrom dict"}
  // functiones async
  // getDictionary de utils. NEcesario obtener el [lang] actual para get del diccionario del mismo idioma



  if (result?.error) {
    showMessage("error", result.error); 
  }

  


  
  if (result?.success && mode==="login") {
    showToast(result.success, "success"); // logged in successfully
    router.push(`/${lang}/projects`);
  }

  if (result?.success && mode==="register") {
    showToast(result.success, "success"); // registered successfully
    router.push(`/${lang}`);
  }

  if (result?.success && mode==="set-password") {
    showToast(result.success, "success"); // password changed successfully
    router.push(`/${lang}`);
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
            className={styles.input}
            value={identifier}
            onChange={(e) => 
              {setIdentifier(e.target.value.trim()); 
              if (message) clearMessage(); }}
            autoComplete="username"
          />
        )}

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

        {message && (
        <Message type={message.type} onClose={clearMessage}>
          {message.text}
        </Message>
        )}

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
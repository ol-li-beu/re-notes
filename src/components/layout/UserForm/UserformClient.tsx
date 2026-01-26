"use client";

import { useState } from "react";
import styles from "./userform.module.css";
import { EyeOff, EyeOn } from "@/components/ui/EyeButton/EyeButton";

interface UserFormClientProps {
  mode: "login" | "register" | "set-password";
  dict: any;
  action: (formData: FormData) => Promise<void>;
}

export default function UserFormClient({
  mode,
  dict,
  action,
}: UserFormClientProps) {
  const [showPassword, setShowPassword] = useState(false);

  const buttonClass =
    mode === "login"
      ? styles.loginBtn
      : mode === "register"
      ? styles.registerBtn
      : styles.changePasswordBtn;

  return (
    <div className={styles.wrapper}>
      <form action={action} className={styles.form}>
        {(mode === "login" || mode === "register") && (
          <input
            name="userdata"
            type="userdata"
            placeholder={dict.userdata}
            required
            className={`${styles.input} ${styles.email}`}
          />
        )}

        {mode !== "set-password" && (
          <div className={styles.passwordField}>
            <input
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder={dict.password}
              required
              className={`${styles.input} ${styles.password}`}
            />
            <button
              type="button"
              className={styles.toggle}
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff /> : <EyeOn />}
            </button>
          </div>
        )}

        {mode === "set-password" && (
          <div className={styles.passwordField}>
            <input
              name="newPassword"
              type={showPassword ? "text" : "password"}
              placeholder={dict.newpassword}
              required
              className={`${styles.input} ${styles.newPassword}`}
            />
            <button
              type="button"
              className={styles.toggle}
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOn />: <EyeOff />}
            </button>
          </div>
        )}

        <button type="submit" className={`${styles.button} ${buttonClass}`}>
          {mode === "login" && dict.btnlogin}
          {mode === "register" && dict.btnregister}
          {mode === "set-password" && dict.btnsetpassword}
        </button>
      </form>
    </div>
  );
}
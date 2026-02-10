import UserFormClient from "./UserformClient";
// 1. Importamos las acciones REALES (no las de test)
import { handleLogin, handleRegister } from "@/utils/auth-actions";

export default function UserForm({ mode, dict, lang }: any) {

  // 2. Elegimos qué función usar según el "mode" ('login' o 'register')
  // Usamos .bind(null, lang) para "pre-cargar" el idioma en la función,
  // ya que tu Server Action espera (lang, formData).
  const action = mode === 'login' 
    ? handleLogin.bind(null, lang) 
    : handleRegister.bind(null, lang);

  return (
    <UserFormClient
      mode={mode}
      lang={lang}
      dict={dict}
      action={action} // Aquí pasamos la función real conectada a Supabase
    />
  );
}
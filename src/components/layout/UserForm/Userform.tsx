import UserFormClient from "./UserformClient";
import { testAction } from "./test";

type UserFormMode = "login" | "register" | "set-password";

interface UserFormProps {
    mode : UserFormMode;
    dict : any;
    user : any;
    lang : string;
}


export default function UserForm({mode, lang, dict, user}: UserFormProps) {
    const action =
    mode === "login"
      ? testAction //login
      : mode === "register"
      ? testAction // register
      : testAction; // passwd
      //TBD SUPABASE BUILT IN FUNCTIONS in LIB, handlelogin etc, add the logic. receives form data and void promise
      // formdata.get
      // lang and user is handled in page.tsx mdidleware and server handler

  return (
    <UserFormClient
      mode={mode}
      dict={dict.userform}
      action={action}
    />
  );
}
import UserFormClient from "./UserformClient";
import { testAction } from "./test";

export default function UserForm({ mode, dict, lang }: any) {

  // BCK import functiones de login register y set password de backend y pasarlo como prop action={function} dependiendo del modo

  // usar el modo importado 
  
  return (
    <UserFormClient
      mode={mode}
      lang={lang}
      dict={dict}
      action={testAction}
    />
  );
}
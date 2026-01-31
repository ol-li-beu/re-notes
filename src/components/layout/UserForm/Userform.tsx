import UserFormClient from "./UserformClient";
import { testAction } from "./test";

export default function UserForm({ mode, dict, lang }: any) {
  return (
    <UserFormClient
      mode={mode}
      lang={lang}
      dict={dict}
      action={testAction}
    />
  );
}
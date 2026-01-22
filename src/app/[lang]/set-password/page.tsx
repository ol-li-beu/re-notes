import { getAuthUser } from "@/utils/auth-actions";
import { getDictionary } from "@/utils/get-dictionary";
import UserForm from "@/components/layout/UserForm/Userform";

interface PageProps {
  params: {
    lang: string;
  };
}

export default async function SetPasswordPage({ params }: PageProps) {
  const { lang } = await params;
  const dictionary = await getDictionary(lang as any);
  const user = await getAuthUser(); //TBD Supabase built-in authentication from session that is set in log in

  return (<>
    <UserForm 
    mode="set-password" 
    lang={lang} 
    dict={dictionary} 
    user={user}
    />
  </>);
}
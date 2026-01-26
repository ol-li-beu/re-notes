

import { getDictionary } from "@/utils/get-dictionary";


interface PageProps {
  params: {
    lang: string;
  };
}

export default async function Page({params} : PageProps) {
  const {lang} = await params;

  const dict = await getDictionary(lang);
  return (<>
    
  </>);
  
}
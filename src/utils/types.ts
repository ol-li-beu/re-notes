import { Trash2, PlusSquare, PencilLine, Undo2, Mail, LogOut, LogIn, Sun, Moon,
     Eye, EyeOff, Computer, UserCircle, UserRoundPen, Search, UserRoundPlus, LucideUserRoundX, Menu  } from "lucide-react";

import { SiGithub, } from "@icons-pack/react-simple-icons"

export type Project = {
  id: string;
  title: string;
  description: string;
};

export interface PageProps {
    params : {lang : string}
}

export interface PagePropsCanvas {
    params : {lang : string, canvasID : string}
}

export const ICONSTYPE = {
  github: SiGithub,

  trash: Trash2,
  create: PlusSquare,
  edit: PencilLine,
  undo: Undo2,
  mail: Mail,
  logout: LogOut,
  sun: Sun,
  moon: Moon,
  eye: Eye, 
  eyeoff: EyeOff,
  repo: Computer,
  user: UserCircle,
  userpen : UserRoundPen,
  search: Search,
  login: LogIn,
  userx: LucideUserRoundX,
  userplus: UserRoundPlus,
  menu: Menu,

  
} 

export type IconName = keyof typeof ICONSTYPE;
import { Trash2, PlusSquare, PencilLine, Undo2, Mail, LogIn, Sun, Moon,
     Eye, EyeOff, Computer, User } from "lucide-react";

import { SiGithub } from "@icons-pack/react-simple-icons"

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
  trash: Trash2,
  create: PlusSquare,
  edit: PencilLine,
  undo: Undo2,
  mail: Mail,
  logout: LogIn,
  sun: Sun,
  moon: Moon,
  eye: Eye, 
  eyeoff: EyeOff,
  repo: Computer,
  user: User,

  github: SiGithub,
} 

export type IconName = keyof typeof ICONSTYPE;
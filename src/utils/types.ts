import { Trash2, PlusSquare, PencilLine, Undo2, Mail, LogIn, Sun, Moon,
     Eye, EyeOff, GithubIcon, Computer } from "lucide-react";

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
  github: GithubIcon,
  repo: Computer,
} 

export type IconName = keyof typeof ICONSTYPE;
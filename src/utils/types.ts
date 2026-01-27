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
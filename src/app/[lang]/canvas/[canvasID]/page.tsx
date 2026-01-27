

import { PagePropsCanvas } from "@/utils/types";

export default async function CanvasPage({params} : PagePropsCanvas) {
    const {lang, canvasID} = await params;

    return (<div> <p> canvasId: {canvasID} {lang} </p> </div>)

}
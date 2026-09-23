import { useEffect, useRef } from "react"
import { type Zoom } from "medium-zoom";
import mediumZoom from 'medium-zoom/dist/pure'
import 'medium-zoom/dist/style.css'

const MediumZoom = ({ selectors }: { selectors: string[] }) => {
  const zoom = useRef<Zoom>(mediumZoom());

  useEffect(() => {
    zoom.current.attach(...selectors);
    console.log("mediumZoom attached");

    return () => {
      zoom.current.detach();
      console.log("mediumZoom detached");
    };
  }, [selectors]);

  return null;
}

export default MediumZoom;

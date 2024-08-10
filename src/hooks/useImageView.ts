import {
  type MouseEvent as ReactMouseEvent,
  useContext,
  useRef,
  useState,
  useEffect,
} from "react";
import { ImageContext, SelectorData } from "../components/ImageContext";
import { checkOverlap } from "../utils/checkOverlap";

export function useImageView() {
  const { selectors, setSelectors, setActiveSelector } =
    useContext(ImageContext);

  const [isDragging, setIsDragging] = useState(false);
  const [isOverlap, setIsOverlap] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [endPos, setEndPos] = useState({ x: 0, y: 0 });

  const imgRef = useRef<HTMLImageElement>(null);

  const handleMouseDown = (e: ReactMouseEvent<HTMLImageElement>) => {
    if (!imgRef.current) return;
    const rect = imgRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setStartPos({ x, y });
    setEndPos({ x, y });
    setIsDragging(true);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || !imgRef.current) return;
      const rect = imgRef.current.getBoundingClientRect();
      const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
      const y = Math.max(0, Math.min(e.clientY - rect.top, rect.height));
      setEndPos({ x, y });
      setIsOverlap(
        checkOverlap(
          {
            id: null,
            $x: x > startPos.x ? startPos.x : x,
            $y: y > startPos.y ? startPos.y : y,
            $width: Math.abs(x - startPos.x),
            $height: Math.abs(y - startPos.y),
          },
          selectors,
        ),
      );
    };

    const handleMouseUp = () => {
      if (isDragging) {
        const width = Math.abs(endPos.x - startPos.x);
        const height = Math.abs(endPos.y - startPos.y);
        const id = crypto.randomUUID();
        const newSelector: SelectorData = {
          id,
          $width: width,
          $height: height,
          $x: Math.min(startPos.x, endPos.x),
          $y: Math.min(startPos.y, endPos.y),
        };
        if (isOverlap) {
          setIsOverlap(false);
        } else {
          setSelectors((prevSelectors) => [...prevSelectors, newSelector]);
          setActiveSelector(id);
        }
      }
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    } else {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [
    isDragging,
    isOverlap,
    startPos,
    endPos,
    setActiveSelector,
    selectors,
    setSelectors,
  ]);

  return {
    imgRef,
    isDragging,
    isOverlap,
    startPos,
    endPos,
    handleMouseDown,
  };
}

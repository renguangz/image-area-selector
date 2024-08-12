import {
  type MouseEvent as ReactMouseEvent,
  type SetStateAction,
  type RefObject,
  useState,
  useCallback,
  useEffect,
} from "react";
import { type SelectorData } from "../components/ImageSelectorContext";
import { checkOverlap } from "../utils/checkOverlap";

type DraggingType = "RESIZE" | "MOVE" | null;

export type ResizeDirection = "t" | "b" | "l" | "r" | "lt" | "lb" | "rt" | "rb";

interface UseDragSelectorProps {
  mediaRef: RefObject<HTMLDivElement>;
  id?: string;
  $x?: number;
  $y?: number;
  $width?: number;
  $height?: number;
  selectors: SelectorData[];
  setSelectors: (value: SetStateAction<SelectorData[]>) => void;
  setActiveSelector: (value: SetStateAction<string | null>) => void;
}
export function useDragSelector({
  mediaRef,
  id,
  $x = 0,
  $y = 0,
  $width = 0,
  $height = 0,
  selectors,
  setSelectors,
  setActiveSelector,
}: UseDragSelectorProps) {
  const [dragging, setDragging] = useState<DraggingType>(null);
  const [isOverlap, setIsOverlap] = useState(false);
  const [isResizing, setIsResizing] = useState<ResizeDirection | undefined>(
    undefined,
  );
  const [startPos, setStartPos] = useState({ x: $x, y: $y });
  const [endPos, setEndPos] = useState({ x: $x + $width, y: $y + $height });
  const [rectWidth, setRectWidth] = useState({ x: 0, y: 0 });

  const getBoxBoundary = useCallback(() => {
    const el = mediaRef.current;
    if (!el) return { x: 0, y: 0, width: 0, height: 0 };
    const { x, y, left, top, width, height } = el.getBoundingClientRect();
    return { x, y, left, top, width, height };
  }, [mediaRef]);

  const handleDragSizeStart = (
    e: ReactMouseEvent<HTMLDivElement>,
    resizeDirection?: ResizeDirection,
  ) => {
    e.stopPropagation();
    setDragging("RESIZE");
    if (id) setActiveSelector(id);
    const boxBoundary = getBoxBoundary();
    const x = e.clientX - boxBoundary.x;
    const y = e.clientY - boxBoundary.y;

    if (!resizeDirection) {
      setStartPos({ x, y });
      setEndPos({ x, y });
    }
    setIsResizing(resizeDirection);
  };

  const handleDragMoveStart = (e: ReactMouseEvent<HTMLDivElement>) => {
    if (!id) return;
    const boxBoundary = getBoxBoundary();
    setDragging("MOVE");
    setActiveSelector(id);
    setRectWidth({
      x: Math.abs(e.clientX - boxBoundary.x - startPos.x),
      y: Math.abs(e.clientY - boxBoundary.y - startPos.y),
    });
  };

  const handleDeleteSelector = () => {
    setActiveSelector(null);
    setSelectors((prev) => prev.filter((selector) => selector.id !== id));
  };

  useEffect(() => {
    const boxBoundary = getBoxBoundary();
    const handleDragSize = (e: MouseEvent) => {
      if (dragging !== "RESIZE") return;
      const x = Math.max(
        0,
        Math.min(e.clientX - boxBoundary.x, boxBoundary.width),
      );
      const y = Math.max(
        0,
        Math.min(e.clientY - boxBoundary.y, boxBoundary.height),
      );
      const newStartPos = { ...startPos };
      const newEndPos = { ...endPos };
      if (isResizing?.includes("r")) {
        newEndPos.x = x;
      }

      if (isResizing?.includes("l")) {
        newStartPos.x = x;
      }

      if (isResizing?.includes("t")) {
        newStartPos.y = y;
      }

      if (isResizing?.includes("b")) {
        newEndPos.y = y;
      }

      if (!isResizing) {
        newEndPos.x = x;
        newEndPos.y = y;
      }

      setIsOverlap(
        checkOverlap(
          {
            id: id ?? null,
            $x: Math.min(newStartPos.x, newEndPos.x),
            $y: Math.min(newStartPos.y, newEndPos.y),
            $width: Math.abs(newEndPos.x - newStartPos.x),
            $height: Math.abs(newEndPos.y - newStartPos.y),
          },
          selectors,
        ),
      );
      setStartPos(newStartPos);
      setEndPos(newEndPos);
    };

    const handleDragMove = (e: MouseEvent) => {
      e.stopPropagation();
      if (!id || dragging !== "MOVE") return;
      const width = Math.abs(endPos.x - startPos.x);
      const height = Math.abs(endPos.y - startPos.y);
      const x = Math.max(
        0,
        Math.min(
          e.clientX - boxBoundary.x - rectWidth.x,
          Math.abs(boxBoundary.width - width),
        ),
      );
      const y = Math.max(
        0,
        Math.min(
          e.clientY - boxBoundary.y - rectWidth.y,
          Math.abs(boxBoundary.height - height),
        ),
      );
      setIsOverlap(
        checkOverlap(
          {
            id,
            $x: x,
            $y: y,
            $width: width,
            $height: height,
          },
          selectors,
        ),
      );
      setStartPos({ x, y });
      setEndPos({ x: x + width, y: y + height });
    };

    const handleDragStop = () => {
      const $width = Math.abs(endPos.x - startPos.x);
      const $height = Math.abs(endPos.y - startPos.y);
      const $id = id ? id : crypto.randomUUID();
      const newSelector: SelectorData = {
        id: $id,
        $width,
        $height,
        $x: Math.min(startPos.x, endPos.x),
        $y: Math.min(startPos.y, endPos.y),
      };
      setStartPos({
        x: Math.min(startPos.x, endPos.x),
        y: Math.min(startPos.y, endPos.y),
      });
      setEndPos({
        x: Math.max(startPos.x, endPos.x),
        y: Math.max(startPos.y, endPos.y),
      });
      const selector = selectors.find((selector) => selector.id === id);
      if (isOverlap || newSelector.$width === 0 || newSelector.$height === 0) {
        setIsOverlap(false);
        if (selector) {
          setStartPos({ x: selector.$x, y: selector.$y });
          setEndPos({
            x: selector.$x + selector.$width,
            y: selector.$y + selector.$height,
          });
        }
      } else {
        if (id === $id) {
          setSelectors((prev) =>
            prev.map((selector) => {
              if (selector.id === $id) return newSelector;
              return selector;
            }),
          );
        } else {
          setSelectors((prev) => [...prev, newSelector]);
          setActiveSelector(newSelector.id);
        }
      }
      setDragging(null);
    };

    if (dragging === "RESIZE") {
      document.addEventListener("mousemove", handleDragSize);
      document.addEventListener("mouseup", handleDragStop);
    } else if (dragging === "MOVE") {
      document.addEventListener("mousemove", handleDragMove);
      document.addEventListener("mouseup", handleDragStop);
    } else {
      document.removeEventListener("mousemove", handleDragSize);
      document.removeEventListener("mousemove", handleDragMove);
      document.removeEventListener("mouseup", handleDragStop);
    }

    return () => {
      document.removeEventListener("mousemove", handleDragSize);
      document.removeEventListener("mousemove", handleDragMove);
      document.removeEventListener("mouseup", handleDragStop);
    };
  }, [
    id,
    dragging,
    isResizing,
    isOverlap,
    rectWidth,
    startPos,
    endPos,
    selectors,
    setSelectors,
    setActiveSelector,
    getBoxBoundary,
  ]);

  return {
    dragging,
    startPos,
    endPos,
    isOverlap,
    handleDragSizeStart,
    handleDragMoveStart,
    handleDeleteSelector,
  };
}

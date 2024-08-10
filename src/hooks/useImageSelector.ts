import {
  type PointerEvent as ReactPointerEvent,
  useState,
  useEffect,
} from "react";
import { type ImageSelectorProps } from "../components/ImageSelector";
import { checkOverlap } from "../utils/checkOverlap";

export type ResizeDirection = "t" | "b" | "l" | "r" | "lt" | "lb" | "rt" | "rb";

export function useImageSelector({
  id,
  mediaRef,
  setActiveSelector,
  selectors,
  setSelectors,
  $width,
  $height,
  $x,
  $y,
}: ImageSelectorProps) {
  const [containerStyle, setContainerStyle] = useState({
    $x,
    $y,
    $width,
    $height,
  });
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState<ResizeDirection | null>(null);
  const [isOverlap, setIsOverlap] = useState(false);
  const [startX, setStartX] = useState(0);
  const [startY, setStartY] = useState(0);

  const handleDragStart = (event: ReactPointerEvent<HTMLDivElement>) => {
    setIsDragging(true);
    setActiveSelector(id);
    setStartX(event.clientX - containerStyle.$x);
    setStartY(event.clientY - containerStyle.$y);
  };

  const handleResizeStart = (
    event: ReactPointerEvent<HTMLDivElement>,
    resizeDirection: ResizeDirection,
  ) => {
    event.stopPropagation();
    setIsResizing(resizeDirection);
    setActiveSelector(id);
    setStartX(event.clientX);
    setStartY(event.clientY);
  };

  const handleDelete = () => {
    setActiveSelector(null);
    setSelectors((prev) => prev.filter((selector) => selector.id !== id));
  };

  useEffect(() => {
    const getBox = () => {
      const el = mediaRef.current;
      if (!el) {
        return { x: 0, y: 0, width: 0, height: 0 };
      }
      const { x, y, width, height } = el.getBoundingClientRect();
      return { x, y, width, height };
    };
    const box = getBox();
    const handleDrag = (event: PointerEvent) => {
      if (!isDragging) return;
      const x = Math.max(
        0,
        Math.min(
          event.clientX - startX,
          Math.abs(box.width - containerStyle.$width),
        ),
      );
      const y = Math.max(
        0,
        Math.min(
          event.clientY - startY,
          Math.abs(box.height - containerStyle.$height),
        ),
      );
      const newContainerStyle = { $x: x, $y: y };
      setIsOverlap(
        checkOverlap(
          {
            ...newContainerStyle,
            $width: containerStyle.$width,
            $height: containerStyle.$height,
            id,
          },
          selectors,
        ),
      );
      setContainerStyle((prev) => ({
        ...prev,
        ...newContainerStyle,
      }));
    };

    const handleResize = (event: PointerEvent) => {
      if (!isResizing) return;

      // 計算滑鼠相對於上次事件的移動距離
      const deltaX = startX - event.clientX;
      const deltaY = startY - event.clientY;
      const newContainerStyle = { ...containerStyle };

      if (isResizing.includes("r")) {
        newContainerStyle.$width = containerStyle.$width - deltaX;
        // 邊界檢查
        if (newContainerStyle.$x + newContainerStyle.$width > box.width) {
          newContainerStyle.$width = box.width - newContainerStyle.$x;
        }
      }
      if (isResizing.includes("l")) {
        newContainerStyle.$width = containerStyle.$width + deltaX;
        newContainerStyle.$x = containerStyle.$x - deltaX;
        // 邊界檢查
        if (newContainerStyle.$x < 0) {
          newContainerStyle.$width += newContainerStyle.$x;
          newContainerStyle.$x = 0;
        }
      }
      if (isResizing.includes("t")) {
        newContainerStyle.$height = containerStyle.$height + deltaY;
        newContainerStyle.$y = containerStyle.$y - deltaY;
        // 邊界檢查
        if (newContainerStyle.$y < 0) {
          newContainerStyle.$height += newContainerStyle.$y;
          newContainerStyle.$y = 0;
        }
      }
      if (isResizing.includes("b")) {
        newContainerStyle.$height = containerStyle.$height - deltaY;
        // 邊界檢查
        if (newContainerStyle.$y + newContainerStyle.$height > box.height) {
          newContainerStyle.$height = box.height - newContainerStyle.$y;
        }
      }

      // 處理寬度和高度為負的情況
      if (newContainerStyle.$width < 0) {
        newContainerStyle.$x += newContainerStyle.$width;
        newContainerStyle.$width = Math.abs(newContainerStyle.$width);
        // 切換調整方向
        if (isResizing === "l") setIsResizing("r");
        else if (isResizing === "r") setIsResizing("l");
        else if (isResizing === "lt") setIsResizing("rt");
        else if (isResizing === "rt") setIsResizing("lt");
        else if (isResizing === "lb") setIsResizing("rb");
        else if (isResizing === "rb") setIsResizing("lb");
      }

      if (newContainerStyle.$height < 0) {
        newContainerStyle.$y += newContainerStyle.$height;
        newContainerStyle.$height = Math.abs(newContainerStyle.$height);
        // 切換調整方向
        if (isResizing === "t") setIsResizing("b");
        else if (isResizing === "b") setIsResizing("t");
        else if (isResizing === "lt") setIsResizing("lb");
        else if (isResizing === "lb") setIsResizing("lt");
        else if (isResizing === "rt") setIsResizing("rb");
        else if (isResizing === "rb") setIsResizing("rt");
      }
      setIsOverlap(checkOverlap({ ...newContainerStyle, id }, selectors));

      // 更新起始位置
      setStartX(event.clientX);
      setStartY(event.clientY);
      setContainerStyle(newContainerStyle);
    };

    const handleEnd = () => {
      setIsDragging(false);
      setIsResizing(null);
      if (isOverlap) {
        setIsOverlap(false);
        setContainerStyle((prev) => {
          const source = selectors.find((selector) => selector.id === id);
          if (!source) return prev;
          return {
            ...prev,
            $x: source.$x,
            $y: source.$y,
            $width: source.$width,
            $height: source.$height,
          };
        });
        return;
      }
      setSelectors((prev) =>
        prev.map((selector) => {
          if (selector.id === id)
            return {
              ...selector,
              $x: containerStyle.$x,
              $y: containerStyle.$y,
              $width: containerStyle.$width,
              $height: containerStyle.$height,
            };
          return selector;
        }),
      );
    };

    if (isDragging) {
      document.addEventListener("pointermove", handleDrag);
      document.addEventListener("pointerup", handleEnd);
    } else if (isResizing) {
      document.addEventListener("pointermove", handleResize);
      document.addEventListener("pointerup", handleEnd);
    } else {
      document.removeEventListener("pointermove", handleDrag);
      document.removeEventListener("pointermove", handleResize);
      document.removeEventListener("pointerup", handleEnd);
    }

    return () => {
      document.removeEventListener("pointermove", handleDrag);
      document.removeEventListener("pointermove", handleResize);
      document.removeEventListener("pointerup", handleEnd);
    };
  }, [
    id,
    isDragging,
    isResizing,
    isOverlap,
    containerStyle,
    startX,
    startY,
    mediaRef,
    selectors,
    setSelectors,
  ]);

  return {
    isOverlap,
    containerStyle,
    handleDragStart,
    handleResizeStart,
    handleDelete,
  };
}

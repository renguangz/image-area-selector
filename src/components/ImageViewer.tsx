import styled from "@emotion/styled";
import { ImageSelector } from "./ImageSelector";
import { useContext, useRef, useState } from "react";
import {
  type SelectorData,
  ImageSelectorContext,
} from "./ImageSelectorContext";
import { colors } from "../utils/colors";
import { useDragSelector } from "../hooks/useDragSelector";

const CONTENT_WIDTH = 355;

const Container = styled.div`
  width: 355px;
  position: relative;
`;

const InteractLayer = styled.div<{ $aspectRatio: number }>`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: ${(props) =>
    props.$aspectRatio > 0 ? CONTENT_WIDTH / props.$aspectRatio : 0}px;
  cursor: crosshair;
`;

interface DraggingContainerProps {
  $isOverlap: boolean;
}

const DraggingContainer = styled.div<
  DraggingContainerProps & Omit<SelectorData, "id">
>`
  width: ${(props) => props.$width}px;
  height: ${(props) => props.$height}px;
  position: absolute;
  top: ${(props) => props.$y}px;
  left: ${(props) => props.$x}px;
  border: 1px dashed
    ${(props) => (props.$isOverlap ? colors.error : colors.primary)};
  pointerevents: none;
`;

interface ImageViewerProps {
  interactAspectRatio: number;
  children: JSX.Element;
}

export function ImageViewer({
  interactAspectRatio,
  children,
}: ImageViewerProps) {
  const { selectors, setSelectors } = useContext(ImageSelectorContext);

  const [activeSelector, setActiveSelector] = useState<string | null>(null);

  const mediaRef = useRef<HTMLDivElement>(null);

  const { dragging, isOverlap, startPos, endPos, handleDragSizeStart } =
    useDragSelector({
      mediaRef,
      selectors,
      setSelectors,
      setActiveSelector,
    });

  return (
    <Container>
      {children}
      <InteractLayer
        $aspectRatio={interactAspectRatio}
        ref={mediaRef}
        onMouseDown={handleDragSizeStart}
      />
      {selectors.map(({ id, $width, $height, $x, $y }, index) => (
        <ImageSelector
          key={id}
          id={id}
          index={index}
          mediaRef={mediaRef}
          focus={activeSelector === id}
          setActiveSelector={setActiveSelector}
          selectors={selectors}
          setSelectors={setSelectors}
          $x={$x}
          $y={$y}
          $width={$width}
          $height={$height}
        />
      ))}
      {dragging === "RESIZE" && (
        <DraggingContainer
          $width={Math.abs(endPos.x - startPos.x)}
          $height={Math.abs(endPos.y - startPos.y)}
          $x={Math.min(startPos.x, endPos.x)}
          $y={Math.min(startPos.y, endPos.y)}
          $isOverlap={isOverlap}
        />
      )}
    </Container>
  );
}

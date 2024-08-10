import styled from "@emotion/styled";
import { ImageSelector } from "./ImageSelector";
import { useContext } from "react";
import { ImageContext } from "./ImageContext";
import { useImageView } from "../hooks/useImageView";
import { colors } from "../utils/colors";

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
  $width: number;
  $height: number;
  $top: number;
  $left: number;
  $isOverlap: boolean;
}

const DraggingContainer = styled.div<DraggingContainerProps>`
  width: ${(props) => props.$width}px;
  height: ${(props) => props.$height}px;
  position: absolute;
  top: ${(props) => props.$top}px;
  left: ${(props) => props.$left}px;
  border: 1px dashed
    ${(props) => (props.$isOverlap ? colors.error : colors.primary)};
  pointerevents: none;
`;

interface ImageViewerProps {
  children: JSX.Element;
}

export function ImageViewer({ children }: ImageViewerProps) {
  const {
    imagePreview,
    selectors,
    activeSelector,
    setActiveSelector,
    setSelectors,
  } = useContext(ImageContext);

  const { imgRef, isDragging, isOverlap, startPos, endPos, handleMouseDown } =
    useImageView();

  return (
    <Container>
      {children}
      <InteractLayer
        $aspectRatio={imagePreview.aspectRatio}
        ref={imgRef}
        onMouseDown={handleMouseDown}
      />
      {selectors.map(({ id, $width, $height, $x, $y }, index) => (
        <ImageSelector
          key={id}
          id={id}
          index={index}
          mediaRef={imgRef}
          focus={activeSelector === id}
          setActiveSelector={setActiveSelector}
          selectors={selectors}
          setSelectors={setSelectors}
          $width={$width}
          $height={$height}
          $x={$x}
          $y={$y}
        />
      ))}
      {isDragging && (
        <DraggingContainer
          $width={Math.abs(endPos.x - startPos.x)}
          $height={Math.abs(endPos.y - startPos.y)}
          $left={Math.min(startPos.x, endPos.x)}
          $top={Math.min(startPos.y, endPos.y)}
          $isOverlap={isOverlap}
        />
      )}
    </Container>
  );
}

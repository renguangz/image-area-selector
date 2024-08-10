import styled from "@emotion/styled";
import { type RefObject } from "react";
import { type SelectorData } from "./ImageContext";
import {
  type ResizeDirection,
  useImageSelector,
} from "../hooks/useImageSelector";
import { colors } from "../utils/colors";
import { DeleteIcon } from "./Icons";

export interface ContainerProps extends Omit<SelectorData, "id"> {
  $isOverlap: boolean;
}

const Container = styled.div<ContainerProps>`
  width: ${(props) => props.$width}px;
  height: ${(props) => props.$height}px;
  top: 0;
  left: 0;
  position: absolute;
  transform: ${(props) => `translate3d(${props.$x}px, ${props.$y}px, 0)`};
  cursor: move;
  border: 1px solid
    ${(props) => (props.$isOverlap ? colors.error : colors.primary)};
  color: #fff;
  display: grid;
  grid-template-columns: 8px 1fr 8px;
  grid-template-rows: 8px 1fr 8px;
`;

interface DragContainerProps {
  type: ResizeDirection;
  $isOverlap: boolean;
}

const DragContainer = styled.div<DragContainerProps>`
  background-color: ${(props) =>
    props.$isOverlap ? colors.error : colors.primary};
  width: 8px;
  height: 8px;
  position: absolute;
  ${(props) => {
    switch (props.type) {
      case "lt":
        return `top: -4px; left: -4px; cursor: nwse-resize`;
      case "t":
        return `top: -4px; left: 50%; transform: translateX(-50%); cursor: ns-resize`;
      case "rt":
        return `top: -4px; right: -4px; cursor: nesw-resize`;
      case "l":
        return `top: 50%; left: -4px; transform: translateY(-50%); cursor: ew-resize`;
      case "r":
        return `top: 50%; right: -4px; transform: translateY(-50%); cursor: ew-resize`;
      case "lb":
        return `bottom: -4px; left: -4px; cursor: nesw-resize`;
      case "b":
        return `bottom: -4px; left: 50%; transform: translateX(-50%); cursor: ns-resize`;
      case "rb":
        return `bottom: -4px; right: -4px; cursor: nwse-resize`;
      default:
        return ``;
    }
  }}
`;

const IndexContainer = styled.div`
  background-color: rgba(246, 248, 194, 0.8);
  border-radius: 100%;
  margin: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 20px;
  min-height: 20px;
`;

const Index = styled.span`
  color: #000;
  user-select: none;
  pointer-events: none;
`;

const DeleteButton = styled.button`
  all: unset;
  background: #ffffff;
  width: 24px;
  height: 24px;
  grid-area: 1 / 3;
  transform: translate(16px, 0);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
`;

const RESIZE_TYPES: ResizeDirection[] = [
  "t",
  "l",
  "r",
  "b",
  "rt",
  "lt",
  "rb",
  "lb",
];

export type ImageSelectorProps = SelectorData & {
  index: number;
  mediaRef: RefObject<HTMLElement>;
  focus: boolean;
  setActiveSelector: React.Dispatch<React.SetStateAction<string | null>>;
  selectors: SelectorData[];
  setSelectors: React.Dispatch<React.SetStateAction<SelectorData[]>>;
};

export function ImageSelector(props: ImageSelectorProps) {
  const { index, focus } = props;
  const {
    isOverlap,
    containerStyle,
    handleDragStart,
    handleResizeStart,
    handleDelete,
  } = useImageSelector(props);

  return (
    <Container
      {...containerStyle}
      $isOverlap={isOverlap}
      onPointerDown={handleDragStart}
    >
      <IndexContainer>
        <Index translate="no">{index + 1}</Index>
      </IndexContainer>
      {RESIZE_TYPES.map((type) => (
        <DragContainer
          key={type}
          type={type}
          $isOverlap={isOverlap}
          onPointerDown={(e) => handleResizeStart(e, type)}
        />
      ))}
      {focus && (
        <DeleteButton type="button" onClick={handleDelete}>
          <DeleteIcon width={16} height={16} color={colors.grey2} />
        </DeleteButton>
      )}
    </Container>
  );
}

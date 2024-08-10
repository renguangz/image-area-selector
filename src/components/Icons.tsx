import styled from "@emotion/styled";
import { colors } from "../utils/colors";

interface IconProps {
  width: number;
  height: number;
  color: string;
}

const DeleteIconSvg = styled.svg`
  cursor: pointer;
  &:hover {
    color: ${colors.error};
  }
`;

export function DeleteIcon({ width, height, color }: IconProps) {
  return (
    <DeleteIconSvg
      width={width}
      height={height}
      color={color}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 6h18"></path>
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
      <line x1="10" y1="11" x2="10" y2="17"></line>
      <line x1="14" y1="11" x2="14" y2="17"></line>
    </DeleteIconSvg>
  );
}

export function ImageIcon({ width, height, color }: IconProps) {
  return (
    <svg
      width={width}
      height={height}
      fill={color}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
    >
      <path d="M21 3H3c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H3V5h18v14zM10 11l2.03 2.71L14 12.05 18 17H6l4-6zm0-2c-.83 0-1.5-.67-1.5-1.5S9.17 6 10 6s1.5.67 1.5 1.5S10.83 9 10 9z" />
    </svg>
  );
}

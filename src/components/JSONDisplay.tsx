import styled from "@emotion/styled";
import { useContext } from "react";
import { ImageContext } from "./ImageContext";

const Container = styled.div`
  background: #2a3948;
  width: 548px;
  height: 703px;
  padding: 16px;
  overflow-y: auto;
`;

const Pre = styled.pre`
  color: #fff;
`;

export function JSONDisplay() {
  const { selectors } = useContext(ImageContext);

  const displaySelectors = selectors.map(({ $x, $y, $width, $height }) => ({
    x: $x,
    y: $y,
    width: $width,
    height: $height,
  }));

  return (
    <Container>
      {displaySelectors.length > 0 && (
        <Pre>{JSON.stringify(displaySelectors, null, 2)}</Pre>
      )}
    </Container>
  );
}

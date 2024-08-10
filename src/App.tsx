import styled from "@emotion/styled";
import { ImageSelectorLayout } from "./layouts/ImageSelectorLayout";

const Container = styled.div`
  display: flex;
  justify-content: center;
  padding-top: 50px;
`;

export function App() {
  return (
    <Container>
      <ImageSelectorLayout />
    </Container>
  );
}

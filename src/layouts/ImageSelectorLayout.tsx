import styled from "@emotion/styled";
import { ImageContextProvider } from "../components/ImageContext";
import { JSONDisplay } from "../components/JSONDisplay";
import { ImageSelectorArea } from "../components/ImageSelectorArea";

const Container = styled.div`
  display: flex;
  gap: 135px;
  overflow-y: hidden;
`;

export function ImageSelectorLayout() {
  return (
    <ImageContextProvider>
      <Container>
        <ImageSelectorArea />
        <JSONDisplay />
      </Container>
    </ImageContextProvider>
  );
}

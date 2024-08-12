import styled from "@emotion/styled";
import { ImageSelectorContextProvider } from "../components/ImageSelectorContext";
import { JSONDisplay } from "../components/JSONDisplay";
import { ImageSelectorArea } from "../components/ImageSelectorArea";

const Container = styled.div`
  display: flex;
  gap: 135px;
  overflow-y: hidden;
`;

export function ImageSelectorLayout() {
  return (
    <ImageSelectorContextProvider>
      <Container>
        <ImageSelectorArea />
        <JSONDisplay />
      </Container>
    </ImageSelectorContextProvider>
  );
}

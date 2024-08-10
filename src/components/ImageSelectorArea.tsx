import styled from "@emotion/styled";
import { ImageUploader } from "./ImageUploader";
import { ImageViewer } from "./ImageViewer";
import { useContext } from "react";
import { ImageContext } from "./ImageContext";

const Container = styled.div`
  background-color: #f4f9fa;
  width: 433px;
  height: 792px;
  overflow-y: auto;
`;

const HeaderContainer = styled.div`
  background-color: #ebf0f3;
  width: 100%;
  height: 56px;
  display: flex;
  align-items: center;
  padding: 0px 27px;
`;

const LogoContainer = styled.div`
  background-color: #d4dade;
  width: 24px;
  height: 24px;
  border-radius: 100%;
`;

const ContentContainer = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  padding-top: 39px;
  padding-bottom: 16px;
`;

const Image = styled.img`
  width: 100%;
  object-fit: contain;
  user-select: none;
  pointer-events: none;
`;

export function ImageSelectorArea() {
  const { imagePreview } = useContext(ImageContext);

  return (
    <Container>
      <HeaderContainer>
        <LogoContainer />
      </HeaderContainer>
      <ContentContainer>
        {imagePreview.imageFile && imagePreview.src ? (
          <ImageViewer>
            <Image src={imagePreview.src} alt={imagePreview.imageFile.name} />
          </ImageViewer>
        ) : (
          <ImageUploader />
        )}
      </ContentContainer>
    </Container>
  );
}

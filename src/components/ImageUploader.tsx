import styled from "@emotion/styled";
import { useImageUpload } from "../hooks/useImageUpload";
import { ImageIcon } from "./Icons";
import { colors } from "../utils/colors";

const Container = styled.div`
  border: 1px solid #dbdcde;
  width: 355px;
  height: 156px;
  border-radius: 8px;
`;

const Input = styled.input`
  display: none;
`;

const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  width: 100%;
  height: 100%;
  cursor: pointer;
  border-radius: 12px;
`;

const Text = styled.span`
  color: ${colors.grey1};
`;

export function ImageUploader() {
  const { fileInputRef, handleClickFileInput, handleImageChange } =
    useImageUpload();

  return (
    <Container>
      <Input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageChange}
      />
      <ContentContainer onClick={handleClickFileInput}>
        <ImageIcon width={24} height={24} color={colors.grey1} />
        <Text>Upload image</Text>
      </ContentContainer>
    </Container>
  );
}

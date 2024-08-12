import styled from "@emotion/styled";
import { ImageIcon } from "./Icons";
import { colors } from "../utils/colors";
import { type ChangeEvent, useRef, Dispatch } from "react";
import { ImagePreviewType } from "./ImageSelectorArea";

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
interface ImageUploaderProps {
  setImagePreview: Dispatch<React.SetStateAction<ImagePreviewType>>;
}

export function ImageUploader({ setImagePreview }: ImageUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleClickFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] as File;
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const image = new Image();
      image.onload = () => {
        const aspectRatio = image.width / image.height;
        setImagePreview((prev) => ({
          ...prev,
          src: URL.createObjectURL(file),
          imageFile: file,
          aspectRatio,
        }));
      };
      image.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  };

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

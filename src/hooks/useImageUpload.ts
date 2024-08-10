import { ChangeEvent, useContext, useRef } from "react";
import { ImageContext } from "../components/ImageContext";

export function useImageUpload() {
  const { setImagePreview } = useContext(ImageContext);

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

  return { fileInputRef, handleClickFileInput, handleImageChange };
}

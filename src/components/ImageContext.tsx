import { createContext, useState } from "react";

export interface SelectorData {
  id: string;
  $width: number;
  $height: number;
  $x: number;
  $y: number;
}

type ImagePreviewType = {
  imageFile: File | null;
  src: string | null;
  aspectRatio: number;
};

type ImageContextType = {
  imagePreview: ImagePreviewType;
  setImagePreview: React.Dispatch<React.SetStateAction<ImagePreviewType>>;
  selectors: SelectorData[];
  setSelectors: React.Dispatch<React.SetStateAction<SelectorData[]>>;
  activeSelector: string | null;
  setActiveSelector: React.Dispatch<React.SetStateAction<string | null>>;
};

const INIT_IMAGE_PREVIEW: ImagePreviewType = {
  imageFile: null,
  src: null,
  aspectRatio: 0,
};

export const ImageContext = createContext<ImageContextType>({
  imagePreview: INIT_IMAGE_PREVIEW,
  setImagePreview: () => {},
  selectors: [],
  setSelectors: () => {},
  activeSelector: null,
  setActiveSelector: () => {},
});

interface ImageContextProviderProps {
  children: JSX.Element;
}

export function ImageContextProvider({ children }: ImageContextProviderProps) {
  const [imagePreview, setImagePreview] =
    useState<ImagePreviewType>(INIT_IMAGE_PREVIEW);
  const [selectors, setSelectors] = useState<SelectorData[]>([]);
  const [activeSelector, setActiveSelector] = useState<string | null>(null);

  const context: ImageContextType = {
    imagePreview,
    setImagePreview,
    selectors,
    setSelectors,
    activeSelector,
    setActiveSelector,
  };

  return (
    <ImageContext.Provider value={context}>{children}</ImageContext.Provider>
  );
}

import { type Dispatch, createContext, useState } from "react";

export interface SelectorData {
  id: string;
  $width: number;
  $height: number;
  $x: number;
  $y: number;
}

type ImageSelectorContextType = {
  selectors: SelectorData[];
  setSelectors: Dispatch<React.SetStateAction<SelectorData[]>>;
};

export const ImageSelectorContext = createContext<ImageSelectorContextType>({
  selectors: [],
  setSelectors: () => {},
});

interface ImageContextProviderProps {
  children: JSX.Element;
}

export function ImageSelectorContextProvider({
  children,
}: ImageContextProviderProps) {
  const [selectors, setSelectors] = useState<SelectorData[]>([]);

  const context: ImageSelectorContextType = {
    selectors,
    setSelectors,
  };

  return (
    <ImageSelectorContext.Provider value={context}>
      {children}
    </ImageSelectorContext.Provider>
  );
}

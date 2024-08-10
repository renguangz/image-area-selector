import { SelectorData } from "../components/ImageContext";

type Rectangle = Omit<SelectorData, "id"> & { id: string | null };

/**
 * @param r1 first rectangle
 * @param r2 second rectangle
 * @returns {boolean} if overlap return true, else false
 * */
function isOverlapping(r1: Rectangle, r2: Rectangle): boolean {
  return !(
    r2.$x > r1.$x + r1.$width ||
    r2.$x + r2.$width < r1.$x ||
    r2.$y > r1.$y + r1.$height ||
    r2.$y + r2.$height < r1.$y
  );
}

/**
 * source: processing rectangle info
 * target: rectangles info
 * @returns {boolean}
 * */
export function checkOverlap(
  source: Rectangle,
  target: SelectorData[],
): boolean {
  return target.some((selector) => {
    if (selector.id === source.id) return false;
    return isOverlapping(source, selector);
  });
}

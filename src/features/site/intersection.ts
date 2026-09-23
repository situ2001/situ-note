/**
 * This is a simple utility function that checks if two elements are intersecting. Only when the rotation of the elements is not taken into account.
 * @param element1 
 * @param element2 
 * @returns 
 */
export const isTwoElementsIntersecting = (
  element1: HTMLElement,
  element2: HTMLElement
): boolean => {
  if (!element1 || !element2) {
    throw new Error("Both elements must be defined.");
  }

  const rect1 = element1.getBoundingClientRect();
  const rect2 = element2.getBoundingClientRect();

  /**
   * The ellipse is used to make the intersection more forgiving.
   */
  const ELLIPSE = 8;

  return (
    rect1.right > rect2.left + ELLIPSE &&
    rect1.left < rect2.right - ELLIPSE &&
    rect1.bottom > rect2.top + ELLIPSE &&
    rect1.top < rect2.bottom - ELLIPSE
  );
}

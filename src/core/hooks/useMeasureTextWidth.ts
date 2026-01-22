import { useMemo } from "react";

export const useMeasureTextWidth = (): ((
  content: string,
  el: HTMLElement | null
) => string) => {
  //fallback if element is not available
  const style = useMemo(() => {
    // Get CSS variables from document root
    const rootElement = document.documentElement;
    const computedStyle = getComputedStyle(rootElement);

    // Get font size and family from CSS variables with fallbacks
    const fontSize = computedStyle.getPropertyValue("--base-font-size").trim();
    const fontFamily = computedStyle.getPropertyValue("--font-family").trim();

    return { fontSize, fontFamily };
  }, []);

  const calculateTextWidth = (text: string, font: string): number => {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    if (!context) return text.length;
    context.font = font;
    return context.measureText(text).width;
  };

  const measureTextWidth = (content: string, element: HTMLElement | null) => {
    const fontSize = element && window.getComputedStyle(element).fontSize;
    const baseFont = element && window.getComputedStyle(element).fontFamily;
    const font = `${fontSize || style.fontSize} ${baseFont || style.fontFamily}`;
    const widthInPixels = calculateTextWidth(content, font);
    return `${widthInPixels}`;
  };

  return measureTextWidth;
};

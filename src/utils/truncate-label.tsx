import { useEffect, useRef, useState } from "react";
import { Box, styled } from "@mui/material";
import { useCommonTranslation } from "@/core/translation/useCommonTranslation";

const StyledTextWrapper = styled(Box)(() => ({
  position: "relative",

  "& .text": {
    overflow: "hidden",
    wordBreak: "break-word",
  },

  "& .fade": {
    position: "absolute",
    bottom: 0,
    right: 0,
    background:
      "linear-gradient(to right, transparent, var(--logile-bg-container-1) 60%)",
  },

  "& .see-more": {
    color: "var(--logile-text-state-information)",
    fontSize: "var(--logile-size-secondary-text)",
    backgroundColor: "var(--logile-bg-container-1)",
    lineHeight: "var(--logile-line-height-secondary-text)",
    marginLeft: "var(--space-xs)",
    whiteSpace: "nowrap",
    cursor: "pointer",
  },
}));

type Props = {
  text: string | React.ReactNode;
  lines?: number;
};

export const TruncateTextWithSeeMore = ({ text, lines = 2 }: Props) => {
  const { GENERAL } = useCommonTranslation();
  const ref = useRef<HTMLDivElement | null>(null);
  const [expanded, setExpanded] = useState<boolean>(false);
  const [clamped, setClamped] = useState<boolean>(false);

  useEffect(() => {
    // Get the text container element
    const el = ref.current;
    if (!el) return;

    // Read computed styles to calculate line height
    const computed = window.getComputedStyle(el);
    const lineHeight = parseFloat(computed.lineHeight);

    // Maximum height allowed based on number of lines
    const maxHeight = lineHeight * lines;

    // Check if content exceeds the allowed height
    if (el.scrollHeight > maxHeight) {
      // Text needs truncation
      setClamped(true);

      if (expanded) {
        // When expanded, remove height restriction to show full text
        el.style.maxHeight = "none";
      } else {
        // When collapsed, restrict height to the specified number of lines
        el.style.maxHeight = `${maxHeight}px`;
      }
    } else {
      // Text fits within the given number of lines
      setClamped(false);

      // Ensure no height restriction is applied
      el.style.maxHeight = "none";
    }
  }, [text, expanded, lines]);

  if (typeof text !== "string") {
    return text;
  }

  return (
    <StyledTextWrapper>
      <Box
        ref={ref}
        className="text"
      >
        {text}
      </Box>

      {!expanded && clamped && (
        <span
          className="fade see-more"
          onClick={() => setExpanded(true)}
        >
          … {GENERAL.seeMoreButtonLabel}
        </span>
      )}

      {expanded && (
        <span
          className="see-more"
          onClick={() => setExpanded(false)}
        >
          {GENERAL.seeLessButtonLabel}
        </span>
      )}
    </StyledTextWrapper>
  );
};

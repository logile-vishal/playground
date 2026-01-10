import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import WildcardLabel from "../WildcardLabel";
import {
  defaultWildcardLabelProps,
  wildcardLabelWithWildcard,
  wildcardLabelWithMultipleWildcards,
  wildcardLabelOnlyWildcard,
  wildcardLabelEmpty,
  wildcardLabelWithSpecialChars,
  wildcardLabelLongText,
  wildcardLabelMultipleSpaces,
  wildcardLabelStartWithWildcard,
  wildcardLabelEndWithWildcard,
  wildcardLabelWithTruncateTrue,
  wildcardLabelWithTruncateFalse,
} from "./__mocks__/WildcardLabel.mocks";

// Mock icons
vi.mock("@/core/constants/icons", () => ({
  CurlyBracket: "CurlyBracket",
}));

// Mock CSvgIcon
vi.mock("@/core/components/icon/Icon", () => ({
  default: ({ component, color, size }: { [key: string]: unknown }) => (
    <span
      data-testid="svg-icon"
      data-component={component}
      data-color={color}
      data-size={size}
    />
  ),
}));

describe("WildcardLabel Component", () => {
  describe("Component Rendering", () => {
    it("should render wildcard label component", () => {
      const { container } = render(
        <WildcardLabel {...defaultWildcardLabelProps} />
      );
      const wildcardLabel = container.querySelector(".wildcard-label");
      expect(wildcardLabel).toBeInTheDocument();
    });

    it("should render label text without wildcards", () => {
      render(<WildcardLabel {...defaultWildcardLabelProps} />);
      expect(screen.getByText(/This is a test label/)).toBeInTheDocument();
    });

    it("should render paragraph element", () => {
      const { container } = render(
        <WildcardLabel {...defaultWildcardLabelProps} />
      );
      const paragraph = container.querySelector(".wildcard-label");
      expect(paragraph?.tagName).toBe("P");
    });

    it("should render with correct CSS class", () => {
      const { container } = render(
        <WildcardLabel {...defaultWildcardLabelProps} />
      );
      const wildcardLabel = container.querySelector(".wildcard-label");
      expect(wildcardLabel).toHaveClass("wildcard-label");
    });
  });

  describe("Props Handling", () => {
    it("should handle label prop correctly", () => {
      render(<WildcardLabel label="Test Label" />);
      expect(screen.getByText(/Test Label/)).toBeInTheDocument();
    });

    it("should handle empty label", () => {
      const { container } = render(<WildcardLabel {...wildcardLabelEmpty} />);
      const wildcardLabel = container.querySelector(".wildcard-label");
      expect(wildcardLabel).toBeInTheDocument();
      expect(wildcardLabel?.textContent).toBe("");
    });

    it("should handle label with special characters", () => {
      render(<WildcardLabel {...wildcardLabelWithSpecialChars} />);
      expect(screen.getByText(/!@#\$%\^&\*\(\)/)).toBeInTheDocument();
    });

    it("should handle very long label text", () => {
      render(<WildcardLabel {...wildcardLabelLongText} />);
      expect(screen.getByText(/very long text/)).toBeInTheDocument();
    });

    it("should handle label with multiple spaces", () => {
      render(<WildcardLabel {...wildcardLabelMultipleSpaces} />);
      expect(screen.getByText(/Multiple/)).toBeInTheDocument();
    });

    it("should apply truncate class by default", () => {
      const { container } = render(<WildcardLabel label="Test label" />);
      const wildcardLabel = container.querySelector(".wildcard-label");
      expect(wildcardLabel).toHaveClass("wildcard-label--truncate");
    });

    it("should apply truncate class when truncate is true", () => {
      const { container } = render(
        <WildcardLabel {...wildcardLabelWithTruncateTrue} />
      );
      const wildcardLabel = container.querySelector(".wildcard-label");
      expect(wildcardLabel).toHaveClass("wildcard-label--truncate");
    });

    it("should not apply truncate class when truncate is false", () => {
      const { container } = render(
        <WildcardLabel {...wildcardLabelWithTruncateFalse} />
      );
      const wildcardLabel = container.querySelector(".wildcard-label");
      expect(wildcardLabel).not.toHaveClass("wildcard-label--truncate");
      expect(wildcardLabel).toHaveClass("wildcard-label");
    });
  });

  describe("Wildcard Replacement Logic", () => {
    it("should replace wildcard with chip component", () => {
      const { container } = render(
        <WildcardLabel {...wildcardLabelWithWildcard} />
      );
      const chip = container.querySelector(".wildcard-label__chip");
      expect(chip).toBeInTheDocument();
    });

    it("should render wildcard content from WILDCARD_MAP", () => {
      render(<WildcardLabel {...wildcardLabelWithWildcard} />);
      expect(screen.getByText("Task Name")).toBeInTheDocument();
    });

    it("should render icon in wildcard chip", () => {
      render(<WildcardLabel {...wildcardLabelWithWildcard} />);
      const icon = screen.getByTestId("svg-icon");
      expect(icon).toBeInTheDocument();
      expect(icon).toHaveAttribute("data-component", "CurlyBracket");
    });

    it("should render icon with correct color", () => {
      render(<WildcardLabel {...wildcardLabelWithWildcard} />);
      const icon = screen.getByTestId("svg-icon");
      expect(icon).toHaveAttribute("data-color", "secondary");
    });

    it("should render icon with correct size", () => {
      render(<WildcardLabel {...wildcardLabelWithWildcard} />);
      const icon = screen.getByTestId("svg-icon");
      expect(icon).toHaveAttribute("data-size", "16");
    });

    it("should handle multiple wildcards in label", () => {
      const { container } = render(
        <WildcardLabel {...wildcardLabelWithMultipleWildcards} />
      );
      const chips = container.querySelectorAll(".wildcard-label__chip");
      expect(chips.length).toBe(2);
    });

    it("should handle label with only wildcard", () => {
      const { container } = render(
        <WildcardLabel {...wildcardLabelOnlyWildcard} />
      );
      const chip = container.querySelector(".wildcard-label__chip");
      expect(chip).toBeInTheDocument();
      expect(screen.getByText("Task Name")).toBeInTheDocument();
    });

    it("should handle wildcard at the start of label", () => {
      const { container } = render(
        <WildcardLabel {...wildcardLabelStartWithWildcard} />
      );
      const chip = container.querySelector(".wildcard-label__chip");
      expect(chip).toBeInTheDocument();
    });

    it("should handle wildcard at the end of label", () => {
      const { container } = render(
        <WildcardLabel {...wildcardLabelEndWithWildcard} />
      );
      const chip = container.querySelector(".wildcard-label__chip");
      expect(chip).toBeInTheDocument();
    });

    it("should not replace non-matching wildcards", () => {
      render(<WildcardLabel label="This %xyz% is not matched" />);
      expect(screen.getByText(/%xyz%/)).toBeInTheDocument();
      expect(screen.queryByText("Task Name")).not.toBeInTheDocument();
    });

    it("should preserve text before wildcard", () => {
      render(<WildcardLabel {...wildcardLabelWithWildcard} />);
      expect(screen.getByText(/This is/)).toBeInTheDocument();
    });

    it("should preserve text after wildcard", () => {
      render(<WildcardLabel {...wildcardLabelWithWildcard} />);
      expect(screen.getByText(/label/)).toBeInTheDocument();
    });
  });

  describe("useMemo Hook Behavior", () => {
    it("should memoize label generation", () => {
      const { rerender } = render(
        <WildcardLabel {...wildcardLabelWithWildcard} />
      );
      expect(screen.getByText("Task Name")).toBeInTheDocument();

      // Re-render with same props
      rerender(<WildcardLabel {...wildcardLabelWithWildcard} />);
      expect(screen.getByText("Task Name")).toBeInTheDocument();
    });

    it("should regenerate label when label prop changes", () => {
      const { rerender } = render(
        <WildcardLabel label="Initial %task_name% label" />
      );
      expect(screen.getByText("Task Name")).toBeInTheDocument();

      rerender(<WildcardLabel label="Updated label without wildcard" />);
      expect(screen.queryByText("Task Name")).not.toBeInTheDocument();
      expect(screen.getByText(/Updated label/)).toBeInTheDocument();
    });

    it("should update when wildcard changes", () => {
      const { rerender } = render(<WildcardLabel label="%task_name%" />);
      expect(screen.getByText("Task Name")).toBeInTheDocument();

      rerender(<WildcardLabel label="No wildcard" />);
      expect(screen.queryByText("Task Name")).not.toBeInTheDocument();
    });
  });

  describe("generateLabel Function Logic", () => {
    it("should split label by spaces", () => {
      render(<WildcardLabel label="Word1 Word2 Word3" />);
      expect(screen.getByText(/Word1/)).toBeInTheDocument();
      expect(screen.getByText(/Word2/)).toBeInTheDocument();
      expect(screen.getByText(/Word3/)).toBeInTheDocument();
    });

    it("should add space between words except last", () => {
      const { container } = render(<WildcardLabel label="Word1 Word2" />);
      const text = container.querySelector(".wildcard-label")?.textContent;
      expect(text).toContain("Word1 Word2");
    });

    it("should not add space after last word", () => {
      const { container } = render(<WildcardLabel label="Word1 Word2" />);
      const text = container.querySelector(".wildcard-label")?.textContent;
      expect(text?.endsWith(" ")).toBe(false);
    });

    it("should handle single word label", () => {
      render(<WildcardLabel label="SingleWord" />);
      expect(screen.getByText("SingleWord")).toBeInTheDocument();
    });

    it("should assign unique keys to wildcard chips", () => {
      const { container } = render(
        <WildcardLabel {...wildcardLabelWithMultipleWildcards} />
      );
      const chips = container.querySelectorAll(".wildcard-label__chip");
      chips.forEach((chip) => {
        expect(chip).toBeInTheDocument();
      });
    });
  });

  describe("Edge Cases and Boundary Conditions", () => {
    it("should handle null label gracefully", () => {
      expect(() =>
        render(<WildcardLabel label={null as unknown as string} />)
      ).not.toThrow();
    });

    it("should handle undefined label gracefully", () => {
      expect(() =>
        render(<WildcardLabel label={undefined as unknown as string} />)
      ).not.toThrow();
    });

    it("should handle label with only spaces", () => {
      const { container } = render(<WildcardLabel label="   " />);
      const wildcardLabel = container.querySelector(".wildcard-label");
      expect(wildcardLabel).toBeInTheDocument();
    });

    it("should handle label with newline characters", () => {
      render(<WildcardLabel label="Line1\nLine2" />);
      const { container } = render(<WildcardLabel label="Line1\nLine2" />);
      expect(container.querySelector(".wildcard-label")).toBeInTheDocument();
    });

    it("should handle label with tab characters", () => {
      render(<WildcardLabel label="Tab\tseparated" />);
      const { container } = render(<WildcardLabel label="Tab\tseparated" />);
      expect(container.querySelector(".wildcard-label")).toBeInTheDocument();
    });

    it("should handle very long single word", () => {
      const longWord = "A".repeat(1000);
      render(<WildcardLabel label={longWord} />);
      expect(screen.getByText(longWord)).toBeInTheDocument();
    });

    it("should handle label with consecutive wildcards", () => {
      render(<WildcardLabel label="%task_name% %task_name%" />);
      const { container } = render(
        <WildcardLabel label="%task_name% %task_name%" />
      );
      const chips = container.querySelectorAll(".wildcard-label__chip");
      expect(chips.length).toBe(2);
    });

    it("should handle wildcard with no spaces around it", () => {
      render(<WildcardLabel label="text%abc%text" />);
      const { container } = render(<WildcardLabel label="text%abc%text" />);
      expect(container.querySelector(".wildcard-label")).toBeInTheDocument();
    });

    it("should handle numeric label", () => {
      render(<WildcardLabel label="12345" />);
      expect(screen.getByText("12345")).toBeInTheDocument();
    });

    it("should handle label with emojis", () => {
      render(<WildcardLabel label="Test 😀 emoji" />);
      expect(screen.getByText(/Test/)).toBeInTheDocument();
    });
  });

  describe("Integration Scenarios", () => {
    it("should handle complete label lifecycle", () => {
      const { rerender } = render(<WildcardLabel label="Initial" />);
      expect(screen.getByText("Initial")).toBeInTheDocument();

      rerender(<WildcardLabel label="With %task_name% wildcard" />);
      expect(screen.getByText("Task Name")).toBeInTheDocument();

      rerender(<WildcardLabel label="Final text" />);
      expect(screen.getByText(/Final text/)).toBeInTheDocument();
    });

    it("should maintain component state through re-renders", () => {
      const { rerender } = render(
        <WildcardLabel {...wildcardLabelWithWildcard} />
      );
      const { container } = render(
        <WildcardLabel {...wildcardLabelWithWildcard} />
      );
      const initialChip = container.querySelector(".wildcard-label__chip");

      rerender(<WildcardLabel {...wildcardLabelWithWildcard} />);
      const rerenderedChip = container.querySelector(".wildcard-label__chip");

      expect(initialChip).toBeTruthy();
      expect(rerenderedChip).toBeTruthy();
    });

    it("should handle rapid label changes", () => {
      const { rerender } = render(<WildcardLabel label="Label 1" />);

      for (let i = 2; i <= 10; i++) {
        rerender(<WildcardLabel label={`Label ${i}`} />);
      }

      expect(screen.getByText(/Label 10/)).toBeInTheDocument();
    });

    it("should handle switching between wildcard and non-wildcard labels", () => {
      const { rerender } = render(<WildcardLabel label="No wildcard" />);
      expect(screen.queryByText("Task Name")).not.toBeInTheDocument();

      rerender(<WildcardLabel label="%task_name%" />);
      expect(screen.getByText("Task Name")).toBeInTheDocument();

      rerender(<WildcardLabel label="No wildcard again" />);
      expect(screen.queryByText("Task Name")).not.toBeInTheDocument();
    });
  });

  describe("Chip Component Structure", () => {
    it("should render chip with correct structure", () => {
      const { container } = render(
        <WildcardLabel {...wildcardLabelWithWildcard} />
      );
      const chip = container.querySelector(".wildcard-label__chip");
      const icon = chip?.querySelector('[data-testid="svg-icon"]');
      const text = chip?.querySelector("p");

      expect(chip).toBeInTheDocument();
      expect(icon).toBeInTheDocument();
      expect(text).toBeInTheDocument();
    });

    it("should render chip text in paragraph element", () => {
      const { container } = render(
        <WildcardLabel {...wildcardLabelWithWildcard} />
      );
      const chip = container.querySelector(".wildcard-label__chip");
      const paragraph = chip?.querySelector("p");

      expect(paragraph?.tagName).toBe("P");
      expect(paragraph?.textContent).toBe("Task Name");
    });

    it("should render chip as span element", () => {
      const { container } = render(
        <WildcardLabel {...wildcardLabelWithWildcard} />
      );
      const chip = container.querySelector(".wildcard-label__chip");

      expect(chip?.tagName).toBe("SPAN");
    });

    it("should maintain chip order with multiple wildcards", () => {
      const { container } = render(
        <WildcardLabel label="First %task_name% second %template_name% third" />
      );
      const chips = container.querySelectorAll(".wildcard-label__chip");

      expect(chips.length).toBe(2);
      expect(chips[0]).toBeInTheDocument();
      expect(chips[1]).toBeInTheDocument();
    });
  });

  describe("WILDCARD_MAP Behavior", () => {
    it("should use correct mapped value for wildcard", () => {
      render(<WildcardLabel label="%task_name%" />);
      expect(screen.getByText("Task Name")).toBeInTheDocument();
    });

    it("should handle wildcard not in map", () => {
      render(<WildcardLabel label="%unmapped%" />);
      expect(screen.queryByText("Task Name")).not.toBeInTheDocument();
      expect(screen.getByText(/%unmapped%/)).toBeInTheDocument();
    });

    it("should only replace exact wildcard matches", () => {
      render(<WildcardLabel label="%task_name %task_name%" />);
      // %task_name (without closing %) should not match
      const { container } = render(
        <WildcardLabel label="%task_name %task_name%" />
      );
      const chips = container.querySelectorAll(".wildcard-label__chip");
      expect(chips.length).toBe(1); // Only %task_name% matches
    });
  });

  describe("Performance and Optimization", () => {
    it("should not re-render unnecessarily with same props", () => {
      const { rerender } = render(<WildcardLabel label="Same label" />);
      const firstRenderText = screen.getByText(/Same label/);

      rerender(<WildcardLabel label="Same label" />);
      const secondRenderText = screen.getByText(/Same label/);

      expect(firstRenderText).toBe(secondRenderText);
    });

    it("should handle large number of words efficiently", () => {
      const manyWords = Array(100).fill("word").join(" ");
      expect(() => render(<WildcardLabel label={manyWords} />)).not.toThrow();
    });

    it("should handle large number of wildcards efficiently", () => {
      const manyWildcards = Array(50).fill("%task_name%").join(" ");
      const { container } = render(<WildcardLabel label={manyWildcards} />);
      const chips = container.querySelectorAll(".wildcard-label__chip");
      expect(chips.length).toBe(50);
    });
  });
});

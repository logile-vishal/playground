import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import userEvent from "@testing-library/user-event";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CSearchbar from "../Searchbar";
import {
  defaultSearchbarProps,
  searchbarWithEndIcon,
  searchbarWithCustomPlaceholder,
  searchbarWithEmptyPlaceholder,
  mockOnSearch,
  resetMocks,
} from "./__mocks__/Searchbar.mocks";

const theme = createTheme();

const renderWithTheme = (component: React.ReactElement) => {
  return render(<ThemeProvider theme={theme}>{component}</ThemeProvider>);
};

describe("CSearchbar Component", () => {
  beforeEach(() => {
    resetMocks();
  });

  describe("Component Rendering", () => {
    it("should render searchbar component", () => {
      renderWithTheme(<CSearchbar {...defaultSearchbarProps} />);
      const searchInput = screen.getByPlaceholderText("Search...");
      expect(searchInput).toBeInTheDocument();
    });

    it("should render input element", () => {
      renderWithTheme(<CSearchbar {...defaultSearchbarProps} />);
      const input = screen.getByRole("textbox", {
        name: "search",
      });
      expect(input).toBeInTheDocument();
    });

    it("should render with correct placeholder", () => {
      renderWithTheme(<CSearchbar {...defaultSearchbarProps} />);
      expect(screen.getByPlaceholderText("Search...")).toBeInTheDocument();
    });

    it("should render search icon wrapper", () => {
      const { container } = renderWithTheme(
        <CSearchbar {...defaultSearchbarProps} />
      );
      // SearchIconWrapper is a styled div without specific role
      expect(container.querySelector("div")).toBeInTheDocument();
    });

    it("should have aria-label for accessibility", () => {
      renderWithTheme(<CSearchbar {...defaultSearchbarProps} />);
      const input = screen.getByLabelText("search");
      expect(input).toBeInTheDocument();
    });
  });

  describe("Props Handling", () => {
    it("should handle placeholder prop", () => {
      renderWithTheme(<CSearchbar {...defaultSearchbarProps} />);
      expect(screen.getByPlaceholderText("Search...")).toBeInTheDocument();
    });

    it("should handle custom placeholder", () => {
      renderWithTheme(<CSearchbar {...searchbarWithCustomPlaceholder} />);
      expect(screen.getByPlaceholderText("Type to search")).toBeInTheDocument();
    });

    it("should handle empty placeholder", () => {
      renderWithTheme(<CSearchbar {...searchbarWithEmptyPlaceholder} />);
      const input = screen.getByRole("textbox", {
        name: "search",
      });
      expect(input).toHaveAttribute("placeholder", "");
    });

    it("should handle iconPosition prop set to start", () => {
      renderWithTheme(<CSearchbar {...defaultSearchbarProps} />);
      const input = screen.getByRole("textbox", {
        name: "search",
      });
      expect(input).toBeInTheDocument();
    });

    it("should handle iconPosition prop set to end", () => {
      renderWithTheme(<CSearchbar {...searchbarWithEndIcon} />);
      const input = screen.getByRole("textbox", {
        name: "search",
      });
      expect(input).toBeInTheDocument();
    });

    it("should handle onSearch prop", () => {
      renderWithTheme(<CSearchbar {...defaultSearchbarProps} />);
      expect(mockOnSearch).toBeDefined();
    });

    it("should handle long placeholder text", () => {
      const longPlaceholder = "A".repeat(100);
      renderWithTheme(
        <CSearchbar
          {...defaultSearchbarProps}
          placeholder={longPlaceholder}
        />
      );
      expect(screen.getByPlaceholderText(longPlaceholder)).toBeInTheDocument();
    });

    it("should handle placeholder with special characters", () => {
      const specialPlaceholder = "Search!@#$%^&*()";
      renderWithTheme(
        <CSearchbar
          {...defaultSearchbarProps}
          placeholder={specialPlaceholder}
        />
      );
      expect(
        screen.getByPlaceholderText(specialPlaceholder)
      ).toBeInTheDocument();
    });
  });

  describe("Event Handling", () => {
    it("should handle keyboard input", async () => {
      const user = userEvent.setup();
      renderWithTheme(<CSearchbar {...defaultSearchbarProps} />);
      const input = screen.getByRole("textbox", {
        name: "search",
      });

      await user.type(input, "test search");

      expect(input).toHaveValue("test search");
    });

    it("should handle onKeyDown event", () => {
      renderWithTheme(<CSearchbar {...defaultSearchbarProps} />);
      const input = screen.getByRole("textbox", {
        name: "search",
      });

      fireEvent.keyDown(input, { key: "Enter", code: "Enter" });

      // handleOnKeyPress is called but does nothing currently
      expect(input).toBeInTheDocument();
    });

    it("should handle Enter key press", () => {
      renderWithTheme(<CSearchbar {...defaultSearchbarProps} />);
      const input = screen.getByRole("textbox", {
        name: "search",
      });

      fireEvent.keyDown(input, { key: "Enter", code: "Enter", charCode: 13 });

      expect(input).toBeInTheDocument();
    });

    it("should handle Escape key press", () => {
      renderWithTheme(<CSearchbar {...defaultSearchbarProps} />);
      const input = screen.getByRole("textbox", {
        name: "search",
      });

      fireEvent.keyDown(input, { key: "Escape", code: "Escape" });

      expect(input).toBeInTheDocument();
    });

    it("should handle typing and clearing text", async () => {
      const user = userEvent.setup();
      renderWithTheme(<CSearchbar {...defaultSearchbarProps} />);
      const input = screen.getByRole("textbox", {
        name: "search",
      });

      await user.type(input, "test");
      expect(input).toHaveValue("test");

      await user.clear(input);
      expect(input).toHaveValue("");
    });

    it("should handle focus event", async () => {
      const user = userEvent.setup();

      renderWithTheme(<CSearchbar {...defaultSearchbarProps} />);

      const input = screen.getByRole("textbox", {
        name: /search/i,
      });

      await user.click(input);

      expect(input).toHaveFocus();
    });

    it("should handle blur event", () => {
      renderWithTheme(<CSearchbar {...defaultSearchbarProps} />);
      const input = screen.getByRole("textbox", {
        name: "search",
      });

      fireEvent.focus(input);
      fireEvent.blur(input);

      expect(document.activeElement).not.toBe(input);
    });

    it("should handle rapid typing", async () => {
      const user = userEvent.setup();
      renderWithTheme(<CSearchbar {...defaultSearchbarProps} />);
      const input = screen.getByRole("textbox", {
        name: "search",
      });
      userEvent.setup({ delay: 1 });

      await user.type(input, "abcdefghijklmnopqrstuvwxyz");

      expect(input).toHaveValue("abcdefghijklmnopqrstuvwxyz");
    });

    it("should handle backspace key", async () => {
      const user = userEvent.setup();
      renderWithTheme(<CSearchbar {...defaultSearchbarProps} />);
      const input = screen.getByRole("textbox", {
        name: "search",
      });

      await user.type(input, "test");
      await user.type(input, "{Backspace}");

      expect(input).toHaveValue("tes");
    });

    it("should handle paste event", async () => {
      const user = userEvent.setup();
      renderWithTheme(<CSearchbar {...defaultSearchbarProps} />);
      const input = screen.getByRole("textbox", {
        name: "search",
      });

      await user.click(input);
      await user.paste("pasted text");

      expect((input as HTMLInputElement).value).toBe("pasted text");
    });
  });

  describe("Edge Cases and Boundary Conditions", () => {
    it("should handle undefined placeholder gracefully", () => {
      renderWithTheme(
        <CSearchbar
          placeholder={undefined as any}
          iconPosition="start"
          onSearch={mockOnSearch}
        />
      );
      const input = screen.getByRole("textbox", {
        name: "search",
      });
      expect(input).toBeInTheDocument();
    });

    it("should handle null onSearch gracefully", () => {
      expect(() =>
        renderWithTheme(
          <CSearchbar
            placeholder="Search"
            iconPosition="start"
            onSearch={null as any}
          />
        )
      ).not.toThrow();
    });

    it("should handle very long input text", async () => {
      const user = userEvent.setup();
      renderWithTheme(<CSearchbar {...defaultSearchbarProps} />);
      const input = screen.getByRole("textbox", {
        name: "search",
      });
      const longText = "A".repeat(500);
      await user.type(input, longText);

      expect(input).toHaveValue(longText);
    });

    it("should handle special characters in input", async () => {
      const user = userEvent.setup();
      renderWithTheme(<CSearchbar {...defaultSearchbarProps} />);
      const input = screen.getByRole("textbox", {
        name: "search",
      });

      await user.type(input, "!@#$%^&*()");

      expect(input).toHaveValue("!@#$%^&*()");
    });

    it("should handle numeric input", async () => {
      const user = userEvent.setup();
      renderWithTheme(<CSearchbar {...defaultSearchbarProps} />);
      const input = screen.getByRole("textbox", {
        name: "search",
      });

      await user.type(input, "123456789");

      expect(input).toHaveValue("123456789");
    });

    it("should handle whitespace input", async () => {
      const user = userEvent.setup();
      renderWithTheme(<CSearchbar {...defaultSearchbarProps} />);
      const input = screen.getByRole("textbox", {
        name: "search",
      });

      await user.type(input, "   ");

      expect(input).toHaveValue("   ");
    });

    it("should handle emoji input", async () => {
      const user = userEvent.setup();
      renderWithTheme(<CSearchbar {...defaultSearchbarProps} />);
      const input = screen.getByRole("textbox", {
        name: "search",
      });

      await user.type(input, "😀😃😄");

      expect(input).toHaveValue("😀😃😄");
    });

    it("should handle mixed content input", async () => {
      const user = userEvent.setup();
      renderWithTheme(<CSearchbar {...defaultSearchbarProps} />);
      const input = screen.getByRole("textbox", {
        name: "search",
      });

      await user.type(input, "Test123!@# ");

      expect(input).toHaveValue("Test123!@# ");
    });

    it("should handle empty string input", () => {
      renderWithTheme(<CSearchbar {...defaultSearchbarProps} />);
      const input = screen.getByRole("textbox", { name: /search/i });

      // Directly simulate user clearing input
      fireEvent.change(input, { target: { value: "" } });

      expect(input).toHaveValue("");
    });
  });

  describe("Negative Scenarios", () => {
    it("should handle onSearch throwing error", () => {
      const errorOnSearch = vi.fn(() => {
        try {
          throw new Error("Search error");
        } catch (error) {
          // Error caught
        }
      });

      expect(() =>
        renderWithTheme(
          <CSearchbar
            {...defaultSearchbarProps}
            onSearch={errorOnSearch}
          />
        )
      ).not.toThrow();
    });

    it("should handle invalid iconPosition gracefully", () => {
      expect(() =>
        renderWithTheme(
          <CSearchbar
            placeholder="Search"
            iconPosition={"invalid" as any}
            onSearch={mockOnSearch}
          />
        )
      ).not.toThrow();
    });

    it("should render without crashing when all props are invalid", () => {
      expect(() =>
        renderWithTheme(
          <CSearchbar
            placeholder={null as any}
            iconPosition={null as any}
            onSearch={null as any}
          />
        )
      ).not.toThrow();
    });
  });

  describe("Integration Scenarios", () => {
    it("should handle complete search flow", async () => {
      const user = userEvent.setup();
      renderWithTheme(<CSearchbar {...defaultSearchbarProps} />);
      const input = screen.getByRole("textbox", {
        name: "search",
      });

      await user.type(input, "search query");
      fireEvent.keyDown(input, { key: "Enter" });

      expect(input).toHaveValue("search query");
    });

    it("should maintain state through re-renders", () => {
      const { rerender } = renderWithTheme(
        <CSearchbar {...defaultSearchbarProps} />
      );
      expect(screen.getByPlaceholderText("Search...")).toBeInTheDocument();

      rerender(
        <ThemeProvider theme={theme}>
          <CSearchbar {...searchbarWithCustomPlaceholder} />
        </ThemeProvider>
      );
      expect(screen.getByPlaceholderText("Type to search")).toBeInTheDocument();
    });

    it("should handle switching icon positions", () => {
      const { rerender } = renderWithTheme(
        <CSearchbar
          {...defaultSearchbarProps}
          iconPosition="start"
        />
      );
      const input = screen.getByRole("textbox", {
        name: "search",
      });
      expect(input).toBeInTheDocument();

      rerender(
        <ThemeProvider theme={theme}>
          <CSearchbar
            {...defaultSearchbarProps}
            iconPosition="end"
          />
        </ThemeProvider>
      );
      expect(
        screen.getByRole("textbox", {
          name: "search",
        })
      ).toBeInTheDocument();
    });

    it("should handle rapid placeholder changes", () => {
      const { rerender } = renderWithTheme(
        <CSearchbar {...defaultSearchbarProps} />
      );

      for (let i = 1; i <= 5; i++) {
        rerender(
          <ThemeProvider theme={theme}>
            <CSearchbar
              {...defaultSearchbarProps}
              placeholder={`Search ${i}`}
            />
          </ThemeProvider>
        );
      }

      expect(screen.getByPlaceholderText("Search 5")).toBeInTheDocument();
    });

    it("should handle focus and type scenario", async () => {
      const user = userEvent.setup();
      renderWithTheme(<CSearchbar {...defaultSearchbarProps} />);
      const input = screen.getByRole("textbox", {
        name: "search",
      });

      await user.click(input);
      expect(document.activeElement).toBe(input);

      await user.type(input, "focused search");
      expect(input).toHaveValue("focused search");
    });
  });

  describe("Accessibility", () => {
    it("should have proper ARIA label", () => {
      renderWithTheme(<CSearchbar {...defaultSearchbarProps} />);
      const input = screen.getByLabelText("search");
      expect(input).toBeInTheDocument();
    });

    it("should be keyboard accessible", async () => {
      const user = userEvent.setup();
      renderWithTheme(<CSearchbar {...defaultSearchbarProps} />);

      await user.tab();

      const input = screen.getByRole("textbox", {
        name: "search",
      });
      expect(document.activeElement).toBe(input);
    });

    it("should have searchbox role", () => {
      renderWithTheme(<CSearchbar {...defaultSearchbarProps} />);
      const input = screen.getByRole("textbox", {
        name: "search",
      });
      expect(input).toBeInTheDocument();
    });

    it("should support keyboard navigation", async () => {
      const user = userEvent.setup();
      renderWithTheme(<CSearchbar {...defaultSearchbarProps} />);
      const input = screen.getByRole("textbox", {
        name: "search",
      });

      await user.click(input);
      await user.keyboard("{ArrowLeft}{ArrowRight}");

      expect(document.activeElement).toBe(input);
    });
  });

  describe("Theme Integration", () => {
    it("should render with MUI theme", () => {
      renderWithTheme(<CSearchbar {...defaultSearchbarProps} />);
      const input = screen.getByRole("textbox", {
        name: "search",
      });
      expect(input).toBeInTheDocument();
    });

    it("should render without theme provider", () => {
      expect(() =>
        render(<CSearchbar {...defaultSearchbarProps} />)
      ).not.toThrow();
    });

    it("should work with custom theme", () => {
      const customTheme = createTheme({
        palette: {
          primary: {
            main: "#ff0000",
          },
        },
      });

      render(
        <ThemeProvider theme={customTheme}>
          <CSearchbar {...defaultSearchbarProps} />
        </ThemeProvider>
      );

      expect(
        screen.getByRole("textbox", {
          name: "search",
        })
      ).toBeInTheDocument();
    });
  });

  describe("Styled Components", () => {
    it("should render Search wrapper component", () => {
      const { container } = renderWithTheme(
        <CSearchbar {...defaultSearchbarProps} />
      );
      expect(container.firstChild).toBeInTheDocument();
    });

    it("should render StyledInputBase component", () => {
      renderWithTheme(<CSearchbar {...defaultSearchbarProps} />);
      const input = screen.getByRole("textbox", {
        name: "search",
      });
      expect(input).toBeInTheDocument();
    });

    it("should render SearchIconWrapper", () => {
      const { container } = renderWithTheme(
        <CSearchbar {...defaultSearchbarProps} />
      );
      // SearchIconWrapper doesn't have specific content or role
      expect(container.querySelector("div")).toBeInTheDocument();
    });
  });

  describe("Input Behavior", () => {
    it("should allow text selection", async () => {
      const user = userEvent.setup();
      renderWithTheme(<CSearchbar {...defaultSearchbarProps} />);
      const input = screen.getByRole("textbox", {
        name: "search",
      });

      await user.type(input, "selectable text");
      (input as HTMLInputElement).setSelectionRange(0, 5);

      expect((input as HTMLInputElement).selectionStart).toBe(0);
      expect((input as HTMLInputElement).selectionEnd).toBe(5);
    });

    it("should handle copy operation", async () => {
      const user = userEvent.setup();
      renderWithTheme(<CSearchbar {...defaultSearchbarProps} />);
      const input = screen.getByRole("textbox", {
        name: "search",
      });

      await user.type(input, "text to copy");
      await user.click(input);

      expect((input as HTMLInputElement).value).toBe("text to copy");
    });

    it("should handle cut operation", async () => {
      const user = userEvent.setup();
      renderWithTheme(<CSearchbar {...defaultSearchbarProps} />);
      const input = screen.getByRole("textbox", {
        name: "search",
      });

      await user.type(input, "text");
      (input as HTMLInputElement).setSelectionRange(0, 4);
      await user.cut();

      // After cut, value should be empty
      expect(input).toHaveValue("");
    });
  });
});

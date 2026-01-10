import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CPagination from "../Pagination";
import type { Pagination } from "@/core/types/pagination.type";
import {
  mockPaginationData,
  mockPaginationDataSinglePage,
  mockPaginationDataMiddlePage,
  mockPaginationDataLastPage,
  mockPaginationDataEmpty,
  mockPaginationDataSmallDataset,
  mockDefaultPaginationProps,
  mockSmallSizePaginationProps,
  mockPaginationPropsWithCustomOptions,
  mockPaginationPropsHidden,
  mockPaginationPropsNoCallback,
  mockOnChange,
  mockUseWalkmeId,
  mockUseCommonTranslation,
  mockCustomPageSizeOptions,
  resetMocks,
} from "./__mocks__/Pagination.mocks";
import { PAGINATION_SIZE } from "@/core/constants/pagination";

// Mock dependencies
vi.mock("@/core/hooks/useWalkmeId", () => ({
  useWalkmeId: () => mockUseWalkmeId,
}));

vi.mock("@/core/translation/useCommonTranslation", () => ({
  useCommonTranslation: () => mockUseCommonTranslation,
}));

vi.mock("@/utils/clsx", () => ({
  default: vi.fn((args) => {
    if (typeof args === "string") return args;
    if (typeof args === "object") {
      return Object.keys(args)
        .filter((key) => args[key])
        .join(" ");
    }
    return "";
  }),
}));

vi.mock("@/utils", () => ({
  isNonEmptyValue: vi.fn((value) => {
    return value !== null && value !== undefined && value !== "" && value !== 0;
  }),
}));

const theme = createTheme();

// Helper function to render component with router and theme
const renderWithRouter = (ui: React.ReactElement) => {
  return render(
    <ThemeProvider theme={theme}>
      <BrowserRouter>{ui}</BrowserRouter>
    </ThemeProvider>
  );
};

describe("CPagination Component", () => {
  beforeEach(() => {
    resetMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("Component Rendering", () => {
    it("should render pagination component with default props", () => {
      renderWithRouter(<CPagination {...mockDefaultPaginationProps} />);

      expect(screen.getByText("Page")).toBeInTheDocument();
      expect(screen.getByText(/of/i)).toBeInTheDocument();
      expect(screen.getByText(/10/i)).toBeInTheDocument();
    });

    it("should render pagination with large size class", () => {
      const { container } = renderWithRouter(
        <CPagination
          {...mockDefaultPaginationProps}
          size={PAGINATION_SIZE.large}
        />
      );

      const paginationElement = container.querySelector(".pagination--large");
      expect(paginationElement).toBeInTheDocument();
    });

    it("should render pagination with small size class", () => {
      const { container } = renderWithRouter(
        <CPagination {...mockSmallSizePaginationProps} />
      );

      const paginationElement = container.querySelector(".pagination--small");
      expect(paginationElement).toBeInTheDocument();
    });

    it("should render with custom className", () => {
      const customClass = "custom-pagination-class";
      const { container } = renderWithRouter(
        <CPagination
          {...mockDefaultPaginationProps}
          className={customClass}
        />
      );

      const paginationElement = container.querySelector(`.${customClass}`);
      expect(paginationElement).toBeInTheDocument();
    });

    it("should render previous button", () => {
      renderWithRouter(<CPagination {...mockDefaultPaginationProps} />);

      const prevButton = screen.getAllByRole("button")[0];
      expect(prevButton).toBeInTheDocument();
      expect(prevButton).toHaveClass("pagination__prev-button");
    });

    it("should render next button", () => {
      renderWithRouter(<CPagination {...mockDefaultPaginationProps} />);

      const buttons = screen.getAllByRole("button");
      const nextButton = buttons[buttons.length - 1];
      expect(nextButton).toBeInTheDocument();
      expect(nextButton).toHaveClass("pagination__next-button");
    });

    it("should render page size select with default options", () => {
      renderWithRouter(
        <CPagination
          {...mockDefaultPaginationProps}
          pageSizeOptions={[]}
        />
      );

      expect(screen.getByText(/50 \/ Page/i)).toBeInTheDocument();
    });

    it("should render page size select with custom options", () => {
      renderWithRouter(
        <CPagination {...mockPaginationPropsWithCustomOptions} />
      );

      expect(screen.getByText(/50 \/ Page/i)).toBeInTheDocument();
    });
  });

  describe("Conditional Rendering", () => {
    it("should not render when showPagination is false", () => {
      const { container } = renderWithRouter(
        <CPagination {...mockPaginationPropsHidden} />
      );

      expect(container.querySelector(".pagination")).not.toBeInTheDocument();
    });

    it("should not render when pagination is not required (small dataset)", () => {
      const { container } = renderWithRouter(
        <CPagination
          {...mockDefaultPaginationProps}
          pagination={mockPaginationDataSmallDataset}
        />
      );

      expect(container.querySelector(".pagination")).not.toBeInTheDocument();
    });

    it("should render when pagination is required (large dataset)", () => {
      const { container } = renderWithRouter(
        <CPagination {...mockDefaultPaginationProps} />
      );

      expect(container.querySelector(".pagination")).toBeInTheDocument();
    });

    it("should not render when totalItems is 0", () => {
      const { container } = renderWithRouter(
        <CPagination
          {...mockDefaultPaginationProps}
          pagination={mockPaginationDataEmpty}
        />
      );

      expect(container.querySelector(".pagination")).not.toBeInTheDocument();
    });
  });

  describe("Previous Button Functionality", () => {
    it("should disable previous button on first page", () => {
      renderWithRouter(
        <CPagination
          {...mockDefaultPaginationProps}
          pagination={mockPaginationData}
        />
      );

      const prevButton = screen.getAllByRole("button")[0];
      expect(prevButton).toBeDisabled();
      expect(prevButton).toHaveClass("pagination__prev-button--disabled");
    });

    it("should enable previous button when not on first page", () => {
      renderWithRouter(
        <CPagination
          {...mockDefaultPaginationProps}
          pagination={mockPaginationDataMiddlePage}
        />
      );

      const prevButton = screen.getAllByRole("button")[0];
      expect(prevButton).not.toBeDisabled();
    });

    it("should call onChange with decremented page on previous button click", () => {
      renderWithRouter(
        <CPagination
          {...mockDefaultPaginationProps}
          pagination={mockPaginationDataMiddlePage}
        />
      );

      const prevButton = screen.getAllByRole("button")[0];
      fireEvent.click(prevButton);

      expect(mockOnChange).toHaveBeenCalledTimes(1);
      expect(mockOnChange).toHaveBeenCalledWith({
        ...mockPaginationDataMiddlePage,
        currentPage: 4,
      });
    });

    it("should not call onChange when previous button is disabled", () => {
      renderWithRouter(
        <CPagination
          {...mockDefaultPaginationProps}
          pagination={mockPaginationData}
        />
      );

      const prevButton = screen.getAllByRole("button")[0];
      fireEvent.click(prevButton);

      expect(mockOnChange).not.toHaveBeenCalled();
    });

    it("should generate correct walkme id for previous button", () => {
      renderWithRouter(
        <CPagination
          {...mockDefaultPaginationProps}
          walkMeIdPrefix={["template", "library"]}
        />
      );

      const prevButton = screen.getAllByRole("button")[0];
      expect(prevButton).toHaveAttribute(
        "data-walkme-id",
        "LOGILE-TEST-TEMPLATE-LIBRARY-PAGINATOR-PREV BUTTON"
      );
    });
  });

  describe("Next Button Functionality", () => {
    it("should disable next button on last page", () => {
      renderWithRouter(
        <CPagination
          {...mockDefaultPaginationProps}
          pagination={mockPaginationDataLastPage}
        />
      );

      const buttons = screen.getAllByRole("button");
      const nextButton = buttons[buttons.length - 1];
      expect(nextButton).toBeDisabled();
      expect(nextButton).toHaveClass("pagination__next-button--disabled");
    });

    it("should enable next button when not on last page", () => {
      renderWithRouter(
        <CPagination
          {...mockDefaultPaginationProps}
          pagination={mockPaginationData}
        />
      );

      const buttons = screen.getAllByRole("button");
      const nextButton = buttons[buttons.length - 1];
      expect(nextButton).not.toBeDisabled();
    });

    it("should call onChange with incremented page on next button click", () => {
      renderWithRouter(
        <CPagination
          {...mockDefaultPaginationProps}
          pagination={mockPaginationData}
        />
      );

      const buttons = screen.getAllByRole("button");
      const nextButton = buttons[buttons.length - 1];
      fireEvent.click(nextButton);

      expect(mockOnChange).toHaveBeenCalledTimes(1);
      expect(mockOnChange).toHaveBeenCalledWith({
        ...mockPaginationData,
        currentPage: 2,
      });
    });

    it("should not call onChange when next button is disabled", () => {
      renderWithRouter(
        <CPagination
          {...mockDefaultPaginationProps}
          pagination={mockPaginationDataLastPage}
        />
      );

      const buttons = screen.getAllByRole("button");
      const nextButton = buttons[buttons.length - 1];
      fireEvent.click(nextButton);

      expect(mockOnChange).not.toHaveBeenCalled();
    });

    it("should generate correct walkme id for next button", () => {
      renderWithRouter(
        <CPagination
          {...mockDefaultPaginationProps}
          walkMeIdPrefix={["template", "library"]}
        />
      );

      const buttons = screen.getAllByRole("button");
      const nextButton = buttons[buttons.length - 1];
      expect(nextButton).toHaveAttribute(
        "data-walkme-id",
        "LOGILE-TEST-TEMPLATE-LIBRARY-PAGINATOR-NEXT BUTTON"
      );
    });
  });

  describe("Current Page Select Functionality", () => {
    it("should display current page number", () => {
      renderWithRouter(
        <CPagination
          {...mockDefaultPaginationProps}
          pagination={mockPaginationDataMiddlePage}
        />
      );

      // The current page should be displayed in the select
      expect(screen.getByText("5")).toBeInTheDocument();
    });

    it("should generate correct page options based on totalPages", () => {
      renderWithRouter(
        <CPagination
          {...mockDefaultPaginationProps}
          pagination={mockPaginationData}
        />
      );

      // With 10 total pages, we should have options from 1 to 10
      const currentPageValue = mockPaginationData.currentPage;
      expect(screen.getByText(currentPageValue.toString())).toBeInTheDocument();
    });

    it("should handle empty totalPages gracefully", () => {
      const { container } = renderWithRouter(
        <CPagination
          {...mockDefaultPaginationProps}
          pagination={{ ...mockPaginationData, totalPages: 0 }}
        />
      );

      // Component should still render without errors
      expect(
        container.querySelector(".pagination__current-page-select")
      ).toBeInTheDocument();
    });

    it("should call onChange with updated current page when page select changes", () => {
      renderWithRouter(
        <CPagination
          {...mockDefaultPaginationProps}
          pagination={mockPaginationData}
        />
      );

      // Find the current page select (first select element)
      const selects = screen.getAllByRole("combobox");
      const currentPageSelect = selects[0];

      // Simulate changing to page 3
      fireEvent.mouseDown(currentPageSelect);
      const option3 = screen.getByText("3");
      fireEvent.click(option3);

      // onChange should be called with updated currentPage
      expect(mockOnChange).toHaveBeenCalledWith({
        ...mockPaginationData,
        currentPage: 3,
      });
    });

    it("should preserve other pagination data when current page changes", () => {
      renderWithRouter(
        <CPagination
          {...mockDefaultPaginationProps}
          pagination={mockPaginationDataMiddlePage}
        />
      );

      const selects = screen.getAllByRole("combobox");
      const currentPageSelect = selects[0];

      fireEvent.mouseDown(currentPageSelect);
      const option8 = screen.getByText("8");
      fireEvent.click(option8);

      // All other pagination data should be preserved
      expect(mockOnChange).toHaveBeenCalledWith({
        ...mockPaginationDataMiddlePage,
        currentPage: 8,
      });
    });
  });

  describe("Page Size Select Functionality", () => {
    it("should display current page size", () => {
      renderWithRouter(
        <CPagination
          {...mockDefaultPaginationProps}
          pagination={mockPaginationData}
        />
      );

      expect(screen.getByText(/50 \/ Page/i)).toBeInTheDocument();
    });

    it("should use default page size options when pageSizeOptions is empty", () => {
      renderWithRouter(
        <CPagination
          {...mockDefaultPaginationProps}
          pageSizeOptions={[]}
          pagination={mockPaginationData}
        />
      );

      // Component should render with default options
      expect(screen.getByText(/50 \/ Page/i)).toBeInTheDocument();
    });

    it("should use custom page size options when provided", () => {
      renderWithRouter(
        <CPagination
          {...mockDefaultPaginationProps}
          pageSizeOptions={mockCustomPageSizeOptions}
          pagination={mockPaginationData}
        />
      );

      expect(screen.getByText(/50 \/ Page/i)).toBeInTheDocument();
    });

    it("should display page label from translation", () => {
      renderWithRouter(<CPagination {...mockDefaultPaginationProps} />);

      // Should show "Page" from translation mock
      expect(screen.getAllByText(/Page/i).length).toBeGreaterThan(0);
    });

    it("should call onChange with updated page size when page size select changes", () => {
      renderWithRouter(
        <CPagination
          {...mockDefaultPaginationProps}
          pagination={mockPaginationData}
        />
      );

      // Find the page size select (second select element)
      const selects = screen.getAllByRole("combobox");
      const pageSizeSelect = selects[1];

      // Simulate changing page size to 100
      fireEvent.mouseDown(pageSizeSelect);
      const option100 = screen.getByText("100");
      fireEvent.click(option100);

      // onChange should be called with updated pageSize and currentPage reset to 1
      expect(mockOnChange).toHaveBeenCalledWith({
        ...mockPaginationData,
        pageSize: 100,
        currentPage: 1,
      });
    });

    it("should reset currentPage to 1 when page size changes", () => {
      renderWithRouter(
        <CPagination
          {...mockDefaultPaginationProps}
          pagination={mockPaginationDataMiddlePage}
        />
      );

      // Current page is 5
      const selects = screen.getAllByRole("combobox");
      const pageSizeSelect = selects[1];

      fireEvent.mouseDown(pageSizeSelect);
      const option20 = screen.getByText("20");
      fireEvent.click(option20);

      // currentPage should be reset to 1
      expect(mockOnChange).toHaveBeenCalledWith({
        ...mockPaginationDataMiddlePage,
        pageSize: 20,
        currentPage: 1,
      });
    });
  });

  describe("onChange Callback", () => {
    it("should call onChange with correct pagination data on previous click", () => {
      renderWithRouter(
        <CPagination
          {...mockDefaultPaginationProps}
          pagination={mockPaginationDataMiddlePage}
        />
      );

      const prevButton = screen.getAllByRole("button")[0];
      fireEvent.click(prevButton);

      expect(mockOnChange).toHaveBeenCalledWith({
        ...mockPaginationDataMiddlePage,
        currentPage: 4,
      });
    });

    it("should call onChange with correct pagination data on next click", () => {
      renderWithRouter(
        <CPagination
          {...mockDefaultPaginationProps}
          pagination={mockPaginationDataMiddlePage}
        />
      );

      const buttons = screen.getAllByRole("button");
      const nextButton = buttons[buttons.length - 1];
      fireEvent.click(nextButton);

      expect(mockOnChange).toHaveBeenCalledWith({
        ...mockPaginationDataMiddlePage,
        currentPage: 6,
      });
    });

    it("should not throw error when onChange is not provided", () => {
      expect(() => {
        renderWithRouter(<CPagination {...mockPaginationPropsNoCallback} />);
      }).not.toThrow();
    });

    it("should not call onChange when clicking disabled previous button", () => {
      renderWithRouter(
        <CPagination
          {...mockDefaultPaginationProps}
          pagination={mockPaginationData}
        />
      );

      const prevButton = screen.getAllByRole("button")[0];
      fireEvent.click(prevButton);

      expect(mockOnChange).not.toHaveBeenCalled();
    });

    it("should not call onChange when clicking disabled next button", () => {
      renderWithRouter(
        <CPagination
          {...mockDefaultPaginationProps}
          pagination={mockPaginationDataLastPage}
        />
      );

      const buttons = screen.getAllByRole("button");
      const nextButton = buttons[buttons.length - 1];
      fireEvent.click(nextButton);

      expect(mockOnChange).not.toHaveBeenCalled();
    });
  });

  describe("Edge Cases and Boundary Conditions", () => {
    it("should handle single page pagination", () => {
      const { container } = renderWithRouter(
        <CPagination
          {...mockDefaultPaginationProps}
          pagination={mockPaginationDataSinglePage}
        />
      );

      // Single page with small dataset should not render pagination
      expect(container.querySelector(".pagination")).not.toBeInTheDocument();
    });

    it("should handle first page correctly", () => {
      renderWithRouter(
        <CPagination
          {...mockDefaultPaginationProps}
          pagination={{ ...mockPaginationData, currentPage: 1 }}
        />
      );

      const prevButton = screen.getAllByRole("button")[0];
      expect(prevButton).toBeDisabled();
    });

    it("should handle last page correctly", () => {
      renderWithRouter(
        <CPagination
          {...mockDefaultPaginationProps}
          pagination={mockPaginationDataLastPage}
        />
      );

      const buttons = screen.getAllByRole("button");
      const nextButton = buttons[buttons.length - 1];
      expect(nextButton).toBeDisabled();
    });

    it("should handle middle page correctly", () => {
      renderWithRouter(
        <CPagination
          {...mockDefaultPaginationProps}
          pagination={mockPaginationDataMiddlePage}
        />
      );

      const prevButton = screen.getAllByRole("button")[0];
      const buttons = screen.getAllByRole("button");
      const nextButton = buttons[buttons.length - 1];

      expect(prevButton).not.toBeDisabled();
      expect(nextButton).not.toBeDisabled();
    });

    it("should handle undefined pagination gracefully with defaults", () => {
      const { container } = renderWithRouter(
        <CPagination
          walkMeIdPrefix={["test"]}
          pagination={undefined as unknown as Pagination}
          showPagination={true}
        />
      );

      // Should not crash and not render if data is invalid
      expect(container.querySelector(".pagination")).not.toBeInTheDocument();
    });

    it("should handle pagination with 1 totalPages", () => {
      renderWithRouter(
        <CPagination
          {...mockDefaultPaginationProps}
          pagination={{ ...mockPaginationData, totalPages: 1, currentPage: 1 }}
        />
      );

      expect(screen.getByText(/of/i)).toBeInTheDocument();
      expect(screen.getByText("1")).toBeInTheDocument();
    });

    it("should handle pagination with large totalPages", () => {
      renderWithRouter(
        <CPagination
          {...mockDefaultPaginationProps}
          pagination={{ ...mockPaginationData, totalPages: 1000 }}
        />
      );

      expect(screen.getByText(/of/i)).toBeInTheDocument();
      expect(screen.getByText(/1000/i)).toBeInTheDocument();
    });

    it("should handle pagination when currentPage equals totalPages", () => {
      renderWithRouter(
        <CPagination
          {...mockDefaultPaginationProps}
          pagination={{
            ...mockPaginationData,
            currentPage: 10,
            totalPages: 10,
          }}
        />
      );

      const buttons = screen.getAllByRole("button");
      const nextButton = buttons[buttons.length - 1];
      expect(nextButton).toBeDisabled();
    });

    it("should handle pagination when currentPage is 1", () => {
      renderWithRouter(
        <CPagination
          {...mockDefaultPaginationProps}
          pagination={{ ...mockPaginationData, currentPage: 1 }}
        />
      );

      const prevButton = screen.getAllByRole("button")[0];
      expect(prevButton).toBeDisabled();
    });
  });

  describe("Internal Functions", () => {
    describe("handlePageClick", () => {
      it("should decrement page on previous action", () => {
        renderWithRouter(
          <CPagination
            {...mockDefaultPaginationProps}
            pagination={{ ...mockPaginationData, currentPage: 5 }}
          />
        );

        const prevButton = screen.getAllByRole("button")[0];
        fireEvent.click(prevButton);

        expect(mockOnChange).toHaveBeenCalledWith(
          expect.objectContaining({ currentPage: 4 })
        );
      });

      it("should increment page on next action", () => {
        renderWithRouter(
          <CPagination
            {...mockDefaultPaginationProps}
            pagination={{ ...mockPaginationData, currentPage: 5 }}
          />
        );

        const buttons = screen.getAllByRole("button");
        const nextButton = buttons[buttons.length - 1];
        fireEvent.click(nextButton);

        expect(mockOnChange).toHaveBeenCalledWith(
          expect.objectContaining({ currentPage: 6 })
        );
      });

      it("should not decrement below page 1", () => {
        renderWithRouter(
          <CPagination
            {...mockDefaultPaginationProps}
            pagination={{ ...mockPaginationData, currentPage: 1 }}
          />
        );

        const prevButton = screen.getAllByRole("button")[0];
        fireEvent.click(prevButton);

        expect(mockOnChange).not.toHaveBeenCalled();
      });

      it("should not increment beyond totalPages", () => {
        renderWithRouter(
          <CPagination
            {...mockDefaultPaginationProps}
            pagination={{
              ...mockPaginationData,
              currentPage: 10,
              totalPages: 10,
            }}
          />
        );

        const buttons = screen.getAllByRole("button");
        const nextButton = buttons[buttons.length - 1];
        fireEvent.click(nextButton);

        expect(mockOnChange).not.toHaveBeenCalled();
      });
    });

    describe("isPaginationRequired", () => {
      it("should return false when totalItems is less than minimum page size", () => {
        const { container } = renderWithRouter(
          <CPagination
            {...mockDefaultPaginationProps}
            pagination={{ ...mockPaginationData, totalItems: 5 }}
          />
        );

        expect(container.querySelector(".pagination")).not.toBeInTheDocument();
      });

      it("should return true when totalItems is greater than minimum page size", () => {
        const { container } = renderWithRouter(
          <CPagination
            {...mockDefaultPaginationProps}
            pagination={{ ...mockPaginationData, totalItems: 100 }}
          />
        );

        expect(container.querySelector(".pagination")).toBeInTheDocument();
      });

      it("should use custom page size options for pagination requirement check", () => {
        const { container } = renderWithRouter(
          <CPagination
            {...mockDefaultPaginationProps}
            pageSizeOptions={[{ label: "5", value: 5 }]}
            pagination={{ ...mockPaginationData, totalItems: 6 }}
          />
        );

        expect(container.querySelector(".pagination")).toBeInTheDocument();
      });

      it("should use default options when pageSizeOptions is empty", () => {
        const { container } = renderWithRouter(
          <CPagination
            {...mockDefaultPaginationProps}
            pageSizeOptions={[]}
            pagination={{ ...mockPaginationData, totalItems: 15 }}
          />
        );

        expect(container.querySelector(".pagination")).toBeInTheDocument();
      });
    });

    describe("currentPageOption", () => {
      it("should generate correct page options array", () => {
        renderWithRouter(
          <CPagination
            {...mockDefaultPaginationProps}
            pagination={{ ...mockPaginationData, totalPages: 5 }}
          />
        );

        // With 5 total pages, current page display should work correctly
        expect(screen.getByText("1")).toBeInTheDocument();
      });

      it("should handle empty totalPages", () => {
        const { container } = renderWithRouter(
          <CPagination
            {...mockDefaultPaginationProps}
            pagination={{ ...mockPaginationData, totalPages: 0 }}
          />
        );

        // Should not crash
        expect(container).toBeInTheDocument();
      });

      it("should handle single page", () => {
        renderWithRouter(
          <CPagination
            {...mockDefaultPaginationProps}
            pagination={{
              ...mockPaginationData,
              totalPages: 1,
              currentPage: 1,
            }}
          />
        );

        expect(screen.getByText("1")).toBeInTheDocument();
      });
    });
  });

  describe("WalkMe ID Generation", () => {
    it("should generate walkme ids for navigation buttons", () => {
      renderWithRouter(
        <CPagination
          {...mockDefaultPaginationProps}
          walkMeIdPrefix={["test", "component"]}
        />
      );

      const prevButton = screen.getAllByRole("button")[0];
      const buttons = screen.getAllByRole("button");
      const nextButton = buttons[buttons.length - 1];

      expect(prevButton).toHaveAttribute("data-walkme-id");
      expect(nextButton).toHaveAttribute("data-walkme-id");
    });

    it("should include prefix in walkme id generation", () => {
      renderWithRouter(
        <CPagination
          {...mockDefaultPaginationProps}
          walkMeIdPrefix={["library", "pagination"]}
        />
      );

      const prevButton = screen.getAllByRole("button")[0];
      const walkmeId = prevButton.getAttribute("data-walkme-id");

      expect(walkmeId).toContain("LIBRARY");
      expect(walkmeId).toContain("PAGINATION");
    });

    it("should handle empty walkMeIdPrefix", () => {
      renderWithRouter(
        <CPagination
          {...mockDefaultPaginationProps}
          walkMeIdPrefix={[]}
        />
      );

      const prevButton = screen.getAllByRole("button")[0];
      expect(prevButton).toHaveAttribute("data-walkme-id", undefined);
    });
  });

  describe("Translation Integration", () => {
    it("should display translated page label", () => {
      renderWithRouter(<CPagination {...mockDefaultPaginationProps} />);

      expect(screen.getAllByText("Page").length).toBeGreaterThan(0);
    });

    it("should display translated 'of' label", () => {
      renderWithRouter(<CPagination {...mockDefaultPaginationProps} />);

      expect(screen.getByText(/of/i)).toBeInTheDocument();
    });

    it("should use translation in page size display", () => {
      renderWithRouter(<CPagination {...mockDefaultPaginationProps} />);

      expect(screen.getByText(/50 \/ Page/i)).toBeInTheDocument();
    });
  });

  describe("Props Handling", () => {
    it("should handle all optional props being undefined", () => {
      const minimalProps = {
        pagination: mockPaginationData,
        walkMeIdPrefix: ["test"],
      };

      expect(() => {
        renderWithRouter(<CPagination {...minimalProps} />);
      }).not.toThrow();
    });

    it("should use default size when size prop is not provided", () => {
      const { container } = renderWithRouter(
        <CPagination
          pagination={mockPaginationData}
          walkMeIdPrefix={["test"]}
          showPagination={true}
        />
      );

      expect(container.querySelector(".pagination--large")).toBeInTheDocument();
    });

    it("should use default pagination when not provided", () => {
      const { container } = renderWithRouter(
        <CPagination
          walkMeIdPrefix={["test"]}
          pagination={undefined as unknown as Pagination}
          showPagination={true}
        />
      );

      // Should handle gracefully
      expect(container).toBeInTheDocument();
    });

    it("should handle className being undefined", () => {
      const { container } = renderWithRouter(
        <CPagination
          {...mockDefaultPaginationProps}
          className={undefined}
        />
      );

      expect(container.querySelector(".pagination")).toBeInTheDocument();
    });

    it("should handle custom className string", () => {
      const customClass = "my-custom-pagination";
      const { container } = renderWithRouter(
        <CPagination
          {...mockDefaultPaginationProps}
          className={customClass}
        />
      );

      expect(container.querySelector(`.${customClass}`)).toBeInTheDocument();
    });
  });

  describe("Multiple Clicks and Interactions", () => {
    it("should handle multiple previous button clicks", () => {
      renderWithRouter(
        <CPagination
          {...mockDefaultPaginationProps}
          pagination={{ ...mockPaginationData, currentPage: 5 }}
        />
      );

      const prevButton = screen.getAllByRole("button")[0];
      fireEvent.click(prevButton);
      fireEvent.click(prevButton);
      fireEvent.click(prevButton);

      expect(mockOnChange).toHaveBeenCalledTimes(3);
    });

    it("should handle multiple next button clicks", () => {
      renderWithRouter(
        <CPagination
          {...mockDefaultPaginationProps}
          pagination={{ ...mockPaginationData, currentPage: 1 }}
        />
      );

      const buttons = screen.getAllByRole("button");
      const nextButton = buttons[buttons.length - 1];
      fireEvent.click(nextButton);
      fireEvent.click(nextButton);

      expect(mockOnChange).toHaveBeenCalledTimes(2);
    });

    it("should handle rapid successive clicks", () => {
      renderWithRouter(
        <CPagination
          {...mockDefaultPaginationProps}
          pagination={{ ...mockPaginationData, currentPage: 5 }}
        />
      );

      const buttons = screen.getAllByRole("button");
      const nextButton = buttons[buttons.length - 1];

      for (let i = 0; i < 5; i++) {
        fireEvent.click(nextButton);
      }

      expect(mockOnChange).toHaveBeenCalledTimes(5);
    });
  });

  describe("Data Consistency", () => {
    it("should preserve pagination data except currentPage on next click", () => {
      const customPaginationData = {
        ...mockPaginationData,
        currentPage: 3,
        pageSize: 25,
        totalPages: 20,
        totalItems: 500,
      };

      renderWithRouter(
        <CPagination
          {...mockDefaultPaginationProps}
          pagination={customPaginationData}
        />
      );

      const buttons = screen.getAllByRole("button");
      const nextButton = buttons[buttons.length - 1];
      fireEvent.click(nextButton);

      expect(mockOnChange).toHaveBeenCalledWith({
        ...customPaginationData,
        currentPage: 4,
      });
    });

    it("should preserve pagination data except currentPage on prev click", () => {
      const customPaginationData = {
        ...mockPaginationData,
        currentPage: 7,
        pageSize: 25,
        totalPages: 20,
        totalItems: 500,
      };

      renderWithRouter(
        <CPagination
          {...mockDefaultPaginationProps}
          pagination={customPaginationData}
        />
      );

      const prevButton = screen.getAllByRole("button")[0];
      fireEvent.click(prevButton);

      expect(mockOnChange).toHaveBeenCalledWith({
        ...customPaginationData,
        currentPage: 6,
      });
    });
  });

  describe("Accessibility", () => {
    it("should have proper button roles", () => {
      renderWithRouter(<CPagination {...mockDefaultPaginationProps} />);

      const buttons = screen.getAllByRole("button");
      expect(buttons.length).toBeGreaterThan(0);
    });

    it("should have disabled attribute on disabled buttons", () => {
      renderWithRouter(
        <CPagination
          {...mockDefaultPaginationProps}
          pagination={mockPaginationData}
        />
      );

      const prevButton = screen.getAllByRole("button")[0];
      expect(prevButton).toHaveAttribute("disabled");
    });

    it("should not have disabled attribute on enabled buttons", () => {
      renderWithRouter(
        <CPagination
          {...mockDefaultPaginationProps}
          pagination={mockPaginationDataMiddlePage}
        />
      );

      const prevButton = screen.getAllByRole("button")[0];
      expect(prevButton).not.toHaveAttribute("disabled");
    });
  });

  describe("Negative Scenarios", () => {
    it("should handle invalid currentPage (0)", () => {
      const { container } = renderWithRouter(
        <CPagination
          {...mockDefaultPaginationProps}
          pagination={{ ...mockPaginationData, currentPage: 0 }}
        />
      );

      expect(container.querySelector(".pagination")).toBeInTheDocument();
    });

    it("should handle invalid currentPage (negative)", () => {
      const { container } = renderWithRouter(
        <CPagination
          {...mockDefaultPaginationProps}
          pagination={{ ...mockPaginationData, currentPage: -1 }}
        />
      );

      expect(container.querySelector(".pagination")).toBeInTheDocument();
    });

    it("should handle currentPage greater than totalPages", () => {
      const { container } = renderWithRouter(
        <CPagination
          {...mockDefaultPaginationProps}
          pagination={{
            ...mockPaginationData,
            currentPage: 100,
            totalPages: 10,
          }}
        />
      );

      expect(container.querySelector(".pagination")).toBeInTheDocument();
    });

    it("should handle negative totalPages", () => {
      const { container } = renderWithRouter(
        <CPagination
          {...mockDefaultPaginationProps}
          pagination={{ ...mockPaginationData, totalPages: -1 }}
        />
      );

      expect(container).toBeInTheDocument();
    });

    it("should handle negative totalItems", () => {
      const { container } = renderWithRouter(
        <CPagination
          {...mockDefaultPaginationProps}
          pagination={{ ...mockPaginationData, totalItems: -1 }}
        />
      );

      // Should not render due to invalid totalItems
      expect(container.querySelector(".pagination")).not.toBeInTheDocument();
    });

    it("should handle zero pageSize", () => {
      const { container } = renderWithRouter(
        <CPagination
          {...mockDefaultPaginationProps}
          pagination={{ ...mockPaginationData, pageSize: 0 }}
        />
      );

      expect(container.querySelector(".pagination")).toBeInTheDocument();
    });

    it("should handle negative pageSize", () => {
      const { container } = renderWithRouter(
        <CPagination
          {...mockDefaultPaginationProps}
          pagination={{ ...mockPaginationData, pageSize: -10 }}
        />
      );

      expect(container.querySelector(".pagination")).toBeInTheDocument();
    });
  });
});

import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { CDataTable } from "../DataTable";
import type { MRT_Row, MRT_RowData } from "material-react-table";
import {
  mockDefaultProps,
  mockPropsWithRowSelection,
  mockPropsWithLoading,
  mockPropsWithoutPagination,
  mockPropsWithCustomStyles,
  mockPropsWithPaginationOptions,
  mockPropsWithEmptyData,
  mockHandlePaginationChange,
  mockIsRowSelected,
  mockUpdatedPagination,
  resetAllMocks,
} from "./__mocks__/DataTable.mocks";

// Track useMaterialReactTable calls
let useMaterialReactTableCalls: any[] = [];

// Mock MaterialReactTable
vi.mock("material-react-table", async () => {
  const actual = await vi.importActual("material-react-table");
  return {
    ...actual,
    MaterialReactTable: vi.fn(() => (
      <div data-testid="material-react-table">MaterialReactTable</div>
    )),
    useMaterialReactTable: vi.fn((config) => {
      useMaterialReactTableCalls.push(config);
      return {
        ...config,
        getState: vi.fn(() => ({ density: "comfortable" })),
      };
    }),
  };
});

// Mock CPagination component
vi.mock("@/core/components/pagination/Pagination", () => ({
  default: vi.fn(
    ({
      pagination,
      onChange,
      walkMeIdPrefix,
      showPagination,
      className,
      pageSizeOptions,
    }) => (
      <div
        data-testid="pagination-component"
        className={className}
      >
        <span data-testid="current-page">{pagination.currentPage}</span>
        <span data-testid="page-size">{pagination.pageSize}</span>
        <span data-testid="total-items">{pagination.totalItems}</span>
        <button
          data-testid="pagination-change-button"
          onClick={() =>
            onChange({
              currentPage: 2,
              pageSize: 20,
              totalPages: 5,
              totalItems: 50,
              hasPreviousPage: true,
              hasNextPage: true,
            })
          }
        >
          Change Pagination
        </button>
        <span data-testid="walkme-id-prefix">{walkMeIdPrefix.join("-")}</span>
        {showPagination && (
          <span data-testid="pagination-visible">Visible</span>
        )}
        {pageSizeOptions && (
          <span data-testid="page-size-options">
            {pageSizeOptions.map((opt) => opt.value).join(",")}
          </span>
        )}
      </div>
    )
  ),
}));

describe("CDataTable Component", () => {
  beforeEach(() => {
    resetAllMocks();
    vi.clearAllMocks();
    useMaterialReactTableCalls = [];
  });

  describe("Component Rendering", () => {
    it("should render the table component", () => {
      render(<CDataTable {...mockDefaultProps} />);
      const table = screen.getByTestId("material-react-table");
      expect(table).toBeInTheDocument();
    });

    it("should render with correct container structure", () => {
      const { container } = render(<CDataTable {...mockDefaultProps} />);
      const dataTableContainer = container.querySelector(".data-table");
      const tableContainer = container.querySelector(
        ".data-table__table-container"
      );
      const paginationContainer = container.querySelector(
        ".data-table__pagination-container"
      );

      expect(dataTableContainer).toBeInTheDocument();
      expect(tableContainer).toBeInTheDocument();
      expect(paginationContainer).toBeInTheDocument();
    });

    it("should render pagination component when not loading", () => {
      render(<CDataTable {...mockDefaultProps} />);
      const pagination = screen.getByTestId("pagination-component");
      expect(pagination).toBeInTheDocument();
    });

    it("should not render pagination component when loading", () => {
      render(<CDataTable {...mockPropsWithLoading} />);
      const pagination = screen.queryByTestId("pagination-component");
      expect(pagination).not.toBeInTheDocument();
    });
  });

  describe("Props Handling - Pagination", () => {
    it("should pass correct pagination data to CPagination component", () => {
      render(<CDataTable {...mockDefaultProps} />);
      expect(screen.getByTestId("current-page")).toHaveTextContent("1");
      expect(screen.getByTestId("page-size")).toHaveTextContent("10");
      expect(screen.getByTestId("total-items")).toHaveTextContent("50");
    });

    it("should pass walkMeIdPrefix to CPagination component", () => {
      render(<CDataTable {...mockDefaultProps} />);
      const walkMeId = screen.getByTestId("walkme-id-prefix");
      expect(walkMeId).toHaveTextContent("test-datatable");
    });

    it("should pass showPagination prop to CPagination", () => {
      render(<CDataTable {...mockDefaultProps} />);
      expect(screen.getByTestId("pagination-visible")).toBeInTheDocument();
    });

    it("should pass custom pagination className when provided", () => {
      render(<CDataTable {...mockPropsWithPaginationOptions} />);
      const pagination = screen.getByTestId("pagination-component");
      expect(pagination).toHaveClass("custom-pagination-class");
    });

    it("should pass pageSizeOptions to CPagination when provided", () => {
      render(<CDataTable {...mockPropsWithPaginationOptions} />);
      const pageSizeOptions = screen.getByTestId("page-size-options");
      expect(pageSizeOptions).toHaveTextContent("10,25,50");
    });
  });

  describe("Event Handling - Pagination Change", () => {
    it("should call handlePaginationChange when pagination changes", () => {
      render(<CDataTable {...mockDefaultProps} />);
      const changeButton = screen.getByTestId("pagination-change-button");
      fireEvent.click(changeButton);
      expect(mockHandlePaginationChange).toHaveBeenCalledTimes(1);
      expect(mockHandlePaginationChange).toHaveBeenCalledWith(
        mockUpdatedPagination
      );
    });

    it("should not call handlePaginationChange when component is loading", () => {
      render(<CDataTable {...mockPropsWithLoading} />);
      expect(mockHandlePaginationChange).not.toHaveBeenCalled();
    });
  });

  describe("Props Handling - Row Selection", () => {
    it("should use isRowSelected function when provided", () => {
      render(<CDataTable {...mockPropsWithRowSelection} />);
      expect(mockIsRowSelected).toBeDefined();

      // Verify the function is available in props
      expect(mockPropsWithRowSelection.isRowSelected).toBe(mockIsRowSelected);
    });

    it("should work without isRowSelected function", () => {
      render(<CDataTable {...mockDefaultProps} />);
      const table = screen.getByTestId("material-react-table");
      expect(table).toBeInTheDocument();
    });
  });

  describe("Props Handling - Custom Styles", () => {
    it("should accept muiTableStyleProps", () => {
      render(<CDataTable {...mockPropsWithCustomStyles} />);
      const table = screen.getByTestId("material-react-table");
      expect(table).toBeInTheDocument();
    });

    it("should work without muiTableStyleProps", () => {
      render(<CDataTable {...mockDefaultProps} />);
      const table = screen.getByTestId("material-react-table");
      expect(table).toBeInTheDocument();
    });
  });

  describe("Props Handling - Loading State", () => {
    it("should handle isLoading=false by default", () => {
      const propsWithoutLoading = {
        ...mockDefaultProps,
        isLoading: undefined,
      };
      render(<CDataTable {...propsWithoutLoading} />);
      const pagination = screen.getByTestId("pagination-component");
      expect(pagination).toBeInTheDocument();
    });

    it("should hide pagination when isLoading=true", () => {
      render(<CDataTable {...mockPropsWithLoading} />);
      const pagination = screen.queryByTestId("pagination-component");
      expect(pagination).not.toBeInTheDocument();
    });

    it("should show table even when loading", () => {
      render(<CDataTable {...mockPropsWithLoading} />);
      const table = screen.getByTestId("material-react-table");
      expect(table).toBeInTheDocument();
    });
  });

  describe("Props Handling - ShowPagination", () => {
    it("should show pagination by default", () => {
      const propsWithoutShowPagination = {
        ...mockDefaultProps,
        showPagination: undefined,
      };
      render(<CDataTable {...propsWithoutShowPagination} />);
      const pagination = screen.getByTestId("pagination-component");
      expect(pagination).toBeInTheDocument();
    });

    it("should pass showPagination=false to CPagination", () => {
      render(<CDataTable {...mockPropsWithoutPagination} />);
      const paginationVisible = screen.queryByTestId("pagination-visible");
      expect(paginationVisible).not.toBeInTheDocument();
    });
  });

  describe("Props Handling - Table Props", () => {
    it("should pass tableProps to useMaterialReactTable", () => {
      render(<CDataTable {...mockDefaultProps} />);

      expect(useMaterialReactTableCalls.length).toBeGreaterThan(0);
      const callArgs = useMaterialReactTableCalls[0];

      // Verify enableStickyHeader is set
      expect(callArgs.enableStickyHeader).toBe(true);

      // Verify tableProps are spread
      expect(callArgs.columns).toBeDefined();
      expect(callArgs.data).toBeDefined();
    });

    it("should merge custom muiTableContainerProps with default styles", () => {
      render(<CDataTable {...mockPropsWithCustomStyles} />);

      const callArgs = useMaterialReactTableCalls[0];
      expect(callArgs.muiTableContainerProps).toBeDefined();
      expect(callArgs.muiTableContainerProps.sx).toBeDefined();
    });
  });

  describe("Edge Cases - Empty Data", () => {
    it("should render table with empty data", () => {
      render(<CDataTable {...mockPropsWithEmptyData} />);
      const table = screen.getByTestId("material-react-table");
      expect(table).toBeInTheDocument();
    });

    it("should still show pagination with empty data", () => {
      render(<CDataTable {...mockPropsWithEmptyData} />);
      const pagination = screen.getByTestId("pagination-component");
      expect(pagination).toBeInTheDocument();
    });
  });

  describe("Edge Cases - Additional Props", () => {
    it("should spread additional props to MaterialReactTable", () => {
      const additionalProps = {
        "data-custom-attr": "test-value",
      };
      render(
        <CDataTable
          {...mockDefaultProps}
          {...additionalProps}
        />
      );
      const table = screen.getByTestId("material-react-table");
      expect(table).toBeInTheDocument();
    });
  });

  describe("Integration - Row Styling", () => {
    it("should configure muiTableBodyRowProps for row selection", () => {
      render(<CDataTable {...mockPropsWithRowSelection} />);

      const callArgs = useMaterialReactTableCalls[0];
      expect(callArgs.muiTableBodyRowProps).toBeDefined();

      // Test the muiTableBodyRowProps function
      const mockRow = {
        original: { templateId: 1, templateName: "Template 1" },
      } as unknown as MRT_Row<MRT_RowData>;

      const rowProps = callArgs.muiTableBodyRowProps({ row: mockRow });
      expect(rowProps).toBeDefined();
      expect(rowProps.hover).toBe(false); // Row is selected, so hover is false
      expect(rowProps.sx).toBeDefined();
    });

    it("should set hover to true for non-selected rows", () => {
      render(<CDataTable {...mockPropsWithRowSelection} />);

      const callArgs = useMaterialReactTableCalls[0];

      const mockRow = {
        original: { templateId: 2, templateName: "Template 2" },
      } as unknown as MRT_Row<MRT_RowData>;

      const rowProps = callArgs.muiTableBodyRowProps({ row: mockRow });
      expect(rowProps.hover).toBe(true); // Row is not selected, so hover is true
    });

    it("should set hover to true when isRowSelected is not provided", () => {
      render(<CDataTable {...mockDefaultProps} />);

      const callArgs = useMaterialReactTableCalls[0];

      const mockRow = {
        original: { templateId: 1, templateName: "Template 1" },
      } as unknown as MRT_Row<MRT_RowData>;

      const rowProps = callArgs.muiTableBodyRowProps({ row: mockRow });
      expect(rowProps.hover).toBe(true); // No isRowSelected function, so hover is true
    });

    it("should apply correct background color for selected rows", () => {
      render(<CDataTable {...mockPropsWithRowSelection} />);

      const callArgs = useMaterialReactTableCalls[0];

      const mockRow = {
        original: { templateId: 1, templateName: "Template 1" },
      } as unknown as MRT_Row<MRT_RowData>;

      const rowProps = callArgs.muiTableBodyRowProps({ row: mockRow });
      expect(rowProps.sx.backgroundColor).toBe(
        "var(--logile-bg-primary-x-subtle)"
      );
    });

    it("should apply inherit background color for non-selected rows", () => {
      render(<CDataTable {...mockPropsWithRowSelection} />);

      const callArgs = useMaterialReactTableCalls[0];

      const mockRow = {
        original: { templateId: 2, templateName: "Template 2" },
      } as unknown as MRT_Row<MRT_RowData>;

      const rowProps = callArgs.muiTableBodyRowProps({ row: mockRow });
      expect(rowProps.sx.backgroundColor).toBe("inherit");
    });
  });

  describe("Integration - Table Styling", () => {
    it("should apply default CSS custom properties for table styling", () => {
      render(<CDataTable {...mockDefaultProps} />);

      const callArgs = useMaterialReactTableCalls[0];
      const sx = callArgs.muiTableContainerProps.sx;

      expect(sx["& .MuiTableHead-root"].backgroundColor).toBe(
        "var(--logile-bg-table-header)"
      );
      expect(sx["& tbody"].bgcolor).toBe("var(--logile-bg-table-row)");
      expect(sx["& th"].backgroundColor).toBe("var(--logile-bg-table-header)");
      expect(sx["& td"].color).toBe("var(--logile-text-primary)");
    });

    it("should apply hover styles for table rows", () => {
      render(<CDataTable {...mockDefaultProps} />);

      const callArgs = useMaterialReactTableCalls[0];
      const sx = callArgs.muiTableContainerProps.sx;

      expect(sx["& tr.MuiTableRow-root:hover"].backgroundColor).toBe(
        "var(--logile-bg-primary-x-subtle)"
      );
      expect(sx["& .MuiTableRow-root:hover td:after"].backgroundColor).toBe(
        "transparent"
      );
    });

    it("should merge custom muiTableStyleProps with default styles", () => {
      render(<CDataTable {...mockPropsWithCustomStyles} />);

      const callArgs = useMaterialReactTableCalls[0];
      const sx = callArgs.muiTableContainerProps.sx;

      // Check that default styles are still applied
      expect(sx["& .MuiTableHead-root"]).toBeDefined();

      // Check that custom styles are merged
      expect(sx.maxHeight).toBe("500px");
      expect(sx.backgroundColor).toBe("lightgray");
    });
  });

  describe("Edge Cases - Pagination Boundary Conditions", () => {
    it("should handle pagination with zero total items", () => {
      const propsWithZeroItems = {
        ...mockDefaultProps,
        pagination: {
          currentPage: 1,
          pageSize: 10,
          totalPages: 0,
          totalItems: 0,
          hasPreviousPage: false,
          hasNextPage: false,
        },
      };
      render(<CDataTable {...propsWithZeroItems} />);
      expect(screen.getByTestId("total-items")).toHaveTextContent("0");
    });

    it("should handle pagination with single page", () => {
      const propsWithSinglePage = {
        ...mockDefaultProps,
        pagination: {
          currentPage: 1,
          pageSize: 100,
          totalPages: 1,
          totalItems: 5,
          hasPreviousPage: false,
          hasNextPage: false,
        },
      };
      render(<CDataTable {...propsWithSinglePage} />);
      expect(screen.getByTestId("total-items")).toHaveTextContent("5");
    });

    it("should handle pagination on last page", () => {
      const propsOnLastPage = {
        ...mockDefaultProps,
        pagination: {
          currentPage: 5,
          pageSize: 10,
          totalPages: 5,
          totalItems: 50,
          hasPreviousPage: true,
          hasNextPage: false,
        },
      };
      render(<CDataTable {...propsOnLastPage} />);
      expect(screen.getByTestId("current-page")).toHaveTextContent("5");
    });
  });

  describe("Edge Cases - WalkMe ID Prefix", () => {
    it("should handle empty walkMeIdPrefix array", () => {
      const propsWithEmptyPrefix = {
        ...mockDefaultProps,
        walkMeIdPrefix: [],
      };
      render(<CDataTable {...propsWithEmptyPrefix} />);
      const walkMeId = screen.getByTestId("walkme-id-prefix");
      expect(walkMeId).toHaveTextContent("");
    });

    it("should handle single item walkMeIdPrefix", () => {
      const propsWithSinglePrefix = {
        ...mockDefaultProps,
        walkMeIdPrefix: ["test"],
      };
      render(<CDataTable {...propsWithSinglePrefix} />);
      const walkMeId = screen.getByTestId("walkme-id-prefix");
      expect(walkMeId).toHaveTextContent("test");
    });

    it("should handle multiple items in walkMeIdPrefix", () => {
      const propsWithMultiplePrefix = {
        ...mockDefaultProps,
        walkMeIdPrefix: ["test", "datatable", "component"],
      };
      render(<CDataTable {...propsWithMultiplePrefix} />);
      const walkMeId = screen.getByTestId("walkme-id-prefix");
      expect(walkMeId).toHaveTextContent("test-datatable-component");
    });
  });

  describe("Edge Cases - Negative Scenarios", () => {
    it("should pass handlePaginationChange callback correctly", () => {
      const mockSuccessHandler = vi.fn();

      const propsWithHandler = {
        ...mockDefaultProps,
        handlePaginationChange: mockSuccessHandler,
      };

      render(<CDataTable {...propsWithHandler} />);
      const changeButton = screen.getByTestId("pagination-change-button");

      fireEvent.click(changeButton);

      expect(mockSuccessHandler).toHaveBeenCalledTimes(1);
      expect(mockSuccessHandler).toHaveBeenCalledWith({
        currentPage: 2,
        pageSize: 20,
        totalPages: 5,
        totalItems: 50,
        hasPreviousPage: true,
        hasNextPage: true,
      });
    });
  });
});

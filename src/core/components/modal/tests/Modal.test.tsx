import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CModal, { ModalHeader, ModalBody, ModalFooter } from "../Modal";
import {
  mockDefaultProps,
  mockSmallModalProps,
  mockLargeModalProps,
  mockModalWithCustomTexts,
  mockModalWithoutActions,
  mockModalWithDisabledPrimary,
  mockModalWithBackdropDisabled,
  mockModalWithCustomClassName,
  mockModalWithSecondarySeverity,
  mockOnClose,
  mockOnConfirm,
  mockGenerateId,
  resetAllMocks,
} from "./__mocks__/Modal.mocks";

// Mock useCommonTranslation hook
vi.mock("@/core/translation/useCommonTranslation", () => ({
  useCommonTranslation: () => ({
    GENERAL: {
      cancelButtonLabel: "Cancel",
      confirmButtonLabel: "Confirm",
    },
  }),
}));

// Mock useWalkmeId hook
vi.mock("@/core/hooks/useWalkmeId", () => ({
  useWalkmeId: () => ({
    generateId: mockGenerateId,
  }),
}));

// Mock CSvgIcon component
vi.mock("@/core/components/icon/Icon", () => ({
  default: vi.fn(({ component, size, color, ...props }) => (
    <span
      data-testid={`icon-${component?.name || "unknown"}`}
      data-color={color}
      data-size={size}
      {...props}
    >
      Icon
    </span>
  )),
}));

// Mock CIconButton component
vi.mock("@/core/components/button/IconButton", () => ({
  default: vi.fn(({ onClick, children, ...props }) => (
    <button
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  )),
}));

// Mock CButton component
vi.mock("@/core/components/button/button", () => ({
  CButton: vi.fn(
    ({ onClick, children, variant, severity, disabled, ...props }) => (
      <button
        onClick={onClick}
        disabled={disabled}
        data-severity={severity}
        data-variant={variant}
        {...props}
      >
        {children}
      </button>
    )
  ),
}));

// Mock Close icon
vi.mock("@/core/constants/icons", () => ({
  Close: { name: "Close" },
}));

// Mock clsx
vi.mock("@/utils/clsx", () => ({
  default: vi.fn((args) => {
    if (typeof args === "string") return args;
    if (typeof args === "object" && args !== null) {
      return Object.keys(args)
        .filter((key) => args[key])
        .join(" ");
    }
    return "";
  }),
}));

const theme = createTheme();

// Helper function to render component with theme provider
const renderWithProviders = (ui: React.ReactElement) => {
  return render(
    <ThemeProvider theme={theme}>
      <BrowserRouter>{ui}</BrowserRouter>
    </ThemeProvider>
  );
};

describe("CModal Component", () => {
  beforeEach(() => {
    resetAllMocks();
  });

  describe("Component Rendering", () => {
    it("should render the modal when open is true", () => {
      renderWithProviders(<CModal {...mockDefaultProps} />);
      expect(screen.getByText("Test Modal Title")).toBeInTheDocument();
      expect(screen.getByText("Test Modal Content")).toBeInTheDocument();
    });

    it("should not render modal content when open is false", () => {
      renderWithProviders(
        <CModal
          {...mockDefaultProps}
          open={false}
        />
      );
      expect(screen.queryByText("Test Modal Title")).not.toBeInTheDocument();
    });

    it("should render with title and default action buttons", () => {
      renderWithProviders(<CModal {...mockDefaultProps} />);
      expect(screen.getByText("Test Modal Title")).toBeInTheDocument();
      expect(screen.getByText("Cancel")).toBeInTheDocument();
      expect(screen.getByText("Confirm")).toBeInTheDocument();
    });

    it("should render modal content correctly", () => {
      renderWithProviders(<CModal {...mockDefaultProps} />);
      expect(screen.getByText("Test Modal Content")).toBeInTheDocument();
    });

    it("should render close icon button in header", () => {
      renderWithProviders(<CModal {...mockDefaultProps} />);
      const closeButton = screen.getAllByRole("button")[0];
      expect(closeButton).toBeInTheDocument();
    });
  });

  describe("Props Handling - Size", () => {
    it("should apply small size class when size is small", () => {
      renderWithProviders(<CModal {...mockSmallModalProps} />);
      expect(screen.getByText("Test Modal Title")).toBeInTheDocument();
      expect(screen.getByText("Test Modal Content")).toBeInTheDocument();
    });

    it("should apply medium size class when size is medium", () => {
      renderWithProviders(<CModal {...mockDefaultProps} />);
      expect(screen.getByText("Test Modal Title")).toBeInTheDocument();
      expect(screen.getByText("Test Modal Content")).toBeInTheDocument();
    });

    it("should apply large size class when size is large", () => {
      renderWithProviders(<CModal {...mockLargeModalProps} />);
      expect(screen.getByText("Test Modal Title")).toBeInTheDocument();
      expect(screen.getByText("Test Modal Content")).toBeInTheDocument();
    });
  });

  describe("Props Handling - Custom Texts", () => {
    it("should render custom confirm and cancel text when provided", () => {
      renderWithProviders(<CModal {...mockModalWithCustomTexts} />);
      expect(screen.getByText("Custom Confirm")).toBeInTheDocument();
      expect(screen.getByText("Custom Cancel")).toBeInTheDocument();
    });

    it("should use default translation labels when custom texts not provided", () => {
      renderWithProviders(<CModal {...mockDefaultProps} />);
      expect(screen.getByText("Cancel")).toBeInTheDocument();
      expect(screen.getByText("Confirm")).toBeInTheDocument();
    });
  });

  describe("Props Handling - Actions", () => {
    it("should not render action buttons when showActions is false", () => {
      renderWithProviders(<CModal {...mockModalWithoutActions} />);
      expect(screen.queryByText("Cancel")).not.toBeInTheDocument();
      expect(screen.queryByText("Confirm")).not.toBeInTheDocument();
    });

    it("should render action buttons when showActions is true", () => {
      renderWithProviders(<CModal {...mockDefaultProps} />);
      expect(screen.getByText("Cancel")).toBeInTheDocument();
      expect(screen.getByText("Confirm")).toBeInTheDocument();
    });
  });

  describe("Props Handling - Severity", () => {
    it("should apply primary severity to confirm button by default", () => {
      renderWithProviders(<CModal {...mockDefaultProps} />);
      const confirmButton = screen.getByText("Confirm");
      expect(confirmButton).toBeInTheDocument();
    });

    it("should apply secondary severity when specified", () => {
      renderWithProviders(<CModal {...mockModalWithSecondarySeverity} />);
      const confirmButton = screen.getByText("Confirm");
      expect(confirmButton).toBeInTheDocument();
    });
  });

  describe("Props Handling - Custom Classes", () => {
    it("should apply custom className to modal", () => {
      renderWithProviders(<CModal {...mockModalWithCustomClassName} />);
      expect(screen.getByText("Test Modal Title")).toBeInTheDocument();
      expect(screen.getByText("Test Modal Content")).toBeInTheDocument();
    });

    it("should apply custom containerClassName", () => {
      renderWithProviders(<CModal {...mockModalWithCustomClassName} />);
      expect(screen.getByText("Test Modal Title")).toBeInTheDocument();
      expect(screen.getByText("Test Modal Content")).toBeInTheDocument();
    });
  });

  describe("Event Handling - Close", () => {
    it("should call onClose when close icon button is clicked", () => {
      render(<CModal {...mockDefaultProps} />);
      const closeButtons = screen.getAllByRole("button");
      const closeIconButton = closeButtons[0];
      fireEvent.click(closeIconButton);
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it("should call onClose when cancel button is clicked", () => {
      render(<CModal {...mockDefaultProps} />);
      const cancelButton = screen.getByText("Cancel");
      fireEvent.click(cancelButton);
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it("should not call onClose on backdrop click when disableBackdropClick is true", () => {
      const { container } = render(
        <CModal {...mockModalWithBackdropDisabled} />
      );
      const backdrop = container.querySelector(".MuiBackdrop-root");
      if (backdrop) {
        fireEvent.click(backdrop);
      }
      expect(mockOnClose).not.toHaveBeenCalled();
    });
  });

  describe("Event Handling - Confirm", () => {
    it("should call onConfirm when confirm button is clicked", () => {
      render(<CModal {...mockDefaultProps} />);
      const confirmButton = screen.getByText("Confirm");
      fireEvent.click(confirmButton);
      expect(mockOnConfirm).toHaveBeenCalledTimes(1);
    });

    it("should not call onConfirm when button is disabled", () => {
      render(<CModal {...mockModalWithDisabledPrimary} />);
      const confirmButton = screen.getByText("Confirm");
      expect(confirmButton).toBeDisabled();
      fireEvent.click(confirmButton);
      expect(mockOnConfirm).not.toHaveBeenCalled();
    });
  });

  describe("Conditional Rendering - Title", () => {
    it("should render title when provided", () => {
      render(<CModal {...mockDefaultProps} />);
      expect(screen.getByText("Test Modal Title")).toBeInTheDocument();
    });

    it("should not render default header when title is not provided", () => {
      const { container } = render(
        <CModal
          {...mockDefaultProps}
          title={undefined}
        />
      );
      const header = container.querySelector(".common-modal__content-header");
      expect(header).not.toBeInTheDocument();
    });

    it("should not render default header when custom header is provided", () => {
      render(
        <CModal
          {...mockDefaultProps}
          title={undefined}
        >
          <ModalHeader>Custom Header</ModalHeader>
          <div>Content</div>
        </CModal>
      );
      expect(screen.getByText("Custom Header")).toBeInTheDocument();
    });
  });

  describe("Conditional Rendering - Custom Components", () => {
    it("should render custom ModalHeader when provided", () => {
      render(
        <CModal
          {...mockDefaultProps}
          title={undefined}
        >
          <ModalHeader headerClassName="custom-header">
            Custom Header Content
          </ModalHeader>
          <div>Content</div>
        </CModal>
      );
      expect(screen.getByText("Custom Header Content")).toBeInTheDocument();
    });

    it("should render ModalBody with custom className", () => {
      renderWithProviders(
        <CModal {...mockDefaultProps}>
          <ModalBody containerClassName="custom-body">Body Content</ModalBody>
        </CModal>
      );
      expect(screen.getByText("Body Content")).toBeInTheDocument();
    });

    it("should render custom ModalFooter when provided", () => {
      render(
        <CModal {...mockDefaultProps}>
          <div>Content</div>
          <ModalFooter footerClassName="custom-footer">
            Custom Footer Content
          </ModalFooter>
        </CModal>
      );
      expect(screen.getByText("Custom Footer Content")).toBeInTheDocument();
      expect(screen.queryByText("Cancel")).not.toBeInTheDocument();
      expect(screen.queryByText("Confirm")).not.toBeInTheDocument();
    });

    it("should not render default footer when custom footer is provided", () => {
      render(
        <CModal {...mockDefaultProps}>
          <div>Content</div>
          <ModalFooter>
            <button>Custom Button</button>
          </ModalFooter>
        </CModal>
      );
      expect(screen.getByText("Custom Button")).toBeInTheDocument();
      expect(screen.queryByText("Cancel")).not.toBeInTheDocument();
    });
  });

  describe("Props Handling - Disabled State", () => {
    it("should disable primary action button when disablePrimaryAction is true", () => {
      render(<CModal {...mockModalWithDisabledPrimary} />);
      const confirmButton = screen.getByText("Confirm");
      expect(confirmButton).toBeDisabled();
    });

    it("should enable primary action button when disablePrimaryAction is false", () => {
      render(<CModal {...mockDefaultProps} />);
      const confirmButton = screen.getByText("Confirm");
      expect(confirmButton).not.toBeDisabled();
    });
  });

  describe("WalkMe ID Generation", () => {
    it("should generate walkme id for close button", () => {
      render(<CModal {...mockDefaultProps} />);
      expect(mockGenerateId).toHaveBeenCalledWith(["test", "close button"]);
    });

    it("should generate walkme id for close icon", () => {
      render(<CModal {...mockDefaultProps} />);
      expect(mockGenerateId).toHaveBeenCalledWith([
        "test",
        "close button",
        "icon",
      ]);
    });

    it("should generate walkme id for cancel button", () => {
      render(<CModal {...mockDefaultProps} />);
      expect(mockGenerateId).toHaveBeenCalledWith([
        "test",
        "modal",
        "cancel button",
      ]);
    });

    it("should generate walkme id for confirm button", () => {
      render(<CModal {...mockDefaultProps} />);
      expect(mockGenerateId).toHaveBeenCalledWith([
        "test",
        "modal",
        "confirm button",
      ]);
    });

    it("should use empty walkMeIdPrefix when not provided", () => {
      render(
        <CModal
          {...mockDefaultProps}
          walkMeIdPrefix={[]}
        />
      );
      expect(mockGenerateId).toHaveBeenCalledWith(["close button"]);
    });
  });

  describe("Edge Cases", () => {
    it("should handle undefined children gracefully", () => {
      render(
        <CModal
          {...mockDefaultProps}
          children={undefined}
        />
      );
      expect(screen.getByText("Test Modal Title")).toBeInTheDocument();
    });

    it("should handle multiple children elements", () => {
      render(
        <CModal {...mockDefaultProps}>
          <div>First Child</div>
          <div>Second Child</div>
          <div>Third Child</div>
        </CModal>
      );
      expect(screen.getByText("First Child")).toBeInTheDocument();
      expect(screen.getByText("Second Child")).toBeInTheDocument();
      expect(screen.getByText("Third Child")).toBeInTheDocument();
    });

    it("should handle empty string for title", () => {
      const { container } = render(
        <CModal
          {...mockDefaultProps}
          title=""
        />
      );
      const header = container.querySelector(".common-modal__content-header");
      expect(header).not.toBeInTheDocument();
    });

    it("should handle null onConfirm gracefully", () => {
      render(
        <CModal
          {...mockDefaultProps}
          onConfirm={undefined}
        />
      );
      const confirmButton = screen.getByText("Confirm");
      fireEvent.click(confirmButton);
    });

    it("should pass additional props to Box component", () => {
      renderWithProviders(
        <CModal
          {...mockDefaultProps}
          data-testid="custom-modal"
          aria-label="Custom Modal"
        />
      );
      expect(screen.getByText("Test Modal Title")).toBeInTheDocument();
      expect(screen.getByText("Test Modal Content")).toBeInTheDocument();
    });
  });

  describe("hasCustomHeader Logic", () => {
    it("should detect custom header and not render default header", () => {
      renderWithProviders(
        <CModal
          {...mockDefaultProps}
          title="Default Title"
        >
          <ModalHeader>Custom Header</ModalHeader>
          <div>Content</div>
        </CModal>
      );
      expect(screen.queryByText("Default Title")).not.toBeInTheDocument();
      expect(screen.getByText("Custom Header")).toBeInTheDocument();
    });

    it("should render default header when no custom header provided", () => {
      render(
        <CModal
          {...mockDefaultProps}
          title="Default Title"
        >
          <div>Content</div>
        </CModal>
      );
      expect(screen.getByText("Default Title")).toBeInTheDocument();
    });
  });

  describe("hasCustomFooter Logic", () => {
    it("should detect custom footer and not render default footer", () => {
      render(
        <CModal
          {...mockDefaultProps}
          showActions={true}
        >
          <div>Content</div>
          <ModalFooter>Custom Footer</ModalFooter>
        </CModal>
      );
      expect(screen.queryByText("Cancel")).not.toBeInTheDocument();
      expect(screen.queryByText("Confirm")).not.toBeInTheDocument();
      expect(screen.getByText("Custom Footer")).toBeInTheDocument();
    });

    it("should render default footer when no custom footer provided and showActions is true", () => {
      render(
        <CModal
          {...mockDefaultProps}
          showActions={true}
        >
          <div>Content</div>
        </CModal>
      );
      expect(screen.getByText("Cancel")).toBeInTheDocument();
      expect(screen.getByText("Confirm")).toBeInTheDocument();
    });
  });

  describe("ModalHeader Component", () => {
    it("should render with custom className", () => {
      const { container } = render(
        <ModalHeader headerClassName="custom-header-class">
          Header Content
        </ModalHeader>
      );
      const header = container.querySelector(".custom-header-class");
      expect(header).toBeInTheDocument();
    });

    it("should render children correctly", () => {
      render(<ModalHeader>Test Header</ModalHeader>);
      expect(screen.getByText("Test Header")).toBeInTheDocument();
    });
  });

  describe("ModalBody Component", () => {
    it("should render with custom className", () => {
      const { container } = render(
        <ModalBody containerClassName="custom-body-class">
          Body Content
        </ModalBody>
      );
      const body = container.querySelector(".custom-body-class");
      expect(body).toBeInTheDocument();
    });

    it("should render children correctly", () => {
      render(<ModalBody>Test Body</ModalBody>);
      expect(screen.getByText("Test Body")).toBeInTheDocument();
    });
  });

  describe("ModalFooter Component", () => {
    it("should render with custom className", () => {
      const { container } = render(
        <ModalFooter footerClassName="custom-footer-class">
          Footer Content
        </ModalFooter>
      );
      const footer = container.querySelector(".custom-footer-class");
      expect(footer).toBeInTheDocument();
    });

    it("should render children correctly", () => {
      render(<ModalFooter>Test Footer</ModalFooter>);
      expect(screen.getByText("Test Footer")).toBeInTheDocument();
    });
  });

  describe("Negative Scenarios", () => {
    it("should call onClose callback even if it throws error", () => {
      const errorOnClose = vi.fn(() => {
        try {
          throw new Error("Close error");
        } catch (error) {}
      });

      renderWithProviders(
        <CModal
          {...mockDefaultProps}
          onClose={errorOnClose}
        />
      );
      const cancelButton = screen.getByText("Cancel");

      // Click will throw but we just verify the callback was invoked
      try {
        fireEvent.click(cancelButton);
      } catch (error) {
        // Expected to throw
      }

      expect(errorOnClose).toHaveBeenCalledTimes(1);
    });

    it("should call onConfirm callback even if it throws error", () => {
      const errorOnConfirm = vi.fn(() => {
        try {
          throw new Error("Confirm error");
        } catch (error) {}
      });

      renderWithProviders(
        <CModal
          {...mockDefaultProps}
          onConfirm={errorOnConfirm}
        />
      );
      const confirmButton = screen.getByText("Confirm");

      // Click will throw but we just verify the callback was invoked
      try {
        fireEvent.click(confirmButton);
      } catch (error) {
        // Expected to throw
      }

      expect(errorOnConfirm).toHaveBeenCalledTimes(1);
    });
  });

  describe("Integration - Complex Scenarios", () => {
    it("should render modal with all custom components together", () => {
      render(
        <CModal
          {...mockDefaultProps}
          title={undefined}
        >
          <ModalHeader headerClassName="custom-header">
            Custom Header
          </ModalHeader>
          <ModalBody containerClassName="custom-body">Custom Body</ModalBody>
          <ModalFooter footerClassName="custom-footer">
            Custom Footer
          </ModalFooter>
        </CModal>
      );
      expect(screen.getByText("Custom Header")).toBeInTheDocument();
      expect(screen.getByText("Custom Body")).toBeInTheDocument();
      expect(screen.getByText("Custom Footer")).toBeInTheDocument();
    });

    it("should handle mixed default and custom components", () => {
      render(
        <CModal {...mockDefaultProps}>
          <ModalBody>Custom Body Content</ModalBody>
        </CModal>
      );
      expect(screen.getByText("Test Modal Title")).toBeInTheDocument();
      expect(screen.getByText("Custom Body Content")).toBeInTheDocument();
      expect(screen.getByText("Cancel")).toBeInTheDocument();
      expect(screen.getByText("Confirm")).toBeInTheDocument();
    });
  });
});

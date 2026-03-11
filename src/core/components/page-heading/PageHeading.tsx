import { useRef, useState } from "react";
import clsx from "@/utils/clsx";
import CSvgIcon from "@/core/components/icon/Icon";
import { ChevronLeftLarge, QuestionCircle } from "@/core/constants/icons";
import CPopper from "@/core/components/popper/Popper";
import { useLongPress } from "@/core/hooks/useLongPress";

import "./PageHeading.scss";

export type BreadcrumbItem = {
  label: string;
  onClick: () => void;
};

export type PageHeadingProps = {
  title: string;
  onBack?: () => void;
  onHelpClick?: () => void;
  showSeparator?: boolean;
  className?: string;
  /**
   * When provided, right-click (desktop) or long-press (touch) on the back
   * button opens a breadcrumb navigation menu.
   */
  breadcrumbs?: BreadcrumbItem[];
};

const PageHeading: React.FC<PageHeadingProps> = ({
  title,
  onBack,
  onHelpClick,
  showSeparator = false,
  className,
  breadcrumbs,
}) => {
  const backBtnRef = useRef<HTMLButtonElement>(null);
  const [breadcrumbOpen, setBreadcrumbOpen] = useState(false);
  const hasBreadcrumbs = !!breadcrumbs?.length;

  const openBreadcrumbs = () => {
    if (hasBreadcrumbs) setBreadcrumbOpen(true);
  };

  // Long-press for touch devices; short tap still fires onBack via onClick prop
  const longPressHandlers = useLongPress({
    onLongPress: openBreadcrumbs,
    onClick: onBack,
  });

  const handleContextMenu = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    openBreadcrumbs();
  };

  return (
    <div className={clsx({ "page-heading": true, [className ?? ""]: !!className })}>
      {onBack && (
        <>
          <button
            ref={backBtnRef}
            className="page-heading__back-btn"
            aria-label="Go back"
            aria-haspopup={hasBreadcrumbs ? "menu" : undefined}
            aria-expanded={hasBreadcrumbs ? breadcrumbOpen : undefined}
            type="button"
            onContextMenu={hasBreadcrumbs ? handleContextMenu : undefined}
            {...longPressHandlers}
          >
            <CSvgIcon component={ChevronLeftLarge} size={22} color="secondary" />
          </button>

          {hasBreadcrumbs && (
            <CPopper
              anchorEl={backBtnRef.current}
              open={breadcrumbOpen}
              onClose={() => setBreadcrumbOpen(false)}
              placement="bottom-start"
              offsetTop={2}
            >
              <div className="page-heading__breadcrumb-menu" role="menu">
                {breadcrumbs.map((crumb, index) => (
                  <button
                    key={index}
                    className="page-heading__breadcrumb-item"
                    role="menuitem"
                    type="button"
                    onClick={() => {
                      crumb.onClick();
                      setBreadcrumbOpen(false);
                    }}
                  >
                    {crumb.label}
                  </button>
                ))}
              </div>
            </CPopper>
          )}
        </>
      )}

      <span className="page-heading__title">{title}</span>

      {onHelpClick && (
        <button
          className="page-heading__help-btn"
          onClick={onHelpClick}
          aria-label="Help"
          type="button"
        >
          <CSvgIcon component={QuestionCircle} size={18} color="secondary" />
        </button>
      )}

      {showSeparator && <span className="page-heading__separator" />}
    </div>
  );
};

export default PageHeading;

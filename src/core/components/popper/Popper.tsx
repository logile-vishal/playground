import {
  ClickAwayListener,
  Popper,
  type PopperPlacementType,
  type SxProps,
  type Theme,
} from "@mui/material";

import "./Popper.scss";
import clsx from "@/utils/clsx";

type PopperProps = {
  anchorEl: HTMLElement | null;
  open: boolean;
  onClose: (e: MouseEvent | TouchEvent) => void;
  children: React.ReactNode;
  onClick?: (e: React.MouseEvent<HTMLElement>) => void;
  placement?: PopperPlacementType;
  className?: string;
  sx?: SxProps<Theme>;
};

const CPopper = ({
  anchorEl,
  open,
  onClose,
  children,
  onClick,
  placement,
  className,
  sx,
}: PopperProps) => {
  const handleOnClick = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    onClick?.(e);
  };

  return (
    <ClickAwayListener onClickAway={onClose}>
      <Popper
        sx={{
          ...sx,
        }}
        className={clsx({ popper: true, [className]: Boolean(className) })}
        anchorEl={anchorEl}
        open={open}
        onClick={handleOnClick}
        placement={placement ?? "right-start"}
      >
        {children}
      </Popper>
    </ClickAwayListener>
  );
};

export default CPopper;

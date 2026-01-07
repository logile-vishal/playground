import clsx from "@/utils/clsx";
import type { ORIENTATION } from "@/core/constants/divider";

import "./Divider.scss";

export type DividerProps = {
  orientation: typeof ORIENTATION.HORIZONTAL | typeof ORIENTATION.VERTICAL;
};

const CDivider: React.FC<DividerProps> = ({ orientation }) => {
  return (
    <span
      className={clsx({
        divider: true,
        [`divider--${orientation}`]: !!orientation,
      })}
    />
  );
};

export default CDivider;

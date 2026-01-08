import type { SvgIconComponent } from "@/core/components/icon/Icon";

import { NO_DATA_PAGE_VARIANTS } from "../constants/no-page-found";

export type NoDataProps = {
  imageSrcName?: SvgIconComponent;
  title?: string;
  description?: string;
  imageWidth?: number;
  children?: React.ReactNode;
  className?: string;
  variant?: keyof typeof NO_DATA_PAGE_VARIANTS;
};

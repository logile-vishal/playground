import React from "react";
import Box from "@mui/material/Box";

import CSvgIcon from "@/core/components/icon/Icon";
import { EmptyState } from "@/core/constants/icons";
import type { NoDataProps } from "@/core/types/no-data.type";
import { useCommonTranslation } from "@/core/translation/useCommonTranslation";
import { NO_DATA_PAGE_VARIANTS } from "@/core/constants/no-page-found";
import clsx from "@/utils/clsx";

import "./NoData.scss";

const CNoData: React.FC<NoDataProps> = ({
  imageSrcName = EmptyState,
  title,
  description,
  imageWidth = 60,
  children,
  className,
  variant,
}) => {
  const { NO_DATA } = useCommonTranslation();

  /**
   * @method renderPageVariant
   * @description Renders the page variant with icon, title, description and children
   * @return {React.ReactNode} Page variant JSX element
   */
  const renderPageVariant = () => {
    return (
      <Box
        className={clsx({
          "no-data__list-container": true,
          [className]: !!className,
        })}
      >
        <CSvgIcon
          component={imageSrcName}
          size={imageWidth}
        />
        {title && title !== "" && (
          <Box className="no-data__list-container-heading">
            {title || NO_DATA.TITLE}
          </Box>
        )}
        {description && (
          <Box className="no-data__list-container-body">{description}</Box>
        )}
        {children}
      </Box>
    );
  };

  /**
   * @method renderBoxVariant
   * @description Renders the box variant with title only
   * @return {React.ReactNode} Box variant JSX element
   */
  const renderBoxVariant = () => {
    return (
      <Box
        className={clsx({
          "no-data__box-container": true,
          [className]: !!className,
        })}
      >
        {title || NO_DATA.TITLE}
      </Box>
    );
  };

  /**
   * @method renderVariant
   * @description Renders the appropriate variant based on the variant prop
   * @return {React.ReactNode} Rendered variant JSX element
   */
  const renderVariant = () => {
    switch (variant) {
      case NO_DATA_PAGE_VARIANTS.page:
        return renderPageVariant();
      case NO_DATA_PAGE_VARIANTS.box:
        return renderBoxVariant();
      default:
        return renderPageVariant();
    }
  };

  return renderVariant();
};

export default CNoData;

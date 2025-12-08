import React from "react";
import Box from "@mui/material/Box";

import CSvgIcon, { type SvgIconComponent } from "@/core/components/icon/Icon";
import { EmptyState } from "@/core/constants/icons";

import "./NoData.scss";

type NoDataProps = {
  imageSrcName: SvgIconComponent;
  title?: string;
  description?: string;
  imageWidth?: number;
};

const CNoData: React.FC<NoDataProps> = ({
  imageSrcName = EmptyState,
  title = "Nothing here yet",
  description,
  imageWidth = 60,
}) => {
  return (
    <Box className="empty-list-container">
      <CSvgIcon
        component={imageSrcName}
        size={imageWidth}
      />
      {title && <Box className="mt-16 mb-8 heading-text">{title}</Box>}
      {description && <Box className="body-text">{description}</Box>}
    </Box>
  );
};

export default CNoData;

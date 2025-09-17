import React from "react";
import Box from "@mui/material/Box";
import SvgIcon from "@/core/components/Icon";
import "./EmptyList.scss";
import type { IconName } from "@/core/types/icon.type";

interface EmptyStateProps {
  imageSrcName: string; 
  title?: string; 
  description?: string;
  imageWidth?: number | string; 
}

const EmptyState: React.FC<EmptyStateProps> = ({
  imageSrcName= "emptyState",
  title = "Nothing here yet",
  description,
  imageWidth = 60,
}) => {
  return (
    <Box className="empty-list-container">
      <SvgIcon component={imageSrcName as IconName} size={imageWidth} />
      {title && (
        <Box className="mt-16 mb-8 heading-text">
          {title}
        </Box>
      )}
      {description && (
        <Box className="body-text">
          {description}
        </Box>
      )}
    </Box>
  );
};

export default EmptyState;

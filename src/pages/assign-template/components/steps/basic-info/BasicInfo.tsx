import React from "react";
import { useLocation } from "react-router-dom";
import { Box } from "@mui/material";

import type { TemplateType } from "@/pages/template-library/types/template-library.type";

import "./BasicInfo.scss";

const BasicInfo: React.FC = () => {
  const location = useLocation();
  const templateData = (location.state as { templateData?: TemplateType })
    ?.templateData;

  return (
    <Box className="at-basic-info">
      <h4>Template Details</h4>
      <Box className="at-basic-info__detail-row">
        Template Name: {templateData.templateName}
      </Box>
      <Box className="at-basic-info__detail-row">
        Type: {templateData.tagType}
      </Box>
      <Box className="at-basic-info__detail-row">
        Status: {templateData.status}
      </Box>
      <Box className="at-basic-info__detail-row">
        Created:{templateData.createdTime}
      </Box>
      <Box className="at-basic-info__detail-row">
        Last Modified: {templateData.lastModifiedTime}
      </Box>
    </Box>
  );
};

export default BasicInfo;

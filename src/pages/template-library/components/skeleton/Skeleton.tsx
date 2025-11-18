import { Box, Skeleton } from "@mui/material";

import "./Skelton.scss";

const renderTemplateIconSkelton = () => {
  return (
    <Box className="template-library-skelton-icon-container">
      <Skeleton variant="circular" classes={{ root: "template-library-skelton-icon" }} />
    </Box>
  );
};

const renderTemplateNameSkeltonDesktop = () => {
  return (
    <Box className="template-library-name-desktop">
      <Skeleton variant="rectangular" classes={{ root: "template-library-skelton-line-lg" }} />
    </Box>
  );
};

const renderTemplateNameSkelton = () => {
  return (
    <Box className="template-library-name">
      <Skeleton variant="rectangular" classes={{ root: "template-library-skelton-line-lg" }} />

      <Box className="template-library-name-tags">
        <Skeleton variant="rectangular" classes={{ root: "template-library-skelton-line-sm" }} />
        <Skeleton  variant="rectangular" classes={{ root: "template-library-skelton-line-sm" }} />
      </Box>
    </Box>
  );
};

const renderTemplateRowSkelton = () => {
  return (
    <Box className="template-library-row">
      <Skeleton variant="rectangular" classes={{ root: "template-library-skelton-row" }}/>
    </Box>
  );
};

const renderTemplateCreatedSkelton = () => {
  return (
    <Box className="template-library-created">
      <Skeleton variant="rectangular" classes={{ root: "template-library-skelton-created-text" }}/>
      <Skeleton variant="circular" classes={{ root: "template-library-skelton-created-icon" }}/>
    </Box>
  );
};

const renderTemplateActionSkelton = () => {
  return (
    <Box className="template-library-actions">
      {Array.from({ length: 4 }).map(() => (
        <Skeleton variant="circular" classes={{ root: "template-library-skelton-action" }} />
      ))}
    </Box>
  );
};

const renderDirectorySkelton = () => {
  return (
    <Box className="template-library-directory">
      {Array.from({ length: 3 }).map(() => (
        <Skeleton variant="rectangular" classes={{ root: "template-library-directory-item" }}/>
      ))}
    </Box>
  );
};

export const renderTemplatePreviewSkelton = () => {
  return (
    <Box className="template-library-preview">
      {Array.from({ length: 8 }).map(() => (
        <Skeleton variant="rectangular" classes={{ root: "template-library-preview-line" }}/>
      ))}
    </Box>
  );
};

export const templateSkelton = {
  renderTemplateIconSkelton,
  renderTemplateNameSkeltonDesktop,
  renderTemplateNameSkelton,
  renderTemplateRowSkelton,
  renderTemplateCreatedSkelton,
  renderTemplateActionSkelton,
  renderDirectorySkelton,
};

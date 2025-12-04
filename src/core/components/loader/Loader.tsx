import React from "react";
import { CircularProgress, Box } from "@mui/material";

import "./Loader.scss";

interface LoaderProps {
  text?: string;
}

const CLoader: React.FC<LoaderProps> = ({ text = "Loading..." }) => {
  return (
    <Box className="loader__wrapper">
      <CircularProgress className="loader__spinner" size="6rem" />
      <Box className="loader__text">{text}</Box>
    </Box>
  );
};

export default CLoader;

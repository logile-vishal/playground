import React, { type ReactNode, type CSSProperties } from "react";

import { IsDesktopViewport } from "@/utils/get-viewport-size";
import clsx from "@/utils/clsx";

import './PageTemplate.scss';

type CommonContentActionBarProps = {
  children: ReactNode;
  style?: CSSProperties;
}

type SectionProps = {
  children: ReactNode;
  style?: CSSProperties;
  className?: string;
}

const Header: React.FC<SectionProps> = ({ children, style }) => {
  return (
    <div
    className="pagetemplate__header"
      style={{
     
        ...style
      }}
    >
      {children}
    </div>
  );
};

const Content: React.FC<SectionProps> = ({ children, className, ...props }) => {
  return (
    <div
    className={`pagetemplate__content ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

const CommonContentActionBar: React.FC<CommonContentActionBarProps> & {
  Header: typeof Header;
  Content: typeof Content;
} = ({ children, style }) => {

  return (
    <div
    className={clsx({'pagetemplate__root':true, "layout-tablet": !IsDesktopViewport()})}
      style={{...style}}
    >
      {children}
    </div>
  );
};

CommonContentActionBar.Header = Header;
CommonContentActionBar.Content = Content;

export default CommonContentActionBar;
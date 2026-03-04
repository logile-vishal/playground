import React, { type ReactNode, type CSSProperties } from "react";

import { useIsDesktopViewport } from "@/utils/get-viewport-size";
import clsx from "@/utils/clsx";

import "./PageTemplate.scss";

type ContentActionBarProps = {
  children: ReactNode;
  style?: CSSProperties;
};

type SectionProps = {
  children: ReactNode;
  style?: CSSProperties;
  className?: string;
};

const Header: React.FC<SectionProps> = ({ children, style }) => {
  return (
    <div
      className="pagetemplate__header"
      style={{ ...style }}
    >
      {children}
    </div>
  );
};

const Content: React.FC<SectionProps> = ({ children, className, ...props }) => {
  return (
    <div
      className={`pagetemplate__content ${className ?? ""}`}
      {...props}
    >
      {children}
    </div>
  );
};

/** Wrapper for PageTabs inside the content box — applies correct padding + border-bottom */
const PageTabsSection: React.FC<SectionProps> = ({ children, className, ...props }) => {
  return (
    <div
      className={`pagetemplate__page-tabs ${className ?? ""}`}
      {...props}
    >
      {children}
    </div>
  );
};

const CContentActionBar: React.FC<ContentActionBarProps> & {
  Header: typeof Header;
  Content: typeof Content;
  PageTabs: typeof PageTabsSection;
} = ({ children, style }) => {
  const isDesktop = useIsDesktopViewport();
  return (
    <div
      className={clsx({
        pagetemplate__root: true,
        "layout-tablet": !isDesktop,
      })}
      style={{ ...style }}
    >
      {children}
    </div>
  );
};

CContentActionBar.Header = Header;
CContentActionBar.Content = Content;
CContentActionBar.PageTabs = PageTabsSection;

export default CContentActionBar;

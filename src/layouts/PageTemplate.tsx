import React, { type ReactNode, type CSSProperties } from "react";

interface CommonContentActionBarProps {
  children: ReactNode;
  style?: CSSProperties;
}

interface SectionProps {
  children: ReactNode;
  style?: CSSProperties;
}

const Header: React.FC<SectionProps> = ({ children, style }) => {
  return (
    <div
      style={{
        position: "sticky",
        top: 0,
        backgroundColor: "var(--bg-base)",
        height: "5rem",
        width: "100%",
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        padding: "0 1rem",
        ...style,
      }}
    >
      {children}
    </div>
  );
};

const Content: React.FC<SectionProps> = ({ children, style }) => {
  return (
    <div
      style={{
        backgroundColor: "var(--bg-container-1)",
        flex: 1,
        marginTop: "0.6rem",
        borderStartStartRadius:"var(--radius-m)",
        ...style,
      }}
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
      style={{
        display: "flex",
        flexDirection: "column",
        height:'calc(100vh - var(--app-bar-height) - var(--pagetemplate-bottom-margin))',
        width: "100%",
        
        ...style,
      }}
    >
      {children}
    </div>
  );
};

CommonContentActionBar.Header = Header;
CommonContentActionBar.Content = Content;

export default CommonContentActionBar;

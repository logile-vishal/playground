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
        backgroundColor: "var(--bg-secondary)",
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
        backgroundColor: "var(--bg-default)",
        flex: 1,
        marginTop: "0.6rem",
        borderStartStartRadius:"var(--border-radius-md)",
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
        height: "100%",
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

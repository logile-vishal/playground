export type PageTabItem = {
  key: string;
  label: string;
  badge?: number;
  disabled?: boolean;
};

export interface PageTabsProps {
  items: PageTabItem[];
  activeKey: string;
  onChange?: (key: string) => void;
  className?: string;
}

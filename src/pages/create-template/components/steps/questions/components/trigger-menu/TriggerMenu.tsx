import { Badge } from "@mui/material";

import CNestedMenu from "@/core/components/nested-menu/NestedMenu";
import type { NestedMenuItem } from "@/core/components/nested-menu/types";
import { TRIGGER_TYPE } from "@/pages/create-template/constants/constant";
import { OPTION_TRIGGER_MENU_KEY } from "@/pages/create-template/constants/questions";
import { useCreateTemplateTranslations } from "@/pages/create-template/translation/useCreateTemplateTranslations";

import "./TriggerMenu.scss";

type TriggerMenuProps = {
  anchorEl: HTMLElement | null;
  notificationCount: number;
  followUpCount: number;
  openUnSavedChangesModal?: (type: string) => void;
  shouldProceedAllowed?: boolean;
  closeTriggerCardMenu: () => void;
  setTriggerCardModal: (modalState: {
    status: boolean;
    data: unknown;
    type: unknown;
  }) => void;
};

/**
 * @method TriggerMenu
 * @description Displays nested menu for managing notifications and follow-up task triggers
 * @params {TriggerMenuProps} props - Component props
 * @params {HTMLElement|null} props.anchorEl - Anchor element for menu positioning
 * @params {number} props.notificationCount - Count of attached notifications
 * @params {number} props.followUpCount - Count of attached follow-up tasks
 * @params {Function} props.closeTriggerCardMenu - Callback to close menu
 * @params {Function} props.setTriggerCardModal - Callback to open trigger modal
 * @returns {JSX.Element} - Nested menu component
 */
const TriggerMenu = ({
  anchorEl,
  notificationCount,
  followUpCount,
  closeTriggerCardMenu,
  setTriggerCardModal,
  shouldProceedAllowed = true,
  openUnSavedChangesModal = () => {},
}: TriggerMenuProps) => {
  const { QUESTIONS } = useCreateTemplateTranslations();

  const handleOnSelect = (item: NestedMenuItem) => {
    openUnSavedChangesModal(item?.value);
    if (shouldProceedAllowed) {
      if (item?.value === OPTION_TRIGGER_MENU_KEY.Notification) {
        setTriggerCardModal({
          status: true,
          data: null,
          type: TRIGGER_TYPE.notification,
        });
      } else if (item?.value === OPTION_TRIGGER_MENU_KEY.FollowUp) {
        setTriggerCardModal({
          status: true,
          data: null,
          type: TRIGGER_TYPE.followup,
        });
      }
    }
  };
  /**
   * @method renderMenuItem
   * @description Renders a menu item with badge displaying trigger count
   * @params {NestedMenuItem} item - Menu item to render
   * @params {string} type - Trigger type (notifications or followUpTask)
   * @returns {JSX.Element} - Menu item with badge
   */
  const renderMenuItem = (item: NestedMenuItem, type: string) => {
    return (
      <div className="trigger-menu-options-menu-item">
        {item?.label}

        <Badge
          className="attachment-badge"
          badgeContent={
            type === "notifications"
              ? notificationCount || 0
              : followUpCount || 0
          }
          color="info"
          overlap="rectangular"
        ></Badge>
      </div>
    );
  };
  return (
    <CNestedMenu
      anchorEl={anchorEl}
      menuWidth={200}
      menuItems={QUESTIONS.OPTION_TRIGGER_MENU_OPTIONS as NestedMenuItem[]}
      onClose={closeTriggerCardMenu}
      showSearch={false}
      templates={{
        itemTemplate: ({ item }) => {
          if (item.value === OPTION_TRIGGER_MENU_KEY.Notification) {
            return renderMenuItem(item, "notifications");
          }
          if (item.value === OPTION_TRIGGER_MENU_KEY.FollowUp) {
            return renderMenuItem(item, "followUpTask");
          }
        },
      }}
      onSelect={handleOnSelect}
    />
  );
};

export default TriggerMenu;

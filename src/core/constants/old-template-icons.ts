import React from "react";

const ICON_PATH = "../../assets/icons/old-template-icons";

/* Icons names in alphabetical order */
const iconNames = [
  "afternoon",
  "announcement",
  "attachment",
  "camera",
  "cleaning",
  "compose-message",
  "contact-list",
  "corporate",
  "crop",
  "delete",
  "districts",
  "evening",
  "expired",
  "forward",
  "grid-view",
  "heartbeat-task",
  "list-view",
  "mail",
  "morning",
  "news",
  "out-of-compliance",
  "party-bag",
  "path-36",
  "pdf-solid",
  "pending",
  "reply",
  "report-card",
  "send",
  "shop-supply",
  "smiley",
  "store-talk",
  "store-trolly",
  "thermometer",
  "violation",
];

/* Lazy load above icons */
export const oldTemplateIcons = Object.fromEntries(
  iconNames.map((name) => [
    name,
    React.lazy(() => import(`${ICON_PATH}/${name}.svg?react`)),
  ]),
);

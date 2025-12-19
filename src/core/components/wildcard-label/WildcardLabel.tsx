import { useMemo } from "react";
import { CurlyBracket } from "@/core/constants/icons";

import CSvgIcon from "@/core/components/icon/Icon";
import clsx from "@/utils/clsx";

import "./WildcardLabel.scss";

type WildCardLabelProps = {
  label: string;
  truncate?: boolean;
};

//TODO: replace with master data for wildcards once available
const WILD_CARD_MAP = new Map([
  ["%abc%", "Question 2 Content"],
  ["%assignee_store%", "Assignee Store"],
  ["%task_name%", "Task Name"],
]);

const generateLabel = (label: WildCardLabelProps["label"]) => {
  const splitLabel = label.split(" ");
  return splitLabel.map((word, index) => {
    if (WILD_CARD_MAP.has(word)) {
      return (
        <span
          className="wildcard-label__chip"
          key={word}
        >
          <CSvgIcon
            component={CurlyBracket}
            color="secondary"
            size={16}
          />
          <p>{WILD_CARD_MAP.get(word)}</p>
        </span>
      );
    }
    return word + (index == splitLabel.length - 1 ? "" : " ");
  });
};

const WildcardLabel = ({ label, truncate = true }: WildCardLabelProps) => {
  const labelWithWildcard = useMemo(() => {
    return generateLabel(label);
  }, [label]);
  return (
    <p
      className={clsx({
        "wildcard-label": true,
        "wildcard-label--truncate": truncate,
      })}
    >
      {labelWithWildcard}
    </p>
  );
};

export default WildcardLabel;

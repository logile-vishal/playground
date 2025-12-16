import { useMemo } from "react";
import { CurlyBracket } from "@/core/constants/icons";

import "./WildcardLabel.scss";
import CSvgIcon from "@/core/components/icon/Icon";

type WildCardLabelProps = {
  label: string;
};

//TODO: replace with master data for wildcards once available
const WILD_CARD_MAP = new Map([["%abc%", "Question 2 Content"]]);

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

const WildcardLabel = ({ label }: WildCardLabelProps) => {
  const labelWithWildcard = useMemo(() => {
    return generateLabel(label);
  }, [label]);
  return <p className="wildcard-label">{labelWithWildcard}</p>;
};

export default WildcardLabel;

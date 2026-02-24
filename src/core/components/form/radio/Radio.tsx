import { Radio } from "@mui/material";

import clsx from "@/utils/clsx";
import {
  GenericRadioChecked,
  GenericRadioUnchecked,
} from "@/core/constants/icons";
import CSvgIcon from "@/core/components/icon/Icon";
import { isNonEmptyValue } from "@/utils";
import { useWalkmeId } from "@/core/hooks/useWalkmeId";
import type {
  LabelPlacement,
  RadioSize,
  RadioProp,
} from "@/core/components/form/types/radio.type";
import {
  RADIO_SIZE,
  LABEL_PLACEMENT,
} from "@/core/components/form/constants/radio";

import "./Radio.scss";

const CRadio = ({
  checked,
  value,
  error = false,
  required = false,
  size = RADIO_SIZE.LARGE as RadioSize,
  className = "",
  labelPlacement = LABEL_PLACEMENT.END as LabelPlacement,
  label,
  disabled,
  id,
  walkMeIdPrefix = [],
  onChange,
  name,
}: RadioProp) => {
  const { generateId } = useWalkmeId();
  const radioId =
    (id as string | undefined) ??
    `radio-${Math.random().toString(36).slice(2)}`;

  return (
    <div
      className={clsx({
        radio: true,
        [`radio--${size}`]: !!size,
        "radio--label-start": labelPlacement == LABEL_PLACEMENT.START,
        "radio--error": error,
        [className]: true,
      })}
    >
      <Radio
        onChange={onChange}
        name={name}
        id={radioId}
        checked={checked}
        disabled={disabled}
        required={required}
        data-walkme-id={generateId(walkMeIdPrefix)}
        value={value}
        icon={<CSvgIcon component={GenericRadioUnchecked} />}
        checkedIcon={<CSvgIcon component={GenericRadioChecked} />}
      />
      {isNonEmptyValue(label) && (
        <label
          htmlFor={radioId}
          className={clsx({
            radio__label: true,
            "radio__label--required": required,
          })}
        >
          {label}
        </label>
      )}
    </div>
  );
};

export default CRadio;

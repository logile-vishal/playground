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
  RadioCheckedStatus,
  RadioState,
  RadioProp,
} from "@/core/components/form/types/radio.type";
import {
  RADIO_CHECKED_STATUS,
  RADIO_VARIANT,
  RADIO_SIZE,
  LABEL_PLACEMENT,
} from "@/core/components/form/constants/radio";

import { radioPalette } from "./radio.palette";
import "./Radio.scss";

const getRadioStyle = (
  RadioCheckedStatus: RadioCheckedStatus,
  RadioState: RadioState
) => {
  const palette = radioPalette[RadioCheckedStatus][RadioState];

  return {
    root: {
      ...palette.normal.root,

      "&:hover": {
        ...palette.hover.root,
      },

      "&.Mui-focusVisible": {
        ...palette.focus.root,
      },

      "&.Mui-disabled": {
        ...palette.disabled.root,
      },
    },

    icon: {
      ...palette.normal.icon,

      "&:hover": {
        ...palette.hover.icon,
      },

      ".Mui-focusVisible &": {
        ...palette.focus.icon,
      },

      ".Mui-disabled &": {
        ...palette.disabled.icon,
      },
    },
  };
};

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
  const RadioCheckedStatus = (
    checked ? RADIO_CHECKED_STATUS.CHECKED : RADIO_CHECKED_STATUS.UNCHECKED
  ) as RadioCheckedStatus;
  const RadioState = (
    error ? RADIO_VARIANT.ERROR : RADIO_VARIANT.DEFAULT
  ) as RadioState;
  const radioId =
    (id as string | undefined) ??
    `radio-${Math.random().toString(36).slice(2)}`;
  const styles = getRadioStyle(RadioCheckedStatus, RadioState);

  return (
    <div
      className={clsx({
        radio: true,
        [`radio--${size}`]: !!size,
        "radio--label-start": labelPlacement == LABEL_PLACEMENT.START,
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
        sx={{
          "& .MuiSvgIcon-root": {
            ...styles.icon,
          },

          "&.MuiRadio-root": {
            ...styles.root,
          },
        }}
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

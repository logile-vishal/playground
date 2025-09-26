import useAutocomplete from "@mui/material/useAutocomplete";
import { Popper, Typography, Box } from "@mui/material";
import SvgIcon from "@/core/components/icon/Icon";
import "./AutoComplete.scss";

type StyledAutocompleteProps<T> = {
  id?: string;
  label?: string;
  options: T[];
  getOptionLabel: (option: T) => string;
  defaultValue?: T[];
  placeholder?: string;
};

export default function StyledAutocomplete<T>({
  label = "Select",
  options,
  getOptionLabel,
  defaultValue,
  placeholder = "Search…",
}: StyledAutocompleteProps<T>) {
  const {
    getRootProps,
    getInputLabelProps,
    getInputProps,
    getTagProps,
    getListboxProps,
    getOptionProps,
    groupedOptions,
    value: values,
    focused,
    setAnchorEl,
    anchorEl,
  } = useAutocomplete<T, true, false, false>({
    multiple: true,
    options,
    defaultValue,
    getOptionLabel,
  });

return (
  <div className="auto-complete-main-container" {...getRootProps()}>
    <label className="auto-complete-main-container__label" {...getInputLabelProps()}>
      {label || "Select"}
    </label>

    <div
      ref={setAnchorEl}
      className={`auto-complete-main-container__input-wrapper ${focused ? "focused" : ""}`}
    >
      {values.map((option, index) => {
        const tagProps = getTagProps({ index });
        return (
          <div key={index} className="auto-complete-main-container__tag" {...tagProps}>
            <span>{getOptionLabel(option)}</span>
            <Box onClick={tagProps.onDelete}>
              <SvgIcon component="close" size={16} fill="#000" />
            </Box>
          </div>
        );
      })}

      <input {...getInputProps()} placeholder={placeholder || "Search…"} />
    </div>

    {groupedOptions.length > 0 && (
      <Popper open placement="bottom-start" anchorEl={anchorEl} style={{ zIndex: 2000 }}>
        <ul className="auto-complete-main-container__listbox" {...getListboxProps()}>
          {groupedOptions.map((option, index) => {
            const { key, ...optionProps } = getOptionProps({ option, index });
            return (
              <li key={key} {...optionProps}>
                <Typography fontSize={14}>{getOptionLabel(option)}</Typography>
                {index === 2 && (
                  <Box className="auto-complete-main-container__icon">
                    <SvgIcon component="chevronLeft" size={16} fill="#000" />
                  </Box>
                )}
              </li>
            );
          })}
        </ul>
      </Popper>
    )}
  </div>
);
}

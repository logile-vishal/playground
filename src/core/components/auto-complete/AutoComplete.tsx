import useAutocomplete from "@mui/material/useAutocomplete";
import { styled } from "@mui/material/styles";
import { autocompleteClasses } from "@mui/material/Autocomplete";
import SvgIcon from "@/core/components/icon/Icon";
import { Box, Typography, Popper} from "@mui/material";

/* ---------- Styled Components ---------- */
const Root = styled("div")(({ theme }) => ({
  color: "rgba(0,0,0,0.85)",
  fontSize: "14px",
  ...theme.applyStyles?.("dark", {
    color: "rgba(255,255,255,0.65)",
  }),
}));

const Label = styled("label")`
  padding: 0 0 4px;
  line-height: 1.5;
  display: block;
  font-size: 13px;
  font-weight: var(--weight-400);
  color: var(--text-secondary);
`;

const InputWrapper = styled("div")(({ theme }) => ({
  width: "200px",
  height:"36px",
  border: "1px solid #d9d9d9",
  backgroundColor: "#fff",
  borderRadius: "var(--space-md)",
  padding: "1px",
  display: "flex",
  flexWrap: "nowrap",
  overflowX: "auto",
  whiteSpace: "nowrap",
  ...theme.applyStyles?.("dark", {
    borderColor: "#434343",
    backgroundColor: "#141414",
  }),
  "&:hover": {
    borderColor: "#40a9ff",
    ...theme.applyStyles?.("dark", {
      borderColor: "#177ddc",
    }),
  },
  "&.focused": {
    borderColor: "#40a9ff",
    boxShadow: "0 0 0 2px rgb(24 144 255 / 0.2)",
    ...theme.applyStyles?.("dark", {
      borderColor: "#177ddc",
    }),
  },
  "& input": {
    backgroundColor: "var(--bg-container-1)",
    color: "rgba(0,0,0,.85)",
    padding: "4px 6px",
    flexGrow: 1,
    border: 0,
    outline: 0,
    ...theme.applyStyles?.("dark", {
      color: "rgba(255,255,255,0.65)",
      backgroundColor: "var(--bg-container-1)",
    }),
  },
}));

/* ---------- Tag Item ---------- */
interface ItemProps {
  label: string;
  onDelete?: (event?: React.MouseEvent<HTMLElement>) => void;
}

function Item(props: ItemProps) {
  const { label, onDelete, ...other } = props;
  return (
    <Box display="flex" alignItems="center" gap="6px" {...other}>
        <Typography fontSize="13px" fontWeight={400}>{label}</Typography>
        <Box onClick={onDelete} height="16px">
            <SvgIcon component="close" size={16} fill="#000" />
        </Box>
    </Box>
  );
}

const StyledItem = styled(Item)<ItemProps>(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  height: "24px",
  margin: "2px",
  backgroundColor: "#E7E7E7",
  border: "1px solid #C1C1C1",
  borderRadius: "6px",
  padding: "0 4px 0 10px",
  ...theme.applyStyles?.("dark", {
    backgroundColor: "rgba(255,255,255,0.08)",
    borderColor: "#303030",
  }),
  "& span": {
    overflow: "hidden",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
  },
  "& svg": {
    fontSize: "12px",
    cursor: "pointer",
  },
}));

/* ---------- Listbox ---------- */
const Listbox = styled("ul")(({ theme }) => {
  console.log("theme",theme)
  return {
  width: "200px",
  margin: "2px 0 0",
  padding: "6px",
  position: "absolute",
  listStyle: "none",
  backgroundColor: "#fff",
  maxHeight: "250px",
  overflow: "auto",
  borderRadius: "8px",
  boxShadow: "0 2px 8px rgb(0 0 0 / 0.15)",
  zIndex: 2000,
  ...theme.applyStyles?.("dark", {
    backgroundColor: "var(--bg-container-1)",
    color: "var(--text-primary)"
  }),
  "& li": {
    padding: "8px 12px",
    display: "flex",
    "& span": {
      flexGrow: 1,
    },
    "& svg": {
      color: "transparent",
   },
  },
  "& li[aria-selected='true']": {
    backgroundColor: "#fafafa",
    fontWeight: "var(--weight-600)",
    "& svg": { color: "#1890ff" },
  },
  [`& li.${autocompleteClasses.focused}`]: {
    backgroundColor: "var(--bg-primary-x-subtle)",
    borderRadius: "6px",
    cursor: "pointer",
    "& svg": { color: "currentColor" },
  },
}
}
);

/* ---------- Props ---------- */
export type StyledAutocompleteProps<T> = {
  id?: string;
  label?: string;
  options: T[];
  getOptionLabel: (option: T) => string;
  defaultValue?: T[];
  placeholder?: string;
};

/* ---------- Component ---------- */
export default function StyledAutocomplete<T>(props: StyledAutocompleteProps<T>) {
  const {
    getRootProps,
    getInputLabelProps,
    getInputProps,
    getTagProps,
    getListboxProps,
    getOptionProps,
    groupedOptions,
    value,
    focused,
    setAnchorEl,
    anchorEl,
  } = useAutocomplete<T, true, false, false>({
    multiple: true,
    ...props,
  });

  return (
    <Root>
      <div {...getRootProps()}>
        <Label {...getInputLabelProps()}>{props.label || "Select"}</Label>
        <InputWrapper ref={setAnchorEl} className={focused ? "focused" : ""}>
          {value.map((option, index) => {
            const tagProps = getTagProps({ index });
            return (
              <StyledItem
                {...tagProps}
                label={props.getOptionLabel(option)}
              />
            );
          })}
          <input {...getInputProps()} placeholder={props.placeholder || "Search…"}  />
        </InputWrapper>
      </div>

     {groupedOptions.length > 0 && (
    <Popper open placement="bottom-start"  anchorEl={anchorEl} style={{ zIndex: 2000 }}>
      <Listbox {...getListboxProps()}>
      {groupedOptions.map((option, index) => {
        const { key, ...optionProps } = getOptionProps({ option, index });
        return (
          <li
            key={key}
            {...optionProps}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              cursor: "pointer",
            }}
          >
            <Typography fontSize={14}>{props.getOptionLabel(option)}</Typography>
            {index === 2 && <Box sx={{transform: 'rotate(180deg)'}}><SvgIcon component="chevronLeft" size={16} fill="#000" /></Box>}
          </li>
        );
      })}
      </Listbox>
    </Popper>
)}
    </Root>
  );
}
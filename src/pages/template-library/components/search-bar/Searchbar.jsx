import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";
import { styled } from "@mui/material/styles";
import CIconButton from "@mui/material/IconButton";

const SearchField = styled(TextField)(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    borderRadius: "8px",
    fontWeight: "var(--logile-weight-400)",
    "& fieldset": {
      border: "1px solid var(--logile-border-secondary)",
    },
    "&:hover fieldset": {
      border: "1px solid var(--logile-border-secondary)",
    },
    "&.Mui-focused fieldset": {
      border: "1px solid var(--logile-border-secondary)",
    },
  },
}));

const CSearchbar = (props) => {
  const { TEMPLATE_LIBRARY_HEADING } = useTemplateLibraryTranslations();
  return (
    <SearchField
      className="search-bar"
      variant="outlined"
      placeholder={TEMPLATE_LIBRARY_HEADING.searchTemplates}
      size="small"
      autoComplete="off"
      sx={{
        "& .MuiOutlinedInput-input": { height: "26px", padding: "4px 8px" },
      }}
      fullWidth
      {...props}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <CIconButton edge="end">
              <SearchIcon />
            </CIconButton>
          </InputAdornment>
        ),
      }}
    />
  );
};
export default CSearchbar;

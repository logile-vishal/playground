import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";
import { styled } from "@mui/material/styles";
import IconButton from "@mui/material/IconButton";

const SearchField = styled(TextField)(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    borderRadius: "8px",
    fontWeight: "var(--weight-400)",
    "& fieldset": {
      border: "1px solid var(--border-secondary)",
    },
    "&:hover fieldset": {
      border: "1px solid var(--border-secondary)",
    },
    "&.Mui-focused fieldset": {
      border: "1px solid var(--border-secondary)",
    },
  },
}));

const Searchbar = (props) => {
  return (
      <SearchField
                        className="search-bar"
                        variant="outlined"
                        placeholder="Search by template name"
                        size="small"
                        sx={{'& .MuiOutlinedInput-input': { height: '26px', padding:'4px 8px' }}}
                        fullWidth
                        {...props}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton edge="end">
                                        <SearchIcon />
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />
  )
}
export default Searchbar;
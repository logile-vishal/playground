import { styled, alpha } from '@mui/material/styles';

import InputBase from '@mui/material/InputBase';

const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor:theme.palette.background.default,
    '&:hover': {
        backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
        marginLeft: theme.spacing(1),
        width: 'auto',
    },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: 'inherit',
    width: '100%',
    '& .MuiInputBase-input': {
        padding: theme.spacing(1, 1, 1, 0),
        fontSize:theme.typography.fontSize,
        // vertical padding + font size from searchIcon
        paddingLeft: `calc(1em + ${theme.spacing(4)})`,
        transition: theme.transitions.create('width'),
        [theme.breakpoints.up('sm')]: {
            width: '12ch',
            '&:focus': {
                width: '20ch',
            },
        },
    },
}));
interface props {
    placeholder: string,
    iconPosition:"start"|"end",
    onSearch: (value:string)=> void
}
const Searchbar = (props: props) => {
    const {placeholder} = props
    const handleOnKeyPress = ()=>{
        
    }
    return <Search>
        <SearchIconWrapper>
        </SearchIconWrapper>
        <StyledInputBase
            onKeyDown={handleOnKeyPress}
            placeholder={placeholder}
            inputProps={{ 'aria-label': 'search' }}
        />
    </Search>
}
export default Searchbar
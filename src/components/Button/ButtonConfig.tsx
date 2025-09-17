export const buttonConfig = () => ({
  primary: {
    fontSize: "15px",
    fontWeight: "400",
    color: "white",
    width: "150px",
    backgroundColor: "#0A68DB",
    borderRadius: "8px",
    padding: "4px 12px",
    border: "1px solid lightgray",
  },
  iconOutlined: {
    border: '1px solid #E7E7E7',
    backgroundColor: '#F6F6F6',
    padding: '10px',
    borderRadius: '100%',
    minHeight: '18px',
    minWidth: '18px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    '&:hover': {
      backgroundColor: '#E7E7E7',
      border: '1px solid #CFCFCF',
    },
    '& .MuiButton-startIcon': {
        margin: 0,
    }
  }
});
import Box from "@mui/material/Box";
import { useNavigate } from "react-router-dom";


export const ComponentLibraryLandingPage: React.FC = () => {
    const navigate = useNavigate();
    return (
        <div style={{ display: "flex", gap: "1rem", padding: "1rem 0" }}>
            <Box
                sx={{
                    width: 100,
                    height: 100,
                    borderRadius: 1,
                    border: "1px solid #ccc",
                    cursor: "pointer",
                    backgroundColor: "#0a68db",
                    color: "#fff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    p: 1,
                    flexWrap: "wrap",
                }}
                onClick={() => {
                    navigate("/dev/component-library/icons");
                }}
            >
                Icon
            </Box>
            <Box
                sx={{
                    width: 100,
                    height: 100,
                    borderRadius: 1,
                    border: "1px solid #ccc",
                    cursor: "pointer",
                    backgroundColor: "#0a68db",
                    color: "#fff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    p: 1,
                    flexWrap: "wrap",
                }}
            >
                Color Palette
            </Box>
        </div>
    );
};
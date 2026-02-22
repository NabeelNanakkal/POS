import React from "react";
import { TextField, InputAdornment } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

const ModernInput = ({
    placeholder,
    value,
    onChange,
    icon = <SearchIcon />,
    ...props
}) => {
    return (
        <TextField
            variant="outlined"
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            fullWidth
            InputProps={{
                startAdornment: icon ? (
                    <InputAdornment position="start">{icon}</InputAdornment>
                ) : null,
                sx: {
                    border: "none",
                    backgroundColor: "rgba(255, 255, 255, 0.7)",
                    backdropFilter: "blur(6px)",
                    borderRadius: "12px",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                    "&:hover": {
                        backgroundColor: "rgba(255, 255, 255, 0.8)",
                    },
                    "& .MuiOutlinedInput-notchedOutline": {
                        border: "none",
                    },
                    "& input": {
                        padding: "10px 14px",
                    },
                },
            }}
            {...props}
        />
    );
};

export default ModernInput;

import React from "react";
import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { useTheme } from "@emotion/react";

const ModernSelect = ({ label, value, onChange, options }) => {
    const theme = useTheme();

    return (
        <FormControl fullWidth>
            <InputLabel>{label}</InputLabel>
            <Select
                value={value}
                onChange={onChange}
                sx={{
                    border: "none",
                    backgroundColor: theme.palette.grey[50],
                    backdropFilter: "blur(6px)",
                    borderRadius: "12px",
                    //   boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                    "& .MuiOutlinedInput-notchedOutline": {
                        border: "none",
                    },
                    "&:hover": {
                        backgroundColor: "rgba(255, 255, 255, 0.8)",
                    },
                    "& .MuiSelect-select": {
                        padding: "10px 14px",
                    },
                }}
            >
                {options.map((opt, i) => (
                    <MenuItem key={i} value={opt.value}>
                        {opt.label}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
};

export default ModernSelect;

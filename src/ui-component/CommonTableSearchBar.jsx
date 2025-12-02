import React from "react";
import {
    Box,
    TextField,
    FormControl,
    Select,
    MenuItem,
    Divider,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useTheme } from "@emotion/react";
import useConfig from "hooks/useConfig";

const CommonTableSearchBar = ({
    columns = [],
    searchField,
    onSearchFieldChange,
    searchTerm,
    onSearchChange,
    placeholder = "Search...",
}) => {

    const theme = useTheme();
    const { state: { borderRadius } } = useConfig();


    return (
        <Box
            sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                backgroundColor: theme.palette.grey[75],
                "&:hover": {
                    boxShadow: `inset 10px 2px 6px ${theme.palette.grey[100]},inset 10px 2px 6px ${theme.palette.grey[100]}`,
                },
                borderRadius: borderRadius - 2.5,
                paddingX: 1,
                paddingY: 0.5,
                width: "100%",
                maxWidth: 450,
            }}
        >
            {/* Search Icon */}
            <SearchIcon sx={{ color: 'secondary.main', fontSize: 22 }} />
            <Divider
                orientation="vertical"
                flexItem
                sx={{
                    borderColor: theme.palette.grey[300],
                    my: 0.5,
                }}
            />
            {/* Dropdown */}
            <FormControl
                variant="standard"
                sx={{
                    minWidth: 110,
                    maxWidth: 150,
                    "& .MuiInputBase-root:before, & .MuiInputBase-root:after": {
                        display: "none",
                    },
                }}
            >
                <Select
                    value={searchField || ""}
                    onChange={(e) => onSearchFieldChange(e.target.value)}
                    displayEmpty
                    sx={{
                        background: "transparent",
                        border: "none",
                        fontSize: 14,
                        color: "text.primary",
                        "& .MuiSelect-select": { padding: "6px 8px" },
                        "& fieldset": { border: "none" },
                    }}
                >
                    {/* <MenuItem value="">All</MenuItem> */}
                    {columns
                        ?.filter((col) => col.isSearchParam)
                        .map((col, i) => (
                            <MenuItem key={i} value={col}>
                                {col.label}
                            </MenuItem>
                        ))}
                </Select>
            </FormControl>

            {/* Text Input */}
            <TextField
                variant="standard"
                placeholder={
                    placeholder ||
                    (searchField?.label ? `Search ${searchField.label}` : "Search")
                }
                value={searchTerm}
                onChange={(e) => onSearchChange(e)}
                fullWidth
                InputProps={{
                    disableUnderline: true,
                    sx: {
                        border: "none",
                        background: "transparent",
                        fontSize: 14,
                        color: "text.primary",
                        "& input": { padding: "6px 8px" },
                    },
                }}
            />
        </Box>
    );
};

export default CommonTableSearchBar;

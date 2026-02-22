import { useState } from "react";
import { Grid, Typography, Popover, List, ListItem, Box } from "@mui/material";
import { IconInfoCircle } from "@tabler/icons-react";
import PropTypes from "prop-types";

const InfoMessage = ({ message, instructions = [], size = 18, textColor = "#bfbfbf" }) => {
    const [anchorEl, setAnchorEl] = useState(null);

    const handlePopoverOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handlePopoverClose = () => {
        setAnchorEl(null);
    };

    return (
        <>
            <Grid
                item
                xs={12}
                m={0}
                p={0}
                width={18}
                spacing={0}
                display="flex"
                alignItems="center"
                onMouseEnter={handlePopoverOpen}
                onMouseLeave={handlePopoverClose}
            >
                <IconInfoCircle
                    size={size}
                    stroke={2}
                    color={textColor}
                    style={{ cursor: "pointer" }}
                />
            </Grid>

            <Popover
                id="info-message-popover"
                open={Boolean(anchorEl)}
                anchorEl={anchorEl}
                onClose={handlePopoverClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }}
                sx={{
                    zIndex: 9999,
                    pointerEvents: "none",
                }}
                disableRestoreFocus
                PaperProps={{
                    sx: {
                        borderRadius: 1,
                        background: "rgba(255, 255, 255, 0.15)", // Semi-transparent background
                        backdropFilter: "blur(5px)", // Blur effect
                        boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)", // Soft shadow
                        padding: 0,
                    }
                }}
            >

                <Grid item xs={12} mb={1} spacing={0} sx={{ padding: 2 }}>
                    <Box display={'flex'} gap={1} flexDirection={"row"}>
                        <IconInfoCircle
                            size={16}
                            stroke={2}
                            color={textColor}
                            style={{ cursor: "pointer" }}
                        />
                        <Typography variant="subtitle2" color={textColor} fontStyle="italic" fontSize="0.75rem">
                            {message}
                        </Typography>
                    </Box>

                    {instructions.length > 0 && (
                        <List sx={{ paddingLeft: 2 }}>
                            {instructions.map((instruction, index) => (
                                <ListItem key={index} disablePadding>
                                    <Typography
                                        sx={{ color: `${textColor}`, fontStyle: "italic", fontSize: "0.7rem", ml: 1 }}
                                    >
                                        - {instruction}
                                    </Typography>
                                </ListItem>
                            ))}
                        </List>
                    )}
                </Grid>
            </Popover>
        </>
    );
};

InfoMessage.propTypes = {
    message: PropTypes.string.isRequired,
    instructions: PropTypes.arrayOf(PropTypes.string),
    size: PropTypes.any,
    textColor: PropTypes.string,
};

export default InfoMessage;

import { DialogContent, Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, DialogActions, Button, Grid, Divider, Chip } from '@mui/material'
import Lottie from 'lottie-react'
import React from 'react'
import successAnimationData from 'assets/animations/successLottie2.json';
import { useSelector } from 'react-redux';

const AllocationSuccess = ({ data, handleClose, allocationByIDSuccessData, queryAllocationSuccessData }) => {

    const allocatedTo = useSelector((state) => state.commonMenu?.allocatedTo);

    return (
        <Box>
            <DialogContent
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    flexDirection: "column",
                    gap: 0,
                    paddingY: 2,
                }}
            >
                <Lottie
                    animationData={successAnimationData}
                    loop={false}
                    style={{
                        width: "120px",
                        filter: "grayscale(10%)",
                        opacity: 0.8
                    }}
                />
                {/* <Typography
                    sx={{
                        paddingBottom: 2,
                        // borderBottom: "1px dashed rgb(230, 230, 230)",
                        fontSize: "1.1rem",
                        color: "gray",
                        fontWeight: 500,
                        textAlign: "center",
                    }}
                >
                     Allocation Successfull
                </Typography> */}
                <Typography
                    sx={{
                        paddingBottom: 2,
                        borderBottom: "1px dashed rgb(230, 230, 230)",
                        fontSize: "1.1rem",
                        color: "gray",
                        fontWeight: 500,
                        textAlign: "center",
                    }}
                >
                    {allocationByIDSuccessData && `  Successfully Allocated  ${allocationByIDSuccessData?.updatedCount} parties `}
                    {queryAllocationSuccessData && `  Successfully Allocated  ${queryAllocationSuccessData?.allocatedCount} parties  `}

                </Typography>

            </DialogContent>
            <Grid container pb={1} pt={0} px={2} spacing={2} justifyContent="center" alignItems="center" wrap="wrap">
                {Object.entries(allocatedTo).map(([key, value]) => (
                    <Grid item key={key}>
                        <Typography
                            variant="body1"
                            sx={{ fontSize: "14px", fontWeight: "500", display: "inline-block", marginRight: "8px" }}
                        >
                            {`${key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())}`}:
                        </Typography>
                        <Chip size="small" label={value} />
                    </Grid>
                ))}
            </Grid>

            <TableContainer
                sx={{
                    maxHeight: "250px",
                    overflow: "hidden",
                    marginY: "8px",
                    position: "relative",
                    "&::after": {
                        content: '""',
                        position: "absolute",
                        bottom: 0,
                        left: 0,
                        right: 0,
                        height: "60px", 
                        background: "linear-gradient(to bottom, rgba(255, 255, 255, 0.41) 0%, rgba(255, 255, 255, 0.99) 100%)", // Gradient for slight blur effect
                        // backdropFilter: "blur(1px)", // Adds a blur effect to the overlay
                        pointerEvents: "none", 
                    },

                }}
                component={Paper}
            >
                <Table sx={{display:"none"}} aria-label="dynamic table">
                    <TableHead>
                        <TableRow sx={{ position: 'sticky', top: 0, backgroundColor: '#f5f5f5', zIndex: 1, fontSize: "10px" }}>
                            <TableCell align={'center'}>
                                {"   No   "}
                            </TableCell>
                            <TableCell align={'center'}>
                                <Typography variant="subtitle2" fontSize={"13px"} color="initial">Party</Typography>
                            </TableCell>
                            <TableCell align={'center'}>
                                <Typography variant="subtitle2" fontSize={"13px"} color="initial">Loan ID</Typography>
                            </TableCell>
                            <TableCell align={'left'}>
                                <Typography variant="subtitle2" fontSize={"13px"} color="initial">Result</Typography>
                            </TableCell>

                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data?.updatedDocs?.length > 0 &&
                            data?.updatedDocs?.map((row, rowIndex) => (
                                <TableRow key={rowIndex}>
                                    <TableCell sx={{ fontSize: "10px" }} align={'center'}>
                                        <Typography variant="subtitle2" color="initial">{rowIndex + 1}</Typography>
                                    </TableCell>
                                    <TableCell sx={{ fontSize: "10px" }} align={'center'}>
                                        <Typography variant="subtitle2" color="initial">{row?._source.partyId}</Typography>
                                    </TableCell>
                                    <TableCell sx={{ fontSize: "10px" }} align={'center'}>
                                        <Typography variant="subtitle2" color="initial">{row?._source.partyLoanId}</Typography>
                                    </TableCell>
                                    <TableCell sx={{ fontSize: "10px" }} align={'left'}>
                                        <Typography variant="subtitle2" color="initial">Updated</Typography>
                                    </TableCell>


                                </TableRow>
                            ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <Grid container spacing={0}>
                <Grid item xs={12}><Divider></Divider></Grid>
            </Grid>
            <DialogActions sx={{ paddingX: 2, paddingTop: 1, paddingBottom: 4 }}>
                <Button fullWidth onClick={handleClose} variant="outlined" color="secondary">
                    Close
                </Button>
            </DialogActions>
        </Box>
    )
}

export default AllocationSuccess
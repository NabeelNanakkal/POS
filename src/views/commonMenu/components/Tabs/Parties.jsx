// example of custom tabs in common drawer-----------------

import React, { useEffect, useState } from 'react';
import { Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip, Accordion, AccordionSummary, AccordionDetails, Divider, TextField, Tooltip, FormControlLabel, Checkbox } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useDispatch, useSelector } from 'react-redux';
// import { getTelleCallsbyID } from 'container/allocationMenuContainer/slice';
import { formatDateTime } from 'utils/formatDateTime';
import NoDataLottie from 'ui-component/NoDataLottie';
import LoadingLottie from 'ui-component/LoadingLottie';
import { getContactsByID, getPartiesbyID } from 'container/commonMenuContainer/slice';
import { formatAmountWithComma } from 'utils/formatAmount';
import { getFieldSize } from 'utils/getFieldSize';
import { veriticalScrollbarStyle } from 'utils/veriticalScrollbarStyle';
import Status from 'ui-component/Status';


const Parties = ({ selectedRow }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    if (selectedRow?.name) {
      dispatch(getPartiesbyID(
        { partyLoanId: selectedRow?.name }
      ));

    }
  }, [selectedRow?.name]);



  const data = useSelector((state) => state.commonMenu?.relatedPartiesData);
  const isLoading = useSelector((state) => state.commonMenu?.loading);
  const NumDatas = useSelector((state) => state.commonMenu?.partyContactData);


  const [expanded, setExpanded] = useState(null);
  const [currentData, setCurrentData] = useState(null);

  const fieldMapping = [
    // { label: "Party Name", fieldName: "partyName", type: "text", size: "sm", isSearchParam: true, isFilterable: true },
    // { label: "Party ID", fieldName: "partyId", type: "text", size: "sm", isFilterable: true, isSortable: true },
    // { label: "Party Type", fieldName: "partyType", type: "dropdown", size: "sm", isFilterable: true },
    // { label: "Agreement No", fieldName: "agreementNo", type: "text", size: "sm", isFilterable: true },
    // { label: "Loan ID", fieldName: "partyLoanId", type: "text", size: "sm", isFilterable: true },
    // { label: "Account Type", fieldName: "accountType", type: "dropdown", size: "sm", isFilterable: true, },
    // { label: "POS Amount", fieldName: "posAmt", type: "cash", size: "sm", isFilterable: true },
    // { label: "TOS Amount", fieldName: "tosAmt", type: "cash", size: "sm", isFilterable: true },
    // { label: "Agreement Status", fieldName: "agreementStatus", type: "dropdown", size: "sm", isFilterable: true, },
    { label: "Pool", fieldName: "pool", type: "dropdown", size: "sm", isFilterable: true, },
    { label: "Product Flag", fieldName: "productFlag", type: "dropdown", size: "sm", isFilterable: true, },
    { label: "Payment Capacity", fieldName: "paymentCapacity", type: "text", size: "sm", isFilterable: true },

    { label: "AD Verified", fieldName: "adVerified", type: "boolean", size: "xs", isFilterable: true },
    { label: "Has PTP", fieldName: "hasPtp", type: "boolean", size: "xs", isFilterable: true },
    { label: "Has Contacted", fieldName: "hasContacted", type: "boolean", size: "xs", isFilterable: true },
    { label: "Has Legal", fieldName: "hasLegal", type: "boolean", size: "xs", isFilterable: true },
    { label: "Has Visited", fieldName: "hasVisited", type: "boolean", size: "xs", isFilterable: true },
    { label: "Is Verified", fieldName: "isVerified", type: "boolean", size: "xs", isFilterable: true },

    { label: "Address info", fieldName: "", type: "divider", size: "xxl", isFilterable: true },
    // -------------------------------------------------------
    { label: "Zone", fieldName: "zone", type: "dropdown", size: "sm", isFilterable: true, },
    { label: "FO Cluster", fieldName: "foCluster", type: "dropdown", size: "sm", isFilterable: true, },

    { label: "Party City", fieldName: "partycity", type: "dropdown", size: "sm", isFilterable: true, },
    {
      label: "State", fieldName: "partyState", type: "text", size: "sm", isFilterable: true,
    },
    { label: "District", fieldName: "partyDistrict", type: "text", size: "sm", isFilterable: true, },
    {
      label: "Postal Code", fieldName: "postalCode", type: "text", size: "sm", isFilterable: true, filterData: { operators: ["is"], isBulkAllocationFilter: true },
    },
    { label: "Primary Mobile", fieldName: "priMobile", type: "text", size: "sm", isFilterable: true },
    { label: "Alternate Phone 1", fieldName: "altPhone1", type: "text", size: "sm", isFilterable: true },
    { label: "Alternate Phone 2", fieldName: "altPhone2", type: "text", size: "sm", isFilterable: true },
    { label: "Initial Address", fieldName: "initialAddress", type: "text", size: "xxl", multiline: 2, isFilterable: true },


    { label: "Allocations", fieldName: "", type: "divider", size: "xxl", isFilterable: true },
    // -------------------------------------------------------
    // { label: "Last Tele Call Date", fieldName: "lastTeleCallDt", type: "text", size: "sm", isFilterable: true },

    { label: "Current Regional Head", fieldName: "regionalHeadName", type: "text", size: "sm", isFilterable: true },
    { label: "Current state Head", fieldName: "stateHeadName", type: "text", size: "sm", isFilterable: true },
    { label: "Current Area Manager", fieldName: "areaManagerName", type: "text", size: "sm", isFilterable: true },
    { label: "Current Field Officer", fieldName: "fieldOfficerName", type: "text", size: "sm", isFilterable: true },
    { label: "Current Teller caller", fieldName: "teleCallerName", type: "text", size: "sm", isFilterable: true },
    { label: "Current Telle caller Lead", fieldName: "tcTeamLeadName", type: "text", size: "sm", isFilterable: true },
    { label: "Current LT owner", fieldName: "ltOwnerName", type: "text", size: "sm", isFilterable: true },

    { label: "Collateral", fieldName: "", type: "divider", size: "xxl", isFilterable: true },
    // -------------------------------------------------------
    { label: "Collateral", fieldName: "collateral", type: "text", size: "sm", multiline: 2, isFilterable: true },
    { label: "Collateral Details", fieldName: "collateralDetails", type: "text", size: "lg", multiline: 2, isFilterable: true },

    { label: "Case details", fieldName: "", type: "divider", size: "xxl", isFilterable: true },
    // -------------------------------------------------------
    { label: "138 CNR No", fieldName: "138CNRNo", type: "text", size: "sm", isFilterable: true },
    { label: "138 Case No", fieldName: "138CaseNo", type: "text", size: "sm", isFilterable: true },
    { label: "138 Court Name", fieldName: "138CourtName", type: "text", size: "sm", isFilterable: true },
    { label: "138 Last Date", fieldName: "138LastDate", type: "date", size: "sm", isFilterable: true },
    { label: "138 Next Date", fieldName: "138NextDate", type: "date", size: "sm", isFilterable: true },
    { label: "138 Stage", fieldName: "138Stage", type: "text", size: "sm", isFilterable: true },
    { label: "420 CNR No", fieldName: "420CNRNo", type: "text", size: "sm", isFilterable: true },
    { label: "420 Case No", fieldName: "420CaseNo", type: "text", size: "sm", isFilterable: true },
    { label: "420 Court Name", fieldName: "420CourtName", type: "text", size: "sm", isFilterable: true },
    { label: "420 Last Date", fieldName: "420LastDate", type: "date", size: "sm", isFilterable: true },
    { label: "420 Next Date", fieldName: "420NextDate", type: "date", size: "sm", isFilterable: true },
    { label: "420 Stage", fieldName: "420Stage", type: "text", size: "sm", isFilterable: true },
    { label: "EP Court Name", fieldName: "epCourtName", type: "text", size: "sm", isFilterable: true },
    { label: "EP No", fieldName: "epNo", type: "text", size: "sm", isFilterable: true },
    { label: "EP Stage", fieldName: "epStage", type: "text", size: "sm", isFilterable: true },

  ];



  const handleAccordionChange = (index, item) => {
    if (expanded === index) {
      setExpanded(null);
      setCurrentData(null);
    } else {
      dispatch(getContactsByID(
        { partyId: item?.partyId }
      ));
      setExpanded(index);
      setCurrentData(data[index]);
    }
  };

  return (
    <div style={{
      marginTop: "8px", flexGrow: 1, paddingBottom: '6px',
      marginBottom: "10px", border: "2px dashed rgba(222, 222, 222, 0.7)", borderRadius: "10px"
    }}>
      {isLoading ? (
        <Grid container sx={{ marginTop: 0 }} spacing={0}>
          <Grid item xs={12} sx={{ display: "flex", justifyContent: "center", height: "25vh" }}>
            <LoadingLottie />
          </Grid>
        </Grid>
      ) : data?.length === 0 ? (
        <Grid container sx={{ marginTop: 0 }} spacing={0}>
          <Grid item xs={12} sx={{ display: "flex", justifyContent: "center", height: "25vh" }}>
            <NoDataLottie />
          </Grid>
        </Grid>
      ) : (
        <TableContainer
          component={Paper}
          sx={{
            maxHeight: "69vh",
            paddingX: 0.6,
            '&::-webkit-scrollbar': {
              width: '6px',
            },
            '&::-webkit-scrollbar-track': {
              borderRadius: '10px',
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: '#cfcccc',
              borderRadius: '10px',
            },
          }}
        >
          <Table stickyHeader aria-label="legal tool table">
            <TableHead>
              <TableRow sx={{ height: "50px" }}>
                <TableCell sx={{ width: '8%', padding: "8px", color: "rgba(0, 0, 0, 0.4)", paddingLeft: "16px" }}>Index</TableCell>
                <TableCell sx={{ width: '17%', padding: "8px", color: "rgba(0, 0, 0, 0.4)" }}>Party Name</TableCell>
                <TableCell sx={{ width: '17%', padding: "8px", color: "rgba(0, 0, 0, 0.4)" }}>Party ID</TableCell>
                <TableCell sx={{ width: '13%', padding: "8px", color: "rgba(0, 0, 0, 0.4)" }}>Party Type</TableCell>
                <TableCell sx={{ width: '15%', padding: "8px", color: "rgba(0, 0, 0, 0.4)" }}>POS</TableCell>
                <TableCell sx={{ width: '15%', padding: "8px", color: "rgba(0, 0, 0, 0.4)" }}>TOS</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {data?.map((call, index) => (

                <TableRow sx={{ padding: 1 }} key={index}>
                  <TableCell sx={{ padding: "0px" }} colSpan={6}>
                    <Accordion
                      expanded={expanded === index}
                      onChange={() => handleAccordionChange(index, call)}
                      sx={{ marginTop: "5px", borderRadius: "10px", backgroundColor: "rgba(222, 222, 222, 0.26)" }}
                    >
                      <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls={`panel${index}-content`}
                        id={`panel${index}-header`}
                      >
                        <Grid container spacing={1} alignItems="center">
                          <Grid item xs={1}>
                            <Tooltip title={index + 1}>
                              <Chip label={index + 1} color="primary" size="small" sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} />
                            </Tooltip>
                          </Grid>
                          <Grid item xs={2.5}>
                            <Tooltip title={call.partyName || "--"}>
                              <Chip label={call.partyName || "--"} color="default" size="small" sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} />
                            </Tooltip>
                          </Grid>
                          <Grid item xs={2.5}>
                            <Tooltip title={call.partyId || "--"}>
                              <Chip label={call.partyId || "--"} color="default" size="small" sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} />
                            </Tooltip>
                          </Grid>
                          <Grid item xs={2}>
                            <Tooltip title={call.partyType || "--"}>
                              <Chip label={call.partyType || "--"} color="default" size="small" sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} />
                            </Tooltip>
                          </Grid>
                          <Grid item xs={2}>
                            <Tooltip title={formatAmountWithComma(call.posAmt) || "--"}>
                              <Chip label={formatAmountWithComma(call.posAmt) || "--"} color="default" size="small" sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} />
                            </Tooltip>
                          </Grid>
                          <Grid item xs={2}>
                            <Tooltip title={formatAmountWithComma(call.tosAmt) || "--"}>
                              <Chip label={formatAmountWithComma(call.tosAmt) || "--"} color="default" size="small" sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} />
                            </Tooltip>
                          </Grid>
                        </Grid>
                      </AccordionSummary>
                      <AccordionDetails>
                        {expanded === index && currentData && (
                          <Grid container spacing={2}>
                            {fieldMapping?.map((item, index) => {
                              return (
                                <Grid item xs={getFieldSize(item.size)} key={index}>
                                  {item.type === 'boolean' ? (
                                    <FormControlLabel
                                      control={
                                        <Checkbox
                                          sx={{ paddingLeft: "12px" }}
                                          checked={call[item.fieldName] === 'TRUE' || call[item.fieldName] === true || call[item.fieldName] === 1 || call[item.fieldName] === "Yes"}
                                          readOnly
                                        />
                                      }
                                      label={item.label}
                                    />
                                  ) : item.type === "divider" ? (
                                    <Divider sx={{ marginX: '16px', marginTop: "5px" }} textAlign="left">{item?.label}</Divider>
                                  ) : (
                                    <TextField
                                      label={item.label}
                                      variant="outlined"
                                      value={
                                        item.type === 'cash'
                                          ? formatAmountWithComma(call[item.fieldName])
                                          : item.type === 'date' ? formatDateTime(call[item.fieldName]) : call[item.fieldName] || ''
                                      }
                                      fullWidth
                                      readOnly
                                      multiline={item.multiline ? true : false}
                                      rows={item.multiline ? item.multiline : 1}
                                      InputLabelProps={{ shrink: true }}
                                    />
                                  )}
                                </Grid>
                              );
                            })}
                            <Grid sx={{ paddingTop: "0px" }} item xs={12}>
                              <Divider sx={{ margin: '16px' }} textAlign="left">Contact Numbers  </Divider>
                            </Grid>
                            {isLoading ? (
                              <Grid container sx={{ marginTop: 0 }} spacing={0}>
                                <Grid item xs={12} sx={{ display: "flex", justifyContent: "center", height: "25vh" }}>
                                  <LoadingLottie />
                                </Grid>
                              </Grid>
                            ) : data?.length === 0 ? (
                              <Grid container sx={{ marginTop: 0 }} spacing={0}>
                                <Grid item xs={12} sx={{ display: "flex", justifyContent: "center", height: "25vh" }}>
                                  <NoDataLottie />
                                </Grid>
                              </Grid>
                            ) : (

                              <Grid mx={1} sx={{ paddingTop: "0px" }} item xs={12} spacing={0}>
                                <TableContainer sx={{ ...veriticalScrollbarStyle, maxHeight: "50vh" }} component={Paper}>
                                  <Table stickyHeader>
                                    <TableHead >
                                      <TableRow>
                                        <TableCell sx={{ padding: "14px 16px", backgroundColor: "#e0dede", zIndex: 1 }}>
                                          No
                                        </TableCell>
                                        <TableCell sx={{ backgroundColor: "#e0dede", zIndex: 1 }}>
                                          Number
                                        </TableCell>
                                        <TableCell sx={{ backgroundColor: "#e0dede", zIndex: 1 }}>
                                          Status
                                        </TableCell>
                                      </TableRow>
                                    </TableHead>
                                    <TableBody>
                                      {NumDatas?.length > 0 && NumDatas?.map((item, index) => (
                                        <TableRow key={`${item?.contactNumber}` + index} sx={{ height: '20px' }}>
                                          <TableCell sx={{ padding: "12px 16px" }}>
                                            <Chip size="small" label={index + 1} />
                                          </TableCell>
                                          <TableCell sx={{ padding: "12px 16px" }}>
                                            {item?.contactNumber || '--'}
                                            {item.isPrimary && (
                                              <Chip
                                                label={"Primary"}
                                                sx={{
                                                  paddingTop: "0px",
                                                  paddingBottom: "0px",
                                                  paddingRight: "0px",
                                                  paddingLeft: "0px",
                                                  fontSize: "12px",
                                                  height: "25px",
                                                  marginLeft: "8px",
                                                  size: "small",
                                                }}
                                              />
                                            )}
                                          </TableCell>
                                          <TableCell sx={{ padding: "12px 16px" }}>
                                            <Status status={item?.numberStatus || ''} />
                                          </TableCell>
                                        </TableRow>
                                      ))}
                                    </TableBody>
                                  </Table>
                                </TableContainer>
                              </Grid>
                            )
                            }

                          </Grid>
                        )}
                      </AccordionDetails>

                    </Accordion>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </div>
  );
};

export default Parties;





{/* {Object.entries(fieldMapping).map(([key, config], idx) => (
                              <Grid item xs={config.width} key={idx}>
                                <TextField
                                  label={config.label}
                                  value={currentData[key] || "N/A"}
                                  variant="outlined"
                                  fullWidth
                                  margin="normal"
                                  InputProps={{
                                    readOnly: true,
                                  }}
                                />
                              </Grid>
                            ))} */}
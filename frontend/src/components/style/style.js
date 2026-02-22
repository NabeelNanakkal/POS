const style = (theme) => ({
  //-------------------------list commonStyle-----------------------//

  //Table
  customTable: {
    '& .MuiTable-root': { borderColor: 'red' }
  },
  table1: {
    '&.MuiTable-root': {
      border: '1px solid #d8d8d8',
      // borderRadius: '0px 16px 0px 0px'
    }
  },
 Chipcolor: {
    height: '30px',
    width: 'fit-content', // dynamic width
    maxWidth:'100px',
    boxShadow: 'none',
    borderRadius: '50px',
    fontSize: '10px',
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start', // left-align content
    padding: '0 10px', // even padding
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis'
  },
  
  Chipcolor2: {
    '&.MuiButton-root ': {
      color: '#F8741A',
      backgroundColor: '#fef4ed',
      height: '30px',
      width: '110px',
      alignSelf: 'center',
      boxShadow: 'none',
      borderRadius: '50px'
    }
  },
  FiberManualRecordIconw1: {
    fontSize: '10px',
    marginRight: '5px',
    flexShrink: 0
  },
  statusBox: {
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    minWidth: 0,
    flexGrow: 1
  },
  tableHead: {
    '& .MuiTableCell-root': {
      color: '#121212',
      minwidth: '200px',
      fontSize: `${theme.palette.fontSize}`,
      fontWeight: 600,
      alignItems: 'center',
      padding: '12px 16px',
      backgroundColor: theme.palette.table?.headColor,
      borderBottom: `1px dashed ${theme.palette.borderColor?.lightBorder}`,
      background: '#0751460F'
    }
  },
  cardbg: {
    backgroundColor: `${theme.palette.cardbg?.cardbg}`
  },
  contested: {
    backgroundColor: `${theme.palette?.contested?.contested}`
  },

  overTab: {
    border: '1px solid green'
  },

  Approvebutton1: {
    '&.MuiBox-root-MuiTab-root.Mui-selected': {
      color: 'green',
      fontSize: '12px',
      backgroundColor: '#ffffff29',
      opacity: '1',
      height: '349px',
      width: 'fit-content',
      fontWeight: '600',
      borderRadius: '50px',
      display: 'flex',
      alignItems: 'center',
      marginRight: '10px',
      padding: '0px 15px 0px 15px',
      marginTop: '-8px',
      cursor: 'pointer'
    }
  },
  inactiveApprovebutton1: {
    '&.MuiBox-root': {
      color: '#000000',
      opacity: '1',
      height: '34px',
      width: 'fit-content',
      borderRadius: '50px',
      display: 'flex',
      alignItems: 'center',
      marginRight: '10px',
      padding: '0px 15px 0px 15px',
      marginTop: '-8px',
      fontWeight: '400',
      cursor: 'pointer'
    }
  },
  financeTypoHead: {
    '&.MuiTypography-root': {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      fontSize: '14px',
      borderRadius: '13px 16px 0px 0px',
      backgroundColor: '#f4f5f4',
      padding: '5px',
      borderBottom: '1px solid black'
    }
  },
  GridItem: {
    '&.MuiGrid-item': {
      paddingTop: '0px'
    }
  },
  financeTypo: {
    '&.MuiTypography-root': {
      display: 'flex',
      alignItems: 'center',
      gap: '3px',
      fontSize: '14px'
    }
  },
  financeCardItem: {
    '&.MuiTypography-root': {
      display: 'flex',
      alignItems: 'center',
      gap: '3px',
      fontSize: '14px',
      backgroundColor: '#f4f5f4'
    }
  },
  financeTypo1: {
    '&.MuiTypography-root': {
      display: 'flex',
      // alignItems: 'center',
      // margin: '3px',
      fontSize: '14px',
      justifyContent: 'flex-end'
    }
  },

  StopIcon: {
    transform: 'rotate(40deg)',
    color: '#075247',
    background: '#075247 0% 0% no-repeat padding-box',
    opacity: 1,
    height: '10px',
    width: '10px',
    margin: '2px'
  },

  contractTenureTitle: {
    '&.MuiTypography-root': {
      fontWeight: '600',
      marginTop: '4px',
      lineHeight: '22px'
    }
  },
  rfqdetailmain: {
    '&.MuiGrid-root': {
      marginTop: '0px'
    }
  },
  summerysubhd: {
    '&.MuiTypography-root': {
      fontWeight: '100',
      marginTop: '6px'
    }
  },
  summerymainsubhd: {
    '&.MuiTypography-root.MuiTypography-body1': {
      fontWeight: '500'
    }
  }
});

export default style;

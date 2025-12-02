// material-ui
import { createTheme } from '@mui/material/styles';

// assets
import defaultColor from 'assets/scss/_themes-vars.module.scss';

// ==============================|| DEFAULT THEME - PALETTE ||============================== //

export default function Palette(mode, presetColor) {
  let colors;
  switch (presetColor) {
    case 'default':
    default:
      colors = defaultColor;
  }

  return createTheme({
    palette: {
      mode,
      common: {
        black: colors.darkPaper
      },
      primary: {
        light: colors.primaryLight,
        main: "#0284c7",
        dark: colors.primaryDark,
        200: colors.primary200,
        800: colors.primary800
      },
      secondary: {
        light: colors.secondaryLight,
        main: colors.secondaryMain,
        dark: colors.secondaryDark,
        200: colors.secondary200,
        800: colors.secondary800
      },
      error: {
        light: colors.errorLight,
        main: colors.errorMain,
        dark: colors.errorDark
      },
      orange: {
        light: colors.orangeLight,
        main: colors.orangeMain,
        dark: colors.orangeDark
      },
      warning: {
        light: colors.warningLight,
        main: colors.warningMain,
        dark: colors.warningDark,
        contrastText: colors.grey700
      },
      success: {
        light: colors.successLight,
        200: colors.success200,
        400:colors.success400,
        main: colors.successMain,
        dark: colors.successDark
      },
      grey: {
        50: colors.grey50,
        75: colors.grey75,
        100: colors.grey100,
        500: colors.grey500,
        600: colors.grey600,
        700: colors.grey700,
        900: colors.grey900
      },
      dark: {
        light: colors.darkTextPrimary,
        main: colors.darkLevel1,
        dark: colors.darkLevel2,
        800: colors.darkBackground,
        900: colors.darkPaper
      },
      text: {
        primary: colors.grey700,
        secondary: colors.grey500,
        dark: colors.grey900,
        hint: colors.grey100,
        paper: colors.paper
      },
      divider: colors.grey200,
      // dividerTheme:
      background: {
        paper: colors.paper,
        default: colors.paper,
        theme: colors.theme,
        lightTheme:colors.lightTheme,
        darkTheme:colors.darkTheme,
        greyTheme:colors.greyTheme,
        paperGrey: colors.paperGrey,
        tableHead: colors.tableHead
      },

      // -------status colors

      statusTxt: {
        create: colors?.statusTextCreate,
        complete: colors?.statusTextComplete,
        ReOpen: colors?.statusTextReOpen,

        inprogress: colors?.statusTextInprogress,
        completed: colors?.statusTextCompleted,
        completedOne: colors?.statusTextCompletedOne,
        pending: colors?.statsTextPending,
        reject: colors?.statusTextReject,
        rejectOne: colors?.statusTextRejectOne,
        default: colors?.statusCreate,
        submitted: colors?.statusTextSubmitted,
        submittedOne: colors?.statusTextSubmittedOne,
        new: colors?.statusTextNew,
        newone: colors?.statusTextNewone,
        optioncreation: colors?.statusTextOptioncreation,
        optioncreationOne: colors?.statusTextOptioncreationOne,
        expired: colors?.statusTextExpired,
        approved: colors?.statusTextApproved,
        approvedone: colors?.statusTextApprovedone,

        active: colors?.statusTextActive,
        open: colors?.statusTextOpen,
        closed: colors?.statusTextClosed,
        statusTextClosed1: colors?.statusTextClosed1,
        send: colors?.statusTextSend,
        verified: colors?.statusTextVerified,
        VendorSelection: colors?.statsTextVendorSelection,
        VendorSelectionOne: colors?.statsTextVendorSelectionOne,

        QuoteCreation: colors?.statusTextCreation,
        QuoteCreationOne: colors?.statusTextCreationOne,
        RFPcreation: colors?.statsTextRFPcreation,
        RFPcreationOne: colors?.statsTextRFPcreationOne,
        YetToBeAuthorize: colors?.statusTextYetToBeAuthorize,
        Authorized: colors?.statsTextAuthorized,
        AuthorizedOne: colors?.statsTextAuthorizedOne,
        Hold: colors?.statsTextHold,
        Verification: colors?.statsTextVerification,
        VerificationOne: colors?.statsTextVerificationOne,
        Booking: colors?.statsTextBooking,
        BookingOne: colors?.statsTextBookingOne,

        Execution: colors?.statsTextExecution,
        ExecutionOne: colors?.statsTextExecutionOne,
        DeliveryPending: colors?.statsTextDeliveryPending,
        Arrived: colors?.statusTextArrived,
        ArrivedOne: colors?.statusTextArrivedOne,
        Invoicing: colors?.statsTextInvoicing,
        Blocked: colors?.statusTextBlocked,
        fontBlue: colors.darkBlue1,
        bgOrange: colors.lightOrange,
        overDue: colors.statusTextDue,
        Paid: colors?.statusTextPaid,
        Cancelled: colors?.statusTextCancelled,
        CancelledOne: colors?.statusTextCancelledOne,
        Draft: colors?.statusTextDraft,
        UnPaid: colors?.statusTextUnPaid
      },

      TablesStatus: {
        create: colors?.TableStatusCreate,
        inprogress: colors?.TableStatusInprogress,
        complete: colors?.TableStatusComplete,
        reOpen: colors?.TableStatusReOpen,

        completed: colors?.TableStatusCompleted,
        completedOne: colors?.TableStatusCompletedOne,
        pending: colors?.TableStatsPending,
        gatein: colors?.TableStatsGateIn,
        reject: colors?.TableStatusReject,
        rejectOne: colors?.TableStatusRejectOne,
        default: colors?.statusCreate,
        submitted: colors?.TableStatusSubmitted,
        submittedOne: colors?.TableStatusSubmittedOne,
        new: colors?.TableStatusNew,
        newone: colors?.TableStatusNewone,
        optioncreation: colors?.TableStatusOptioncreation,
        optioncreationOne: colors?.TableStatusOptioncreationOne,
        expired: colors?.TableStatusExpired,
        approved: colors?.TableStatusApproved,
        approvedone: colors?.TableStatusApprovedNewone,
        active: colors?.TableStatusActive,
        open: colors?.TableStatusOpen,
        closed: colors?.TableStatusClosed,
        send: colors?.TableStatusSend,
        verified: colors?.TableStatusVerified,
        created: colors.TableStatusCreated,
        VendorSelection: colors?.TableStatusVendorSelection,
        VendorSelectionOne: colors?.TableStatusVendorSelectionOne,

        QuoteCreation: colors?.TableStatusQuoteCreation,
        QuoteCreationOne: colors?.TableStatusQuoteCreationOne,
        RFPcreation: colors?.TableStatusRFPcreation,
        RFPcreationOne: colors?.TableStatusRFPcreationOne,
        YetToBeAuthorize: colors?.TableStatusYetToBeAuthorize,
        Authorized: colors?.TableStatusAuthorized,
        AuthorizedOne: colors?.TableStatusAuthorizedOne,
        Hold: colors?.TableStatusHold,
        Verification: colors?.TableStatusVerification,
        VerificationOne: colors?.TableStatusVerificationOne,
        Booking: colors?.TableStatusBooking,
        BookingOne: colors?.TableStatusBookingOne,

        Execution: colors?.TableStatusExecution,
        ExecutionOne: colors?.TableStatusExecutionOne,
        DeliveryPending: colors?.TableStatusDeliveryPending,
        Arrived: colors?.TableStatusArrived,
        ArrivedOne: colors?.TableStatusArrivedOne,
        Invoicing: colors?.TableStatusInvoicing,
        Blocked: colors?.TableStatusBlocked,
        Due: colors?.TableStatusDue,
        Paid: colors?.TableStatusPaid,
        Cancelled: colors?.TableStatusCancelled,
        CancelledOne: colors?.TableStatusCancelledOne,
        Draft: colors?.TableStatusDraft,
        UnPaid: colors?.TableStatusUnPaid,
        rejectedBg: colors.rejectedBg
      }
    }
  });
}

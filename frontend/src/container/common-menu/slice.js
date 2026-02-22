import { createSlice } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';

const commonMenuSlice = createSlice({
  name: 'commonMenu',
  initialState: {
    menuData: [],
    menuDataCount: 0,
    totalMenuData: [],
    totalMenuDataCount: 0,
    searchAfter: null,
    loading: false,
    fileUploading: false,
    fileUploadSuccess: null,
    fileUploadError: false,
    gettingCountloading: false,
    allocationByIDsSuccess: false,
    secondaryCreateFoScheduleSuccess: false,
    userStatusUpdateSuccess: false,
    bulkAllocationSuccess: false,
    createActivitySuccess: false,
    updateDocbyIdSuccess: false,
    closedData: null,
    numStatusUpdated: false,
    allocatedData: null,
    allocationByIDSuccessData: null,
    queryAllocationSuccessData: null,
    allocatedTo: null,
    error: null,
    uploadedFileData: [],
    getFilesData: [],
    partyTelleCallsData: [],
    partyTelleCallsCount: 0,
    partyFoActivyData: [],
    todaySchedule: [],
    partyFoActivyCount: 0,

    allocationfilterCount: 0,
    isAllocationfilterEmpty: false,

    FoSCheduleHistory: [],
    FoSCheduleHistoryCount: 0,
    FoSCheduleSearchAfter: null,
    dataById: null,
    uploadedFile: null,
    BreadcrumbsData: {}
  },
  reducers: {
    // common menu get---------
    getCommonMenuData: (state) => {
      state.loading = true;
      state.error = null;
    },
    getCommonMenuDataSuccess: (state, action) => {
      const isPagination = !!(
        action.payload?.metaPayLoad?.params?.fethcedDataCount > 0 || action.payload?.metaPayLoad?.params?.searchAfter?.length > 0
      );
      state.loading = false;
      // state.menuData = [...state.menuData, ...action.payload.data];
      if (isPagination) {
        state.menuData = [...state.menuData, ...action.payload.data];
      } else {
        state.menuData = action.payload.data;
      }
      state.menuDataCount = action.payload?.pagination?.totalCount;
      state.searchAfter = action.payload.nextSearchAfter || action.payload.searchAfter;
    },
    getCommonMenuDataFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.menuData = [];
      state.menuDataCount = 0;
      toast.error('menu data fetching failed', {
          autoClose: 2000
      });
    },
    getTotalData: (state) => {
      state.loading = true;
      state.error = null;
    },
    getTotalDataSuccess: (state, action) => {
      state.loading = false;
      state.totalMenuData = action.payload.data;
      state.totalMenuDataCount = action.payload.total;
      state.searchAfter = action.payload.nextSearchAfter;
    },
    getTotalDataFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.totalMenuData = [];
      state.totalMenuDataCount = 0;
      toast.error('Fetching data failed', {
        autoClose: 2000
      });
    },
    getRedirectedMenuData: (state) => {
      state.loading = true;
      state.error = null;
    },
    getRedirectedMenuDataSuccess: (state, action) => {
      state.loading = false;
      state.menuData = [...state.menuData, ...action.payload.data];
      state.menuDataCount = action.payload.total;
      state.searchAfter = action.payload.nextSearchAfter;
    },
    getRedirectedMenuDataFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.menuData = [];
      state.menuDataCount = 0;
      toast.error('menu data fetching failed', {
        autoClose: 2000
      });
    },

    getDataByID: (state) => {
      state.loading = true;
      state.error = null;
      state.updateDocbyIdSuccess = false;
      // state.allocationByIDsSuccess=false
      // state.secondaryCreateFoScheduleSuccess=false
    },
    getDataByIDSuccess: (state, action) => {
      state.loading = false;
      state.dataById = action.payload.data;
    },
    getDataByIDFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      toast.error('getting Data By Id is failed', {
        autoClose: 2000
      });
    },
    getRedirectDataByID: (state) => {
      state.loading = true;
      state.error = null;
      // state.allocationByIDsSuccess=false
      // state.secondaryCreateFoScheduleSuccess=false
    },
    getRedirectDataByIDSuccess: (state, action) => {
      state.loading = false;
      state.menuData = [action.payload.data];
      state.menuDataCount = [action.payload.data].length;
    },
    getRedirectDataByIDFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      toast.error('getting Data By Id is failed', {
        autoClose: 2000
      });
    },
    getDataByFilter: (state) => {
      state.loading = true;
      state.error = null;
    },
    getDataByFilterSuccess: (state, action) => {
      state.loading = false;
      state.dataByFilter = action.payload.data;
      state.dataByFilterCount = action.payload.total;
    },
    getDataByFilterFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      toast.error('getting Data By Filter is failed', {
        autoClose: 2000
      });
    },

    updateCommonMenuData: (state) => {
      state.loading = true;
      state.error = null;
    },
    updateCommonMenuDataSuccess: (state, action) => {
      state.loading = false;
      toast.success('Data updated successfully');
    },
    updateCommonMenuDataFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      toast.error('Data Updation failed', {
        autoClose: 2000
      });
    },

    addCommonMenuDataFn: (state) => {
      state.loading = true;
      state.error = null;
    },
    addCommonMenuDataFnSuccess: (state, action) => {
      state.loading = false;
      toast.success('Data added successfully');
    },
    addCommonMenuDataFnFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      toast.error('Data add failed', {
        autoClose: 2000
      });
    },

    // custom slices for tabs data-----------
    // ==================================================================

    getPartiesbyID: (state) => {
      state.loading = true;
      state.error = null;
    },
    getPartiesbyIDSuccess: (state, action) => {
      state.loading = false;
      state.relatedPartiesData = action.payload.data;
      state.relatedPartiesDataCount = action.payload.count;
    },
    getPartiesbyIDFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.menuData = [];
      state.menuDataCount = 0;
      toast.error('Tab data fetching failed', {
        autoClose: 2000
      });
    },

    getContactsByID: (state) => {
      state.loading = true;
      state.error = null;
    },
    getContactsByIDSuccess: (state, action) => {
      state.loading = false;
      state.partyContactData = action.payload.data;
      state.partyContactDataCount = action.payload.count;
    },
    getContactsByIDFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.partySettlementData = [];
      state.partySettlementCount = 0;
      toast.error('Tab data fetching failed', {
        autoClose: 2000
      });
    },










    updateDocbyId: (state) => {
      state.loading = true;
      state.error = null;
    },
    updateDocbyIdSuccess: (state, action) => {
      state.loading = false;
      state.closedData = action.payload.data;
      state.updateDocbyIdSuccess = true;
    },
    updateDocbyIdFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      toast.error(' Doc updation failed', {
        autoClose: 2000
      });
    },
    uploadFile: (state) => {
      state.fileUploading = true;
      state.error = null;
      state.fileUploadSuccess = null;
      state.fileUploadError = null;
    },
    uploadFileSuccess: (state, action) => {
      state.fileUploading = false;
      // state.uploadedFile = action.payload.data
      state.uploadedFile = action.payload.data;
      toast.success('File Uploaded successfully');
    },
    uploadFileFail: (state, action) => {
      state.fileUploading = false;
      state.error = action.payload;
      state.fileUploadError = action.payload;
      toast.error(' File upload failed', {
        autoClose: 2000
      });
    },
    getFile: (state) => {
      state.fileUploading = true;
      state.error = null;
      state.getFilesData = null;
      state.fileUploadError = null;
    },
    getFileSuccess: (state, action) => {
      state.fileUploading = false;
      // state.uploadedFile = action.payload.data
      state.getFilesData = action.payload.data;
      // toast.success('File Uploaded successfully');
    },
    getFileFail: (state, action) => {
      state.fileUploading = false;
      state.error = action.payload;
      state.fileUploadError = action.payload;
      // toast.error(' File upload failed', {
      //   autoClose: 2000
      // });
    },
    deleteFile: (state) => {
      state.fileUploading = true;
      state.error = null;
      state.getFilesData = null;
      state.fileUploadError = null;
    },
    deleteFileSuccess: (state, action) => {
      state.fileUploading = false;
      // state.uploadedFile = action.payload.data
      state.getFilesData = action.payload.data;
      toast.success('File Deleted successfully');
    },
    deleteFileFail: (state, action) => {
      state.fileUploading = false;
      state.error = action.payload;
      state.fileUploadError = action.payload;
      // toast.error(' File upload failed', {
      //   autoClose: 2000
      // });
    },

    updateUserStatus: (state) => {
      state.loading = true;
      state.error = null;
      state.userStatusUpdateSuccess = false;
    },
    updateUserStatusSuccess: (state) => {
      state.loading = false;
      (state.userStatusUpdateSuccess = true),
        toast.success('User Status updated', {
          autoClose: 2000
        });
    },
    updateUserStatusFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      (state.userStatusUpdateSuccess = false),
        toast.error(' Doc updation failed', {
          autoClose: 2000
        });
    },
    
    clearCommonMenuData: (state) => {
      state.menuData = [];
      state.menuDataCount = 0;
      state.searchAfter = null;
    },

    clearAllocationFilterCount: (state) => {
      state.allocationfilterCount = 0;
      state.isAllocationfilterEmpty = false;
    },

    clearSuccessess: (state) => {
      state.allocationByIDsSuccess = false;
      state.secondaryCreateFoScheduleSuccess = false;
      state.userStatusUpdateSuccess = false;
      state.bulkAllocationSuccess = false;
      state.createActivitySuccess = false;
      state.createActivitySuccess = false;
      state.fileUploadSuccess = null;
      state.updateDocbyIdSuccess = false;
    },

    clearDrawerData: (state) => {
      state.partyTelleCallsData = [];
      state.partyTelleCallsCount = 0;
      state.partyFoActivyData = [];
      state.partyFoActivyCount = 0;
      state.partyLegalToolData = [];
      state.partyLegalToolCount = 0;
      state.partyCasesData = [];
      state.partyCasesCount = 0;
      state.partyNOCDetailsData = [];
      state.partyNOCDetailsCount = 0;
      state.partyConciliationData = [];
      state.partyConciliationCount = 0;
      state.partySettlementData = [];
      state.partySettlementCount = 0;
      state.partyCollectionData = [];
      state.partyCollectionCount = 0;
      state.partyPaymentEntryData = [];
      state.partyPaymentEntryCount = 0;
      state.allocationByIDsSuccess = false;
      state.bulkAllocationSuccess = false;
      state.allocatedTo = null;
      state.createActivitySuccess = false;
      state.userStatusUpdateSuccess = false;
      state.allocatedData = null;
      state.dataByFilter = [];
      state.dataByFilterCount = 0;
      state.dataById = null;
    },
    SetBreadcrumbsData: (state, action) => {
      state.BreadcrumbsData = action.payload.data;
    }
  }
});

export const {



  getCommonMenuData,
  getCommonMenuDataSuccess,
  getCommonMenuDataFail,

  addCommonMenuDataFn,
  addCommonMenuDataFnSuccess,
  addCommonMenuDataFnFail,

  updateCommonMenuData,
  updateCommonMenuDataSuccess,
  updateCommonMenuDataFail,

  getTotalData,
  getTotalDataSuccess,
  getTotalDataFail,

  getRedirectedMenuData,
  getRedirectedMenuDataSuccess,
  getRedirectedMenuDataFail,

  getDataByID,
  getDataByIDSuccess,
  getDataByIDFail,
  getRedirectDataByID,
  getRedirectDataByIDSuccess,
  getRedirectDataByIDFail,

  getDataByFilter,
  getDataByFilterSuccess,
  getDataByFilterFail,

  getPartiesbyID,
  getPartiesbyIDSuccess,
  getPartiesbyIDFail,

  getContactsByID,
  getContactsByIDSuccess,
  getContactsByIDFail,

  updateDocbyId,
  updateDocbyIdSuccess,
  updateDocbyIdFail,

  uploadFile,
  uploadFileSuccess,
  uploadFileFail,

  getFile,
  getFileFail,
  getFileSuccess,

  deleteFile,
  deleteFileFail,
  deleteFileSuccess,

  updateUserStatus,
  updateUserStatusSuccess,
  updateUserStatusFail,



  clearCommonMenuData,
  clearAllocationFilterCount,
  clearAllocationMenuSearchAfter,
  clearDrawerData,
  clearSuccessess,



  SetBreadcrumbsData
} = commonMenuSlice.actions;

export default commonMenuSlice.reducer;

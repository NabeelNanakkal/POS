import { createScheduleAllowedRoles } from 'constants/allowedRoles';

const devices = {
  title: 'Devices',
  apiEndPoint: '/devices',
  // apiType: "foallocation",
  permittedRoles: ['all'],
  routerConfigs: {
    path: 'devices',
    title: 'Devices'
    // icon: IconScale
  },
  tableStructure: {
    isPage: true,
    columns: [
      { label: 'Case No', fieldName: 'arbitrationId', type: 'text', size: 'sm' },
      { label: 'Agreement No', fieldName: 'agreementNumber', type: 'text', size: 'sm', isSearchParam: true, isSortable: true },
      { label: ' Claimant', fieldName: 'claimant', type: 'text', size: 'sm' },
      { label: 'Arbitrator', fieldName: 'arbitrator', type: 'text' },
      { label: 'Award Date', fieldName: 'awardDate', type: 'objectDate', size: 'sm' },
      { label: 'Lot', fieldName: 'lot', type: 'text', size: 'sm' },
      { label: 'Stage', fieldName: 'stage', type: 'status', size: 'sm' }
    ],
  },
  drawerConfigs: {
    isUpdatable: false,
    titleField: 'arbitrationId',
    id: 'objectId',
    haveTabs: true,
    tabs: [
      {
        label: 'Case Details',
        items: [
          { label: 'Agreement No', fieldName: 'agreementNumber', type: 'text', size: 'sm', isNotEditable: true },
          { label: 'Claimant', fieldName: 'claimant', type: 'text', size: 'sm' },
          { label: 'Arbitrator', fieldName: 'arbitrator', type: 'text', size: 'sm' },
          { label: 'Posting Date', fieldName: 'postingDate', type: 'objectDate', size: 'sm', isNotEditable: true },
          { label: 'Claim Registration', fieldName: 'claimRegistration', type: 'objectDate', size: 'sm' },
          { label: 'Claim Registration Along With Soc', fieldName: 'claimRegistrationAlongWithSoc', type: 'objectDate', size: 'sm' },
          { label: 'Allocation To Arbitrator', fieldName: 'allocationToArbitrator', type: 'objectDate', size: 'sm' },
          { label: 'Acceptance By Arbitrator', fieldName: 'acceptanceAndDisclosureByArbitrator', type: 'objectDate', size: 'sm' },
          { label: 'Statement Of Claim', fieldName: 'statementOfClaim', type: 'objectDate', size: 'sm' },
          { label: 'Upcoming Hearing Date', fieldName: 'upcomingHearingDate', type: 'objectDate', size: 'sm' },
          { label: 'Hearing Time', fieldName: 'upcomingHearingTime', type: 'time', size: 'sm' },
          { label: 'Video Conference Link', fieldName: 'videoConferenceLink', type: 'url', size: 'sm' },
          { label: 'Respondent Reply', fieldName: 'respondentToFileReply', type: 'objectDate', size: 'sm' },
          { label: 'Award Date', fieldName: 'awardDate', type: 'objectDate', size: 'sm' },
          { label: 'Award Dispatch Date', fieldName: 'awardDispatchDate', type: 'objectDate', size: 'sm' },
          { label: 'Product Type', fieldName: 'ProductType', type: 'dropdown', size: 'sm' },
          { label: 'product', fieldName: 'product', type: 'text', size: 'sm' },
          { label: 'Stage', fieldName: 'stage', type: 'dropdown', size: 'sm', isFilterable: true }
        ]
      },
      {
        label: 'Create Schedule',
        permittedRoles: createScheduleAllowedRoles
      }
    ]
  }
};

export default devices;

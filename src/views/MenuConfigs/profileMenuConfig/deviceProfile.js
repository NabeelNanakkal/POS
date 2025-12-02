
const deviceProfile = {
  title: 'Device Profile',
  apiEndPoint: '/hearings',
  apiType: 'foallocation',
  defaultSort: { sortField: "updatedOn", sortOrder: "desc" },
  permittedRoles: ['all'],
  baseFilter: { type: 'Device Profile' },
  routerConfigs: {
    path: 'deviceProfile',
    title: 'Device Profile'
    // icon: IconScale
  },
  tableStructure: {
    columns: [
      { label: 'Hearing Id', fieldName: 'hearingId', type: 'text', size: 'sm', isSearchParam: true, isSortable: true },
      { label: ' Hearing Mode', fieldName: 'hearingMode', type: 'text', size: 'sm' },
      { label: 'Schedule Date', fieldName: 'hearingSchedule', type: 'date' },
      { label: 'Hearing Type', fieldName: 'hearingType', type: 'text', size: 'sm' },
      // { label: 'Date & Time', fieldName: 'partyCount', type: 'dropdown', size: 'sm' },
      { label: 'Status', fieldName: 'status', type: 'status', size: 'sm', }
    ]
  },
  drawerConfigs: {
    isUpdatable: false,
    titleField: 'hearingId',
    statusField: 'status',
    hearingTitle: { label: "ID", fieldName: "hearingType" },
    // subtTitle: { label: "ID", fieldName: "id" },
    haveTabs: true,
    tabs: [
      {
        label: 'Hearing-Details',
        items: [
          { label: 'Type', fieldName: 'type', type: 'text', size: 'sm' },
          { label: 'Hearing Type', fieldName: 'hearingType', type: 'text', size: 'sm' },
          { label: 'Schedule Date', fieldName: 'hearingSchedule', type: 'objectDate', size: 'sm' },
          { label: 'Hearing Mode', fieldName: 'hearingMode', type: 'text', size: 'sm', isSearchParam: true },
          { label: 'Meeting Link', fieldName: 'meetingLink', type: 'url', size: 'sm' },
          { label: 'Venue', fieldName: 'venue', type: 'text', size: 'sm' },
          { label: 'Address', fieldName: 'address', type: 'text', size: 'sm' },
          { label: 'Created By', fieldName: 'createdByName', type: 'text', size: 'sm' },

          { label: 'Status', fieldName: 'status', type: 'autocomplete', size: 'sm', options: ['Draft', 'Upcoming', 'Completed', 'Cancelled'] },
          { label: 'Completed On', fieldName: 'completedOn', type: 'objectDate', size: 'sm' },
          { label: 'Created On', fieldName: 'createdOn', type: 'objectDate', size: 'sm' },
          { label: 'Transcript', fieldName: 'remarks', type: 'image', size: 'sm' }
        ]
      },
      {
        label: 'attendees',
        items: [
          { label: 'Name', fieldName: 'name', type: 'text', size: 'sm', isArray: true },
          { label: 'Designation', fieldName: 'designation', type: 'text', size: 'sm', isArray: true },
          { label: 'Contact', fieldName: 'contact', type: 'text', size: 'sm', isArray: true },
          {
            label: 'Party Type',
            fieldName: 'partyType',
            type: 'autocomplete',
            size: 'sm',
            isArray: true,
            options: [
              { label: 'Claimant', value: 'Claimant' },
              { label: 'Respondent', value: 'Respondent' },
              { label: 'Neutral', value: 'Neutral' }
            ]
          },
          // { label: 'Party ID', fieldName: 'partyId', type: 'text', size: 'sm', isArray: true }
        ]
      },
    ]
  }
};

export default deviceProfile;

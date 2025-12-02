const leads = {
  title: 'Leads',
  apiEndPoint: '/leads',
  permittedRoles: ['all'],
  routerConfigs: {
    path: 'list',
    title: 'Leads'
  },
  tableStructure: {
    isPage: true,
    columns: [
      { label: 'Lead ID', fieldName: 'id', type: 'text', size: 'sm', isSearchParam: true, isSortable: true },
      { label: 'Name', fieldName: 'name', type: 'text', size: 'sm' },
      { label: 'Owner', fieldName: 'owner', type: 'text', size: 'sm' },
      { label: 'Status', fieldName: 'status', type: 'status', size: 'sm' },
      { label: 'Source', fieldName: 'source', type: 'text', size: 'sm' },
      { label: 'Created Date', fieldName: 'createdAt', type: 'date', size: 'sm' }
    ]
  },
  drawerConfigs: {
    isUpdatable: false,
    titleField: 'name'
  }
};

export default leads;



export const mockStores = [
  { id: '1', name: 'Main Branch - Downtown', code: 'STR-001', location: 'Downtown', status: 'Active' },
  { id: '2', name: 'North Plaza Outlet', code: 'STR-002', location: 'North Mall', status: 'Active' },
  { id: '3', name: 'Westside Express', code: 'STR-003', location: 'West End', status: 'Inactive' }
];

export const mockEmployees = [
  { 
    id: 'emp-1', 
    name: 'Sarah Johnson', 
    email: 'sarah.j@retailos.com', 
    role: 'TenantAdmin', 
    storeId: '1',
    status: 'Online'
  },
  { 
    id: 'emp-2', 
    name: 'Michael Chen', 
    email: 'm.chen@retailos.com', 
    role: 'Manager', 
    storeId: '1',
    status: 'Offline'
  },
  { 
    id: 'emp-3', 
    name: 'Amara Okafor', 
    email: 'amara.o@retailos.com', 
    role: 'Cashier', 
    storeId: '2',
    status: 'Online'
  },
  { 
    id: 'emp-4', 
    name: 'David Wilson', 
    email: 'd.wilson@retailos.com', 
    role: 'Cashier', 
    storeId: '1',
    status: 'Offline'
  },
  { 
    id: 'emp-5', 
    name: 'Elena Rodriguez', 
    email: 'e.rodriguez@retailos.com', 
    role: 'Manager', 
    storeId: '3',
    status: 'Online'
  }
];

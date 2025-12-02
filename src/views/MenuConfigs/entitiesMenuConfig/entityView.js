import { IconAward } from '@tabler/icons-react';
import { createScheduleAllowedRoles } from "constants/allowedRoles";

const entityView = {
    title: "Entity View",
    apiEndPoint: "/foallocation/count/legal_toolsy",
    permittedRoles: ['all'],
    routerConfigs: {
        path: "entityView",
        title: "Entity View",
        // icon: IconAward
    },
    tableStructure: {
        columns: [
      { label: 'Case No', fieldName: 'userName', type: 'text', size: 'sm', isSearchParam: true, isSortable: true },
      { label: 'Claimant', fieldName: 'role', type: 'text', size: 'sm' },
      { label: 'Organisation', fieldName: 'reportsToName', type: 'text' },
      { label: 'Date', fieldName: 'loanAccountCount', type: 'text', size: 'sm' },
      { label: 'Amount', fieldName: 'loanAccountCount', type: 'text', size: 'sm' },
      { label: 'Status', fieldName: 'partyCount', type: 'dropdown', size: 'sm' }
        ],
    },
    drawerConfigs: {
        isUpdatable: false,
        titleField: "userName",
        // subtTitle: { label: "ID", fieldName: "id" },
        haveTabs: true,
        tabs: [
            {
                label: "User-Details",
                items: [
                    { label: "User", fieldName: "userName", type: "text", size: "sm", isSearchParam: true, },
                    { label: "User Role", fieldName: "role", type: "text", size: "sm" },
                    { label: "User ID", fieldName: "user", type: "text", size: "sm" },
                    { label: "Reports To", fieldName: "reportsToName", type: "dropdown", size: "sm", },
                    { label: "Reports To ID", fieldName: "reportsTo", type: "dropdown", size: "sm", },

                    // { label: "First Name", fieldName: "firstName", type: "text", size: "sm", isSearchParam: true,  },
                    // { label: "Last Name", fieldName: "firstName", type: "text", size: "sm", isSearchParam: true,  },
                    // { label: "Full Name", fieldName: "fullName", type: "text", size: "sm", isSearchParam: true,  },
                    // { label: "FO ID", fieldName: "id", type: "text", size: "sm",  isSortable: true },
                    // { label: "State Head", fieldName: "reportsToName", type: "dropdown", size: "sm",  },
                    // { label: "Mobile", fieldName: "mobile", type: "dropdown", size: "sm",  },
                    // { label: "E-mail", fieldName: "email", type: "dropdown", size: "sm",  },

                    // { label: "State", fieldName: "state", type: "text", size: "sm",  },
                    // { label: "District", fieldName: "district", type: "text", size: "sm",  },
                    // { label: "Joinging Date", fieldName: "dateOfJoining", type: "date", size: "sm",  },

                ]
            },
            // { label: "User-Details" },
            {
                label: "Create Schedule", permittedRoles: createScheduleAllowedRoles,
            },

        ],

    }
};

export default entityView;

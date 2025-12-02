import { createScheduleAllowedRoles } from "constants/allowedRoles";

const assets = {
    title: "Assets",
    apiEndPoint: "/foallocation/count/legal_toolsy",
    permittedRoles: ['all'],
    routerConfigs: {
        path: "assets",
        title: "Assets",
        // icon: IconFileCheck
    },
    tableStructure: {
        columns: [
            { label: 'Case No', fieldName: 'userName', type: 'text', size: 'sm', isSearchParam: true, isSortable: true },
            { label: 'Claimant', fieldName: 'role', type: 'text', size: 'sm' },
            { label: 'Arbitrator', fieldName: 'reportsToName', type: 'text' },
            { label: 'Submission Date', fieldName: 'loanAccountCount', type: 'text', size: 'sm' },
            { label: 'Assets Date', fieldName: 'loanAccountCount', type: 'text', size: 'sm' },
            { label: 'Accepted Amount', fieldName: 'partyCount', type: 'dropdown', size: 'sm' }
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

export default assets;

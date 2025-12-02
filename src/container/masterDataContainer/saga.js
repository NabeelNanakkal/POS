import config from "config";
import commonApi from "container/api";
import { toast } from "react-toastify";
import { call, takeEvery } from "redux-saga/effects";
import { getAreaManagersFail, getAreaManagersSuccess, getCommonDataFail, getCommonDataSuccess, getFOsFail, getFOsSuccess, getRegionalHeadsFail, getRegionalHeadsSuccess, getStateHeadsFail, getStateHeadsSuccess } from "./slice";




// function* getCommonDataFn(action) {
//     try {
//         const { endPoint } = action.payload;
//         let apiUrl = `${config.ip}${endPoint}`;

//         const apiParams = {
//             api: apiUrl,
//             method: "GET",
//             successAction: getCommonDataSuccess(),
//             failAction: getCommonDataFail(),
//             authourization: "token",
//         };

//         yield call(commonApi, apiParams);
//     } catch (error) {
//         console.error("Error in getCommonDataFn:", error);
//     }
// }

function* getCommonDataFn(action) {
    try {
        const { endPoint, params } = action.payload;

        const query = {
            // from: params?.from || 0,
            limit: params?.size || 100,
        };

        if (params?.searchField && params?.searchTerm) {
            query.filters = {
                ...query.filters,
                [params.searchField]: params.searchTerm,
            };
        }

        if (params?.sortField && params?.sortOrder) {
            query.sortField = params?.sortField
            query.sortOrder = params?.sortOrder
        }

        if (params?.filters && params.filters.filter(filter => filter.field && filter.operator && filter.value).length > 0) {

            const transformedFilters = params.filters.reduce((acc, filter) => {
                acc[filter.field] = filter.value;
                return acc;
            }, {});

            query.filters = {
                ...query.filters,
                ...transformedFilters,
            };
        }
        if (params?.baseFilter) {

            query.filters = {
                ...query.filters,
                ...params.baseFilter,
            };
        }

        if (query.filters) {
            query.filters = JSON.stringify(query.filters);
        }


        // Construct query string
        const queryString = new URLSearchParams(query).toString();

        // Construct API URL
        const apiUrl = `${config.ip}${endPoint}?${queryString}`;

        // API parameters
        let apiParams = {
            api: apiUrl,
            method: "GET",
            successAction: getCommonDataSuccess(),
            failAction: getCommonDataFail(),
            authourization: "token",
        };

        // Call API
        yield call(commonApi, apiParams);
    } catch (error) {
        console.error("Error in getMenuDataFn:", error);
    }
}

function* getRegionalHeadsFn() {
    try {
        const query = {
            size: 100,
            exact: true,
            filters: {
                role: "Regional Head",
            },
        };

        const queryString = new URLSearchParams({
            size: query.size, exact: true,
            filters: JSON.stringify(query.filters),
        }).toString();
        let apiUrl = `${config.ip}/index/users?${queryString}`;

        const apiParams = {
            api: apiUrl,
            method: "GET",
            successAction: getRegionalHeadsSuccess(),
            failAction: getRegionalHeadsFail(),
            authourization: "token",
        };

        yield call(commonApi, apiParams);
    } catch (error) {
        console.error("Error in getting state heads master data:", error);
    }
}

function* getStateHeadsFn(action) {
    try {

        const reportsTo = action?.payload?.reportsTo ? action.payload.reportsTo : null;

        const query = {
            size: 100,
            filters: {
                role: "State Head",
                ...(reportsTo && { reportsTo: reportsTo, })
            },
        };
        const queryString = new URLSearchParams({
            size: query.size, exact: true,
            filters: JSON.stringify(query.filters),
        }).toString();
        let apiUrl = `${config.ip}/index/users?${queryString}`;

        const apiParams = {
            api: apiUrl,
            method: "GET",
            successAction: getStateHeadsSuccess(),
            failAction: getStateHeadsFail(),
            authourization: "token",
        };

        yield call(commonApi, apiParams);
    } catch (error) {
        console.error("Error in getting state heads master data:", error);
    }
}
function* getAreaManagersFn(action) {

    const reportsTo = action.payload.reportsTo ? action.payload.reportsTo : null;

    try {
        const query = {
            size: 100,
            filters: {
                role: "Area Manager",
                ...(reportsTo && { reportsTo: reportsTo })
            },
        };

        const queryString = new URLSearchParams({
            size: query.size, exact: true,
            filters: JSON.stringify(query.filters),
        }).toString();
        let apiUrl = `${config.ip}/index/users?${queryString}`;

        const apiParams = {
            api: apiUrl,
            method: "GET",
            successAction: getAreaManagersSuccess(),
            failAction: getAreaManagersFail(),
            authourization: "token",
        };

        yield call(commonApi, apiParams);
    } catch (error) {
        console.error("Error in getting state heads master data:", error);
    }
}

function* getFOsFn(action) {

    try {
        const { reportsTo } = action.payload;

        const query = {
            size: 100,
            filters: {
                role: "Field Officer",
                reportsTo: reportsTo,
            },
        };

        const queryString = new URLSearchParams({
            size: query.size,
            exact: true,
            filters: JSON.stringify(query.filters),
        }).toString();
        let apiUrl = `${config.ip}/index/users?${queryString}`;

        const apiParams = {
            api: apiUrl,
            method: "GET",
            successAction: getFOsSuccess(),
            failAction: getFOsFail(),
            authourization: "token",
        };

        yield call(commonApi, apiParams);
    } catch (error) {
        toast.error()
        console.error("Error in getting FO master data:", error);
    }
}

function* getTcTeamLeadsFn() {
    try {
        const query = {
            size: 100,
            filters: {
                role: ["Telecall Manager", "Telecall Lead"]
            },
        };

        const queryString = new URLSearchParams({
            size: query.size, exact: true,
            filters: JSON.stringify(query.filters),
        }).toString();
        let apiUrl = `${config.ip}/index/users?${queryString}`;

        const apiParams = {
            api: apiUrl,
            method: "GET",
            successAction: getTcTeamLeadsSuccess(),
            failAction: getTcTeamLeadsFail(),
            authourization: "token",
        };

        yield call(commonApi, apiParams);
    } catch (error) {
        console.error("Error in getting tc  leads master data:", error);
    }
}
// function* getTelecallersFn(action) {

//     try {
//         const { params } = action.payload;

//         const query = {
//             size: 10,
//             exact: true,
//             filters: {
//                 role: "Tele Caller",
//                 fullName: params.searchTerm,
//             },
//         };
//         const queryString = new URLSearchParams({
//             size: query.size,
//             filters: JSON.stringify(query.filters),
//         }).toString();
//         let apiUrl = `${config.ip}/index/users?${queryString}`;

//         const apiParams = {
//             api: apiUrl,
//             method: "GET",
//             successAction: getTelecallersSuccess(),
//             failAction: getTelecallersFail(),
//             authourization: "token",
//         };

//         yield call(commonApi, apiParams);
//     } catch (error) {
//         toast.error()
//         console.error("Error in getting tellecaller master data:", error);
//     }
// }




export default function* masterDataActionWacther() {
    yield takeEvery('masterData/getCommonData', getCommonDataFn);
    yield takeEvery('masterData/getStateHeads', getStateHeadsFn);
    yield takeEvery('masterData/getRegionalHeads', getRegionalHeadsFn);
    yield takeEvery('masterData/getAreaManagers', getAreaManagersFn);
    yield takeEvery('masterData/getFOs', getFOsFn);
    yield takeEvery('masterData/getTcTeamLeads', getTcTeamLeadsFn);
    // yield takeEvery('masterData/getTelecallers', getTelecallersFn);

}
import { call, takeEvery } from "redux-saga/effects";
import config from "config";
import commonApi from "container/api";
import { getActivityCountsFail, getActivityCountsSuccess, getCardCountsFail, getCardCountsSuccess } from "./slice";
import dayjs from 'dayjs'; 


function* getCardCountsFn() {
    try {
        let params = {
            api: `${config.ip}/dashboard-count`,
            method: 'GET',
            successAction: getCardCountsSuccess(),
            failAction: getCardCountsFail(),
            authourization: "token",
        };
        yield call(commonApi, params);
    } catch (error) {
        console.log(error);
    }
}

function* getActivityCountsFn(action) {
    try {
        const date = action.payload
            ? dayjs(action.payload).format('YYYY-MM-DD')
            : new Date().toISOString().split('T')[0];
        let params = {
            api: `${config.ip}/dashboard/activitycount?date=${date}`,
            method: 'GET',
            successAction: getActivityCountsSuccess(),
            failAction: getActivityCountsFail(),
            authorization: "token",
        };
        yield call(commonApi, params);
    } catch (error) {
        console.log(error);
    }
}





export default function* dashboardActionWatcher() {
    yield takeEvery('dashboard/getCardCounts', getCardCountsFn);
    yield takeEvery('dashboard/getActivityCounts', getActivityCountsFn);

}
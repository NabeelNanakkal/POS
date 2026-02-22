import { call, takeEvery } from "redux-saga/effects";
import { createUserFail, createUserSuccess, resetPasswordFail, resetPasswordSuccess } from "./slice";
import config from "config";
import commonApi from "container/api";
import { getDataByFilterFail, getDataByFilterSuccess, uploadFileFail, uploadFileSuccess } from "container/common-menu/slice";
import { toast } from "react-toastify";


function* resetPasswordFn(action) {
    const credentials = action.payload;
    try {
        let params = {
            api: `${config.ip}/reset-password`,
            method: "POST",
            successAction: resetPasswordSuccess(),
            failAction: resetPasswordFail(),
            authourization: "token",
            body: JSON.stringify(credentials),
        };

        yield call(commonApi, params);
    } catch (error) {
        console.log(error);
    }
}
function* createUserFn(action) {
    let data = action.payload;
    try {
        const emailFilter = { email: data.email };
        const emailQuery = { filters: JSON.stringify(emailFilter), exact: true };
        const emailQueryString = new URLSearchParams(emailQuery).toString();
        const getUserByEmailUrl = `${config.ip}/index/users?${emailQueryString}`;

        const emailApiParams = {
            api: getUserByEmailUrl,
            method: "GET",
            successAction: getDataByFilterSuccess(),
            failAction: getDataByFilterFail(),
            authourization: "token",
        };

        const userWithEmail = yield call(commonApi, emailApiParams);
        if (userWithEmail.data.length > 0) {
            toast.warn("Email is already in use");
            return;
        }

        // 2️ Check Mobile
        const mobileFilter = { mobile: data.mobile };
        const mobileQuery = { filters: JSON.stringify(mobileFilter), exact: true };
        const mobileQueryString = new URLSearchParams(mobileQuery).toString();
        const getUserByMobileUrl = `${config.ip}/index/users?${mobileQueryString}`;

        const mobileApiParams = {
            api: getUserByMobileUrl,
            method: "GET",
            successAction: getDataByFilterSuccess(),
            failAction: getDataByFilterFail(),
            authourization: "token",
        };

        const userWithMobile = yield call(commonApi, mobileApiParams);
        if (userWithMobile.data.length > 0) {
            toast.warn("Mobile number is already in use");
            return;
        }
        if (data.photo) {
            const file = data.photo;
            const formData = new FormData();
            formData.append('file', file);
            const apiUrl = `${config.ip}/files/upload-file`;
            const apiParams = {
                api: apiUrl,
                method: "POST",
                successAction: uploadFileSuccess(),
                failAction: uploadFileFail(),
                authourization: "token",
                body: formData,

            };

            const uploadedFile = yield call(commonApi, apiParams);


            if (uploadedFile && uploadedFile.url) {
                data.attatchmet = uploadedFile.url
                let params = {
                    api: `${config.ip}/user`,
                    method: "POST",
                    successAction: createUserSuccess(),
                    failAction: createUserFail(),
                    authourization: "token",
                    body: JSON.stringify(data),
                };
                yield call(commonApi, params);
            } else {
                console.error("failed to upload file")
            }
        } else {
            let params = {
                api: `${config.ip}/user`,
                method: "POST",
                successAction: createUserSuccess(),
                failAction: createUserFail(),
                authourization: "token",
                body: JSON.stringify(data),
            };
            yield call(commonApi, params);
        }

    } catch (error) {
        console.log(error);
    }
}



export default function* UserActionWatcher() {
    yield takeEvery('user/resetPassword', resetPasswordFn);
    yield takeEvery('user/createUser', createUserFn);

}
import { takeEvery, call, put } from 'redux-saga/effects';
import commonApi from '../api';
import config from '../../config';
import {
  generatePresignedUrl,
  generatePresignedUrlSuccess,
  generatePresignedUrlFail
} from './slice';

function* postPresignedUrl(action) {
  try {
    const params = {
      api: `${config.ip}/uploads/presigned-url`,
      method: 'POST',
      successAction: generatePresignedUrlSuccess(),
      failAction: generatePresignedUrlFail(),
      body: JSON.stringify(action.payload),
      authourization: 'Bearer'
    };
    yield call(commonApi, params);
  } catch (error) {
    console.error('Generate pre-signed URL failed:', error);
  }
}

export default function* UploadActionWatcher() {
  yield takeEvery(generatePresignedUrl.type, postPresignedUrl);
}

import { all, call } from 'redux-saga/effects';
import LoginActionWatcher from '../container/LoginContainer/saga';
// import UserListActionWatcher from '../container/UserContainer/saga';
import commonMenuActionWacther from 'container/commonMenuContainer/saga';
import masterDataActionWacther from 'container/masterDataContainer/saga';
import dashboardActionWatcher from 'container/dashBoardContainer/saga';
import UserActionWatcher from 'container/userContainer/saga';
import AdminActionWatcher from 'container/AdminContainer/saga';


function* rootSaga() {
  yield all(
    [
      call(LoginActionWatcher),
      // call(UserListActionWatcher),
      call(dashboardActionWatcher),
      call(commonMenuActionWacther),
      call(UserActionWatcher),
      call(masterDataActionWacther),
      call(AdminActionWatcher)

    ]);
}


export default rootSaga;

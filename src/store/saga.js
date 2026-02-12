import { all, call } from 'redux-saga/effects';
import LoginActionWatcher from '../container/LoginContainer/saga';
// import UserListActionWatcher from '../container/UserContainer/saga';
import commonMenuActionWacther from 'container/commonMenuContainer/saga';
import masterDataActionWacther from 'container/masterDataContainer/saga';
import dashboardActionWatcher from 'container/dashBoardContainer/saga';
import UserActionWatcher from 'container/userContainer/saga';
import AdminActionWatcher from 'container/AdminContainer/saga';
import ProductActionWatcher from 'container/ProductContainer/saga';
import POActionWatcher from 'container/POContainer/saga';
import CategoryActionWatcher from 'container/CategoryContainer/saga';
import InventoryActionWatcher from 'container/InventoryContainer/saga';
import OrderActionWatcher from 'container/OrderContainer/saga';
import PaymentActionWatcher from 'container/PaymentContainer/saga';
import CustomerActionWatcher from 'container/CustomerContainer/saga';
import ShiftActionWatcher from 'container/ShiftContainer/saga';
import UploadActionWatcher from 'container/UploadContainer/saga';
import ReportActionWatcher from 'container/ReportContainer/saga';
import StoreActionWatcher from 'container/StoreContainer/saga';
import EmployeeActionWatcher from 'container/EmployeeContainer/saga';
import DiscountActionWatcher from 'container/DiscountContainer/saga';


function* rootSaga() {
  yield all(
    [
      call(LoginActionWatcher),
      // call(UserListActionWatcher),
      call(dashboardActionWatcher),
      call(commonMenuActionWacther),
      call(UserActionWatcher),
      call(masterDataActionWacther),
      call(AdminActionWatcher),
      call(ProductActionWatcher),
      call(POActionWatcher),
      call(CategoryActionWatcher),
      call(InventoryActionWatcher),
      call(OrderActionWatcher),
      call(PaymentActionWatcher),
      call(CustomerActionWatcher),
      call(ShiftActionWatcher),
      call(UploadActionWatcher),
      call(ReportActionWatcher),
      call(StoreActionWatcher),
      call(EmployeeActionWatcher),
      call(DiscountActionWatcher)

    ]);
}


export default rootSaga;

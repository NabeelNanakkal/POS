import { all, call } from 'redux-saga/effects';
import LoginActionWatcher from '../container/auth/saga';
// import UserListActionWatcher from '../container/UserContainer/saga';
import commonMenuActionWacther from 'container/common-menu/saga';
import masterDataActionWacther from 'container/master-data/saga';
import dashboardActionWatcher from 'container/dashboard/saga';
import UserActionWatcher from 'container/user/saga';
import AdminActionWatcher from 'container/admin/saga';
import ProductActionWatcher from 'container/product/saga';
import POActionWatcher from 'container/purchase-order/saga';
import CategoryActionWatcher from 'container/category/saga';
import InventoryActionWatcher from 'container/inventory/saga';
import OrderActionWatcher from 'container/order/saga';
import PaymentActionWatcher from 'container/payment/saga';
import CustomerActionWatcher from 'container/customer/saga';
import ShiftActionWatcher from 'container/shift/saga';
import UploadActionWatcher from 'container/upload/saga';
import ReportActionWatcher from 'container/report/saga';
import StoreActionWatcher from 'container/store/saga';
import EmployeeActionWatcher from 'container/employee/saga';
import DiscountActionWatcher from 'container/discount/saga';


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

// third-party
import { combineReducers } from 'redux';

// project import
import loginReducer from 'container/auth/slice';
import dashboard from 'container/dashboard/slice';
import commonMenu from 'container/common-menu/slice';
import user from 'container/user/slice';
import masterData from 'container/master-data/slice';
import admin from 'container/admin/slice';
import product from 'container/product/slice';
import po from 'container/purchase-order/slice';
import category from 'container/category/slice';
import inventory from 'container/inventory/slice';
import order from 'container/order/slice';
import payment from 'container/payment/slice';
import customer from 'container/customer/slice';
import shift from 'container/shift/slice';
import upload from 'container/upload/slice';
import report from 'container/report/slice';
import store from 'container/store/slice';
import employee from 'container/employee/slice';
import discount from 'container/discount/slice';

import menu from './menu';
import customizationReducer from 'store/customizationReducer';

// ==============================|| COMBINE REDUCERS ||============================== //

const reducer = combineReducers({
  menu: menu,
  customization: customizationReducer,
  login: loginReducer,
  dashboard: dashboard,
  commonMenu: commonMenu,
  user: user,
  masterData: masterData,
  admin: admin,
  product: product,
  po: po,
  category: category,
  inventory: inventory,
  order: order,
  payment: payment,
  customer: customer,
  shift: shift,
  upload: upload,
  report: report,
  store: store,
  employee: employee,
  discount: discount
});



export default reducer;


// third-party
import { combineReducers } from 'redux';

// project import
import loginReducer from 'container/LoginContainer/slice';
import dashboard from 'container/dashBoardContainer/slice';
import commonMenu from 'container/commonMenuContainer/slice';
import user from 'container/userContainer/slice';
import masterData from 'container/masterDataContainer/slice';
import admin from 'container/AdminContainer/slice';
import product from 'container/ProductContainer/slice';
import po from 'container/POContainer/slice';
import category from 'container/CategoryContainer/slice';
import inventory from 'container/InventoryContainer/slice';
import order from 'container/OrderContainer/slice';
import payment from 'container/PaymentContainer/slice';
import customer from 'container/CustomerContainer/slice';
import shift from 'container/ShiftContainer/slice';
import upload from 'container/UploadContainer/slice';
import report from 'container/ReportContainer/slice';
import store from 'container/StoreContainer/slice';
import employee from 'container/EmployeeContainer/slice';
import discount from 'container/DiscountContainer/slice';

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


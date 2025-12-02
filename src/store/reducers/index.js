// third-party
import { combineReducers } from 'redux';

// project import
import loginReducer from 'container/LoginContainer/slice';
import dashboard from 'container/dashBoardContainer/slice';
import commonMenu from 'container/commonMenuContainer/slice';
import user from 'container/userContainer/slice';
import masterData from 'container/masterDataContainer/slice';
import admin from 'container/AdminContainer/slice';

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
  admin: admin
});



export default reducer;


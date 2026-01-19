import { takeEvery, call, put } from 'redux-saga/effects';
import commonApi from '../api';
import config from '../../config';
import {
  createOrder, createOrderSuccess, createOrderFail,
  fetchOrders, fetchOrdersSuccess, fetchOrdersFail,
  addOrderItem, addOrderItemSuccess, addOrderItemFail,
  updateOrderItem, updateOrderItemSuccess, updateOrderItemFail,
  removeOrderItem, removeOrderItemSuccess, removeOrderItemFail,
  confirmOrder, confirmOrderSuccess, confirmOrderFail,
  cancelOrder, cancelOrderSuccess, cancelOrderFail,
  voidOrder, voidOrderSuccess, voidOrderFail,
  returnOrder, returnOrderSuccess, returnOrderFail
} from './slice';

function* postOrder(action) {
  try {
    const params = {
      api: `${config.ip}/orders`,
      method: 'POST',
      successAction: createOrderSuccess(),
      failAction: createOrderFail(),
      body: JSON.stringify(action.payload),
      authourization: 'Bearer'
    };
    yield call(commonApi, params);
  } catch (error) {
    console.error('Create order failed:', error);
  }
}

function* getOrders(action) {
  try {
    const { page, limit } = action.payload || { page: 1, limit: 10 };
    const params = {
      api: `${config.ip}/orders?page=${page}&limit=${limit}`,
      method: 'GET',
      successAction: fetchOrdersSuccess(),
      failAction: fetchOrdersFail(),
      authourization: 'Bearer'
    };
    yield call(commonApi, params);
  } catch (error) {
    console.error('Fetch orders failed:', error);
  }
}

function* postOrderItem(action) {
  try {
    const { orderId, ...itemData } = action.payload;
    const params = {
      api: `${config.ip}/orders/${orderId}/items`,
      method: 'POST',
      successAction: addOrderItemSuccess(),
      failAction: addOrderItemFail(),
      body: JSON.stringify(itemData),
      authourization: 'Bearer'
    };
    yield call(commonApi, params);
  } catch (error) {
    console.error('Add order item failed:', error);
  }
}

function* putOrderItem(action) {
  try {
    const { orderId, itemId, ...itemData } = action.payload;
    const params = {
      api: `${config.ip}/orders/${orderId}/items/${itemId}`,
      method: 'PUT',
      successAction: updateOrderItemSuccess(),
      failAction: updateOrderItemFail(),
      body: JSON.stringify(itemData),
      authourization: 'Bearer'
    };
    yield call(commonApi, params);
  } catch (error) {
    console.error('Update order item failed:', error);
  }
}

function* deleteOrderItem(action) {
  try {
    const { orderId, itemId } = action.payload;
    const params = {
      api: `${config.ip}/orders/${orderId}/items/${itemId}`,
      method: 'DELETE',
      successAction: removeOrderItemSuccess(),
      failAction: removeOrderItemFail(),
      authourization: 'Bearer'
    };
    yield call(commonApi, params);
  } catch (error) {
    console.error('Remove order item failed:', error);
  }
}

function* postConfirmOrder(action) {
  try {
    const { orderId } = action.payload;
    const params = {
      api: `${config.ip}/orders/${orderId}/confirm`,
      method: 'POST',
      successAction: confirmOrderSuccess(),
      failAction: confirmOrderFail(),
      authourization: 'Bearer'
    };
    yield call(commonApi, params);
  } catch (error) {
    console.error('Confirm order failed:', error);
  }
}

function* postCancelOrder(action) {
  try {
    const { orderId } = action.payload;
    const params = {
      api: `${config.ip}/orders/${orderId}/cancel`,
      method: 'POST',
      successAction: cancelOrderSuccess(),
      failAction: cancelOrderFail(),
      authourization: 'Bearer'
    };
    yield call(commonApi, params);
  } catch (error) {
    console.error('Cancel order failed:', error);
  }
}

function* postVoidOrder(action) {
  try {
    const { orderId } = action.payload;
    const params = {
      api: `${config.ip}/orders/${orderId}/void`,
      method: 'POST',
      successAction: voidOrderSuccess(),
      failAction: voidOrderFail(),
      authourization: 'Bearer'
    };
    yield call(commonApi, params);
  } catch (error) {
    console.error('Void order failed:', error);
  }
}

function* postReturnOrder(action) {
  try {
    const { orderId, ...returnData } = action.payload;
    const params = {
      api: `${config.ip}/orders/${orderId}/return`,
      method: 'POST',
      successAction: returnOrderSuccess(),
      failAction: returnOrderFail(),
      body: JSON.stringify(returnData),
      authourization: 'Bearer'
    };
    yield call(commonApi, params);
  } catch (error) {
    console.error('Return order failed:', error);
  }
}

export default function* OrderActionWatcher() {
  yield takeEvery(createOrder.type, postOrder);
  yield takeEvery(fetchOrders.type, getOrders);
  yield takeEvery(addOrderItem.type, postOrderItem);
  yield takeEvery(updateOrderItem.type, putOrderItem);
  yield takeEvery(removeOrderItem.type, deleteOrderItem);
  yield takeEvery(confirmOrder.type, postConfirmOrder);
  yield takeEvery(cancelOrder.type, postCancelOrder);
  yield takeEvery(voidOrder.type, postVoidOrder);
  yield takeEvery(returnOrder.type, postReturnOrder);
}

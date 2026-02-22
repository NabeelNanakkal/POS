import { configureStore } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';
import reducer from './reducers';
import saga from './saga';
import logger from 'redux-logger';

const sagaMiddleware = createSagaMiddleware();

const store = configureStore({
  reducer,
  middleware: (getDefaultMiddleware) => {
    const middlewares = getDefaultMiddleware().concat(sagaMiddleware);
    if (process.env.NODE_ENV === 'development') {
      middlewares.push(logger);
    }
    return middlewares;
  },
});

sagaMiddleware.run(saga);

const { dispatch } = store;

export { store, dispatch };

import PaymentMode from '../models/payment-mode.model.js';

export const getPaymentModes = async (storeId) => {
  const filter = { isActive: true };
  if (storeId) filter.store = storeId;
  return PaymentMode.find(filter);
};

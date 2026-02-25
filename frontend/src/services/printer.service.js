import api from './api';

const printerService = {
  // Printers CRUD
  getPrinters:    (params = {}) => api.get('/printers', { params }),
  getPrinterById: (id)          => api.get(`/printers/${id}`),
  createPrinter:  (data)        => api.post('/printers', data),
  updatePrinter:  (id, data)    => api.put(`/printers/${id}`, data),
  deletePrinter:  (id)          => api.delete(`/printers/${id}`),

  // Print Config
  getConfig:    ()     => api.get('/printers/config'),
  updateConfig: (data) => api.put('/printers/config', data),

  // Barcode generation (delegates to product routes)
  generateBarcode:     (productId, data = {}) => api.post(`/products/generate-barcode/${productId}`, data),
  generateAllBarcodes: ()                     => api.post('/products/generate-all-barcodes'),
};

export default printerService;

import main from './main';
// import menuGroup from './menuGroup';
// import signups from './users';

// ==============================|| MENU ITEMS ||============================== //

// Helper to inject store code at module level
const injectStoreCode = (items) => {
  try {
    const user = JSON.parse(localStorage.getItem('user'));
    const storeCode = user?.store?.code;
    
    if (storeCode) {
      const processItems = (list) => {
        list.forEach(item => {
          if (item.url) {
            // Admin routes: Replace /admin/ or /admin/OLDCODE/ with /admin/NEWCODE/
            if (item.url.match(/^\/admin\//)) {
               item.url = item.url.replace(/^\/admin\/([^\/]+\/)?/, `/admin/${storeCode}/`);
            } 
            // POS routes: Handled by component logic or skipped to prevent double injection
            // else if (item.url.match(/^\/pos\//)) {
            //    item.url = item.url.replace(/^\/pos\/([^\/]+\/)?/, `/pos/${storeCode}/`);
            // }
          }
          if (item.children) {
            processItems(item.children);
          }
        });
      };
      
      processItems(items);
    }
  } catch (err) {
    console.error('[menu-items] Failed to inject store code', err);
  }
};

const menuItems = [
    main,
    // menuGroup,
];

// Inject code before export
injectStoreCode(menuItems);

export default menuItems;
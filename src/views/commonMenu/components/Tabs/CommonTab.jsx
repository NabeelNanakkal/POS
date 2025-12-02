import { Grid } from '@mui/material';
import { useSelector } from 'react-redux';
import { getFieldSize } from 'utils/getFieldSize';
import FieldRender from 'ui-component/FieldRender';
import { isRolePermitted } from 'utils/permissions';
import ConfirmDialog from 'ui-component/ConfirmDialog';
import React, { useCallback, useEffect, useState } from 'react';

const CommonTab = ({ drawerItems, menuConfig, haveTabs, formik, mode }) => {

  const user1 = JSON.parse(localStorage.getItem('user'));
  const user2 = useSelector((state) => state.login?.data?.user);
  const [selectedData, setSelectedData] = useState({});
  const [deleteField, setDeleteField] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const role = user2?.role || user1?.role;

  useEffect(() => {
    setSelectedData(formik?.values);
  }, []);

  const handleDeleteFile = (fieldName) => {
    setDeleteField(fieldName);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (deleteField) {
      setSelectedData((prev) => ({
        ...prev,
        [deleteField]: ''
      }));
      formik.setFieldValue(deleteField, '');
    }
    setDeleteDialogOpen(false);
    setDeleteField(null);
  };

  const handleFileChange = (fieldName, file) => {
    if (file) {
      const fileUrl = URL.createObjectURL(file);
      setSelectedData((prev) => ({
        ...prev,
        [fieldName]: fileUrl
      }));
      formik.setFieldValue(fieldName, fileUrl);
    }
  };

  const isButtonAccessible = useCallback(
    (item) => {
      return isRolePermitted(item.permittedRoles, role);
    },
    [role]
  );

  // commonStyles.js or inside your component file
  const getDisabledSx = (mode) => ({
    '& .MuiOutlinedInput-root.Mui-disabled': {
      WebkitTextFillColor: mode === 'view' ? 'rgba(0,0,0,1)' : 'rgba(34, 33, 33, 0.6)',
      fontWeight: mode === 'view' ? 500 : 400,
      backgroundColor: 'transparent',
      // cursor: 'not-allowed'
    },
    '& .MuiInputBase-input.Mui-disabled': {
      WebkitTextFillColor: mode === 'view' ? 'rgba(0,0,0,1)' : 'rgba(34, 33, 33, 0.6)',
      fontWeight: mode === 'view' ? 500 : 400,
      // cursor: 'not-allowed'
    },
    '& .MuiFormLabel-root': {
      color: mode === 'view' ? 'rgba(34, 33, 33, 0.6)' : 'rgba(0,0,0,0.87)',
      fontWeight: mode === 'view' ? 500 : 400
    },
    '& .MuiIconButton-root': {
      pointerEvents: mode === 'view' ? 'none' : 'auto'
    },
    '& .MuiSvgIcon-root': {
      color: 'inherit'
    }
  });

  return (
    <div style={{ marginTop: '20px' }}>
      {selectedData && (
        <Grid
          sx={{
            paddingTop: '10px',
            paddingBottom: '30px',
            maxHeight: haveTabs ? '70vh' : '77vh',
            overflowY: 'auto',
            paddingRight: 1,
            '&::-webkit-  ': {
              width: '6px'
            },
            '&::-webkit-scrollbar-track': {
              borderRadius: '10px'
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: '#cfcccc',
              borderRadius: '10px'
            }
          }}
          container
          spacing={2}
        >
          {drawerItems?.map(
            (item, index) =>
            (item.type === 'button' && !isButtonAccessible(item) ? null : (
              <FieldRender item={item} index={index}
                role={role}
                mode={mode}
                formik={formik}
                menuConfig={menuConfig}
                getFieldSize={getFieldSize}
                selectedData={selectedData}
                getDisabledSx={getDisabledSx}
                setSelectedData={setSelectedData}
                handleFileChange={handleFileChange}
                handleDeleteFile={handleDeleteFile}
              />
            ))
          )}
        </Grid>
      )}
      <ConfirmDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Document"
        message="Are you sure you want to delete this document? This action cannot be undone."
      />
    </div>
  );
};

export default CommonTab;
import React, { lazy, useState } from 'react';
import { Button, useTheme } from '@mui/material';
import { IconPlus } from '@tabler/icons-react';
import Loadable from 'ui-component/Loadable';

const CommonDrawer = Loadable(lazy(() => import('../Drawers/CommonDrawer')));

const CreateDataButton = ({ setMode, createForm }) => {
  const theme = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const handleButtonClick = () => setIsOpen(true);
  const handleCloseDrawer = () => setIsOpen(false);

  const Icon = createForm?.buttonIcon || IconPlus;
  const startIcon = Icon && <Icon strokeWidth={1.5} size="1.3rem" style={{ marginTop: 'auto', marginBottom: 'auto' }} />;

  return (
    <>
      <Button
        onClick={() => {
          setMode('edit'),
            handleButtonClick()
        }}
        startIcon={startIcon}
        variant="contained"
        sx={{
          borderRadius: 10,
          height: '38px',
        }}
      >
        {createForm?.buttonLabel}
      </Button>

      {/* <CreateDrawer
        open={isOpen}
        formConfig={createForm}
        handleCloseDrawer={handleCloseDrawer}
      />  */}
      <CommonDrawer setMode={setMode} open={isOpen} menuConfig={createForm?.formConfig} handleCloseDrawer={handleCloseDrawer} />
    </>
  );
};

export default CreateDataButton;

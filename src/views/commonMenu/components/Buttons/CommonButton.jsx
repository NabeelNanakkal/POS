import React, { lazy, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import { clearUserActionSuccess } from 'container/userContainer/slice';
import { useDispatch } from 'react-redux';
import Tooltip from '@mui/material/Tooltip'

const ToggleUserStatusModal = lazy(() => import('views/commonMenu/components/modals/ToggleUserStatusModal'));
const ResetUserPasswordModal = lazy(() => import('views/commonMenu/components/modals/ResetUserPasswordModal'));

const CommonButton = ({
  data,
  label,
  toolTip,
  actionType,
  variant,
  disabled,
  startIcon,
  endIcon,
  menuConfig,
  ...rest
}) => {
  const dispatch = useDispatch()

  const [id, setid] = useState(null)
  useEffect(() => {
    if (data?.data?.id) {
      setid(data?.data?.id)
    }
  }, [data])

  // button fn() switching logic  -----------------------------
  const handleClick = () => {
    switch (actionType) {
      case 'toggleUserStatus':
        handleToggleUserStatus();
        break;
      case 'resetUserPassword':
        handleResetUserPassOpenModal();
        break;
      default:
        console.warn("invalid Action configration")
    }
  };

  // (3)User Status Toggling 
  const [statusTglmodalOpen, setStatusTglmodalOpen] = useState(false);

  const handleToggleUserStatus = () => {
    setStatusTglmodalOpen(true)
  };
  const handlestatusTglCloseModal = () => {
    setStatusTglmodalOpen(false);
    dispatch(clearUserActionSuccess())
  };


  // (4)User Password modal Toggling 
  const [resetUserPassModalOpen, setresetUserPassModalOpen] = useState(false);

  const handleResetUserPassOpenModal = () => {
    setresetUserPassModalOpen(true)
  };
  const handleResetUserPassCloseModal = () => {
    setresetUserPassModalOpen(false);
    dispatch(clearUserActionSuccess())
  };

  const Icon = endIcon;
  const EndIcon = endIcon && <Icon strokeWidth={1.5} size="1.3rem" style={{ marginTop: 'auto', marginBottom: 'auto' }} />

  return (
    <>
      <Tooltip title={toolTip}>
        <Button
          fullWidth
          variant={variant}
          disabled={disabled}
          onClick={handleClick}
          {...rest}
          startIcon={startIcon}
          endIcon={EndIcon}
        >
          {label}
        </Button>
      </Tooltip>


      {/* components---------------------- */}

      {statusTglmodalOpen && <ToggleUserStatusModal
        open={statusTglmodalOpen}
        handleClose={handlestatusTglCloseModal}
        selectedUser={data?.data}
        menuConfig={menuConfig}
        id={id}
      />
      }
      {resetUserPassModalOpen && <ResetUserPasswordModal
        open={resetUserPassModalOpen}
        handleClose={handleResetUserPassCloseModal}
        selectedUser={data?.data}
        menuConfig={menuConfig}
        id={id}
      />
      }
    
    </>
  );
};

CommonButton.propTypes = {
  data: PropTypes.object,
  label: PropTypes.string.isRequired,
  toolTip: PropTypes.string,
  actionType: PropTypes.isRequired,
  variant: PropTypes.oneOf(['contained', 'outlined', 'text']),
  disabled: PropTypes.bool,
  startIcon: PropTypes.node,
  endIcon: PropTypes.node,
  menuConfig: PropTypes.object,
};

CommonButton.defaultProps = {
  variant: 'contained',
  disabled: false,
  startIcon: null,
  endIcon: null,
};

export default CommonButton;
import { useFormik } from 'formik';
import Status from 'ui-component/Status';
import { useTheme } from '@emotion/react';
import Loadable from 'ui-component/Loadable';
import Priority from 'ui-component/Priority';
import CloseIcon from '@mui/icons-material/Close';
import { isRolePermitted } from 'utils/permissions';
import { useDispatch, useSelector } from 'react-redux';
import LoadingLottie from 'ui-component/LoadingLottie';
import React, { useState, lazy, Suspense, useEffect, useCallback, useRef } from 'react';
import {  updateCommonMenuData, addCommonMenuDataFn } from 'container/commonMenuContainer/slice';
import { Drawer, Button, Box, Grid, Typography, Divider, Tabs, Tab, IconButton } from '@mui/material';
import { processFields,  buildValidationSchema, extractDrawerFields } from 'utils/formValidation';
import Logo from 'assets/images/icons/vs.svg';


const CommonTab = Loadable(lazy(() => import('../Tabs/CommonTab')));
const TableTab = lazy(() => import('../Tabs/TableTab'));

const CommonDrawer = ({ mode, setMode, open, selectedRow, menuConfig, handleCloseDrawer, setSelectedRow }) => {

  const {  titleField, statusField, priorityField, subtTitle, hearingTitle, haveTabs, tabs } =
    menuConfig?.drawerConfigs;
  const theme = useTheme();
  const fieldRefs = useRef({});
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState(null);
  const user1 = JSON.parse(localStorage.getItem('user'));
  const user2 = useSelector((state) => state.login?.data?.user);
  const role = user2?.role || user1?.role;

  const drawerFields = extractDrawerFields(menuConfig?.drawerConfigs);
  const processedFields = processFields(drawerFields);
  // Build validation schema for Formik
  const validationSchema = buildValidationSchema(processedFields);

  const formik = useFormik({
    initialValues: selectedRow || {},
    validationSchema,
    validateOnBlur: true,
    validateOnChange: true,
    onSubmit: (values) => {
      const changedValues = Object.keys(values).reduce((acc, key) => {
        const initialVal = formik.initialValues[key];
        const currentVal = values[key];
        const isDate = (val) => val && typeof val === 'object' && val.__type === 'Date';
        let hasChanged = false;
        if (isDate(currentVal) && isDate(initialVal)) {
          hasChanged = currentVal.iso !== initialVal.iso;
        } else if (Array.isArray(currentVal) && Array.isArray(initialVal)) {
          hasChanged = JSON.stringify(currentVal) !== JSON.stringify(initialVal);
        } else {
          hasChanged = currentVal !== initialVal;
        }
        if (hasChanged) acc[key] = currentVal;
        return acc;
      }, {});
      if (!selectedRow) {
        console.log(menuConfig?.createForm?.apiEndPoint);
        dispatch(
          addCommonMenuDataFn({
            endPoint: menuConfig?.createForm?.apiEndPoint,
            apiEndPoint: menuConfig?.apiEndPoint,
            baseFilter: menuConfig?.baseFilter,
            defaultSort: menuConfig?.defaultSort,
            role: menuConfig?.createForm?.role,
            apiType: menuConfig?.apiType,
            organizationType: menuConfig?.createForm?.organizationType,
            data: changedValues
          })
        );
      } else {
        dispatch(
          updateCommonMenuData({
            endPoint: menuConfig?.apiEndPoint,
            baseFilter: menuConfig?.baseFilter,
            apiType: menuConfig?.apiType,
            id: selectedRow?.objectId,
            defaultSort: menuConfig?.defaultSort,
            data: changedValues
          })
        );
      }
      formik.resetForm({});
      handleCloseDrawer();
      setMode('view');
      // setSelectedRow(null);
    },
    enableReinitialize: true
  });

  useEffect(() => {
    if (tabs?.length > 0) {
      setActiveTab(tabs[0].label);
    } else {
      setActiveTab('noTabs');
    }
  }, [haveTabs, tabs]);

  const isButtonAccessible = useCallback(
    (item) => {
      return isRolePermitted(item.permittedRoles, role);
    },
    [role]
  );

  const handleTabChange = (_, newValue) => {
    setActiveTab(newValue);
  };

  const renderActiveTabContent = (formik) => {
    switch (activeTab) {
      case 'noTabs':
        return (
          <Suspense fallback={<div></div>}>
            <CommonTab dataRow={selectedRow} drawerItems={menuConfig?.drawerConfigs.items} menuConfig={menuConfig} haveTabs={haveTabs} />
          </Suspense>
        );
      case 'Claimant Details':
      case 'Contact Information':
      case 'Hearing-Details':
      case 'Tax & Identification':
      case 'User-Details':
      case 'Bank Information':
      case 'Case Details':
      case 'Basic Details':
      case 'Details':
      case 'Bank & Tax Info':
      case 'Tax Info':
        return (
          <Suspense fallback={<div></div>}>
            <CommonTab
              formik={formik}
              mode={mode}
              dataRow={selectedRow}
              drawerItems={menuConfig?.drawerConfigs?.tabs?.find((tab) => tab.label == activeTab)?.items}
              menuConfig={menuConfig}
              haveTabs={haveTabs}
            />
          </Suspense>
        );
     
      case 'Attentees':
      case 'qualification':
      case 'experience':
      case 'Case Managers':
      case 'Linked Case Managers':
      case 'Linked Claimants':
      case 'Linked  Claimants':
      case 'Linked Arbitrators':
      case 'attendees':
        const drawerTabItemsConfig = menuConfig.drawerConfigs.tabs?.find((tab) => tab.label === activeTab)?.items;
        return (
          <Suspense fallback={<div></div>}>
            <TableTab
              formik={formik}
              mode={mode}
              drawerItems={drawerTabItemsConfig}
              tableData={selectedRow?.[activeTab] || []}
              title={activeTab}
            />
          </Suspense>
        );
      default:
        return (
          <Suspense fallback={<div></div>}>
            <LoadingLottie style={{ marginTop: '10vh' }} />
          </Suspense>
        );
    }
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={() => {
        handleCloseDrawer();
        setMode('view');
        formik.resetForm({});
      }}
      sx={{
        width: {
          xs: '100%',
          sm: '70%',
          md: '70%',
          lg: '90%'
        },
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: {
            xs: '100%',
            sm: '100%',
            md: '90%',
            lg: '77%'
          },
          padding: '2% 2% 1.5% 3%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }
      }}
    >
      <form onSubmit={formik.handleSubmit} style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          <Grid
            container
            spacing={1}
            direction="row"
            justifyContent="space-between"
            alignItems="flex-start"
            alignContent="stretch"
            wrap="wrap"
          >
            <Grid>
              <Box sx={{ marginBottom: 2 }}>
                {selectedRow && (
                  <Grid container direction="column" spacing={0}>
                    <Grid>
                      <Grid container direction="row" alignItems="center" spacing={2}>
                        <Grid>
                          <Typography variant="h2" sx={{ fontWeight: 'bold' }}>
                            {selectedRow[titleField] ? selectedRow[titleField] : menuConfig?.drawerConfigs?.defaultTitle}
                          </Typography>
                        </Grid>
                        {selectedRow[statusField] && (
                          <>
                            <Grid>
                              <Divider orientation="vertical" flexItem sx={{ height: '30px' }} />
                            </Grid>
                            <Grid>
                              <Status status={selectedRow[statusField] || ''} />
                            </Grid>
                          </>
                        )}
                        {selectedRow[priorityField] && (
                          <>
                            <Grid>
                              <Divider orientation="vertical" flexItem sx={{ height: '30px' }} />
                            </Grid>
                            <Grid>
                              <Priority priority={selectedRow[priorityField] || ''} />
                            </Grid>
                          </>
                        )}
                      </Grid>
                    </Grid>
                    {subtTitle && (
                      <Grid mt={1} item>
                        <Grid container direction="row" alignItems="start" spacing={1}>
                          {subtTitle.label && (
                            <Grid>
                              <Typography color="#474747">{subtTitle.label} :</Typography>
                            </Grid>
                          )}
                          <Grid>
                            <Typography color="#474747">{selectedRow[subtTitle.fieldName]}</Typography>
                          </Grid>
                        </Grid>
                      </Grid>
                    )}
                    {hearingTitle && (
                      <Grid mt={1} item>
                        {/* <Grid container direction="row" alignItems="start" spacing={1}>
                          {hearingTitle.label && (
                            <Grid>
                              <Typography color="#474747">{hearingTitle.label} :</Typography>
                            </Grid>
                          )}
                          <Grid>
                            <Typography color="#474747">{selectedRow[hearingTitle.fieldName]}</Typography>
                          </Grid>
                        </Grid> */}
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            flexWrap: 'nowrap',
                            mt: 0,
                            minWidth: 0,
                            overflow: 'hidden'
                          }}
                        >
                          <Typography
                            sx={{
                              // ...style1.gradientSet,
                              display: 'flex',
                              alignItems: 'center',
                              flexWrap: 'nowrap',
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              fontSize: '14px'
                            }}
                          >
                            {'Intergro Finserv Pvt Ltd'}
                            <Box component="img" src={Logo} alt="integro-logo" sx={{ height: 30, width: 'auto', mx: 1 }} />
                            Siddarth
                          </Typography>
                        </Box>
                      </Grid>
                    )}
                  </Grid>
                )}
                {!selectedRow && (
                  <Grid container direction="column" spacing={0}>
                    <Grid>
                      <Grid container direction="row" alignItems="center" spacing={2}>
                        <Grid>
                          <Typography variant="h2" sx={{ fontWeight: 'bold' }}>
                            {menuConfig?.createForm?.label}
                          </Typography>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                )}
              </Box>
            </Grid>
            <Grid>
              <IconButton
                size="30px"
                onClick={() => {
                  setMode('view');
                  formik.resetForm({});
                  handleCloseDrawer();
                }}
                sx={{ padding: '8px', borderRadius: '50%', '&:hover': { backgroundColor: '#e0e0e0' } }}
              >
                <CloseIcon />
              </IconButton>
            </Grid>
          </Grid>
          <Divider />

          {/* Tabs */}

          {menuConfig?.drawerConfigs?.haveTabs && tabs.length > 1 && (
            <Tabs
              value={activeTab}
              onChange={handleTabChange}
              textColor="primary"
              variant="scrollable"
              scrollButtons="auto"
              aria-label="scrollable auto tabs example"
              sx={{
                '& .MuiTabs-flexContainer': {
                  flexWrap: 'nowrap'
                },
                overflowX: 'auto',
              
              }}
            >
              {tabs.map((tab) => (
                <Tab
                  key={tab.label}
                  value={tab.label}
                  label={tab.label}
                  sx={{
                    display: !isButtonAccessible(tab) ? 'none' : 'inline-flex',
                    whiteSpace: 'nowrap',
                    minWidth: 'fit-content'
                  }}
                />
              ))}
            </Tabs>
          )}

          <Box
            sx={{
              flexGrow: 1,
              overflowY: 'hidden',
              paddingRight: 1,
              '&::-webkit-scrollbar': {
                width: '8px'
              },
              '&::-webkit-scrollbar-track': {
                backgroundColor: theme.palette.background.default,
                borderRadius: '10px'
              },
              '&::-webkit-scrollbar-thumb': {
                backgroundColor: '#cfcccc',
                borderRadius: '10px',
                border: `2px solid ${theme.palette.background.default}`
              }
            }}
          >
            {renderActiveTabContent(formik)}
          </Box>

          {/* Footer Buttons */}
          <Box sx={{ marginTop: 'auto' }}>
            <Grid container spacing={2}>
              {mode === 'view' ? (
                <>
                  <Grid size={6}>
                    <Button
                      onClick={() => {
                        handleCloseDrawer();
                        formik.resetForm({});
                        setMode('view');
                      }}
                      variant="outlined"
                      fullWidth
                    
                    >
                      Close
                    </Button>
                  </Grid>
                  {/* {isUpdatable && ( */}
                  <Grid size={6}>
                    <Button
                      variant="contained"
                      fullWidth
                      onClick={(e) => {
                        e.preventDefault();
                        setMode('edit');
                      }}
                      sx={{
                        color: (theme) => theme.palette.common.white,
                        '&:hover': {
                          opacity: 0.9
                        }
                      }}
                    >
                      Edit
                    </Button>
                  </Grid>

                  {/* // )} */}
                </>
              ) : (
                <>
                  <Grid size={activeTab === 'Documents & Branding' ? 12 : 6}>
                    {!selectedRow ? (
                      <Button
                        onClick={() => {
                          handleCloseDrawer();
                          formik.resetForm({});
                          setMode('view');
                        }}
                        variant="outlined"
                        fullWidth
                      >
                        Close
                      </Button>
                    ) : (
                      <Button
                        onClick={() => setMode('view')}
                        variant="outlined"
                        fullWidth
                      >
                        Cancel
                      </Button>
                    )}
                  </Grid>
                  <Grid size={6}>
                    <Button
                      variant="contained"
                      fullWidth
                      disabled={!formik.dirty && selectedRow}
                      onClick={async () => {
                        const errs = await formik.validateForm();
                        if (Object.keys(errs).length > 0) {
                          const touchedObj = Object.keys(errs).reduce((acc, k) => {
                            acc[k] = true;
                            return acc;
                          }, {});
                          formik.setTouched(touchedObj, false);

                          // Focus first invalid field
                          const firstKey = processedFields.find((f) => errs[f._key])?._key;
                          const el = fieldRefs.current[firstKey];
                          if (el && typeof el.focus === 'function') el.focus();
                          return;
                        }
                        await formik.submitForm();
                      }}
                      sx={{
                        display: activeTab === 'Documents & Branding' ? 'none' : 'block'
                      }}
                    >
                      {selectedRow ? 'Update' : menuConfig?.createForm?.label}
                    </Button>
                  </Grid>
                </>
              )}
            </Grid>
          </Box>
        </Box>
      </form>
    </Drawer>
  );
};

export default CommonDrawer;

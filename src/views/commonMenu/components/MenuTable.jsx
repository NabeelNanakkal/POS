import { lazy, useEffect, useRef, useState, useCallback, useMemo } from 'react';
import {
  Box,
  Grid,
  Table,
  Paper,
  Badge,
  Select,
  Button,
  Popover,
  Tooltip,
  lighten,
  Checkbox,
  MenuItem,
  useTheme,
  TableRow,
  TableBody,
  TableCell,
  TableHead,
  TextField,
  InputLabel,
  IconButton,
  Typography,
  FormControl,
  InputAdornment,
  TableContainer,
  FormControlLabel,
  Divider,
} from '@mui/material';
import {
  clearCommonMenuData,
  clearDrawerData,
  getCommonMenuData,
  getRedirectDataByID,
  clearSuccessess,
} from 'container/commonMenuContainer/slice';
import dayjs from 'dayjs';
import { getUser } from 'utils/getUser';
import useDebounce from 'hooks/useDebounce';
import Loadable from 'ui-component/Loadable';
import SortIcon from '@mui/icons-material/Sort';
import SearchIcon from '@mui/icons-material/Search';
import NoDataLottie from 'ui-component/NoDataLottie';
import { useDispatch, useSelector } from 'react-redux';
import LoadingLottie from 'ui-component/LoadingLottie';
import FilterListIcon from '@mui/icons-material/FilterList';
import { useLocation, useNavigate } from 'react-router-dom';
import CellDataRenderer from 'ui-component/CellDataRenderer';
import { clearmasterData, getCommonData } from 'container/masterDataContainer/slice';
import { downloadDocAllowedRoles } from 'constants/allowedRoles';
import { IconChevronDown, IconSortAscending, IconSortDescending, IconTableExport } from '@tabler/icons-react';
import CommonTableSearchBar from 'ui-component/CommonTableSearchBar';
import useConfig from 'hooks/useConfig';

const FilterPopover = Loadable(lazy(() => import('./FilterPopover')));
const CommonDrawer = Loadable(lazy(() => import('./Drawers/CommonDrawer')));
const ExportFileModal = Loadable(lazy(() => import('./modals/ExportFileModal')));
const CreateDataButton = Loadable(lazy(() => import('./Buttons/CreateDataButton')));

const MenuTable = ({ menuConfig, tableCustomHeight }) => {

  const theme = useTheme();
  const user1 = getUser();
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const { state: { borderRadius } } = useConfig();
  console.log("[94m 👉[ borderRadius ]========== [0m", borderRadius);
  const tableContainerRef = useRef(null);

  const user2 = useSelector((state) => state.login);
  const loading = useSelector((state) => state.commonMenu?.loading);
  const error = useSelector((state) => state.commonMenu?.error || null);
  const dataCount = useSelector((state) => state.commonMenu?.menuDataCount);
  const tableData = useSelector((state) => state.commonMenu?.menuData || []);
  const searchAfter = useSelector((state) => state.commonMenu?.searchAfter || null);

  // configs----------
  const columns = useMemo(
    () => menuConfig?.tableStructure?.columns || [],
    [menuConfig]
  );

  const sortables = useMemo(
    () =>
      (menuConfig?.tableStructure?.columns?.filter(col => col.isSortable) || []).length > 0
        ? menuConfig.tableStructure.columns.filter(col => col.isSortable)
        : (menuConfig?.drawerConfigs?.items?.filter(col => col.isSortable) || []).length > 0
          ? menuConfig.drawerConfigs.items.filter(col => col.isSortable)
          : menuConfig?.drawerConfigs?.tabs?.[0]?.items?.filter(col => col.isSortable) || [],
    [menuConfig]
  );

  const filteritems = useMemo(() =>
    menuConfig?.drawerConfigs?.filters ||
    menuConfig?.drawerConfigs?.tabs?.[0]?.items ||
    menuConfig?.drawerConfigs?.items || [],
    [menuConfig]);

  const filterables = useMemo(
    () => filteritems?.filter((col) => col.isFilterable) || [],
    [filteritems]);

  const createForm = useMemo(
    () => ({
      isCreatable: menuConfig?.createForm?.formId && menuConfig?.createForm?.buttonLabel && menuConfig?.createForm?.allowedRoles,
      //  &&isRolePermitted(menuConfig?.tableStructure?.createForm?.allowedRoles, role),
      buttonLabel: menuConfig?.createForm?.buttonLabel,
      buttonIcon: menuConfig?.createForm?.buttonIcon,
      formConfig: menuConfig
    }),
    [menuConfig]
  );

  const role = user2?.role || user1?.role;
  const baseFilter = menuConfig?.baseFilter || null;
  const urlParts = window.location.href?.split('/');
  const lastSegment = urlParts[urlParts.length - 1];
  const defaultSort = menuConfig?.defaultSort || null;
  const isbulkAllocation = menuConfig?.isbulkAllocation;
  const menukey = menuConfig?.routerConfigs?.path || null;
  const searchItem = columns?.filter((column) => column.isSearchParam);
  const isAllocation = menuConfig?.isAllocation || menuConfig?.isReAllocation;
  const colSpan = columns.length + ((role === 'admin' || role === 'Management') && isAllocation ? 1 : 0);

  const [itemsPerPage] = useState(20);
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState('view');
  const [toggle, setToggle] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState(null);
  const [sortField, setSortField] = useState(null);
  const [drawerType, setDrawerType] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);
  const [selectedItems, setSelectedItems] = useState([]);
  const [anchorElSort, setAnchorElSort] = useState(null);
  const [isRedirected, setisRedirected] = useState(false);
  const [doDrawerOpen, setDoDrawerOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState(null);
  const [anchorElFilter, setAnchorElFilter] = useState(null);
  const [activeFilterCount, setActiveFilterCount] = useState(0);
  const [filters, setFilters] = useState([{ field: '', value: null }]);
  const [tableHeight, setTableHeight] = useState(window.innerHeight - (tableCustomHeight ?? 90));
  console.log("[45m 👉[ tableHeight ]========== [0m", tableHeight);
  const [searchField, setSearchField] = useState(columns?.length > 0 ? columns?.filter((col) => col?.isSearchParam)[0] : null);
  const [openFileExportModal, setOpenFileExportModal] = useState(false);

  // ---------------table height handler----------------
  useEffect(() => {
    const handleResize = () => {
      setTableHeight(window.innerHeight - (tableCustomHeight ?? 90));
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [tableCustomHeight]);

  // Manual infinite scroll handler
  useEffect(() => {
    const container = tableContainerRef.current;
    if (!container) return;
    const handleScroll = () => {
      if (loading || !hasMore || tableData.length === 0) return;

      const { scrollTop, scrollHeight, clientHeight } = container;
      if (scrollTop + clientHeight >= scrollHeight - 5) {
        // Threshold of 5px
        loadFunc();
      }
    };
    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, [loading, hasMore, tableData.length, searchAfter, searchTerm, sortField, sortOrder, filters]);

  // ---------------initial fetch----------------
  useEffect(() => {
    dispatch(clearCommonMenuData());
    setSearchField(columns?.length > 0 ? columns.find((col) => col.isSearchParam) : null);
    setSearchTerm('');
    setFilters([{ field: '', value: null }]);
    setActiveFilterCount(0);
    setActiveFilters(null);
    setSortField(null);
    setHasMore(true);
    setSelectedItems([]);
    const queryParams = new URLSearchParams(location.search);
    const stateParam = queryParams.get('state');
    let params = {
      size: itemsPerPage
    };

    if (stateParam) {
      // ---------condition for managing the redirected state from other page ------
      try {
        const state = JSON.parse(decodeURIComponent(stateParam));
        if (state?.isById && state?.id) {
          const cleanedEndPoint = menuConfig?.apiEndPoint?.startsWith('/') ? menuConfig?.apiEndPoint.substring(1) : menuConfig?.apiEndPoint;
          dispatch(getRedirectDataByID({ index: cleanedEndPoint, id: state?.id }));
          setisRedirected(true);
          setDoDrawerOpen(state?.doDrawerOpen);
          return;
        }

        if (state?.item) {
          const matchingFilterItem = filteritems.find((item) => item.fieldName === state.item[0]?.field);
          const filterObject = matchingFilterItem
            ? {
              field: matchingFilterItem,
              operator: state.item[0]?.operator || 'eq',
              value: state.item[0]?.value,
              options: matchingFilterItem?.filterData?.values || [{ value: 'true' }, { value: 'false' }]
            }
            : {
              field: state.item[0]?.field,
              operator: state.item[0]?.operator || 'eq',
              value: state.item[0]?.value
            };
          const activeFilterObject = {
            field: state.item[0]?.field,
            operator: state.item[0]?.operator || 'eq',
            value: state.item[0]?.value
          };
          setFilters([filterObject]);
          setActiveFilters([activeFilterObject]);
          setActiveFilterCount(1);
          params.filters = state.item;
          params.apiType = state.apiType;
        }
        setisRedirected(true);
        setDoDrawerOpen(state?.doDrawerOpen);
        if (baseFilter) {
          params.baseFilter = baseFilter;
        }
        if (defaultSort) {
          params.sortField = defaultSort?.sortField;
          params.sortOrder = defaultSort?.sortOrder;
        }
        dispatch(
          getCommonMenuData({
            endPoint: menuConfig?.apiEndPoint,
            apiType: menuConfig?.apiType,
            params
          })
        );
      } catch (error) {
        console.error('Failed to parse state parameter:', error);
      }
      return;
    }

    if (baseFilter) {
      params.baseFilter = baseFilter;
    }
    if (defaultSort) {
      params.sortField = defaultSort?.sortField;
      params.sortOrder = defaultSort?.sortOrder;
    }

    dispatch(
      getCommonMenuData({
        endPoint: menuConfig?.apiEndPoint,
        apiType: menuConfig?.apiType,
        params
      })
    );
  }, [menukey, location.search, toggle]);

  // --------redirection data clearing fun()
  const handleClear = () => {
    navigate({ pathname: location.pathname });
    dispatch(clearCommonMenuData());
  };

  useEffect(() => {
    if (isRedirected && doDrawerOpen && tableData?.length > 0) {
      handleRowClick(tableData[0]);
      setisRedirected(false);
      setDoDrawerOpen(false);
    }
  }, [tableData]);

  // ----------------inifinite-scroll----------
  const loadFunc = useCallback(() => {
    const queryParams = new URLSearchParams(location.search);
    const stateParam = queryParams.get('state');

    if (dataCount === 0 || tableData?.length === 0) {
      return;
    }
    if (stateParam && JSON.parse(decodeURIComponent(stateParam))?.isById) {
      setHasMore(false);
      return;
    }
    if (loading || !hasMore) {
      return;
    }
    if (error) {
      setHasMore(false);
      return;
    }
    if (tableData?.length >= dataCount) {
      setHasMore(false);
      return;
    }

    const diff = dataCount - tableData.length;
    const isless = diff <= itemsPerPage;
    const params = {
      searchAfter: searchAfter,
      fethcedDataCount: tableData?.length,
      size: isless ? diff : itemsPerPage,
      searchField: searchField?.fieldName,
      searchTerm: searchTerm,
      sortField: sortField,
      sortOrder: sortOrder,
      filters: filters
    };

    if (baseFilter) {
      // ---------base filter is using for the scenario were same api with filter for diff menus  ------
      params.baseFilter = baseFilter;
    }
    if (defaultSort) {
      params.sortField = defaultSort?.sortField;
      params.sortOrder = defaultSort?.sortOrder;
    }

    let formattedFilters;
    if (filters.length > 0 && filters[0].value) {
      formattedFilters = filters
        .filter((filter) => filter.value !== null && filter.value !== '' && filter.field)
        .map((filter) => ({
          ...filter,
          field: filter.field.fieldName,
          fieldType: filter.field.type,
          value:
            Array.isArray(filter.value) && filter.value.every((item) => typeof item === 'object')
              ? filter.value.map((item) => item[filter?.field?.filterData?.key] || item)
              : filter.value
        }));
      if (formattedFilters) {
        params.filters = formattedFilters;
      }
    }

    dispatch(
      getCommonMenuData({
        endPoint: menuConfig?.apiEndPoint,
        apiType: menuConfig?.apiType,
        params: params
      })
    );
  }, [
    dataCount,
    tableData?.length,
    loading,
    hasMore,
    error,
    searchAfter,
    itemsPerPage,
    searchField?.fieldName,
    searchTerm,
    sortField,
    sortOrder,
    filters,
    baseFilter,
    defaultSort,
    dispatch,
    menuConfig?.apiEndPoint,
    menuConfig?.apiType,
    location.search
  ]);

  // ------------------search logic-----------
  const handleSearchFieldChange = (event) => {
    setSearchField(event.target.value);
    setSearchTerm('');
    doSearch('');
  };

  // -----------Search handler-----------------------
  const doSearch = (term) => {
    if (location.search !== '') {
      handleClear();
    }
    setSortField(null);
    setSortOrder(null);
    setHasMore(true);
    dispatch(clearCommonMenuData());
    if (term === '') {
      setHasMore(true);
    }
    let formattedFilters = null;
    if (filters[0]?.value) {
      formattedFilters = filters
        .filter((filter) => filter.value !== null && filter.value !== '' && filter.field)
        .map((filter) => ({
          ...filter,
          field: filter.field.fieldName,
          fieldType: filter.field.type,
          value:
            Array.isArray(filter.value) && filter.value.every((item) => typeof item === 'object')
              ? filter.value.map((item) => item[filter?.field?.filterData?.key] || item)
              : filter.value
        }));
    }
    const params = {
      size: itemsPerPage,
      searchField: searchField?.fieldName,
      searchTerm: term,
      filters: formattedFilters
    };

    if (baseFilter) {
      params.baseFilter = baseFilter;
    }
    if (defaultSort) {
      params.sortField = defaultSort?.sortField;
      params.sortOrder = defaultSort?.sortOrder;
    }

    dispatch(
      getCommonMenuData({
        endPoint: menuConfig?.apiEndPoint,
        apiType: menuConfig?.apiType,
        params: params
      })
    );
  };

  // (debounce hook  for avoiding unnecessary api calls on key strokes)------------
  const deBouncedSearch = useDebounce(doSearch, 250);
  const handleSearchChange = (event) => {
    console.log("[38;2;255;0;255m 👉[ event ]========== [0m", event);
    const term = event.target.value;
    setSearchTerm(term);
    deBouncedSearch(term);
  };

  // --------------------filter things-------------------------------------------
  const handleOpenFilterPopover = (event) => {
    setAnchorElFilter(event.currentTarget);
  };

  const handleCloseFilterPopover = () => {
    setAnchorElFilter(null);
  };

  const handleFilterByChange = (index, field) => {
    dispatch(clearmasterData());
    const isDateField = field?.type === 'date' || field?.type === 'dateTime';
    setFilters((prev) =>
      prev.map((filter, i) =>
        i === index
          ? {
            ...filter,
            field,
            operator: isDateField ? undefined : 'eq',
            value: isDateField ? { gte: dayjs().format('YYYY-MM-DD'), lte: dayjs().format('YYYY-MM-DD') } : null
          }
          : filter
      )
    );
  };

  const handleOperatorChange = (index, operator) => {
    try {
      setFilters((prev) => prev.map((filter, i) => (i === index ? { ...filter, value: null, operator } : filter)));
    } catch (error) {
      console.error('Error in handleOperatorChange:', error);
    }
  };

  const hanldeDropDownDatafetch = (filter) => {
    const filterDataEndPoint = filter?.field?.filterData?.apiEndpoint;
    if (filterDataEndPoint) {
      dispatch(
        getCommonData({
          endPoint: filterDataEndPoint,
          params: {
            size: 50,
            baseFilter: filter?.field?.filterData?.baseFilter || null
          }
        })
      );
    }
  };

  const handleFilterValueChange = (index, value, filterData) => {
    setFilters((prev) =>
      prev.map((filter, i) =>
        i === index
          ? {
            ...filter,
            value,
            ...(filterData && { options: filterData })
          }
          : filter
      )
    );
  };

  const addNewFilter = () => {
    setFilters((prev) => [...prev, { field: '', operator: '', value: '' }]);
  };

  const hanldeFilterApply = () => {
    let formattedFilters = filters
      .filter((filter) => {
        const isDateField = filter.field?.type === 'date' || filter.field?.type === 'dateTime';
        if (isDateField) {
          return filter.value && (filter.value.gte || filter.value.lte);
        } else {
          return filter.value !== null && filter.value !== '' && filter.field;
        }
      })
      .map((filter) => {
        const isDateField = filter.field?.type === 'date' || filter.field?.type === 'dateTime';
        return {
          field: filter.field.fieldName,
          fieldType: filter.field.type,
          ...(isDateField
            ? { value: filter.value }
            : {
              operator: filter.operator,
              value:
                Array.isArray(filter.value) && filter.value.every((item) => typeof item === 'object')
                  ? filter.value.map((item) => item[filter?.field?.filterData?.key] || item)
                  : filter.value
            })
        };
      });

    if (formattedFilters.length === 0) {
      console.log('No valid filters to apply.');
      return;
    }

    const params = {
      filters: formattedFilters,
      size: itemsPerPage
    };

    setActiveFilterCount(formattedFilters?.length);
    setActiveFilters(formattedFilters);
    setSearchTerm('');
    setSortField(null);
    dispatch(clearCommonMenuData());
    if (baseFilter) {
      params.baseFilter = baseFilter;
    }
    if (defaultSort) {
      params.sortField = defaultSort?.sortField;
      params.sortOrder = defaultSort?.sortOrder;
    }

    dispatch(
      getCommonMenuData({
        endPoint: menuConfig?.apiEndPoint,
        apiType: menuConfig?.apiType,
        params: params
      })
    );
    handleCloseFilterPopover();
    setHasMore(true);
  };

  const removeFilter = (index) => {
    setFilters((prev) => {
      const updatedFilters = prev.filter((_, i) => i !== index);
      return updatedFilters.length > 0 ? updatedFilters : [{ field: '', operator: '', value: '' }];
    });
  };

  const clearFilters = () => {
    setToggle(!toggle);
    handleClear();
    setFilters([{ field: '', value: null }]);
    setActiveFilterCount(0);
    setActiveFilters(null);
    dispatch(clearDrawerData());
    handleCloseFilterPopover();
  };

  //   ------------------sort logic----------------------
  const handleOpenSortPopover = (event) => {
    setAnchorElSort(event.currentTarget);
  };

  const handleCloseSortPopover = () => {
    setAnchorElSort(null);
  };

  const handleSortChange = (field, order) => {
    setSortField(field);
    setSortOrder(order);
    setHasMore(true);
    dispatch(clearCommonMenuData());

    let formattedFilters = null;
    if (filters[0]?.value) {
      formattedFilters = filters
        .filter((filter) => filter.value !== null && filter.value !== '' && filter.field)
        .map((filter) => ({
          ...filter,
          field: filter.field.fieldName,
          fieldType: filter.field.type,
          value:
            Array.isArray(filter.value) && filter.value.every((item) => typeof item === 'object')
              ? filter.value.map((item) => item[filter?.field?.filterData?.key] || item)
              : filter.value
        }));
    }

    const params = {
      size: itemsPerPage,
      filters: formattedFilters,
      sortField: field,
      sortOrder: order
    };

    if (baseFilter) {
      params.baseFilter = baseFilter;
    }

    dispatch(
      getCommonMenuData({
        endPoint: menuConfig?.apiEndPoint,
        apiType: menuConfig?.apiType,
        params: params
      })
    );
    handleCloseSortPopover();
  };

  // --------------side drawer controll---------------
  const handleRowClick = (row) => {
    if (menuConfig?.tableStructure?.isPage) {
      navigate(
        `/${lastSegment === 'mediations' ? 'mediations' : 'arbitrations'}/${lastSegment === 'mediations' ? row.mediationId : row.arbitrationId}`,
        { state: { tableData: row } }
      );
    } else {
      setDrawerType(menuConfig?.drawerConfigs?.type || 'default');
      dispatch(clearSuccessess());
      setSelectedRow(row);
      setOpen(true);
    }
  };

  const handleCloseDrawer = () => {
    dispatch(clearDrawerData());
    dispatch(clearSuccessess());
    setOpen(false);
  };

  // ----------individual allocation (selecting item to bucket)------
  const handleCheckClick = (event, row) => {
    setSelectedItems((prevSelected) => {
      if (event.target.checked) {
        return [...prevSelected, row];
      } else {
        return prevSelected.filter((selectedRow) => selectedRow !== row);
      }
    });
  };

  const isSelected = (row) => selectedItems.includes(row);

  const handleClearselection = () => {
    setSelectedItems([]);
  };



  return (
    <>
      {!menuConfig ||
        !menuConfig?.tableStructure ||
        !menuConfig?.tableStructure?.columns ||
        menuConfig?.tableStructure?.columns?.length === 0 ? (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            height: '75vh'
          }}
        >
          <Typography sx={{ color: 'orange' }} variant="body1" color="initial">
            Invalid menu config or unexpected error occurred ⚠️
          </Typography>
        </Box>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', height: tableHeight, }}>
          <Grid
            container
            spacing={{ xs: 1, sm: 2 }}
            sx={{
              marginBottom: 2.5,
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: { xs: 'wrap', sm: 'nowrap' },
              flexShrink: 0
            }}
          >
            {searchItem?.length !== 0 && (
              <Grid size={{ xs: 12, sm: 6, md: 5 }}>
                <CommonTableSearchBar
                  columns={columns}
                  searchField={searchField}
                  onSearchFieldChange={handleSearchFieldChange}
                  searchTerm={searchTerm}
                  onSearchChange={handleSearchChange}
                />
              </Grid>
            )}

            <Grid
              size={{ xs: 12, sm: 6, md: 7 }}
              sx={{
                display: 'flex',
                justifyContent: { xs: 'flex-start', sm: 'flex-end' },
                alignItems: 'center',
                minWidth: { xs: '100%', sm: 'auto' }
              }}
            >
              <Grid
                container
                spacing={{ xs: 0, sm: 1.5 }}
                direction="row"
                justifyContent={{ xs: 'flex-start', sm: 'flex-end' }}
                sx={{
                  flexWrap: 'nowrap',
                  width: { xs: '100%', sm: 'auto' }
                }}
              >

                {createForm?.isCreatable && (
                  <Grid item>
                    <CreateDataButton setMode={setMode} createForm={createForm} />
                  </Grid>
                )}

                <Grid>
                  <Badge
                    color="primary"
                    badgeContent={activeFilterCount}
                    invisible={activeFilterCount === 0}
                  >
                    {filterables && filterables?.length > 0 && (
                      <Button
                        variant="outlined"
                        onClick={handleOpenFilterPopover}
                        sx={{
                          border: "none",
                          backgroundColor: theme.palette.grey[75],
                          padding: { xs: '4px 8px', sm: '6px 12px' },
                          fontSize: { xs: '0.75rem', sm: '0.875rem' },
                        }}
                      >
                        <FilterListIcon sx={{ color: activeFilterCount == 0 ? theme.palette.grey[500] : 'secondary.main', fontSize: 20 }} />
                        <Divider
                          orientation="vertical"
                          flexItem
                          sx={{
                            borderColor: theme.palette.grey[300],
                            my: 0.5,
                            mx: 1,
                          }}
                        />
                        <Box sx={{ minWidth: 60, display: "flex" }}>
                          Filter
                        </Box>
                        <IconChevronDown size={14} sx={{ color: 'secondary.main' }} />
                      </Button>
                    )}
                  </Badge>
                  {anchorElFilter && filterables && filterables?.length > 0 && (
                    <FilterPopover
                      anchorEl={anchorElFilter}
                      filters={filters}
                      columns={filteritems || columns}
                      handleClose={handleCloseFilterPopover}
                      handleFilterByChange={handleFilterByChange}
                      handleOperatorChange={handleOperatorChange}
                      handleFilterValueChange={handleFilterValueChange}
                      addNewFilter={addNewFilter}
                      removeFilter={removeFilter}
                      clearFilters={clearFilters}
                      hanldeFilterApply={hanldeFilterApply}
                      hanldeDropDownDatafetch={hanldeDropDownDatafetch}
                      filterables={filterables || []}
                    />
                  )}
                </Grid>
                <Grid
                  sx={{
                    display: sortables?.filter((col) => col.isSortable).length === 0 ? 'none' : 'block'
                  }}
                >
                  <Badge
                    color="primary"
                    badgeContent={1}
                    invisible={sortField == null}
                  >
                    <Button
                      variant="outlined"
                      onClick={handleOpenSortPopover}
                      sx={{
                        border: "none",
                        backgroundColor: theme.palette.grey[75],
                        padding: { xs: '4px 8px', sm: '6px 12px' },
                        fontSize: { xs: '0.75rem', sm: '0.875rem' },
                      }}
                    >
                      <SortIcon sx={{ color: sortField == null ? theme.palette.grey[500] : 'secondary.main', fontSize: 20 }} />
                      <Divider
                        orientation="vertical"
                        flexItem
                        sx={{
                          borderColor: theme.palette.grey[300],
                          my: 0.5,
                          mx: 1,
                        }}
                      />
                      <Box sx={{ minWidth: 60, display: "flex" }}>
                        Sort
                      </Box>
                      <IconChevronDown size={14} sx={{ color: 'secondary.main' }} />
                    </Button>
                  </Badge>
                  <Popover
                    open={Boolean(anchorElSort)}
                    anchorEl={anchorElSort}
                    onClose={handleCloseSortPopover}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                    PaperProps={{
                      sx: {
                        borderRadius: 2,
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                        mt: 1
                      }
                    }}
                  >
                    <Box
                      sx={{
                        padding: { xs: 1.5, sm: 2 },
                        minWidth: { xs: '150px', sm: '190px' },
                        maxHeight: '300px',
                        overflowY: 'auto'
                      }}
                    >
                      {sortables
                        ?.filter((col) => col.isSortable)
                        .map((column) => [
                          <MenuItem
                            key={`${column.fieldName}-asc`}
                            onClick={() => {
                              handleSortChange(column.fieldName, 'asc');
                              handleCloseSortPopover();
                            }}
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 1,
                              py: 0.75,
                              borderRadius: 1,
                              bgcolor: sortField === column.fieldName && sortOrder === 'asc' ? 'rgba(217, 217, 217, 0.5)' : 'inherit',

                            }}
                          >
                            <IconSortAscending size={18} stroke={1.5} />
                            <Typography variant="body2">{column.label} (Asc)</Typography>
                          </MenuItem>,
                          <MenuItem
                            key={`${column.fieldName}-desc`}
                            onClick={() => {
                              handleSortChange(column.fieldName, 'desc');
                              handleCloseSortPopover();
                            }}
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 1,
                              py: 0.75,
                              borderRadius: 1,
                              bgcolor: sortField === column.fieldName && sortOrder === 'desc' ? 'grey.200' : 'inherit',

                            }}
                          >
                            <IconSortDescending size={18} stroke={1.5} />
                            <Typography variant="body2">{column.label} (Desc)</Typography>
                          </MenuItem>
                        ])}
                    </Box>
                  </Popover>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <Box
            sx={{
              flex: 1,
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: `1px 2px 10px ${theme.palette.grey[100]}`,
              borderRadius: `${borderRadius + 4}px`,
              border: `1px solid ${theme.palette.grey[100]}`
            }}
          >
            <TableContainer
              id="table-container"
              ref={tableContainerRef}
              sx={{
                flex: 1,
                maxHeight: tableHeight - 80,
                overflowY: 'auto',
                overflowX: 'auto',
                backgroundColor: 'background.paper',
                '&::-webkit-scrollbar': {
                  width: '6px',
                  height: '6px'
                },
                '&::-webkit-scrollbar-track': {
                  borderRadius: '10px'
                },
                '&::-webkit-scrollbar-thumb': {
                  backgroundColor: '#cfcccc',
                  borderRadius: '10px'
                }
              }}
              component={Paper}
            >
              <Table stickyHeader sx={{ minWidth: 650 }} aria-label="dynamic table">
                <TableHead
                // sx={{
                //   position: 'sticky',
                //   whiteSpace: 'nowrap',
                //   top: 0,
                //   zIndex: 3,
                //   backgroundColor: 'background.paper',
                //   '& .MuiTableCell-head': {
                //     background: `linear-gradient(180deg, ${theme.palette.background.tableHead} 0%, ${theme.palette.background.paper} 100%)`,
                //     borderBottom: `1px solid ${theme.palette.divider}`,
                //     padding: '12px',
                //     fontWeight: 'bold'
                //   }
                // }}
                >
                  <TableRow>
                    {(role === 'admin' || role === 'Management') && isAllocation && (
                      <TableCell
                        align={'left'}
                        sx={{
                          padding: '8px',
                          maxWidth: '40px',
                          zIndex: 3,
                          backgroundColor: 'background.paper'
                        }}
                      >
                        {selectedItems.length > 0 && (
                          <Tooltip title={'clear selection'}>
                            <IconButton padding={'0px'} onClick={handleClearselection}>
                              <IconSquareOff stroke={2} />
                            </IconButton>
                          </Tooltip>
                        )}
                      </TableCell>
                    )}
                    {columns?.map((column, index) => (
                      <TableCell
                        key={index}
                        align={column.align || 'left'}
                        style={{
                          paddingLeft: 20,
                          zIndex: 3,
                          padding: "12px 16px",
                          minWidth: column.minWidth || '135px',
                          textAlign: column.type === 'cash' ? 'right' : 'left'
                        }}
                      >
                        {column.label}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {tableData?.length === 0 ? (
                    loading ? (
                      <TableRow
                        sx={{
                          '& td, & th': { border: 'none' }
                        }}
                      >
                        <TableCell colSpan={colSpan} sx={{ textAlign: 'center', padding: '15px', height: '40vh' }}>
                          <LoadingLottie />
                        </TableCell>
                      </TableRow>
                    ) : (
                      <TableRow
                        sx={{
                          '& td, & th': { border: 'none' }
                        }}
                      >
                        <TableCell colSpan={colSpan} sx={{ textAlign: 'center', padding: '15px' }}>
                          <NoDataLottie marginTop={'5%'} />
                        </TableCell>
                      </TableRow>
                    )
                  ) : (
                    <>
                      {tableData?.map((row, rowIndex) => (
                        <TableRow
                          key={row.id + rowIndex || rowIndex}
                          sx={{
                            '&:last-child td, &:last-child th': { border: 0 },
                            transition: 'all 0.05s ease',
                            '&:hover': {
                              backgroundColor: '#fff',
                              boxShadow: '0px 4px 20px rgba(26, 25, 25, 0.1), 0px -2px 10px rgba(26, 25, 25, 0.05)'
                            },
                            cursor: 'pointer',
                            height: 50, // 👈 fixed height
                            '& td, & th': {
                              paddingTop: 0,
                              paddingBottom: 0
                            }
                          }}
                        >
                          {(role === 'admin' || role === 'Management') && isAllocation && (
                            <TableCell
                              align={'left'}
                              style={{
                                maxWidth: '40px',
                                overflow: 'hidden'
                              }}
                            >
                              <FormControlLabel
                                label=""
                                control={
                                  <Checkbox checked={isSelected(row)} onChange={(event) => handleCheckClick(event, row)} color="primary" />
                                }
                              />
                            </TableCell>
                          )}
                          {columns.map((column, index) => {
                            return (
                              <TableCell
                                onClick={() => handleRowClick(row)}
                                key={index}
                                align={column.align || 'left'}
                                style={{
                                  paddingLeft: 20,
                                  paddingRight: 15,
                                  maxWidth: column.maxWidth || '150px',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  textAlign: column.type === 'cash' ? 'right' : '',
                                  whiteSpace: 'nowrap',
                                  ...(column.startEclips
                                    ? {
                                      direction: 'rtl',
                                      textAlign: 'left'
                                    }
                                    : {})
                                }}
                              >
                                <CellDataRenderer column={column} row={row} />
                              </TableCell>
                            );
                          })}
                        </TableRow>
                      ))}
                      {loading && hasMore && tableData.length > 0 && (
                        <TableRow>
                          <TableCell colSpan={colSpan} sx={{ textAlign: 'center', padding: '15px', color: 'gray' }}>
                            Loading more...
                          </TableCell>
                        </TableRow>
                      )}
                      {!hasMore && tableData.length > 0 && tableData.length >= dataCount && (
                        <TableRow>
                          <TableCell colSpan={colSpan} sx={{ textAlign: 'center', padding: '15px', opacity: 0.6 }}>
                            <Typography sx={{ fontSize: '12px' }}>You have seen it all</Typography>
                          </TableCell>
                        </TableRow>
                      )}
                    </>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
          <Grid
            px={1}
            py={1}
            // py={1}
            container
            spacing={2}
            sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
          >
            <Grid>
              <Typography variant='caption' color={'grey.700'} sx={{ opacity: 0.5 }}>
                {`Showing Data From ${dataCount} entries (${tableData.length} loaded)`}
              </Typography>
            </Grid>
            <Grid sx={{ gap: 1, display: 'flex', flexDirection: 'row' }}>
            </Grid>
            {menuConfig?.tableStructure?.downloadDocOptions && downloadDocAllowedRoles.includes(role) && (
              <Grid>
                <Button
                  onClick={() => {
                    setOpenFileExportModal(true);
                  }}
                  variant="outlined"
                  color="primary"
                >
                  <IconTableExport stroke={1} style={{ paddingRight: '4px' }} />
                  Export Data
                </Button>
              </Grid>
            )}
          </Grid>
          {drawerType === 'default' && (
            <CommonDrawer mode={mode} setMode={setMode} open={open} selectedRow={selectedRow} menuConfig={menuConfig} handleCloseDrawer={handleCloseDrawer} />
          )}
          {openFileExportModal && (
            <ExportFileModal
              open={openFileExportModal}
              setOpenDialog={setOpenFileExportModal}
              handleClose={() => setOpenFileExportModal(false)}
              menuConfig={menuConfig}
              addOnFilters={activeFilters}
            />
          )}

        </div>
      )}
    </>
  );
};

export default MenuTable;
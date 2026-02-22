import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Button,
  TextField,
  InputAdornment,
  Chip,
  Drawer,
  Stack,
  Dialog,
  Switch,
  FormControlLabel,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  TablePagination
} from '@mui/material';
import { useTheme, alpha } from '@mui/material/styles';

// Icons
import SearchIcon from '@mui/icons-material/Search';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import CategoryIcon from '@mui/icons-material/Category';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';

import NoDataLottie from 'components/NoDataLottie';
import { fetchCategories, createCategory, updateCategory, deleteCategory } from 'container/category/slice';

const DeleteConfirmationDialog = ({ open, onClose, onConfirm, categoryName }) => {
  const theme = useTheme();
  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      PaperProps={{ 
        sx: { 
          borderRadius: 5, 
          p: 1, 
          maxWidth: 400, 
          width: '100%',
          boxShadow: '0 24px 48px rgba(0,0,0,0.1)'
        } 
      }}
    >
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Box sx={{ width: 64, height: 64, borderRadius: '50%', bgcolor: alpha(theme.palette.error.main, 0.1), color: 'error.main', display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 2 }}>
          <WarningAmberIcon sx={{ fontSize: 32 }} />
        </Box>
        <Typography variant="h5" fontWeight={800} sx={{ mb: 1 }}>Delete Category?</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3, px: 2 }}>
          Are you sure you want to delete <strong>{categoryName}</strong>? This action cannot be undone.
        </Typography>
        <Stack direction="row" spacing={2}>
          <Button 
            variant="outlined" 
            fullWidth 
            onClick={onClose}
            sx={{ borderRadius: 3, py: 1.2, fontWeight: 800, textTransform: 'none', border: '1px solid #e2e8f0', color: 'text.secondary' }}
          >
            Cancel
          </Button>
          <Button 
            variant="contained" 
            color="error"
            fullWidth 
            onClick={onConfirm}
            sx={{ borderRadius: 3, py: 1.2, fontWeight: 800, textTransform: 'none', boxShadow: `0 8px 16px ${alpha(theme.palette.error.main, 0.2)}` }}
          >
            Delete
          </Button>
        </Stack>
      </Box>
    </Dialog>
  );
};

const Categories = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { categories, loading } = useSelector((state) => state.category);

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [formState, setFormState] = useState({
    name: '',
    description: '',
    parent: '',
    isActive: true
  });

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const handleEditClick = (category) => {
    setSelectedCategory(category);
    setFormState({
      name: category.name || '',
      description: category.description || '',
      parent: category.parent?._id || category.parent || '',
      isActive: category.isActive !== false
    });
    setIsDrawerOpen(true);
  };

  const handleAddNew = () => {
    setSelectedCategory(null);
    setFormState({
      name: '',
      description: '',
      parent: '',
      isActive: true
    });
    setIsDrawerOpen(true);
  };

  const handleDeleteClick = (category) => {
    setCategoryToDelete(category);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    dispatch(deleteCategory({ id: categoryToDelete._id || categoryToDelete.id }));
    setIsDeleteDialogOpen(false);
    setCategoryToDelete(null);
  };

  const handleSaveCategory = () => {
    const payload = {
      ...formState,
      parent: formState.parent === '' ? null : formState.parent
    };

    if (selectedCategory) {
      dispatch(updateCategory({ id: selectedCategory._id || selectedCategory.id, ...payload }));
    } else {
      dispatch(createCategory(payload));
    }
    setIsDrawerOpen(false);
  };

  const filteredCategories = (categories || []).filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const paginatedCategories = filteredCategories.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Box sx={{ 
      p: { xs: 2, md: 4 }, 
      height: '100vh', 
      overflowY: 'auto', 
      bgcolor: '#f8fafc',
      m: -3,
      backgroundImage: `radial-gradient(at 0% 0%, ${alpha(theme.palette.primary.main, 0.03)} 0, transparent 50%), radial-gradient(at 50% 0%, ${alpha(theme.palette.primary.main, 0.05)} 0, transparent 50%)`,
    }}>
      <DeleteConfirmationDialog 
        open={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        categoryName={categoryToDelete?.name}
      />

      {/* Toolbar */}
      <Paper 
        elevation={0} 
        sx={{ 
          p: 2, 
          mb: 4, 
          borderRadius: 4, 
          border: '1px solid rgba(255, 255, 255, 0.3)', 
          bgcolor: 'rgba(255, 255, 255, 0.7)',
          backdropFilter: 'blur(20px)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.03)',
          display: 'flex',
          gap: 2,
          flexDirection: { xs: 'column', md: 'row' },
          alignItems: { xs: 'stretch', md: 'center' },
          justifyContent: 'space-between'
        }}
      >
        <TextField 
          placeholder="Search categories..."
          size="small"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{ flex: 1, maxWidth: { md: 400 } }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="primary" />
              </InputAdornment>
            ),
            sx: { borderRadius: 3, bgcolor: 'white', border: '1px solid #f1f5f9', '& fieldset': { border: 'none' } }
          }}
        />
        
        <Button 
          variant="contained" 
          startIcon={<AddIcon />}
          onClick={handleAddNew}
          sx={{ 
            borderRadius: 3, 
            textTransform: 'none', 
            fontWeight: 800, 
            px: 3, 
            height: 40,
            boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.2)}`,
            background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${alpha(theme.palette.primary.main, 0.8)})`,
            '&:hover': { boxShadow: `0 6px 16px ${alpha(theme.palette.primary.main, 0.3)}` }
          }}
        >
          Add Category
        </Button>
      </Paper>

      {/* Table */}
      <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 4, border: '1px solid #eee' }}>
        <Table>
          <TableHead sx={{ bgcolor: '#f8fafc' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 800, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: 1 }}>Name</TableCell>
              <TableCell sx={{ fontWeight: 800, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: 1 }}>Description</TableCell>
              <TableCell sx={{ fontWeight: 800, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: 1 }}>Created Date</TableCell>
              <TableCell sx={{ fontWeight: 800, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: 1 }}>Status</TableCell>
              <TableCell align="right" sx={{ fontWeight: 800, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: 1 }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedCategories.length > 0 ? (
              paginatedCategories.map((category) => (
                <TableRow key={category._id || category.id} hover>
                  <TableCell>
                    <Stack direction="row" spacing={1.5} alignItems="center">
                      <Box sx={{ p: 1, borderRadius: 2, bgcolor: alpha(theme.palette.primary.main, 0.1), color: 'primary.main', display: 'flex' }}>
                        <CategoryIcon sx={{ fontSize: 20 }} />
                      </Box>
                      <Typography variant="body2" fontWeight={700}>{category.name}</Typography>
                    </Stack>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="text.secondary">{category.description || '-'}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="text.secondary">
                      {category.createdAt ? new Date(category.createdAt).toLocaleDateString() : '-'}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={category.isActive ? 'Active' : 'Inactive'} 
                      size="small" 
                      sx={{ 
                        fontWeight: 800, 
                        borderRadius: 2,
                        bgcolor: category.isActive ? alpha(theme.palette.success.main, 0.1) : alpha(theme.palette.error.main, 0.1),
                        color: category.isActive ? theme.palette.success.main : theme.palette.error.main
                      }} 
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Stack direction="row" spacing={1} justifyContent="flex-end">
                      <IconButton size="small" onClick={() => handleEditClick(category)} sx={{ color: 'primary.main' }}>
                        <EditOutlinedIcon sx={{ fontSize: 18 }} />
                      </IconButton>
                      <IconButton size="small" onClick={() => handleDeleteClick(category)} sx={{ color: 'error.main' }}>
                        <DeleteOutlineIcon sx={{ fontSize: 18 }} />
                      </IconButton>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 8 }}>
                  <NoDataLottie message="No categories found" />
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredCategories.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          sx={{ borderTop: '1px solid #edf2f7' }}
        />
      </TableContainer>

      {/* Drawer */}
      <Drawer anchor="right" open={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} PaperProps={{ sx: { width: { xs: '100%', sm: 500 }, p: 3 } }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h4" fontWeight={800}>{selectedCategory ? 'Edit Category' : 'Add Category'}</Typography>
          <IconButton onClick={() => setIsDrawerOpen(false)}><CloseIcon /></IconButton>
        </Box>

        <Stack spacing={3}>
          <TextField
            label="Category Name"
            fullWidth
            value={formState.name}
            onChange={(e) => setFormState({ ...formState, name: e.target.value })}
            required
          />
          
          <TextField
            label="Description"
            fullWidth
            multiline
            rows={3}
            value={formState.description}
            onChange={(e) => setFormState({ ...formState, description: e.target.value })}
          />

          <FormControl fullWidth>
            <InputLabel>Parent Category</InputLabel>
            <Select
              value={formState.parent}
              onChange={(e) => setFormState({ ...formState, parent: e.target.value })}
              label="Parent Category"
            >
              <MenuItem value="">None</MenuItem>
              {(categories || []).map(cat => (
                <MenuItem key={cat._id || cat.id} value={cat._id || cat.id}>{cat.name}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControlLabel
            control={
              <Switch 
                checked={formState.isActive} 
                onChange={(e) => setFormState({ ...formState, isActive: e.target.checked })}
              />
            }
            label="Active"
          />

          <Button 
            variant="contained" 
            fullWidth 
            onClick={handleSaveCategory}
            disabled={!formState.name}
            sx={{ borderRadius: 2, height: 48, fontWeight: 700, textTransform: 'none', mt: 'auto' }}
          >
            {selectedCategory ? 'Update Category' : 'Create Category'}
          </Button>
        </Stack>
      </Drawer>
    </Box>
  );
};

export default Categories;

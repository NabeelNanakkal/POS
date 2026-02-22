import { Container, Typography, Button, Box } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

const ErrorFallback = () => {
    return (
        <Container
            maxWidth="sm"
            sx={{
                height: '80vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}
        >
            <Box textAlign="center">
                <ErrorOutlineIcon sx={{ fontSize: 50, mb: 2, color: 'main' }} />
                <Typography variant="h4" component="h2" gutterBottom>
                    Oops! Something went wrong.
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>
                    An unexpected error has occurred. Please try reloading the page.
                </Typography>
                <Typography color="text.secondary" sx={{ mb: 3 ,fontSize: 12}}>
                    For more details, open the browser console (F12 or right-click → Inspect → Console).
                </Typography>
                {/* <Button
                    variant="link"
                    color="primary"
                    size="large"
                    onClick={() => window.location.reload()}
                    sx={{ textTransform: 'none' }}
                >
                    Reload Page
                </Button> */}
            </Box>
        </Container>
    );
};

export default ErrorFallback;

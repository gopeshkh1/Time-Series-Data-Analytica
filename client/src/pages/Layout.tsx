import { Outlet } from "react-router-dom";
import {
  Box,
  Container,
  CssBaseline,
  AppBar,
  Toolbar,
  Typography,
} from "@mui/material";

const Layout = () => {
  return (
    <>
      <CssBaseline />
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Time Series Data Analytica
          </Typography>
        </Toolbar>
      </AppBar>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box
          sx={{ display: "flex", flexDirection: "column", minHeight: "80vh" }}
        >
          <Outlet />
        </Box>
      </Container>
    </>
  );
};

export default Layout;

import { Box, createTheme, ThemeProvider } from "@mui/material";
import SiteBar from "./SiteBar";

const theme = createTheme({
  typography: {
    fontFamily: [
      "Roboto",
      '"Noto Sans SC"',
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      '"Helvetica Neue"',
      "Arial",
      "sans-serif",
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(","),
  },
});

const Layout = (props: { children: React.ReactNode }) => {
  const { children } = props;
  return (
    <ThemeProvider theme={theme}>
      <Box>
        <SiteBar />
        {children}
      </Box>
    </ThemeProvider>
  );
};

export default Layout;

import { Box } from "@mui/material";
import SiteBar from "./SiteBar";

const Layout = (props: any) => {
  const { children } = props;
  return (
    <Box>
      <SiteBar />
      {children}
    </Box>
  );
};

export default Layout;

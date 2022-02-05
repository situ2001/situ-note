import { AppBar, Toolbar, Typography, Box } from "@mui/material";
import Link from "next/link";
import React from "react";

const SiteBar = () => {
  return (
    <React.Fragment>
      <AppBar
        elevation={0}
        position="sticky"
        sx={{
          backdropFilter: "saturate(180%) blur(20px)",
          background: "hsla(0, 0%, 100%, .72)",
          color: "black",
          borderColor: "rgb(231, 235, 240)",
          borderWidth: "0px 0px thin",
        }}
      >
        <Toolbar>
          <Box sx={{ flexGrow: "1" }}>
            <Typography component="div" variant="h5" sx={{ ml: 2 }}>
              <Link href="/">Situ Note</Link>
            </Typography>
          </Box>
          <Box>
            <Typography component="div" variant="h6" sx={{ mr: 2 }}>
              <Link href="/posts/">BLOG</Link>
            </Typography>
          </Box>
        </Toolbar>
      </AppBar>
    </React.Fragment>
  );
};

export default SiteBar;

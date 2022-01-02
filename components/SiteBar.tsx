import { AppBar, Toolbar, Typography } from "@mui/material";
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
          <Typography component="div" variant="h6">
            <Link href="/">Situ Note</Link>
          </Typography>
        </Toolbar>
      </AppBar>
    </React.Fragment>
  );
};

export default SiteBar;

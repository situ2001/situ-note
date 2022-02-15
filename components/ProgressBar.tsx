import styled from "@emotion/styled";
import { Fade, LinearProgress } from "@mui/material";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

const Progress = styled(LinearProgress)`
  z-index: 10000;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
`;

const ProgressBar = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleRouterChangeBegin = (
    url: string,
    { shallow }: { shallow: boolean }
  ) => {
    // console.log("Change start", url, shallow);
    setLoading(true);
  };

  const handleRouterChangeEnd = (
    url: string,
    { shallow }: { shallow: boolean }
  ) => {
    if (!shallow) {
      // console.log("Change complete", url, shallow);
      setLoading(false);
    }
  };

  useEffect(() => {
    router.events.on("routeChangeStart", handleRouterChangeBegin);
    router.events.on("routeChangeComplete", handleRouterChangeEnd);
    router.events.on("routeChangeError", handleRouterChangeEnd);

    return () => {
      router.events.off("routeChangeStart", handleRouterChangeBegin);
      router.events.off("routeChangeComplete", handleRouterChangeEnd);
      router.events.off("routeChangeError", handleRouterChangeEnd);
    };
  }, [router.events]);

  return (
    <React.Fragment>
      <Fade in={loading}>
        <Progress />
      </Fade>
    </React.Fragment>
  );
};

export default ProgressBar;

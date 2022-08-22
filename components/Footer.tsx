import moment from "moment";
import React, { useEffect, useMemo } from "react";

const Footer = () => {
  const duration = useMemo(
    () =>
      moment
        .duration(moment(Date.now()).diff(moment("2020-09-12")))
        .asDays()
        .toFixed(),
    []
  );

  return (
    <footer>
      <div className="flex flex-col justify-center items-center my-4 opacity-50">
        <div>
          Made by&nbsp;<a href="https://github.com/situ2001">situ2001</a>
        </div>
        <div>Running for {duration} days</div>
      </div>
    </footer>
  );
};

export default Footer;

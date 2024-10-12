import React from "react";

interface CardProps {
  fullHeight?: boolean;
}

const Card = (props: CardProps & { children?: any }) => {
  return (
    <div
      style={{
        height: props.fullHeight ? "100%" : "auto",
      }}
      className="bg-white dark:bg-gray-700 rounded-xl shadow-lg p-4 transition-transform mb-4"
    >
      {props.children}
    </div>
  );
};

export default Card;

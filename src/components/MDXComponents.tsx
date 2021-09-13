/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable react/prop-types */
/* eslint-disable react/destructuring-assignment */
import React from 'react';
import styled from 'styled-components';

type MyHeadingComponentProps = {
  children: JSX.Element[] | JSX.Element;
};

const H2 = (props: MyHeadingComponentProps) => {
  const { children } = props;
  return (
    <h2
      id={children.toString()}
      className="text-2xl mt-8 font-semibold"
      {...props}
    >
      {children}
    </h2>
  );
};

const H3 = (props: MyHeadingComponentProps) => {
  const { children } = props;
  return (
    <h3
      id={children.toString()}
      className="text-lg mt-6 font-medium"
      {...props}
    >
      {children}
    </h3>
  );
};

const H4 = (props: MyHeadingComponentProps) => {
  const { children } = props;
  return (
    <h4 id={children.toString()} {...props}>
      {children}
    </h4>
  );
};

const Text = (props: MyHeadingComponentProps) => {
  const { children } = props;
  return <p className="my-4">{children}</p>;
};

const OrderedList = (props: MyHeadingComponentProps) => {
  const { children } = props;
  return <ol className="list-decimal list-inside my-4">{children}</ol>;
};

const UnorderedList = (props: MyHeadingComponentProps) => {
  const { children } = props;
  return <ul className="list-disc list-inside my-4">{children}</ul>;
};

const StyledBlockquote = styled.div`
  border-left: 4px solid #ddd;
  padding: 0 16px;
  margin: 0;
`;

const Blockquote = (props: any) => <StyledBlockquote {...props} />;

// const Img = (props: any) => {
//   console.log(props);
//   return (
//     <figure>
//       <a href={props.src}>
//         <img {...props} className="m-auto max-w-full" />
//       </a>
//       <figcaption className="text-center font-bold">{props.alt}</figcaption>
//     </figure>
//   );
// };

// const StyledImg = styled.img`
//   display: block;
//   margin-left: auto;
//   margin-right: auto;
//   max-width: 100%;
//   margin-bottom: 20px;
// `;

// const StyledCaption = styled.p`
//   margin-top: -20px;
//   text-align: center;
//   margin-left: auto;
//   margin-right: auto;
//   margin-bottom: 10px;
//   font-size: 0.875em;
//   font-weight: bold;
// `;

// const MyImg = (props) => (
//   <>
//     <StyledImg alt="" {...props} />
//     {props.src && props.src.indexOf(0) === '/' && props.alt && (
//       <StyledCaption>{props.alt}</StyledCaption>
//     )}
//   </>
// );

const components = {
  h2: H2,
  h3: H3,
  h4: H4,
  blockquote: Blockquote,
  p: Text,
  ol: OrderedList,
  ul: UnorderedList,
  // img: Img,
  // img: MyImg,
};

export default components;

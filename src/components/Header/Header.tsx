import React, { Dispatch, SetStateAction } from 'react';
import { Link } from 'gatsby';
import styled from 'styled-components';

type Props = {
  setOpen: Dispatch<SetStateAction<boolean>>;
};

const Header = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 90%;
  align-self: center;
  justify-content: space-between;
`;

const SiteTitle = styled(Link)`
  font-size: x-large;
  text-decoration: none;
  color: black;
`;

const NavList = styled.ul`
  display: flex;
  list-style: none;
  padding: 0;
`;

const MenuButton = styled.button`
  background: transparent;
  border: none;
  cursor: pointer;
`;

const HorizontalStripe = styled.div`
  width: 24px;
  height: 2.4px;
  background-color: black;
  margin: 6px;
`;

const MyHeader = (props: Props) => {
  const { setOpen } = props;

  return (
    <Header>
      <p>
        <SiteTitle to="/">Situ Note</SiteTitle>
      </p>
      <nav>
        <NavList>
          <li>
            <MenuButton type="button" onClick={() => setOpen(true)}>
              <HorizontalStripe />
              <HorizontalStripe />
              <HorizontalStripe />
            </MenuButton>
          </li>
        </NavList>
      </nav>
    </Header>
  );
};

export default MyHeader;

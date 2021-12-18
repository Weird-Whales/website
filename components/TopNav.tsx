import Link from 'next/link';
import React from 'react';
import styled from 'styled-components';
import { computeRandomWhaleID } from '../utils/compute-random-whale-id';
import { routes } from '../utils/routes';

const Header = styled.header`
  width: 100%;
  height: 70px;
  border-bottom: 1px solid #eaeaea;
  display: flex;
  justify-content: center;
  align-items: center;
`;
export const TopNav = () => {
  return (
    <Header>
      <Link href={'/'}>
        <a>
          <span style={{ margin: '30px' }}>Home</span>
        </a>
      </Link>
      <Link href={`${routes.internal.whale}${computeRandomWhaleID()}`}>
        <a>
          <span style={{ margin: '10px' }}>Random Whale</span>
        </a>
      </Link>
      <Link href={routes.internal.provenance}>
        <a>
          <span style={{ margin: '30px' }}>Provenance</span>
        </a>
      </Link>
    </Header>
  );
};

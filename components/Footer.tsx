import React from 'react';
import { FaDiscord, FaGithub, FaTwitter } from 'react-icons/fa';
import styled from 'styled-components';
import { routes } from '../utils/routes';

const _Footer = styled.footer`
  width: 100%;
  height: 70px;
  border-top: 1px solid #eaeaea;
  display: flex;
  justify-content: center;
  align-items: center;
`;
export const Footer = () => {
  return (
    <_Footer>
      <a
        href={routes.external.WWTwitter}
        target="_blank"
        rel="noopener noreferrer"
      >
        <span style={{ margin: '10px' }}>
          <FaTwitter size={'1.6em'} />
        </span>
      </a>
      <a
        href={routes.external.WWDiscord}
        target="_blank"
        rel="noopener noreferrer"
      >
        <span style={{ margin: '10px' }}>
          <FaDiscord size={'1.6em'} />
        </span>
      </a>
      <a
        href={routes.external.WWGithub}
        target="_blank"
        rel="noopener noreferrer"
      >
        <span style={{ margin: '10px' }}>
          <FaGithub size={'1.6em'} />
        </span>
      </a>
    </_Footer>
  );
};

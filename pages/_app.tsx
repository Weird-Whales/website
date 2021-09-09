import type { AppProps } from 'next/app';
import React from 'react';
import { createGlobalStyle } from 'styled-components';
import { Footer } from '../components/Footer';
import { SEO } from '../components/SEO';
import { TopNav } from '../components/TopNav';
import '../styles/globals.css';

const GlobalStyle = createGlobalStyle`
html,
body {
  padding: 0;
  margin: 0;
  width: 100%;
  font-family: 'Karla', sans-serif;
  color: rgb(51,51,51);
  overflow-x: hidden;
}
main {
  padding: 5rem 0;
   /* footer and header are each 70px tall */
  min-height: calc(100vh - 140px);
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-size: 20px;
}
h1 {
  font-size: 46px;
}
h2 {
  font-size: 40px;
}
h3 {
  font-size: 32px;
}
h4 {
  font-size: 26px;
}
`;

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <SEO />
      <TopNav />
      <GlobalStyle />
      <Component {...pageProps} />
      <Footer />
    </>
  );
}
export default MyApp;

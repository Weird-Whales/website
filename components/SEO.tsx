import Head from 'next/head';
import React from 'react';

export const DEFAULT_TITLE = 'Weird Whales';
export const DEFAULT_DESCRIPTION =
  "Generative art, 3,350 Whale NFT's on the Ethereum blockchain.";
export const DEFAULT_IMAGE =
  'https://lh3.googleusercontent.com/Y_V9UCc9DK8IUUE_nxHxWVsfukUhVkXgwJDw0D87chRLttypJu6fNmA8PCYvdXRXB7R9cL-WZjG3GtXh2ut8oCPo3qxEespfs4hGQhY=s1000';

type SEOProps = { title?: string; description?: string; image?: string };
export const SEO = (props: SEOProps) => {
  const title = props.title || DEFAULT_TITLE;
  const description = props.description || DEFAULT_DESCRIPTION;
  const image = props.image || DEFAULT_IMAGE;

  return (
    <Head>
      <title>{title}</title>
      <meta charSet="utf-8" />
      <meta name="og:title" key="og:title" content={title} />
      <meta name="twitter:site" key="twitter:site" content={'WeirdWhales'} />
      <meta name="twitter:title" key="twitter:title" content={title} />
      <meta name="description" key="description" content={description} />
      <meta name="og:description" key="og:description" content={description} />
      {/* favicon */}
      <link rel="icon" href="/favicon.ico" />
      <meta
        name="twitter:description"
        key="twitter:description"
        content={description}
      />
      <meta name="twitter:image" key="twitter:image" content={image} />
      <meta
        name="twitter:card"
        key="twitter:card"
        content="summary_large_image"
      />
      <meta name="og:image" key="og:image" content={image} />
    </Head>
  );
};

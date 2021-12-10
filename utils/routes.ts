const githubImages = 'https://github.com/Weird-Whales/images';
export const routes = {
  internal: {
    whale: '/whale/',
  },
  external: {
    rawImageRoot600px: `${githubImages}/raw/main/optimized-images/600x600/`,
    githubImages,
    openSeaWWHome: 'https://opensea.io/collection/weirdwhales',
    openSeaWhaleBasePath:
      'https://opensea.io/assets/0x96ed81c7f4406eff359e27bff6325dc3c9e042bd/',
    WWTwitter: 'https://twitter.com/WeirdWhales',
    WWDiscord: 'https://discord.com/invite/gpSU5AVjju',
  },
} as const;

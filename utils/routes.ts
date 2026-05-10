const githubImages = 'https://github.com/Weird-Whales/images';
// Hit raw.githubusercontent.com directly rather than github.com/.../raw/...
// The latter is just a redirect to the former, and it occasionally 502s on
// individual files (e.g. #3115 was returning 502 for hours).
const rawCdn =
  'https://raw.githubusercontent.com/Weird-Whales/images/main';
export const routes = {
  internal: {
    whale: '/whale/',
    provenance: '/provenance/',
  },
  external: {
    rawImageRoot600px: `${rawCdn}/optimized-images/600x600/`,
    githubImages,
    openSeaWWHome: 'https://opensea.io/collection/weirdwhales',
    openSeaWhaleBasePath:
      'https://opensea.io/assets/0x96ed81c7f4406eff359e27bff6325dc3c9e042bd/',
    WWTwitter: 'https://twitter.com/WeirdWhales',
    WWDiscord: 'https://discord.gg/UJ348eqzsj',
    WWGithub: 'https://github.com/Weird-Whales',
    Etherscan:
      'https://etherscan.io/address/0x96Ed81c7F4406Eff359E27BfF6325DC3c9e042BD',
    IPFSImage:
      'https://ipfs.io/ipfs/QmaQQvX5KsaDwHgnzXebQKCvYA6fWfmMHiKtQF8nPC1Npm/',
  },
} as const;

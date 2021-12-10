import axios from 'axios';
import { weiToEther } from 'essential-eth';
import { useRouter } from 'next/dist/client/router';
import React, { useEffect } from 'react';
import { SEO } from '../../components/SEO';
import { Container, FlexRow, Section } from '../../components/shared';
import { WhaleImage } from '../../components/WhaleImage';
import allTraits from '../../utils/all-traits.json';
import { routes } from '../../utils/routes';
import { traitFrequency } from '../../utils/trait-frequency';

// displays a whale's property (attribute)
const WhaleProperty: React.FunctionComponent<{ title: string; value: string }> =
  ({ title, value }) => {
    return (
      <div
        style={{
          margin: '10px',
          padding: '10px',
          border: '2px solid purple',
          borderRadius: '6px',
        }}
      >
        <div>
          <b>{title}</b>
        </div>
        <div>{value.replace('_', ' ')}</div>
      </div>
    );
  };

const Details = () => {
  const router = useRouter();
  const whaleID = router.query['whale-id'];

  const [lastSalePrice, setLastSalePrice] = React.useState('');
  const [currentOwner, setCurrentOwner] = React.useState('');
  useEffect(() => {
    if (router.isReady) {
      axios(`/api/last-sale/${whaleID}`).then((res: any) => {
        const assetData = res.data as AssetInfoResponse;
        let lastSale = 'no sale';
        if (assetData.last_sale?.total_price) {
          lastSale = `${weiToEther(assetData.last_sale?.total_price)} ETH`;
          setLastSalePrice(lastSale);
          setCurrentOwner(assetData.owner.address);
        }
      });
    }
  }, [router.isReady, whaleID]);
  if (typeof whaleID === 'undefined') {
    return null;
  }
  const whaleTraits = allTraits[Number(whaleID)];
  return (
    <>
      <SEO
        title={`Weird Whale #${whaleID}`}
        description={`Whale #${whaleID} is one of ${traitFrequency.Base[
          whaleTraits.Base as keyof typeof traitFrequency.Base
        ].toLocaleString()} ${whaleTraits.Base} whales`}
        image={`${routes.external.rawImageRoot600px}${whaleID}.png?raw=true`}
      />
      <main>
        <Section>
          <Container>
            <WhaleImage whaleID={Number(whaleID)} size={300} />
            <h1>Weird Whale {whaleID}</h1>
            <h2>Market Stats</h2>
            <p>Last sale for {lastSalePrice}</p>
            <p>
              Current owner is{' '}
              <a
                href={`https://opensea.io/${currentOwner}`}
                target="_blank"
                rel="noreferrer"
              >
                <code style={{ fontSize: '18px' }}>{currentOwner}</code>
              </a>
            </p>
            <h4>
              One of{' '}
              <u>
                {traitFrequency.Base[
                  whaleTraits.Base as keyof typeof traitFrequency.Base
                ].toLocaleString()}
              </u>{' '}
              {whaleTraits.Base} whales
            </h4>
            <h3>Properties</h3>
            <FlexRow>
              <WhaleProperty
                title={'Background'}
                value={whaleTraits.Background}
              />
              <WhaleProperty
                title={'Eye Accessory'}
                value={whaleTraits['Eye Accessory']}
              />
              <WhaleProperty title={'Headgear'} value={whaleTraits.Headgear} />
              <WhaleProperty
                title={'Mouth Accessory'}
                value={whaleTraits['Mouth Accessory']}
              />
              <WhaleProperty title={'Base'} value={whaleTraits.Base} />
            </FlexRow>
            <a
              href={`${routes.external.openSeaWhaleBasePath}${whaleID}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              🌊 View on OpenSea{' '}
            </a>
          </Container>
        </Section>
      </main>
    </>
  );
};
export default Details;

export type AssetInfoResponse = {
  id: 158831;
  token_id: '1';
  num_sales: 3;
  background_color: null;
  image_url: 'https://lh3.googleusercontent.com/7bRocEaoBrWYBX3vThkHj4kAV3b3mKG-Kem85xeT-D8oHpvQ19kcoiBd9mIFeNU0GrwZGvj6Oc5NAEGBSsGlrww';
  image_preview_url: 'https://lh3.googleusercontent.com/7bRocEaoBrWYBX3vThkHj4kAV3b3mKG-Kem85xeT-D8oHpvQ19kcoiBd9mIFeNU0GrwZGvj6Oc5NAEGBSsGlrww=s250';
  image_thumbnail_url: 'https://lh3.googleusercontent.com/7bRocEaoBrWYBX3vThkHj4kAV3b3mKG-Kem85xeT-D8oHpvQ19kcoiBd9mIFeNU0GrwZGvj6Oc5NAEGBSsGlrww=s128';
  image_original_url: 'https://www.larvalabs.com/cryptopunks/cryptopunk1.png';
  animation_url: null;
  animation_original_url: null;
  name: 'CryptoPunk #1';
  description: null;
  external_link: 'https://www.larvalabs.com/cryptopunks/details/1';
  asset_contract: {
    address: '0xb47e3cd837ddf8e4c57f05d70ab865de6e193bbb';
    asset_contract_type: 'non-fungible';
    created_date: '2018-01-23T04:51:38.832339';
    name: 'CryptoPunks';
    nft_version: 'unsupported';
    opensea_version: null;
    owner: null;
    schema_name: 'CRYPTOPUNKS';
    symbol: 'PUNK';
    total_supply: null;
    description: 'CryptoPunks launched as a fixed set of 10,000 items in mid-2017 and became one of the inspirations for the ERC-721 standard. They have been featured in places like The New York Times, Christie’s of London, Art|Basel Miami, and The PBS NewsHour.';
    external_link: 'https://www.larvalabs.com/cryptopunks';
    image_url: 'https://lh3.googleusercontent.com/BdxvLseXcfl57BiuQcQYdJ64v-aI8din7WPk0Pgo3qQFhAUH-B6i-dCqqc_mCkRIzULmwzwecnohLhrcH8A9mpWIZqA7ygc52Sr81hE=s120';
    default_to_fiat: false;
    dev_buyer_fee_basis_points: 0;
    dev_seller_fee_basis_points: 0;
    only_proxied_transfers: false;
    opensea_buyer_fee_basis_points: 0;
    opensea_seller_fee_basis_points: 250;
    buyer_fee_basis_points: 0;
    seller_fee_basis_points: 250;
    payout_address: null;
  };
  permalink: 'https://opensea.io/assets/0xb47e3cd837ddf8e4c57f05d70ab865de6e193bbb/1';
  collection: {
    payment_tokens: [
      {
        id: 4645681;
        symbol: 'WETH';
        address: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2';
        image_url: 'https://storage.opensea.io/files/accae6b6fb3888cbff27a013729c22dc.svg';
        name: 'Wrapped Ether';
        decimals: 18;
        eth_price: 1;
        usd_price: 4328.54;
      },
      {
        id: 13689077;
        symbol: 'ETH';
        address: '0x0000000000000000000000000000000000000000';
        image_url: 'https://storage.opensea.io/files/6f8e2979d428180222796ff4a33ab929.svg';
        name: 'Ether';
        decimals: 18;
        eth_price: 1;
        usd_price: 4324.66;
      },
      {
        id: 12182941;
        symbol: 'DAI';
        address: '0x6b175474e89094c44da98b954eedeac495271d0f';
        image_url: 'https://storage.opensea.io/files/8ef8fb3fe707f693e57cdbfea130c24c.svg';
        name: 'Dai Stablecoin';
        decimals: 18;
        eth_price: 0.00023252;
        usd_price: 0.999165;
      },
      {
        id: 4403908;
        symbol: 'USDC';
        address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48';
        image_url: 'https://storage.opensea.io/files/749015f009a66abcb3bbb3502ae2f1ce.svg';
        name: 'USD Coin';
        decimals: 6;
        eth_price: 0.00023239;
        usd_price: 0.999553;
      },
    ];
    primary_asset_contracts: [
      {
        address: '0xb47e3cd837ddf8e4c57f05d70ab865de6e193bbb';
        asset_contract_type: 'non-fungible';
        created_date: '2018-01-23T04:51:38.832339';
        name: 'CryptoPunks';
        nft_version: 'unsupported';
        opensea_version: null;
        owner: null;
        schema_name: 'CRYPTOPUNKS';
        symbol: 'PUNK';
        total_supply: null;
        description: 'CryptoPunks launched as a fixed set of 10,000 items in mid-2017 and became one of the inspirations for the ERC-721 standard. They have been featured in places like The New York Times, Christie’s of London, Art|Basel Miami, and The PBS NewsHour.';
        external_link: 'https://www.larvalabs.com/cryptopunks';
        image_url: 'https://lh3.googleusercontent.com/BdxvLseXcfl57BiuQcQYdJ64v-aI8din7WPk0Pgo3qQFhAUH-B6i-dCqqc_mCkRIzULmwzwecnohLhrcH8A9mpWIZqA7ygc52Sr81hE=s120';
        default_to_fiat: false;
        dev_buyer_fee_basis_points: 0;
        dev_seller_fee_basis_points: 0;
        only_proxied_transfers: false;
        opensea_buyer_fee_basis_points: 0;
        opensea_seller_fee_basis_points: 250;
        buyer_fee_basis_points: 0;
        seller_fee_basis_points: 250;
        payout_address: null;
      },
    ];
    traits: {};
    stats: {
      one_day_volume: 621.21;
      one_day_change: -0.7978226908806874;
      one_day_sales: 7;
      one_day_average_price: 88.76124999999999;
      seven_day_volume: 10894.16;
      seven_day_change: 1.6295335193015883;
      seven_day_sales: 130;
      seven_day_average_price: 83.8485496183206;
      thirty_day_volume: 35361.52100000001;
      thirty_day_change: -0.7750331706560141;
      thirty_day_sales: 359;
      thirty_day_average_price: 98.22644722222225;
      total_volume: 738957.8912493123;
      total_sales: 18005;
      total_supply: 9999;
      count: 9999;
      num_owners: 3258;
      average_price: 41.041815676162344;
      num_reports: 5;
      market_cap: 838401.6476335878;
      floor_price: 0;
    };
    banner_image_url: 'https://lh3.googleusercontent.com/48oVuDyfe_xhs24BC2TTVcaYCX7rrU5mpuQLyTgRDbKHj2PtzKZsQ5qC3xTH4ar34wwAXxEKH8uUDPAGffbg7boeGYqX6op5vBDcbA=s2500';
    chat_url: null;
    created_date: '2019-04-26T22:13:09.691572';
    default_to_fiat: false;
    description: 'CryptoPunks launched as a fixed set of 10,000 items in mid-2017 and became one of the inspirations for the ERC-721 standard. They have been featured in places like The New York Times, Christie’s of London, Art|Basel Miami, and The PBS NewsHour.';
    dev_buyer_fee_basis_points: '0';
    dev_seller_fee_basis_points: '0';
    discord_url: 'https://discord.gg/tQp4pSE';
    display_data: {
      card_display_style: 'cover';
    };
    external_url: 'https://www.larvalabs.com/cryptopunks';
    featured: false;
    featured_image_url: 'https://storage.opensea.io/0xb47e3cd837ddf8e4c57f05d70ab865de6e193bbb-featured-1556589448.png';
    hidden: false;
    safelist_request_status: 'verified';
    image_url: 'https://lh3.googleusercontent.com/BdxvLseXcfl57BiuQcQYdJ64v-aI8din7WPk0Pgo3qQFhAUH-B6i-dCqqc_mCkRIzULmwzwecnohLhrcH8A9mpWIZqA7ygc52Sr81hE=s120';
    is_subject_to_whitelist: false;
    large_image_url: 'https://lh3.googleusercontent.com/QB2kKuQEw04X02V9EoC2BNYZV652LYuewUv9ZdR7KJfI9Jocwmd28jIfsGg0umSCr2bOMV8O9UpLAkoaqfYwvwmC';
    medium_username: null;
    name: 'CryptoPunks';
    only_proxied_transfers: false;
    opensea_buyer_fee_basis_points: '0';
    opensea_seller_fee_basis_points: '250';
    payout_address: null;
    require_email: false;
    short_description: null;
    slug: 'cryptopunks';
    telegram_url: null;
    twitter_username: 'larvalabs';
    instagram_username: null;
    wiki_url: null;
  };
  decimals: null;
  token_metadata: '';
  owner: {
    user: null;
    profile_img_url: 'https://storage.googleapis.com/opensea-static/opensea-profile/32.png';
    address: '0xb88f61e6fbda83fbfffabe364112137480398018';
    config: '';
  };
  sell_orders: null;
  creator: {
    user: null;
    profile_img_url: 'https://storage.googleapis.com/opensea-static/opensea-profile/22.png';
    address: '0xc352b534e8b987e036a93539fd6897f53488e56a';
    config: '';
  };
  traits: [
    {
      trait_type: 'type';
      value: 'Male';
      display_type: null;
      max_value: null;
      trait_count: 6039;
      order: null;
    },
    {
      trait_type: 'accessory';
      value: 'Mohawk';
      display_type: null;
      max_value: null;
      trait_count: 441;
      order: null;
    },
    {
      trait_type: 'accessory';
      value: 'Smile';
      display_type: null;
      max_value: null;
      trait_count: 238;
      order: null;
    },
    {
      trait_type: 'accessory';
      value: '2 attributes';
      display_type: null;
      max_value: null;
      trait_count: 448;
      order: null;
    },
  ];
  last_sale: null | {
    asset: {
      token_id: '1';
      decimals: null;
    };
    asset_bundle: null;
    event_type: 'successful';
    event_timestamp: '2020-11-30T18:44:26';
    auction_type: null;
    total_price: '60000000000000000000';
    payment_token: {
      id: 1;
      symbol: 'ETH';
      address: '0x0000000000000000000000000000000000000000';
      image_url: 'https://storage.opensea.io/files/6f8e2979d428180222796ff4a33ab929.svg';
      name: 'Ether';
      decimals: 18;
      eth_price: '1.000000000000000';
      usd_price: '4324.659999999999854000';
    };
    transaction: {
      block_hash: '0xe3eacbc6f4d6bb43525b69baffe09477f452f0f5e1a5b1d5232dc23b6cb176cb';
      block_number: '11361817';
      from_account: {
        user: {
          username: 'GoWestBTC';
        };
        profile_img_url: 'https://storage.googleapis.com/opensea-static/opensea-profile/4.png';
        address: '0xee3766e4f996dc0e0f8c929954eaafef3441de87';
        config: '';
      };
      id: 63641091;
      timestamp: '2020-11-30T18:44:26';
      to_account: {
        user: null;
        profile_img_url: 'https://storage.googleapis.com/opensea-static/opensea-profile/23.png';
        address: '0xb47e3cd837ddf8e4c57f05d70ab865de6e193bbb';
        config: '';
      };
      transaction_hash: '0xf4af5563f3c4c3b26dee3ab027902f113bee5985b28d9ede5b81ab42b46abb30';
      transaction_index: '58';
    };
    created_date: '2020-11-30T18:45:11.476313';
    quantity: '1';
  };
  top_bid: null;
  listing_date: null;
  is_presale: false;
  transfer_fee_payment_token: null;
  transfer_fee: null;
  related_assets: [];
  orders: [];
  auctions: [];
  supports_wyvern: false;
  top_ownerships: [
    {
      owner: {
        user: null;
        profile_img_url: 'https://storage.googleapis.com/opensea-static/opensea-profile/32.png';
        address: '0xb88f61e6fbda83fbfffabe364112137480398018';
        config: '';
      };
      quantity: '1';
    },
  ];
  ownership: null;
  highest_buyer_commitment: null;
};

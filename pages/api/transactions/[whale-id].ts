import axios, { AxiosRequestConfig } from 'axios';
import type { NextApiRequest, NextApiResponse } from 'next';
import { AssetInfoResponse } from './../../whale/[whale-id]';

type Data = {
  name: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>,
) {
  const whaleID = req.query['whale-id'];

  const config: AxiosRequestConfig = {
    method: 'GET',
    url: 'https://api.opensea.io/api/v1/events',
    headers: {
      'X-API-KEY': `${process.env.NEXT_PUBLIC_API_KEY_OPENSEA}`,
    },
    params: {
      asset_contract_address: '0x96Ed81c7F4406Eff359E27BfF6325DC3c9e042BD',
      token_id: whaleID,
      event_type: 'successful',
      only_opensea: 'false',
      offset: '0',
      limit: '20',
    },
  };
  const assetInfo = await axios(config).then(
    (res) => res.data as AssetInfoResponse,
  );
  res.status(200).json(assetInfo);
}

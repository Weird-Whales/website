import axios from 'axios';
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
  const assetInfo = await axios(
    `https://api.opensea.io/api/v1/asset/0x96ed81c7f4406eff359e27bff6325dc3c9e042bd/${whaleID}/`,
  ).then((res) => res.data as AssetInfoResponse);

  res.status(200).json(assetInfo);
}

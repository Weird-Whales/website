import imageData from '../image-hashes.json';
import * as Constants from '../utils/provenance';
import { routes } from '../utils/routes';

const Provenance = () => {
  return (
    <div>
      <h1>PROVENANCE RECORD</h1>
      <div>
        <h1>Contract Details</h1>
        <h6>
          Contract |{' '}
          <a
            href={`${routes.external.Etherscan}`}
            target="_blank"
            rel="noreferrer"
          >
            0x96Ed81c7F4406Eff359E27BfF6325DC3c9e042BD
          </a>
        </h6>
        <h6>Final Proof Hash | {Constants.PROVENANCE_HASH_FINAL}</h6>
      </div>
      <div>
        <h1>
          Concatenated Hash String
          <div>
            <textarea
              style={{ backgroundColor: 'transparent', fontSize: '10px' }}
              rows="10"
              cols="100"
              value={Constants.PROVENANCE_HASH}
              disabled
            />
          </div>
        </h1>
      </div>
      <div>
        <h1>Whale Record</h1>
        <table>
          <thead>
            <tr>
              <th>WHALE ID</th>
              <th>OPENSEA</th>
              <th>RAW IMAGE</th>
              <th>SHA-256 HASH</th>
              <th>IPFS IMAGE</th>
            </tr>
          </thead>
          <tbody>
            {imageData
              .sort((a, b) => a.tokenId - b.tokenId)
              .map((x, i) => (
                <tr key={x.tokenId}>
                  <td>{x.tokenId}</td>
                  <td>
                    <a
                      href={`${Constants.OPENSEA_ASSET_BASE}${x.tokenId}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      VIEW OPENSEA
                    </a>
                  </td>
                  <td>
                    <a
                      href={`${Constants.IMAGE_BASE_600X600}${x.tokenId}.png?raw=true`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      VIEW IMAGE
                    </a>
                  </td>
                  <td>{x.hash}</td>
                  <td>
                    <a
                      href={`${routes.external.IPFSImage}${x.tokenId}.png`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      VIEW IMAGE
                    </a>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Provenance;

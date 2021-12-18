import imageData from '../image-hashes.json';
import styles from '../styles/Provenance.module.css';
import * as Constants from '../utils/provenance';
import { routes } from '../utils/routes';

const Provenance = () => {
  return (
    <div className={styles.container}>
      <h1 style={{ textTransform: 'uppercase' }}>Provenance Record</h1>
      <div>
        <h1 className={styles.contractDetails}>Contract Details</h1>
        <h6 className={styles.contract}>
          Contract |{' '}
          <a
            href={`${routes.external.Etherscan}`}
            className="siteLink"
            target="_blank"
            rel="noreferrer"
          >
            0x96Ed81c7F4406Eff359E27BfF6325DC3c9e042BD
          </a>
        </h6>
        <h6 className={styles.finalProofHash}>
          Final Proof Hash | {Constants.PROVENANCE_HASH_FINAL}
        </h6>
      </div>
      <div>
        <h1 className={styles.concatenatedHashString}>
          Concatenated Hash String
          <div className={styles.concatenatedHashContainer}>
            <textarea
              style={{ backgroundColor: 'transparent', fontSize: '10px' }}
              rows={10}
              cols={175}
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
              <th>ID</th>
              <th style={{ textTransform: 'uppercase' }}>Opensea</th>
              <th style={{ textTransform: 'uppercase' }}>Image</th>
              <th style={{ textTransform: 'uppercase' }}>SHA-256 Hash</th>
              <th>IPFS</th>
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
                      className="siteLink"
                      rel="noreferrer"
                      style={{ textTransform: 'uppercase' }}
                    >
                      View
                    </a>
                  </td>
                  <td>
                    <a
                      href={`${Constants.IMAGE_BASE_600X600}${x.tokenId}.png?raw=true`}
                      target="_blank"
                      className="siteLink"
                      rel="noreferrer"
                      style={{ textTransform: 'uppercase' }}
                    >
                      View
                    </a>
                  </td>
                  <td>{x.hash}</td>
                  <td>
                    <a
                      href={`${routes.external.IPFSImage}${x.tokenId}.png`}
                      target="_blank"
                      className="siteLink"
                      rel="noreferrer"
                      style={{ textTransform: 'uppercase' }}
                    >
                      View
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

import styles from '../styles/TransactionHistory.module.css';

export const TransactionHistory: React.FunctionComponent<{ whaleID: number }> =
  ({ whaleID }) => {
    return (
      <>
        <h2>Transaction History {whaleID}</h2>

        <table className={styles.transactionTable}>
          <tr>
            <th>Type</th>
            <th>From</th>
            <th>To</th>
            <th>Amount</th>
            <th>Txn</th>
          </tr>
          <tr className={styles.bid}>
            <td>Bid</td>
            <td>
              <a href="https://etherscan.io/address/0x8a502e0e3eda70eae505a6fa0fa49eb29b85fe5b">
                0x8a502e
              </a>
            </td>
            <td></td>
            <td>0.13Ξ ($443)</td>
            <td>Aug 31, 2021</td>
          </tr>
          <tr className={styles.sold}>
            <td>Sold</td>
            <td>
              <a href="https://etherscan.io/address/0x8a502e0e3eda70eae505a6fa0fa49eb29b85fe5b">
                0x8a502e
              </a>
            </td>
            <td>
              <a href="https://etherscan.io/address/0x8a502e0e3eda70eae505a6fa0fa49eb29b85fe5b">
                0x8a502e
              </a>
            </td>
            <td>0.13Ξ ($443)</td>
            <td>Aug 31, 2021</td>
          </tr>
          <tr className={styles.offered}>
            <td>Offered</td>
            <td></td>
            <td></td>
            <td>0.13Ξ ($443)</td>
            <td>Aug 31, 2021</td>
          </tr>
          <tr className={styles.mint}>
            <td>Minted</td>
            <td></td>
            <td>
              <a href="https://etherscan.io/address/0x8a502e0e3eda70eae505a6fa0fa49eb29b85fe5b">
                0x8a502e
              </a>
            </td>
            <td></td>
            <td>Aug 31, 2021</td>
          </tr>
        </table>
      </>
    );
  };

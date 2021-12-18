import axios from 'axios';
import React, { useEffect } from 'react';
import styles from '../styles/TransactionHistory.module.css';

export const TransactionHistory: React.FunctionComponent<{ whaleID: string }> =
  ({ whaleID }) => {
    useEffect(() => {
      const url = `/api/transactions/${whaleID}`;
      const requestSuccessful = axios.get(`${url}/successful`);
      const requestOfferEntered = axios.get(`${url}/offer_entered`);
      const requestCreated = axios.get(`${url}/created`);
      const requestBidEntered = axios.get(`${url}/bid_entered`);

      axios
        .all([
          requestSuccessful,
          requestOfferEntered,
          requestCreated,
          requestBidEntered,
        ])
        .then(
          axios.spread((...responses) => {
            const responseSuccessful = responses[0];
            const responseOfferEntered = responses[1];
            const responseCreated = responses[2];
            const responseBidEntered = responses[3];

            console.log('responseSuccessful', responseSuccessful);
            console.log('responseOfferEntered', responseOfferEntered);
            console.log('responseCreated', responseCreated);
            console.log('responseBidEntered', responseBidEntered);
          }),
        );
    }, []);

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

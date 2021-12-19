import axios from 'axios';
import { weiToEther } from 'essential-eth';
import React, { useEffect } from 'react';
import styles from '../styles/TransactionHistory.module.css';

type txnType = 'Sold' | 'Offer' | 'Transfer' | 'Bid' | 'Bid Withdrawn';

interface Transaction {
  type: txnType;
  from: string;
  to: string | null;
  amount: string | null;
  txnDate: Date;
  txnID: string | null;
}

const getPrice = (priceWei: string): string => {
  return `${weiToEther(priceWei)}Ξ`;
};

const getSold = (data: any): Transaction[] => {
  const txns = new Array<Transaction>();

  data.forEach((v) => {
    txns.push({
      type: 'Sold',
      from: v.seller.address,
      to: v.winner_account.address,
      amount: getPrice(v.total_price),
      txnDate: new Date(v.transaction.timestamp),
      txnID: v.transaction.transaction_hash,
    } as Transaction);
  });
  return txns;
};

const getOffers = (data: any): Transaction[] => {
  const txns = new Array<Transaction>();

  data.forEach((v) => {
    txns.push({
      type: 'Offer',
      from: v.from_account.address,
      to: null,
      amount: getPrice(v.bid_amount),
      txnDate: new Date(v.created_date),
      txnID: null,
    } as Transaction);
  });
  return txns;
};

const getTransfers = (data: any): Transaction[] => {
  const txns = new Array<Transaction>();

  data.forEach((v) => {
    txns.push({
      type: 'Transfer',
      from: v.from_account.address,
      to: v.to_account.address,
      amount: null,
      txnDate: new Date(v.transaction.timestamp),
      txnID: v.transaction.block_hash,
    } as Transaction);
  });
  return txns;
};

const getBidsEntered = (data: any): Transaction[] => {
  const txns = new Array<Transaction>();

  data.forEach((v) => {
    txns.push({
      type: 'Bid',
      from: v.from_account.address,
      to: null,
      amount: getPrice(v.bid_amount),
      txnDate: new Date(v.created_date),
      txnID: null,
    } as Transaction);
  });
  return txns;
};

const getBidsWithdrawn = (data: any): Transaction[] => {
  const txns = new Array<Transaction>();

  data.forEach((v) => {
    txns.push({
      type: 'Bid Withdrawn',
      from: v.from_account.address,
      to: null,
      amount: getPrice(v.total_price),
      txnDate: new Date(v.created_date),
      txnID: v.transaction.block_hash,
    } as Transaction);
  });
  return txns;
};

export const TransactionHistory: React.FunctionComponent<{ whaleID: string }> =
  ({ whaleID }) => {
    useEffect(() => {
      const url = `/api/transactions/${whaleID}`;
      const requestSuccessful = axios.get(`${url}/successful`);
      const requestOfferEntered = axios.get(`${url}/offer_entered`);
      const requestTransfer = axios.get(`${url}/transfer`);
      const requestBidEntered = axios.get(`${url}/bid_entered`);
      const requestBidsWithdrawn = axios.get(`${url}/bid_withdrawn`);

      axios
        .all([
          requestSuccessful,
          requestOfferEntered,
          requestTransfer,
          requestBidEntered,
          requestBidsWithdrawn,
        ])
        .then(
          axios.spread((...responses) => {
            const responseSuccessful = responses[0];
            const responseOfferEntered = responses[1];
            const responseTransferred = responses[2];
            const responseBidEntered = responses[3];
            const requestBidsWithdrawn = responses[4];

            let txns = new Array<Transaction>();

            const sold = getSold(responseSuccessful['data']['asset_events']);

            const offers = getOffers(
              responseOfferEntered['data']['asset_events'],
            );

            const transfers = getTransfers(
              responseTransferred['data']['asset_events'],
            );

            const bids = getBidsEntered(
              responseBidEntered['data']['asset_events'],
            );

            const bidsWithdrawn = getBidsWithdrawn(
              requestBidsWithdrawn['data']['asset_events'],
            );

            txns = [...sold, ...offers, ...transfers, ...bids, ...bidsWithdrawn];
            
            console.log(txns)
          }),
        );
    }, []);

    return (
      <>
        <h2>Transaction History {whaleID}</h2>

        <table className={styles.transactionTable}>
          <tbody>
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
          </tbody>
        </table>
      </>
    );
  };

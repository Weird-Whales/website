import axios from 'axios';
import { format } from 'date-fns';
import { weiToEther } from 'essential-eth';
import Link from 'next/link';
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
  return `${weiToEther(priceWei).toNumber().toFixed(3)}Ξ`;
};

const burnAddress = '0x0000000000000000000000000000000000000000';

const getSold = (data: any): Transaction[] => {
  const txns = new Array<Transaction>();

  data.forEach((v: any) => {
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

  data.forEach((v: any) => {
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

  data.forEach((v: any) => {
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

  data.forEach((v: any) => {
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

  data.forEach((v: any) => {
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
    const [txns, setTxns] = React.useState(new Array<Transaction>());

    const [isBusy, setIsBusy] = React.useState(true);

    useEffect(() => {
      setIsBusy(true);
      
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

            txns = [
              ...sold,
              ...offers,
              ...transfers,
              ...bids,
              ...bidsWithdrawn,
            ];
            setTxns(txns);
            setIsBusy(false);
          }),
        );
    }, [whaleID]);

    return (
      <>
        {!isBusy && (
          <>
            <h2>Transaction History</h2>

            <table className={styles.transactionTable}>
              <thead>
                <tr>
                  <th className={styles.tableCell}>Type</th>
                  <th className={styles.tableCell}>From</th>
                  <th className={styles.tableCell}>To</th>
                  <th className={styles.tableCell}>Amount</th>
                  <th className={styles.tableCell}>Txn</th>
                </tr>
              </thead>
              <tbody>
                {txns
                  .sort((a, b) => b.txnDate.valueOf() - a.txnDate.valueOf())
                  .map((item, i) => {
                    return [
                      <tr key={i} className={item.type}>
                        <td className={styles.tableCell}>
                          {item.from === burnAddress ? 'Minted' : item.type}
                        </td>
                        <td className={styles.tableCell}>
                          {item.from !== burnAddress ? (
                            <Link
                              href={`https://etherscan.io/address/${item.from}`}
                            >
                              <a className={styles.transactionLink}>
                                {item.from.substring(0, 8)}
                              </a>
                            </Link>
                          ) : (
                            ''
                          )}
                        </td>
                        <td className={styles.tableCell}>
                          {item.to ? (
                            <Link
                              href={`https://etherscan.io/address/${item.to}`}
                            >
                              <a className={styles.transactionLink}>
                                {item.to.substring(0, 8)}
                              </a>
                            </Link>
                          ) : (
                            ''
                          )}
                        </td>
                        <td className={styles.tableCell}>{item.amount}</td>
                        <td className={styles.tableCell}>
                          {item.txnID ? (
                            <Link
                              href={`https://etherscan.io/tx/${item.txnID}`}
                            >
                              <a className={styles.transactionLink}>
                                {format(item.txnDate, 'MMM dd, yyyy')}
                              </a>
                            </Link>
                          ) : (
                            <span>{format(item.txnDate, 'MMM dd, yyyy')}</span>
                          )}
                        </td>
                      </tr>,
                    ];
                  })}
              </tbody>
            </table>
          </>
        )}
      </>
    );
  };

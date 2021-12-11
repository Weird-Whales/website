import type { GetStaticProps, NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { default as React } from 'react';
import { Container, FlexRow, Section } from '../components/shared';
import { WhaleImage } from '../components/WhaleImage';
import verifiedBadge from '../public/images/verified-badge.svg';
import styles from '../styles/Home.module.css';
import allTraits from '../utils/all-traits.json';
import { computeRandomWhaleID } from '../utils/compute-random-whale-id';
import { routes } from '../utils/routes';

type ServerHydratedProps = {
  randomWhaleIDs: number[];
};

const Home: NextPage<ServerHydratedProps> = ({ randomWhaleIDs }) => {
  return (
    <div>
      <Head>
        <title>Weird Whales</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <Section>
          <Container>
            <h1 className={styles.title}>Weird Whales</h1>

            <p className={styles.description}>
              Weird Whales is a collection of <b>3,350 NFTs</b> - unique digital
              collectibles, swimming on the Ethereum Blockchain.
            </p>

            <FlexRow>
              <WhaleImage whaleID={randomWhaleIDs[0]} size={250} isAnchor />
              <WhaleImage whaleID={randomWhaleIDs[1]} size={250} isAnchor />
              <WhaleImage whaleID={randomWhaleIDs[2]} size={250} isAnchor />
            </FlexRow>
          </Container>
        </Section>
        <Section>
          <Container>
            <div className={styles.grid}>
              <Link
                href={`${routes.internal.whale}${Math.floor(
                  Math.random() * 3550,
                )}`}
              >
                <a className={styles.card}>
                  <h2>View whale information &rarr;</h2>
                  <p>Learn about rarity and attributes from a random whale</p>
                </a>
              </Link>

              <a href={routes.external.githubImages} className={styles.card}>
                <h2>Images &rarr;</h2>
                <p>View and download the source images</p>
              </a>

              <a
                href={routes.external.openSeaWWHome}
                className={styles.card}
                target="_blank"
                rel="noopener noreferrer"
              >
                <h2
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <span
                    style={{
                      marginRight: '10px',
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    <Image
                      src={verifiedBadge}
                      width={26}
                      height={26}
                      alt="verified"
                    />
                  </span>
                  OpenSea &rarr;
                </h2>
                <p>See the floor price and recent sales.</p>
              </a>
            </div>
          </Container>
        </Section>
        <Section>
          <Container>
            <h2>Whale Types</h2>
            <table>
              <tr>
                <th>Type</th>
                <th>Number</th>
              </tr>
              <tr>
                <td>
                  <a
                    href="https://opensea.io/collection/weirdwhales?search[sortAscending]=true&search[sortBy]=PRICE&search[stringTraits][0][name]=Base&search[stringTraits][0][values][0]=Alien"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Alien
                  </a>
                </td>
                <td>
                  {allTraits.filter((traits) => traits.Base === 'Alien').length}
                </td>
              </tr>
              <tr>
                <td>
                  <a
                    href="https://opensea.io/collection/weirdwhales?search[sortAscending]=true&search[sortBy]=PRICE&search[stringTraits][0][name]=Base&search[stringTraits][0][values][0]=Ape"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Ape
                  </a>
                </td>
                <td>
                  {allTraits.filter((traits) => traits.Base === 'Ape').length}
                </td>
              </tr>

              <tr>
                <td>
                  <a
                    href="https://opensea.io/collection/weirdwhales?search[sortAscending]=true&search[sortBy]=PRICE&search[stringTraits][0][name]=Base&search[stringTraits][0][values][0]=Zombie"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Zombie
                  </a>
                </td>
                <td>
                  {
                    allTraits.filter((traits) => traits.Base === 'Zombie')
                      .length
                  }
                </td>
              </tr>
              <tr>
                <td>
                  <a
                    href="https://opensea.io/collection/weirdwhales?search[sortAscending]=true&search[sortBy]=PRICE&search[stringTraits][0][name]=Base&search[stringTraits][0][values][0]=Normal"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Normal
                  </a>
                </td>
                <td>
                  {
                    allTraits.filter((traits) => traits.Base === 'Normal')
                      .length
                  }
                </td>
              </tr>
            </table>
          </Container>
        </Section>
      </main>
    </div>
  );
};

export default Home;

export const getStaticProps: GetStaticProps<ServerHydratedProps> = async () => {
  const randomWhaleIDs = Array.from({ length: 3 }, computeRandomWhaleID);
  return {
    props: {
      randomWhaleIDs,
    },
    revalidate: 60 * 60 /* New whales every hour */,
  };
};

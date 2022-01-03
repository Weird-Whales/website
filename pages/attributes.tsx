import Image from 'next/image';
import styles from '../styles/Attributes.module.css';
import { routes } from '../utils/routes';

const WhaleImage: React.FunctionComponent<{ whaleID: number; type: string }> =
  ({ whaleID, type }) => {
    return (
      <>
        <a target="_blank" href={`${routes.internal.whale}/${whaleID}`}>
          <Image
            src={`/images/${type}/${whaleID}.png`}
            width="50px"
            height="50px"
            title={`Whale #${whaleID}`}
          ></Image>
        </a>
      </>
    );
  };

const Attributes = () => {
  return (
    <>
      <h1 className={styles.title}>Types and Attributes</h1>
      <h3 className={styles.whaleTypes}>Whale Types</h3>
      <table className={styles.table}>
        <tr>
          <th className={styles.columName}>Attribute</th>
          <th className={styles.columName}>#</th>
          <th className={styles.columName}>Avg Sale</th>
          <th className={styles.columName}>Cheapest</th>
          <th className={styles.columName}>More Examples</th>
        </tr>
        <tr>
          <td className={styles.attribute}>Alien</td>
          <td className={styles.columnElement}>262</td>
          <td className={styles.columnElement}>-</td>
          <td className={styles.columnElement}>-</td>
          <td>
            <WhaleImage whaleID={1594} type="aliens" />
            <WhaleImage whaleID={578} type="aliens" />
            <WhaleImage whaleID={2878} type="aliens" />
            <WhaleImage whaleID={3063} type="aliens" />
            <WhaleImage whaleID={1813} type="aliens" />
            <WhaleImage whaleID={3318} type="aliens" />
            <WhaleImage whaleID={183} type="aliens" />
            <WhaleImage whaleID={1108} type="aliens" />
          </td>
        </tr>
        <tr>
          <td className={styles.attribute}>Ape</td>
          <td className={styles.columnElement}>508</td>
          <td className={styles.columnElement}>-</td>
          <td className={styles.columnElement}>-</td>
          <td>
            <WhaleImage whaleID={1170} type="apes" />
            <WhaleImage whaleID={2730} type="apes" />
            <WhaleImage whaleID={589} type="apes" />
            <WhaleImage whaleID={220} type="apes" />
            <WhaleImage whaleID={1871} type="apes" />
            <WhaleImage whaleID={2276} type="apes" />
            <WhaleImage whaleID={3041} type="apes" />
            <WhaleImage whaleID={406} type="apes" />
          </td>
        </tr>

        <tr>
          <td className={styles.attribute}>Zombie</td>
          <td className={styles.columnElement}>1040</td>
          <td className={styles.columnElement}>-</td>
          <td className={styles.columnElement}>-</td>
          <td>
            <WhaleImage whaleID={189} type="zombies" />
            <WhaleImage whaleID={320} type="zombies" />
            <WhaleImage whaleID={364} type="zombies" />
            <WhaleImage whaleID={3268} type="zombies" />
            <WhaleImage whaleID={1465} type="zombies" />
            <WhaleImage whaleID={2185} type="zombies" />
            <WhaleImage whaleID={687} type="zombies" />
            <WhaleImage whaleID={34} type="zombies" />
          </td>
        </tr>
        <tr>
          <td className={styles.attribute}>Normal</td>
          <td className={styles.columnElement}>1540</td>
          <td className={styles.columnElement}>-</td>
          <td className={styles.columnElement}>-</td>
          <td>
            <Image
              src="/images/normals/72.png"
              width="50px"
              height="50px"
            ></Image>
            <Image
              src="/images/normals/666.png"
              width="50px"
              height="50px"
            ></Image>
            <Image
              src="/images/normals/855.png"
              width="50px"
              height="50px"
            ></Image>
            <Image
              src="/images/normals/1306.png"
              width="50px"
              height="50px"
            ></Image>
            <Image
              src="/images/normals/2111.png"
              width="50px"
              height="50px"
            ></Image>
            <Image
              src="/images/normals/2282.png"
              width="50px"
              height="50px"
            ></Image>
            <Image
              src="/images/normals/2474.png"
              width="50px"
              height="50px"
            ></Image>
            <Image
              src="/images/normals/2634.png"
              width="50px"
              height="50px"
            ></Image>
          </td>
        </tr>
      </table>

      <h3 className={styles.whaleTypes}>Attributes</h3>
      <table className={styles.table}>
        <tr>
          <th className={styles.columName}>Attribute</th>
          <th className={styles.columName}>#</th>
          <th className={styles.columName}>Avg Sale</th>
          <th className={styles.columName}>Cheapest</th>
          <th className={styles.columName}>More Examples</th>
        </tr>
        <tr>
          <td className={styles.attribute}>Police Cap</td>
          <td className={styles.columnElement}>53</td>
          <td className={styles.columnElement}>-</td>
          <td className={styles.columnElement}>-</td>
          <td>-</td>
        </tr>
        <tr>
          <td className={styles.attribute}>Fez</td>
          <td className={styles.columnElement}>163</td>
          <td className={styles.columnElement}>-</td>
          <td className={styles.columnElement}>-</td>
          <td>-</td>
        </tr>

        <tr>
          <td className={styles.attribute}>Do Rag</td>
          <td className={styles.columnElement}>175</td>
          <td className={styles.columnElement}>-</td>
          <td className={styles.columnElement}>-</td>
          <td>-</td>
        </tr>
        <tr>
          <td className={styles.attribute}>Cowboy Hat</td>
          <td className={styles.columnElement}>175</td>
          <td className={styles.columnElement}>-</td>
          <td className={styles.columnElement}>-</td>
          <td>-</td>
        </tr>
        <tr>
          <td className={styles.attribute}>Knitted Cap</td>
          <td className={styles.columnElement}>181</td>
          <td className={styles.columnElement}>-</td>
          <td className={styles.columnElement}>-</td>
          <td>-</td>
        </tr>
        <tr>
          <td className={styles.attribute}>Tiara</td>
          <td className={styles.columnElement}>182</td>
          <td className={styles.columnElement}>-</td>
          <td className={styles.columnElement}>-</td>
          <td>-</td>
        </tr>
        <tr>
          <td className={styles.attribute}>Cap</td>
          <td className={styles.columnElement}>184</td>
          <td className={styles.columnElement}>-</td>
          <td className={styles.columnElement}>-</td>
          <td>-</td>
        </tr>
        <tr>
          <td className={styles.attribute}>Top Hat</td>
          <td className={styles.columnElement}>186</td>
          <td className={styles.columnElement}>-</td>
          <td className={styles.columnElement}>-</td>
          <td>-</td>
        </tr>
        <tr>
          <td className={styles.attribute}>Hat</td>
          <td className={styles.columnElement}>186</td>
          <td className={styles.columnElement}>-</td>
          <td className={styles.columnElement}>-</td>
          <td>-</td>
        </tr>
        <tr>
          <td className={styles.attribute}>Pilot Helmet</td>
          <td className={styles.columnElement}>187</td>
          <td className={styles.columnElement}>-</td>
          <td className={styles.columnElement}>-</td>
          <td>-</td>
        </tr>
        <tr>
          <td className={styles.attribute}>Headband</td>
          <td className={styles.columnElement}>189</td>
          <td className={styles.columnElement}>-</td>
          <td className={styles.columnElement}>-</td>
          <td>-</td>
        </tr>
        <tr>
          <td className={styles.attribute}>Cap Forward</td>
          <td className={styles.columnElement}>191</td>
          <td className={styles.columnElement}>-</td>
          <td className={styles.columnElement}>-</td>
          <td>-</td>
        </tr>
        <tr>
          <td className={styles.attribute}>Fedora</td>
          <td className={styles.columnElement}>271</td>
          <td className={styles.columnElement}>-</td>
          <td className={styles.columnElement}>-</td>
          <td>-</td>
        </tr>
        <tr>
          <td className={styles.attribute}>Tassle Hat</td>
          <td className={styles.columnElement}>275</td>
          <td className={styles.columnElement}>-</td>
          <td className={styles.columnElement}>-</td>
          <td>-</td>
        </tr>
        <tr>
          <td className={styles.attribute}>Beanie</td>
          <td className={styles.columnElement}>278</td>
          <td className={styles.columnElement}>-</td>
          <td className={styles.columnElement}>-</td>
          <td>-</td>
        </tr>
        <tr>
          <td className={styles.attribute}>Clown Eyes Green</td>
          <td className={styles.columnElement}>286</td>
          <td className={styles.columnElement}>-</td>
          <td className={styles.columnElement}>-</td>
          <td>-</td>
        </tr>
        <tr>
          <td className={styles.attribute}>Viking Hat</td>
          <td className={styles.columnElement}>314</td>
          <td className={styles.columnElement}>-</td>
          <td className={styles.columnElement}>-</td>
          <td>-</td>
        </tr>
        <tr>
          <td className={styles.attribute}>Clown Eyes Blue</td>
          <td className={styles.columnElement}>380</td>
          <td className={styles.columnElement}>-</td>
          <td className={styles.columnElement}>-</td>
          <td>-</td>
        </tr>
        <tr>
          <td className={styles.attribute}>Vape</td>
          <td className={styles.columnElement}>469</td>
          <td className={styles.columnElement}>-</td>
          <td className={styles.columnElement}>-</td>
          <td>-</td>
        </tr>
        <tr>
          <td className={styles.attribute}>Blue Eye Shadow</td>
          <td className={styles.columnElement}>486</td>
          <td className={styles.columnElement}>-</td>
          <td className={styles.columnElement}>-</td>
          <td>-</td>
        </tr>
        <tr>
          <td className={styles.attribute}>Pipe</td>
          <td className={styles.columnElement}>497</td>
          <td className={styles.columnElement}>-</td>
          <td className={styles.columnElement}>-</td>
          <td>-</td>
        </tr>
        <tr>
          <td className={styles.attribute}>Purple Eye Shadow</td>
          <td className={styles.columnElement}>508</td>
          <td className={styles.columnElement}>-</td>
          <td className={styles.columnElement}>-</td>
          <td>-</td>
        </tr>
        <tr>
          <td className={styles.attribute}>Cigarette</td>
          <td className={styles.columnElement}>518</td>
          <td className={styles.columnElement}>-</td>
          <td className={styles.columnElement}>-</td>
          <td>-</td>
        </tr>
        <tr>
          <td className={styles.attribute}>Eye Mask</td>
          <td className={styles.columnElement}>520</td>
          <td className={styles.columnElement}>-</td>
          <td className={styles.columnElement}>-</td>
          <td>-</td>
        </tr>
        <tr>
          <td className={styles.attribute}>Green Eye Shadow</td>
          <td className={styles.columnElement}>555</td>
          <td className={styles.columnElement}>-</td>
          <td className={styles.columnElement}>-</td>
          <td>-</td>
        </tr>
      </table>
    </>
  );
};

export default Attributes;

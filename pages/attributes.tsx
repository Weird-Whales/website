import styles from '../styles/Attributes.module.css';
import Image from 'next/image';
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
          <td>262</td>
          <td>-</td>
          <td>-</td>
          <td>
            <Image src="/images/aliens/1594.png" width="50px" height="50px"></Image>
            <Image src="/images/aliens/578.png" width="50px" height="50px"></Image>
            <Image src="/images/aliens/2878.png" width="50px" height="50px"></Image>
            <Image src="/images/aliens/3063.png" width="50px" height="50px"></Image>
            <Image src="/images/aliens/1813.png" width="50px" height="50px"></Image>
            <Image src="/images/aliens/3318.png" width="50px" height="50px"></Image>
            <Image src="/images/aliens/183.png" width="50px" height="50px"></Image>
            <Image src="/images/aliens/1108.png" width="50px" height="50px"></Image>
          </td>
        </tr>
        <tr>
          <td className={styles.attribute}>Ape</td>
          <td>508</td>
          <td>-</td>
          <td>-</td>
          <td>
            <Image src="/images/apes/1170.png" width="50px" height="50px"></Image>
            <Image src="/images/apes/2730.png" width="50px" height="50px"></Image>
            <Image src="/images/apes/589.png" width="50px" height="50px"></Image>
            <Image src="/images/apes/220.png" width="50px" height="50px"></Image>
            <Image src="/images/apes/1871.png" width="50px" height="50px"></Image>
            <Image src="/images/apes/2276.png" width="50px" height="50px"></Image>
            <Image src="/images/apes/3041.png" width="50px" height="50px"></Image>            
            <Image src="/images/apes/406.png" width="50px" height="50px"></Image>
          </td>
        </tr>

        <tr>
          <td className={styles.attribute}>Zombie</td>
          <td>1040</td>
          <td>-</td>
          <td>-</td>
          <td>
            <Image src="/images/zombies/189.png" width="50px" height="50px"></Image>
            <Image src="/images/zombies/320.png" width="50px" height="50px"></Image>
            <Image src="/images/zombies/364.png" width="50px" height="50px"></Image>
            <Image src="/images/zombies/3268.png" width="50px" height="50px"></Image>
            <Image src="/images/zombies/1465.png" width="50px" height="50px"></Image>
            <Image src="/images/zombies/2185.png" width="50px" height="50px"></Image>
            <Image src="/images/zombies/687.png" width="50px" height="50px"></Image>            
            <Image src="/images/zombies/34.png" width="50px" height="50px"></Image>
          </td>
        </tr>
        <tr>
          <td className={styles.attribute}>Normal</td>
          <td>1540</td>
          <td>-</td>
          <td>-</td>
          <td>
            <Image src="/images/normals/72.png" width="50px" height="50px"></Image>
            <Image src="/images/normals/666.png" width="50px" height="50px"></Image>
            <Image src="/images/normals/855.png" width="50px" height="50px"></Image>
            <Image src="/images/normals/1306.png" width="50px" height="50px"></Image>
            <Image src="/images/normals/2111.png" width="50px" height="50px"></Image>
            <Image src="/images/normals/2282.png" width="50px" height="50px"></Image>
            <Image src="/images/normals/2474.png" width="50px" height="50px"></Image>            
            <Image src="/images/normals/2634.png" width="50px" height="50px"></Image>
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
          <td>262</td>
          <td>-</td>
          <td>-</td>
          <td>-</td>
        </tr>
        <tr>
          <td className={styles.attribute}>Fez</td>
          <td>508</td>
          <td>-</td>
          <td>-</td>
          <td>-</td>
        </tr>

        <tr>
          <td className={styles.attribute}>Do Rag</td>
          <td>1040</td>
          <td>-</td>
          <td>-</td>
          <td>-</td>
        </tr>
        <tr>
          <td className={styles.attribute}>Cowboy Hat</td>
          <td>1540</td>
          <td>-</td>
          <td>-</td>
          <td>-</td>
        </tr>
        <tr>
          <td className={styles.attribute}>Knitted Cap</td>
          <td>1540</td>
          <td>-</td>
          <td>-</td>
          <td>-</td>
        </tr>
        <tr>
          <td className={styles.attribute}>Tiara</td>
          <td>1540</td>
          <td>-</td>
          <td>-</td>
          <td>-</td>
        </tr>
        <tr>
          <td className={styles.attribute}>Cap</td>
          <td>1540</td>
          <td>-</td>
          <td>-</td>
          <td>-</td>
        </tr>
        <tr>
          <td className={styles.attribute}>Top Hat</td>
          <td>1540</td>
          <td>-</td>
          <td>-</td>
          <td>-</td>
        </tr>
        <tr>
          <td className={styles.attribute}>Hat</td>
          <td>1540</td>
          <td>-</td>
          <td>-</td>
          <td>-</td>
        </tr>
        <tr>
          <td className={styles.attribute}>Pilot Helmet</td>
          <td>1540</td>
          <td>-</td>
          <td>-</td>
          <td>-</td>
        </tr>
        <tr>
          <td className={styles.attribute}>Headband</td>
          <td>1540</td>
          <td>-</td>
          <td>-</td>
          <td>-</td>
        </tr>
        <tr>
          <td className={styles.attribute}>Cap Forward</td>
          <td>1540</td>
          <td>-</td>
          <td>-</td>
          <td>-</td>
        </tr>
        <tr>
          <td className={styles.attribute}>Fedore</td>
          <td>1540</td>
          <td>-</td>
          <td>-</td>
          <td>-</td>
        </tr>
        <tr>
          <td className={styles.attribute}>Tassle Hat</td>
          <td>1540</td>
          <td>-</td>
          <td>-</td>
          <td>-</td>
        </tr>
        <tr>
          <td className={styles.attribute}>Beanie</td>
          <td>1540</td>
          <td>-</td>
          <td>-</td>
          <td>-</td>
        </tr>
        <tr>
          <td className={styles.attribute}>Clown Eyes Green</td>
          <td>1540</td>
          <td>-</td>
          <td>-</td>
          <td>-</td>
        </tr>
        <tr>
          <td className={styles.attribute}>Viking Hat</td>
          <td>1540</td>
          <td>-</td>
          <td>-</td>
          <td>-</td>
        </tr>
        <tr>
          <td className={styles.attribute}>Clown Eyes Blue</td>
          <td>1540</td>
          <td>-</td>
          <td>-</td>
          <td>-</td>
        </tr>
        <tr>
          <td className={styles.attribute}>Vape</td>
          <td>1540</td>
          <td>-</td>
          <td>-</td>
          <td>-</td>
        </tr>
        <tr>
          <td className={styles.attribute}>Blue Eye Shadow</td>
          <td>1540</td>
          <td>-</td>
          <td>-</td>
          <td>-</td>
        </tr>
        <tr>
          <td className={styles.attribute}>Pipe</td>
          <td>1540</td>
          <td>-</td>
          <td>-</td>
          <td>-</td>
        </tr>
        <tr>
          <td className={styles.attribute}>Purple Eye Shadow</td>
          <td>1540</td>
          <td>-</td>
          <td>-</td>
          <td>-</td>
        </tr>
        <tr>
          <td className={styles.attribute}>Cigarette</td>
          <td>1540</td>
          <td>-</td>
          <td>-</td>
          <td>-</td>
        </tr>
        <tr>
          <td className={styles.attribute}>Eye Mask</td>
          <td>1540</td>
          <td>-</td>
          <td>-</td>
          <td>-</td>
        </tr>
        <tr>
          <td className={styles.attribute}>Green Eye Shadow</td>
          <td>1540</td>
          <td>-</td>
          <td>-</td>
          <td>-</td>
        </tr>
      </table>
    </>
  );
};

export default Attributes;

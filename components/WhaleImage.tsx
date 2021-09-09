import Link from 'next/link';
import React from 'react';
import { routes } from '../utils/routes';
import { RoundedImage } from './shared';

/**
 * @params whaleID - Integer between 0 and 3349 inclusive
 * @params size - Width and height of whale image in pixels
 */
export const WhaleImage: React.FunctionComponent<{
  whaleID: number;
  size: number;
  isAnchor?: boolean /* should this link to it's details page */;
}> = ({ whaleID, size = 300, isAnchor }) => {
  const ImageWithContainer = (
    <span style={{ width: size, height: size }}>
      <RoundedImage
        src={`${routes.external.rawImageRoot600px}${whaleID}.png?raw=true`}
        alt={`whale number ${whaleID}`}
        width={size}
        height={size}
      />
    </span>
  );
  if (isAnchor) {
    return (
      <Link href={`${routes.internal.whale}${whaleID}`}>
        <a>{ImageWithContainer}</a>
      </Link>
    );
  }
  return ImageWithContainer;
};

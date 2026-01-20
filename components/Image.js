/* eslint-disable @next/next/no-img-element */
/* eslint-disable jsx-a11y/alt-text */

const Image = ({ src, alt, ...props }) => {
  return <img src={src} alt={alt || ''} {...props} />
}

export default Image

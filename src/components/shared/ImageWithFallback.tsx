import { useState } from "react";

interface Props extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackSrc: string;
}

const ImageWithFallback = ({ src, fallbackSrc, alt, ...props }: Props) => {
  const [imgSrc, setImgSrc] = useState(src);

  return (
    <img
      {...props}
      src={imgSrc}
      onError={() => setImgSrc(fallbackSrc)}
      alt={alt}
    />
  );
};

export default ImageWithFallback;

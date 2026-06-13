import { useState } from 'react';

interface Props {
  src?: string;
  alt: string;
  className?: string;
}

const FALLBACK = '/products/placeholder.svg';

export default function ProductImage({ src, alt, className }: Props) {
  const [errored, setErrored] = useState(false);
  return (
    <img
      src={errored || !src ? FALLBACK : src}
      alt={alt}
      loading="lazy"
      onError={() => setErrored(true)}
      className={className}
    />
  );
}

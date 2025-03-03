import {Image} from '@shopify/hydrogen';

interface PageProps {
  title: string;
  ImageSource: string;
}

export function PageBanner({title, ImageSource}: PageProps) {
  return (
    <div className="page--banner">
      <Image src={ImageSource} />
      <h3>{title}</h3>
    </div>
  );
}

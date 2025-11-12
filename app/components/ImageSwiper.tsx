import {Link} from '@remix-run/react';
import {Swiper, SwiperSlide} from 'swiper/react';
import {Navigation, Pagination, Autoplay} from 'swiper/modules';
import {Image} from '@shopify/hydrogen';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

interface ImageProduct {
  url: string;
  id: string;
  altText?: string;
  title?: string;
  link?: string;
}

interface ProductRecommendation {
  images: {edges: Array<{node: {url?: string; src?: string}}>};
  title: string;
  id: string;
  handle: string;
}

interface ImageSwiperProps {
  type?: 'PRODUCT' | 'RECOMMENDATION' | 'BANNER';
  images?: ImageProduct[];
  productRecommendation?: ProductRecommendation[];
  slidesPerView?: number | 'auto';
  centeredSlides?: boolean;
  onSwiper?: (swiper: any) => void;
}

const ImageSwiper: React.FC<ImageSwiperProps> = ({
  images = [],
  slidesPerView,
  centeredSlides,
  type,
  productRecommendation,
  onSwiper,
}) => {
  const module =
    type == 'PRODUCT' || type == 'BANNER' ? [Pagination, Autoplay] : [];
  return (
    <Swiper
      modules={module}
      spaceBetween={20}
      slidesPerView={slidesPerView}
      centeredSlides={centeredSlides}
      navigation
      pagination={{clickable: true}}
      autoplay={{delay: 5000}}
      loop={true}
      initialSlide={type == 'RECOMMENDATION' ? 2 : 0}
      onSwiper={onSwiper}
    >
      {type == 'BANNER' &&
        images.map((image, index) => (
          <SwiperSlide key={image.id}>
            <Link key={image.id} to={image.link}>
              <Image
                src={image.url}
                alt={image.altText || `Slide ${image.id}`}
                aspectRatio="4/5"
                sizes="100vw"
                loading={index === 0 ? 'eager' : 'lazy'}
                fetchPriority={index === 0 ? 'high' : 'low'}
              />
              <div className="product-item-description">
                <p className="uppercase">{image.title}</p>
              </div>
            </Link>
          </SwiperSlide>
        ))}

      {type == 'PRODUCT' &&
        images.map((image, index) => (
          <SwiperSlide key={image.id}>
            <Image
              src={image.url}
              alt={image.altText || `Slide ${image.id}`}
              aspectRatio="4/5"
              sizes="100vw"
              loading={index === 0 ? 'eager' : 'lazy'}
              fetchPriority={index === 0 ? 'high' : 'low'}
            />
          </SwiperSlide>
        ))}

      {type == 'RECOMMENDATION' &&
        productRecommendation &&
        productRecommendation.map((product: ProductRecommendation) => (
          <SwiperSlide key={product.id} className="product-recommendations">
            <Link to={`/products/${product.handle}`}>
              <Image
                src={product.images.edges[0]?.node.url || product.images.edges[0]?.node.src}
                alt={product.title}
                aspectRatio="4/5"
                sizes="(min-width: 45em) 400px, 100vw"
                loading="lazy"
                fetchPriority="low"
              />
              <div className="product-item-description">
                <p className="uppercase">{product.title}</p>
              </div>
            </Link>
          </SwiperSlide>
        ))}
    </Swiper>
  );
};

export default ImageSwiper;

import {Link} from '@remix-run/react';
import {Swiper, SwiperSlide} from 'swiper/react';
import {Navigation, Pagination, Autoplay} from 'swiper/modules';
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
  images: {edges: Array<{node: {src: string}}>};
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
}

const ImageSwiper: React.FC<ImageSwiperProps> = ({
  images = [],
  slidesPerView,
  centeredSlides,
  type,
  productRecommendation,
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
    >
      {type == 'BANNER' &&
        images.map((image) => (
          <SwiperSlide key={image.id}>
            <Link key={image.id} to={image.link}>
              <img src={image.url} alt={image.altText || `Slide ${image.id}`} />
              <div className="product-item-description">
                <p className="uppercase">{image.title}</p>
              </div>
            </Link>
          </SwiperSlide>
        ))}

      {type == 'PRODUCT' &&
        images.map((image) => (
          <SwiperSlide key={image.id}>
            <img
              src={image.url}
              alt={image.altText || `Slide ${image.id}`}
              className="w-full h-auto"
            />
          </SwiperSlide>
        ))}

      {type == 'RECOMMENDATION' &&
        productRecommendation &&
        productRecommendation.map((product: ProductRecommendation) => (
          <SwiperSlide key={product.id} className="product-recommendations">
            <Link to={`/products/${product.handle}`}>
              <img
                src={product.images.edges[0].node.src}
                alt=""
                className="w-full h-auto"
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

import {Swiper, SwiperSlide} from 'swiper/react';
import {Navigation, Pagination, Autoplay} from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

interface ImageProduct {
  url: string;
  id: string;
  altText?: string;
}

interface ProductRecommendation {
  images: {edges: Array<{node: {src: string}}>};
  title: string;
  id: string;
}

interface ImageSwiperProps {
  type?: 'PRODUCT' | 'RECOMMENDATION';
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
  const module = type == 'PRODUCT' ? [Pagination, Autoplay] : [];
  return (
    <Swiper
      modules={module}
      spaceBetween={20}
      slidesPerView={slidesPerView}
      centeredSlides={centeredSlides}
      navigation
      pagination={{clickable: true}}
      autoplay={{delay: 8000}}
      initialSlide={type == 'RECOMMENDATION' ? 1 : 0}
    >
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
            <img
              src={product.images.edges[0].node.src}
              alt=""
              className="w-full h-auto"
            />
            <div className="product-item-description">
              <p className="uppercase">{product.title}</p>
            </div>
          </SwiperSlide>
        ))}
    </Swiper>
  );
};

export default ImageSwiper;

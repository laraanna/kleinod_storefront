import {SplitBox} from './SplitBox';
import {useTranslation} from 'react-i18next';
export function AtelierSection() {
  const {t} = useTranslation();

  return (
    <SplitBox
      title=""
      ImageSource="https://cdn.shopify.com/s/files/1/0808/9255/9695/files/landscape-texture.jpg?v=1766405042"
      paragraph={t('atelier-section.description')}
      cta={t('atelier-section.cta')}
      ctaLink="/about"
    ></SplitBox>
  );
}

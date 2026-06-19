import {useFetcher, useLocation} from '@remix-run/react';
import {useState, useEffect} from 'react';
import {useTranslation} from 'react-i18next';

type NewsletterActionData = {
  successMessage?: string;
  formError?: string;
  res?: {ok?: boolean};
};

export function NewsletterFooter() {
  const fetcher = useFetcher<NewsletterActionData>();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const isSubmitting = fetcher.state === 'submitting';
  const {t} = useTranslation();
  // Determine if we're in a locale path and construct the action path accordingly
  const localeMatch = /(\/[a-zA-Z]{2}-[a-zA-Z]{2}\/)/.exec(location.pathname);
  const localePrefix = localeMatch ? localeMatch[0] : '';
  const actionPath = `${localePrefix}newsletter/subscribe`;

  // On successful subscription, set the email field to "thanks for subscribing"
  useEffect(() => {
    if (fetcher.data?.successMessage && fetcher.data?.res?.ok) {
      setEmail(t('newsletter.thanks-for-subscribing'));
    }
  }, [fetcher.data]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSubmitting) return;

    const formData = new FormData();
    formData.set('email', email);
    fetcher.submit(formData, {method: 'POST', action: actionPath});
  };

  return (
    <div className="newsletter-footer">
      <fetcher.Form onSubmit={handleSubmit}>
        <div className="newsletter-footer__form">
          <input
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t('newsletter.placeholder')}
            required
            disabled={isSubmitting}
            className="newsletter-footer__input"
            aria-label="Email address"
          />
          <button
            type="submit"
            disabled={isSubmitting}
            className="newsletter-footer__button"
          >
            {isSubmitting ? t('newsletter.subscribing') : t('newsletter.cta')}
          </button>
        </div>
        {fetcher.data?.formError && (
          <p className="newsletter-footer__error" role="alert">
            {fetcher.data.formError}
          </p>
        )}
      </fetcher.Form>
    </div>
  );
}

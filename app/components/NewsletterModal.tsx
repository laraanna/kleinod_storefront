import {useFetcher, useLocation} from '@remix-run/react';
import {useState, useEffect} from 'react';
import {Image} from '@shopify/hydrogen';

type NewsletterActionData = {
  successMessage?: string;
  formError?: string;
  res?: {ok?: boolean};
};

export function NewsletterModal() {
  const fetcher = useFetcher<NewsletterActionData>();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [hasShown, setHasShown] = useState(false);
  const isSubmitting = fetcher.state === 'submitting';

  // Determine if we're in a locale path and construct the action path accordingly
  const localeMatch = /(\/[a-zA-Z]{2}-[a-zA-Z]{2}\/)/.exec(location.pathname);
  const localePrefix = localeMatch ? localeMatch[0] : '';
  const actionPath = `${localePrefix}newsletter/subscribe`;

  const handleClose = () => {
    setIsOpen(false);
    // Remember that user dismissed the modal for this session
    sessionStorage.setItem('newsletterModalDismissed', 'true');
  };

  // Show modal after 10 seconds, only once per session
  useEffect(() => {
    if (hasShown) return;

    const timer = setTimeout(() => {
      // Check if user has already dismissed or subscribed in this session
      const dismissed = sessionStorage.getItem('newsletterModalDismissed');
      const subscribed = sessionStorage.getItem('newsletterSubscribed');
      if (!dismissed && !subscribed) {
        setIsOpen(true);
        setHasShown(true);
      }
    }, 10000); // 10 seconds

    return () => clearTimeout(timer);
  }, [hasShown]);

  // On successful subscription, set the email field to "thanks for subscribing" and close after a delay
  useEffect(() => {
    if (fetcher.data?.successMessage && fetcher.data?.res?.ok) {
      setEmail('thanks for subscribing');
      // Mark as subscribed in sessionStorage to prevent showing again
      sessionStorage.setItem('newsletterSubscribed', 'true');
      // Close modal after 3 seconds on success
      const timer = setTimeout(() => {
        handleClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [fetcher.data]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSubmitting) return;

    const formData = new FormData();
    formData.set('email', email);
    fetcher.submit(formData, {method: 'POST', action: actionPath});
  };

  if (!isOpen) return null;

  return (
    <div className="newsletter-modal-overlay">
      <div
        className="newsletter-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="newsletter-modal-title"
      >
        <button
          className="newsletter-modal__close"
          onClick={handleClose}
          aria-label="Close newsletter signup"
        >
          &times;
        </button>
        <Image
          src="https://cdn.shopify.com/s/files/1/0808/9255/9695/files/banner-sign-up.jpg?v=1767866664"
          alt="Atelier Kleinod"
          className="atelier-logo"
        />

        <div className="newsletter-modal__content">
          <p className="newsletter-modal__description">
            Receive first access to Atelier Kleinods collections, inspiration
            and other exclusive updates.
          </p>

          <fetcher.Form onSubmit={handleSubmit}>
            <div className="newsletter-modal__form">
              <input
                type="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                disabled={isSubmitting || email === 'thanks for subscribing'}
                readOnly={email === 'thanks for subscribing'}
                className="newsletter-modal__input"
                aria-label="Email address"
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className="newsletter-modal__button"
              >
                {isSubmitting ? 'Subscribing...' : 'Subscribe'}
              </button>
            </div>
            {fetcher.data?.formError && (
              <p className="newsletter-modal__error" role="alert">
                {fetcher.data.formError}
              </p>
            )}
          </fetcher.Form>
        </div>
      </div>
    </div>
  );
}

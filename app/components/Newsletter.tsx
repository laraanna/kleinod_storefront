import {
  Form,
  Link,
  useActionData,
  useFetcher,
  useNavigation,
} from '@remix-run/react';
import {LinksFunction} from '@shopify/remix-oxygen';
import {useEffect, useRef, useState} from 'react';
import {createPortal} from 'react-dom';

type NewsletterActionData = {
  successMessage?: string;
  formError?: string;
  res?: {ok?: boolean};
};

export default function Newsletter() {
  const newsletter = useFetcher<NewsletterActionData>();
  const succeeded = newsletter?.data?.successMessage;
  const [showSuccessMsg, setShowSuccessMsg] = useState<boolean>(!!succeeded);

  const state: 'idle' | 'success' | 'error' | 'submitting' = newsletter?.data
    ?.res?.ok
    ? 'success'
    : newsletter?.data?.formError
    ? 'error'
    : newsletter.state === 'submitting'
    ? 'submitting'
    : 'idle';

  const formRef = useRef<HTMLFormElement>(null);
  const successRef = useRef<HTMLHeadingElement>(null);
  const mounted = useRef<boolean>(false);

  useEffect(() => {
    if (state === 'success' && formRef.current) {
      formRef.current.reset();
    }
  }, [state]);

  useEffect(() => {
    let timeout: number;
    if (succeeded && formRef.current) {
      setShowSuccessMsg(true);
      formRef.current.reset();
      timeout = window.setTimeout(() => setShowSuccessMsg(false), 2000);
    } else {
      setShowSuccessMsg(false);
    }
    return () => {
      if (timeout) window.clearTimeout(timeout);
    };
  }, [succeeded]);

  return (
    <main className="flex flex-wrap justify-center">
      <newsletter.Form
        method="post"
        aria-hidden={state === 'success'}
        action="/newsletter/subscribe"
        ref={formRef}
        className="w-full shrink-0 grow-0 basis-auto px-3 md:w-6/12 lg:w-8/12 xl:w-10/12"
      >
        <div className="grid items-center gap-x-6 lg:grid-cols-2">
          <div className="text-center">
            <h2 className="text-3xl font-bold dark:text-white">
              Join the loop.
            </h2>
            <p className="">Get 15% off your first order!</p>
          </div>
          <div>
            <fieldset className="my-6 flex-row md:mb-0 md:flex">
              <input
                aria-label="Email address"
                aria-describedby="error-message"
                type="email"
                name="email"
                placeholder="you@example.com"
                className="md:w-1/2 w-full"
                required
              />
              <button
                type="submit"
                className="w-full md:w-1/2 px-8 py-2 md:mx-4 bg-black text-white my-2 md:my-0"
              >
                {state === 'submitting' ? 'Subscribing...' : 'Subscribe'}
              </button>
            </fieldset>
          </div>
        </div>

        <p>
          {newsletter?.data?.formError && (
            <div>{newsletter?.data?.formError}</div>
          )}
        </p>

        {showSuccessMsg && (
          <div className="absolute w-full inset-x-0 z-50 left-1/2 transform -translate-x-1/2">
            <div className="flex items-center justify-center py-2" role="alert">
              <div className="flex items-center w-full max-w-xs p-4 mb-4 text-gray-500 bg-white rounded-lg shadow">
                <div className="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-green-500 bg-green-100 rounded-lg dark:bg-green-800 dark:text-green-200">
                  <svg
                    className="w-5 h-5"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
                  </svg>
                  <span className="sr-only">Check icon</span>
                </div>
                <div className="ml-3 text-sm font-normal">{succeeded}</div>
              </div>
            </div>
          </div>
        )}
      </newsletter.Form>
    </main>
  );
}

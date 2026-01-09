import {type ActionFunction, json} from '@shopify/remix-oxygen';

type ActionData = {
  formError?: string;
  successMessage?: string;
  res?: {ok?: boolean};
};

const badRequest = (data: ActionData) => json(data, {status: 400});

export const action: ActionFunction = async ({request, context}) => {
  await new Promise((res) => setTimeout(res, 1000));
  const formData = await request.formData();
  const email = formData.get('email');

  if (!email || typeof email !== 'string') {
    return badRequest({
      formError: 'Please provide an valid email address.',
    });
  }
  if (email === '') {
    return badRequest({
      formError: 'The input can not be empty',
    });
  }

  const apiKey = context.env.KLAVIYO_API_KEY;
  const listId = context.env.KLAVIYO_LIST_ID;

  if (!apiKey || !listId) {
    return badRequest({
      formError: 'Newsletter service is not configured.',
    });
  }

  const res = await fetch(
    'https://a.klaviyo.com/api/profile-subscription-bulk-create-jobs/',
    {
      method: 'post',
      body: JSON.stringify({
        data: {
          type: 'profile-subscription-bulk-create-job',
          attributes: {
            profiles: {
              data: [
                {
                  type: 'profile',
                  attributes: {
                    email,
                  },
                },
              ],
            },
          },
          relationships: {
            list: {data: {type: 'list', id: listId}},
          },
        },
      }),
      headers: {
        accept: 'application/vnd.api+json',
        'content-type': 'application/vnd.api+json',
        revision: '2023-07-15',
        Authorization: `Klaviyo-API-Key ${apiKey}`,
      },
    },
  );

  if (!res.ok) {
    return badRequest({
      formError: 'Failed to subscribe. Please try again later.',
    });
  }

  return json({res: {ok: res.ok}, successMessage: 'You are subscribed!'});
};

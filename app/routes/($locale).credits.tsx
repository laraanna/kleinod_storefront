import {type MetaFunction} from '@remix-run/react';
import type {ReactNode} from 'react';

type CreditsSection = {
  title: string;
  body: Array<{id: string; content: ReactNode}>;
};

const modelCredits = [
  {
    id: 'model-name-1',
    name: 'Massiel Mendi',
    url: 'https://www.instagram.com/mass.mendi/',
  },
  {
    id: 'model-name-2',
    name: 'Shinji Tsukiyama',
    url: 'https://www.instagram.com/shinji.tsukiyama/',
  },
  {
    id: 'model-name-3',
    name: 'Luisa Blechschmidt',
    url: 'https://www.instagram.com/luisa_blechschmidt/',
  },
  {
    id: 'model-name-4',
    name: 'Lili Leitner',
    url: 'https://www.instagram.com/lilifee.l/',
  },
];

const creditsSections: CreditsSection[] = [
  {
    title: 'Creative Direction',
    body: [
      {
        id: 'creative-direction-overview',
        content:
          'Led by Atelier Kleinod, defining the visual and narrative identity.',
      },
    ],
  },
  {
    title: 'Photography',
    body: [
      {
        id: 'photography-title',
        content: '',
      },
      {
        id: 'photography-credits',
        content: (
          <>
            Imagery captured by {' '}
            <a
              href="https://www.instagram.com/tony.foulquier/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Tony Foulquier
            </a>
            , with additional photography by Atelier Kleinod.
          </>
        ),
      },
    ],
  },
  {
    title: 'Models',
    body: [
      {
        id: 'models-featured',
        content: (
          <>
            Featuring{' '}
            {modelCredits.map((model, index) => {
              const isLast = index === modelCredits.length - 1;
              const isSecondLast = index === modelCredits.length - 2;
              const moreThanTwo = modelCredits.length > 2;
              const separator = (() => {
                if (isLast) return '';
                if (isSecondLast) {
                  return moreThanTwo ? ', and ' : ' and ';
                }
                return ', ';
              })();

              return (
                <span key={model.id}>
                  <a href={model.url} target="_blank" rel="noopener noreferrer">
                    {model.name}
                  </a>
                  {separator}
                </span>
              );
            })}
            .
          </>
        ),
      },
    ],
  },
  {
    title: 'Digital Experience',
    body: [
      {
        id: 'digital-experience-overview',
        content: 'Conceived and developed by Atelier Kleinod, reflecting the craftsmanship and precision of each piece.',
      },
    ],
  },
];

export const meta: MetaFunction = () => {
  return [{title: `Atelier Kleinod | Credits`}];
};

export default function Credits() {
  return (
    <div className="policy">
      <br />
      <br />
      <h1>Credits</h1>
      {creditsSections.map((section) => (
        <section key={section.title}>
          <h4>{section.title}</h4>
          {section.body.map((paragraph) => (
            <p key={paragraph.id}>{paragraph.content}</p>
          ))}
        </section>
      ))}
      <section>
        <h4>Community & Collaborators</h4>
        <p>
        With gratitude to the artists, suppliers, and clients whose creativity and trust continue to shape Atelier Kleinod.
        </p>
        <br/>
        <p>
          For collaborations or press inquiries, please contact{' '}
          <a href="mailto:hello@kleinod-atelier.com">
            hello@kleinod-atelier.com
          </a>
          .
        </p>
      </section>
    </div>
  );
}

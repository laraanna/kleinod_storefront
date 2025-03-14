import {type MetaFunction} from '@remix-run/react';

export const meta: MetaFunction = () => {
  return [{title: `Atelier Kleinod | Commission`}];
};

export default function Commission() {
  return (
    <div className="commission--container">
      <h1>Commission</h1>
    </div>
  );
}

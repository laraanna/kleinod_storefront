import {useState} from 'react';
import {useAside} from '~/components/Aside';

export function ProductCustomization({
  wantsCustom,
  setWantsCustom,
  customDescription,
  setCustomDescription,
  productId,
  customEngraveID,
}: {
  wantsCustom: boolean;
  setWantsCustom: (val: boolean) => void;
  customDescription: string;
  setCustomDescription: (val: string) => void;
  productId: string;
  customEngraveID: string;
}) {
  const {open} = useAside();

  if (productId !== customEngraveID) {
    return null;
  }

  return (
    <div className="customization-section">
      <p>Would you like to add 3 custom letters?</p>
      <div style={{display: 'flex', gap: '1rem', marginTop: '0.5rem'}}>
        <label>
          <input
            type="radio"
            name="customToggle"
            value="yes"
            checked={wantsCustom}
            onChange={() => setWantsCustom(true)}
          />
          Yes
        </label>
        <label>
          <input
            type="radio"
            name="customToggle"
            value="no"
            checked={!wantsCustom}
            onChange={() => {
              setWantsCustom(false);
              setCustomDescription('');
            }}
          />
          No
        </label>
      </div>

      {wantsCustom && (
        <div style={{marginTop: '1rem'}}>
          <label htmlFor="customDescription">Enter up to 3 letters:</label>
          <input
            type="text"
            id="customDescription"
            name="customDescription"
            value={customDescription}
            onChange={(e) => {
              const value = e.target.value.toUpperCase().replace(/[^A-Z]/g, '');
              setCustomDescription(value.slice(0, 3));
            }}
            maxLength={3}
            className="custom-description-input"
          />
        </div>
      )}

      <button
        type="button"
        className="btn-add-chain"
        onClick={() => open('add-chain')}
      >
        Want to add a chain?
      </button>
    </div>
  );
}

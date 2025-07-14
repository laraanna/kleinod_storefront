import {useState, useCallback} from 'react';
import {useAside} from '~/components/Aside';

// Constant for aside key
const ADD_CHAIN_ASIDE_KEY = 'add-chain';

// Props type defined outside for clarity
export type ProductCustomizationProps = {
  wantsCustom: boolean;
  setWantsCustom: (val: boolean) => void;
  customDescription: string;
  setCustomDescription: (val: string) => void;
  productId: string;
  customEngraveID: string;
};

export function ProductCustomization({
  wantsCustom,
  setWantsCustom,
  customDescription,
  setCustomDescription,
  productId,
  customEngraveID,
}: ProductCustomizationProps) {
  const {open} = useAside();
  const [error, setError] = useState('');

  // Memoized handlers
  const handleCustomChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      // Allow uppercase letters and numbers only
      const value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
      if (value.length > 3) {
        setError('Maximum 3 characters allowed.');
      } else {
        setError('');
      }
      setCustomDescription(value.slice(0, 3));
    },
    [setCustomDescription],
  );

  const handleRadioChange = useCallback(
    (val: boolean) => {
      setWantsCustom(val);
      if (!val) {
        setCustomDescription('');
        setError('');
      }
    },
    [setWantsCustom, setCustomDescription],
  );

  const handleOpenChainAside = useCallback(() => {
    open(ADD_CHAIN_ASIDE_KEY);
  }, [open]);

  if (productId !== customEngraveID) {
    return null;
  }

  return (
    <div className="customization-section">
      <fieldset>
        <legend id="customization-legend">
          Personalize your medaillon? <br />
          <span className="italic">(Add up to 3 letters/numbers)</span>
        </legend>
        <div
          className="customization-radio-group"
          role="radiogroup"
          aria-labelledby="customization-legend"
        >
          <label>
            <input
              type="radio"
              name="customToggle"
              value="yes"
              checked={wantsCustom}
              onChange={() => handleRadioChange(true)}
              aria-checked={wantsCustom}
              aria-label="Yes, I want to personalize"
            />
            Yes
          </label>
          <label>
            <input
              type="radio"
              name="customToggle"
              value="no"
              checked={!wantsCustom}
              onChange={() => handleRadioChange(false)}
              aria-checked={!wantsCustom}
              aria-label="No, I do not want to personalize"
            />
            No
          </label>
        </div>
      </fieldset>

      {wantsCustom && (
        <div style={{marginTop: '1rem', marginBottom: '1rem'}}>
          <label htmlFor="customDescription">
            Enter up to 3 letters/numbers:
            <br />
            <input
              type="text"
              id="customDescription"
              name="customDescription"
              value={customDescription}
              onChange={handleCustomChange}
              maxLength={3}
              className="custom-description-input"
              aria-describedby="custom-description-help"
              aria-invalid={!!error}
              autoComplete="off"
            />
          </label>
          <div id="custom-description-help" className="sr-only">
            Only uppercase letters and numbers are allowed. Maximum 3
            characters.
          </div>
          {error && (
            <div className="customization-error" role="alert">
              {error}
            </div>
          )}
        </div>
      )}
      {/* <button
        type="button"
        className="customization-chain-btn"
        onClick={handleOpenChainAside}
        aria-label="Want to add a chain?"
      >
        Want to add a chain?
      </button> */}
    </div>
  );
}

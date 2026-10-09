'use client';

import {
  districtNames,
  findMunicipality,
  INCLUDED_DELIVERY,
  isValleyDistrict,
  municipalitiesOf,
  type DeliveryQuote,
} from '../shop/delivery-data';

// district + municipality come from dropdowns, spot (the place) is typed by the customer
export type DeliveryChoice = { district: string; municipality: string; spot: string };

export const OTHER = '__other'; // "not listed" option for district or municipality

export const emptyDeliveryChoice: DeliveryChoice = { district: '', municipality: '', spot: '' };

/** true once the customer has picked enough for us to quote the delivery */
export function deliveryChoiceReady(area: string, choice: DeliveryChoice) {
  if (!area) return false;
  if (choice.district === OTHER) return true;
  if (!choice.district || !choice.municipality) return false;
  return choice.municipality === OTHER || choice.spot.trim().length > 0;
}

/** what we send to the server (null when nothing specific was chosen) */
export function deliveryChoiceForServer(choice: DeliveryChoice) {
  if (!choice.district || choice.district === OTHER || !choice.municipality || choice.municipality === OTHER) {
    return null;
  }
  return { district: choice.district, place: choice.municipality, spot: choice.spot.trim() };
}

/** one line of address text: "Kalanki, Kathmandu Metropolitan City, Kathmandu" */
export function deliveryChoiceText(choice: DeliveryChoice) {
  const muni = choice.municipality === OTHER ? '' : choice.municipality;
  const dist = choice.district === OTHER ? '' : choice.district;
  return [choice.spot.trim(), muni, dist].filter(Boolean).join(', ');
}

export default function DeliveryPicker({
  area,
  choice,
  onChange,
  onAreaChange,
  quote,
}: {
  area: string;
  choice: DeliveryChoice;
  onChange: (next: DeliveryChoice) => void;
  onAreaChange: (area: string) => void;
  quote: DeliveryQuote;
}) {
  const districtPicked = !!choice.district && choice.district !== OTHER;
  const municipalities = districtPicked ? municipalitiesOf(choice.district) : [];
  const muni = findMunicipality(choice.district, choice.municipality);
  const spotEnabled = !!muni;

  return (
    <div className="checkout-field">
      <span>Delivery Zone *</span>
      <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', margin: '8px 0' }}>
        <label style={{ display: 'flex', gap: 8, alignItems: 'center', opacity: 0.8 }}>
          <input type="radio" disabled readOnly checked={area === 'kathmandu-valley'} />
          Kathmandu Valley
        </label>
        <label style={{ display: 'flex', gap: 8, alignItems: 'center', opacity: 0.8 }}>
          <input type="radio" disabled readOnly checked={area === 'outside-valley'} />
          Outside Valley (courier rate above NRS {INCLUDED_DELIVERY} extra)
        </label>
      </div>
      <p className="checkout-delivery-note">Chosen automatically from your district.</p>

      <div
        style={{
          display: 'grid',
          gap: 14,
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          marginTop: 12,
        }}
      >
        <label className="checkout-field">
          District *
          <select
            required
            value={choice.district}
            onChange={(e) => {
              const v = e.target.value;
              onAreaChange(v === OTHER ? 'outside-valley' : isValleyDistrict(v) ? 'kathmandu-valley' : v ? 'outside-valley' : '');
              onChange({ district: v, municipality: '', spot: '' });
            }}
          >
            <option value="">Select district</option>
            {districtNames.map((d) => (
              <option key={d} value={d}>
                {d}
                {isValleyDistrict(d) ? ' (Valley)' : ''}
              </option>
            ))}
            <option value={OTHER}>My district is not listed</option>
          </select>
        </label>

        <label className="checkout-field">
          Municipality *
          <select
            required={districtPicked}
            disabled={!districtPicked}
            value={choice.municipality}
            onChange={(e) => onChange({ ...choice, municipality: e.target.value, spot: '' })}
          >
            <option value="">{districtPicked ? 'Select municipality' : 'Select a district first'}</option>
            {municipalities.map((m) => (
              <option key={m.name} value={m.name}>
                {m.name}
              </option>
            ))}
            {districtPicked && <option value={OTHER}>My municipality is not listed</option>}
          </select>
        </label>

        <label className="checkout-field">
          Place / Area *
          {/* typed by the customer; known places show up as suggestions */}
          <input
            list="delivery-spot-options"
            disabled={!spotEnabled}
            required={spotEnabled}
            value={choice.spot}
            placeholder={spotEnabled ? 'Type your place, e.g. Kalanki' : 'Select a municipality first'}
            onChange={(e) => onChange({ ...choice, spot: e.target.value })}
          />
          <datalist id="delivery-spot-options">
            {muni?.places.map((p) => (
              <option key={p} value={p} />
            ))}
          </datalist>
        </label>
      </div>

      {!area || !deliveryChoiceReady(area, choice) || quote.charge === null ? (
        <p className="checkout-delivery-note">
          {area && deliveryChoiceReady(area, choice)
            ? 'Delivery charge for this location will be confirmed separately.'
            : 'Select your district, municipality and place.'}
        </p>
      ) : quote.charge === 0 ? (
        <p className="checkout-delivery-note">
          Delivery: <s>NRS {INCLUDED_DELIVERY}</s> <strong>Free</strong>
        </p>
      ) : (
        <p className="checkout-delivery-note">
          Delivery: <s>NRS {quote.place?.rate ?? INCLUDED_DELIVERY + quote.charge}</s>{' '}
          <strong>NRS {quote.charge}</strong> (NRS {INCLUDED_DELIVERY} of it is on us)
        </p>
      )}
    </div>
  );
}
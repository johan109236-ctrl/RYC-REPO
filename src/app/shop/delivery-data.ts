// ─────────────────────────────────────────────────────────────────────────────
// DELIVERY RATES: the file to edit when delivery prices / places change.
//
// STRUCTURE:   District  →  Municipality  →  Places
//   • The customer picks the district and municipality from dropdowns.
//   • The PLACE is typed by the customer (suggestions come from `places`).
//
// PRICING
//   • INCLUDED_DELIVERY (NRS) is already covered by the product price.
//   • The customer pays only the courier rate ABOVE that:  rate 170 → NRS 70 extra.
//   • `rate` on a municipality = courier price for the whole municipality.
//   • `placeRates` = places in that municipality that cost something different.
//   • A place the customer types that is not in `places` uses the municipality `rate`.
//
// HOW TO ADD / CHANGE A DISTRICT
//   Copy the Kathmandu block below (the sample) and change the names/rates.
//   Any district written in `manualLocations` REPLACES that district from
//   delivery-locations.generated.ts (auto-made from your Excel sheet).
//   Keep this file identical in the website and the admin project.
// ─────────────────────────────────────────────────────────────────────────────
import { generatedLocations } from './delivery-locations.generated';

export const INCLUDED_DELIVERY = 100;
export const VALLEY_DISTRICTS = ['Kathmandu', 'Lalitpur', 'Bhaktapur'];

export type Municipality = {
  name: string;
  rate: number; // courier price (NRS) for this municipality
  places: string[]; // known places (suggestions in the dropdown)
  placeRates?: Record<string, number>; // places that cost different from `rate`
};
export type DistrictData = { district: string; municipalities: Municipality[] };

// ── SAMPLE: Kathmandu district (copy this shape for other districts) ──
export const manualLocations: DistrictData[] = [
  {
    district: 'Kathmandu',
    municipalities: [
      { name: 'Budhanilkantha Municipality', rate: 100, places: [] },
      { name: 'Chandragiri Municipality', rate: 100, places: [] },
      { name: 'Dakshinkali Municipality', rate: 100, places: ['Chalnakhel', 'Chobhar', 'Dakhsinkali Mandir Area', 'Pharping', 'Seto Gumba', 'Sheshnarayan', 'Taudaha', 'Whoopiland'] },
      { name: 'Gokarneshwor Municipality', rate: 100, places: ['Besigaun', 'Namgel Buspark', 'Nayapati', 'Sundarijal'] },
      { name: 'Kageshwori Manohara Municipality', rate: 100, places: [] },
      { name: 'Kathmandu Metropolitan City', rate: 100, places: ['Aakashdhara', 'Aalapot', 'Aayatar', 'Aloknagar', 'Anamnagar', 'Arubari Area', 'Asan', 'Ason', 'Baad Bhanjyang', 'Babarmahal', 'Bafal', 'Bagbazar', 'Bagh Bhairab Tample Area', 'Balaju', 'Balambu', 'Balkhu', 'Baluwakhani', 'Baluwatar', 'Banasthali Height', 'Baneshwor Height', 'Baneshwor Shantinagar', 'Bangemunda', 'Baniyatar', 'Bansbari', 'Basantapur', 'Basnet Gau', 'Basnettar', 'Basundhara', 'Battisputali', 'Bauddha', 'Bauthali Chowk', 'Bhadrakali', 'Bhagawatithan', 'Bhagwan Pau', 'Bhairabchaur', 'Bhaktapur', 'Bhanjyang', 'Bhatkeko Pul', 'Bhatkepati', 'Bhimdhunga', 'Bhimsengola', 'Bhotahiti', 'Bhotebahal', 'Bibek Chowk', 'Bijulibajar', 'Bishal Bazar', 'Bishnudevi Campus Area', 'Bishnudevi Mandir Area', 'Boharatar', 'Boshigaun', 'Bouddha', 'Bouddha Pipalbot', 'Buddhanagar', 'Budhanilkantha', 'Budhanilkantha School Area', 'Budhanilkantha Tample', 'Bypass', 'Bypass Gumba Area', 'Chabahil', 'Chabahil Area', 'Chakrapath', 'Chaksibari', 'Chalnakhel', 'Chamati', 'Champadevi Buspark Area', 'Chandeshwori', 'Chandikashwori School', 'Chandol', 'Chandragiri', 'Chapali', 'Chapali Bhadrakali', 'Chapali Chowk Pasikot Area', 'Chappal Karkhana', 'Chardhara', 'Chauni', 'Checkpost', 'Checkpost Area', 'Chhauni', 'Chhetrapati', 'Chhoiling Gumba', 'Chigamugal', 'Chisapani', 'Chobhar', 'Chuchepati', 'Chunikhel Area', 'Chunikhel Kapan', 'Chyasingdol', 'Chyasiundol', 'Comfort Apartment Area', 'Dahachok', 'Dahachowk', 'Dakhsinkali Mandir Area', 'Dakshindhoka', 'Dallu', 'Danda Gaun', 'Darbar Marga', 'Daura Dipo', 'Deuba Chowk', 'Dhalku', 'Dhaneshowr Tokha', 'Dhapasi', 'Dharmasthali', 'Dhumbarahi', 'Dhungeadda', 'Dhungedhara', 'Dillibazar', 'Durbar Marg', 'Durga Mandir', 'Faika', 'Fresh Farm Kapan', 'Gairidhara Naxal', 'Gairigaun', 'Ganesh Chowk', 'Ganeshthan', 'Gangahiti', 'Gaule Khasi', 'Gaurighat', 'Gaushala', 'Ghattekulo', 'Gokarneshwor Temple', 'Goldhunga', 'Golfutar', 'Gongabu', 'Gopikrishna', 'Gothatar', 'Grande Height', 'Grande Hospital', 'Guheshwori', 'Gurjudhara', 'Gyaneshwor', 'Hadigaun', 'Hallchok', 'Handigau', 'Hanuman Chowk', 'Haryali Satungal', 'Hatisar', 'Hattigauda', 'Hattigauda Bishnumati Poll', 'Hattisar', 'Hepali Hight', 'High Vision Colony', 'Highvision', 'Hiledol', 'Ichangunarayan', 'Indrachok', 'Iskon', 'Iskon Temple', 'Italitar Chowk', 'Jagdol', 'Jagdol Jhanda Park', 'Jagritrinagar', 'Jalbinayak', 'Jalpa Chowk Area', 'Jamal', 'Jambudanda', 'Jamunapati Chowk', 'Jaranku', 'Jayabageshwori', 'Jhor', 'Jhulpokhari', 'Jorpati', 'Jyatha', 'Jyotinagar', 'Kadaghari', 'Kalanki', 'Kalanki Area', 'Kalanki Malpot', 'Kalimati', 'Kalopul', 'Kamalpokhari', 'Kamladi', 'Kanchanbasti', 'Kantipath', 'Kapan', 'Kapan Gumba', 'Kapan Milan Chowk', 'Kapurdhara', 'Karkhana Chok', 'Karuna Hospital Area', 'Kathmandu', 'Kathmandu Valley', 'Kaudol', 'Kaversthali', 'Kavresthali Buspark', 'Khahare', 'Kharibot Chowk Kapan', 'Khasibazar', 'Khichapokhari', 'Khursanitar', 'Khusibu', 'Khusikhusi', 'Kimdol', 'Kirtipur Bazar', 'Kirtipur Dhalpa', 'Kirtipur Nayabazar', 'Kirtipur Tu Area', 'Koteshwor', 'Kritipur Gamcha', 'Kuleshwor', 'Kumari Club', 'Kumarigal', 'Kumarithan', 'Lagan Tol', 'Lainchaur', 'Lalitpur', 'Lazimpat', 'Lemon Tree', 'Lokanthali', 'Lolang', 'Lri School Area', 'Machapokhari', 'Machhapokhari', 'Machhegau Buspark Area', 'Machhegaun', 'Madannagar', 'Mahabouddha', 'Mahadevsthan', 'Mahadevthan Chandragiri', 'Mahankal', 'Maharajgunj', 'Maijubahal', 'Maitidevi', 'Maitighar', 'Maitinepal Area', 'Maitrinagar', 'Makalbari', 'Manamaiju', 'Mandikhatar', 'Mandikhatar Area', 'Manmaiju', 'Matatirtha', 'Matatirtha Buspark Area', 'Mathillo Bhangal', 'Meraki', 'Mhepi', 'Mid Baneshowr', 'Milan Chowk', 'Mitranagar', 'Mitrapark', 'Muhanpokhari', 'Mulpani', 'Muskan Chowk', 'Nagaun', 'Nagdhunga', 'Nagpokhari', 'Naikap', 'Namgel', 'Namuna Basti', 'Narayan Chowk', 'Narayan Gopal Chok', 'Narayan Gopal Chowk', 'Narayanhiti Durbar', 'Narayanthan', 'Narayanthan Area', 'Nardevi', 'Naxal', 'Naya Buspark', 'Naya Chowk', 'Naya Naikap', 'Nayabasti', 'Nayabato', 'Nayabazar', 'Nayabuspark', 'Nayagau', 'Nayapati Pipal Bot', 'Ncell Chowk', 'Nepaltar', 'New Baneshwor', 'Newroad', 'Newroad Kathmandu', 'Nilopool', 'Nilopul', 'Old Baneshwor', 'Ombahal', 'Osho Tapoban', 'Pabitranagar', 'Pahelopul', 'Paiyatar Tarakeshwor', 'Paiyutar', 'Panchakanya School', 'Panchdhara', 'Panchyakanya Mandir', 'Panga', 'Panighat', 'Panipokhari', 'Pashupati Temple', 'Pasikot', 'Patichok', 'Pepsicola', 'Pharping', 'Phulbari Tokha', 'Phutung', 'Pipalbot', 'Piplamod', 'Purano Guheshwori', 'Purano Naikap', 'Putalisadak', 'Ram Mandir', 'Ram Mandir Area', 'Ramhiti', 'Ramkot', 'Raniban', 'Ranibari', 'Ranipokhari', 'Ranjana Galli', 'Ratopul', 'Ravi Bhawan', 'Road Show Housing', 'Rudramati Chowk', 'Rudreshwor Chowk', 'Salyanthan', 'Samakhusi', 'Sangla', 'Sankhamul', 'Sano Bharyang', 'Sano Gaucharan', 'Sanopool', 'Sapatar', 'Sapredhunga', 'Saraswatinagar', 'Saraswotinagar', 'Sattale', 'Satungal', 'Sesmati Bridge', 'Sheshmati', 'Sheshnarayan', 'Sheshnarayan Tample', 'Shivachowk', 'Shivanagar', 'Shivapuri Chowk', 'Sifal', 'Simaltaar', 'Simaltar', 'Sinamangal', 'Singhadurbar', 'Single Tree', 'Sitapaila', 'Sitapaila Chok', 'Soltidobato', 'Soltimode', 'Soludanda', 'Sorakhutte', 'Special Chowk', 'Star Hospital', 'Subidhanagar', 'Sukedhara', 'Sundarbasti', 'Sundarijal Buspark', 'Sundarijal Dobato', 'Sundhara', 'Suntakhan', 'Suryadarsan Height', 'Suryadarshan', 'Suryadarshan Height', 'Swayambhu', 'Swoyambhu', 'Swyambhu', 'Syuchatar', 'Syuchatar Kirtipur Bazar', 'Tachal', 'Tahachal', 'Talin Chowk', 'Tallo Bhangal', 'Tarkeshwor', 'Taudaha', 'Taulung Chautara', 'Teaching Hospital', 'Teku', 'Tenjing Chowk', 'Thali Danchi', 'Thamel', 'Thankot', 'Thapa Gau', 'Thapathali', 'Thulo Bharyang', 'Tilganga', 'Tinchuli', 'Tinkune', 'Tinthana', 'Tokha', 'Toti Tol', 'Tribeni Chowk Kapan', 'Tribhuvan International Airport', 'Tripureshwor', 'Tushal', 'Tyanglaphat', 'Un Park', 'Us Embassy', 'Uttarbahini School', 'Uttardhoka', 'Valley Public School', 'White Gumba', 'Whoopiland', 'Yellow Gumba'] },
      { name: 'Kirtipur Municipality', rate: 100, places: [] },
      { name: 'Nagarjun Municipality', rate: 100, places: [] },
      { name: 'Shankharapur Municipality', rate: 100, places: ['Alapot', 'Bajrayogini Mandir', 'Bajrayogini Temple Area', 'Bhadrabas Alapot', 'Bishmabhara', 'Bramakhel', 'Gagalphedi', 'Hariyali Height', 'Indrawani', 'Indrayeni', 'Jarsing Pauwa Palubari', 'Jhule Danda', 'Kattike', 'Khulaltar', 'Palubari', 'Salambutar', 'Sali Nadi', 'Sankhu', 'Sukekhola', 'Thali'] },
      { name: 'Tarakeshwor Municipality', rate: 100, places: ['Bypass Gumba Area', 'Chisapani', 'Dharmasthali', 'Goldhunga', 'Jaranku', 'Kavresthali', 'Kavresthali Buspark', 'Lolang', 'Machapokhari', 'Manmaiju', 'Nepaltar', 'Osho Tapoban', 'Phutung', 'Purano Guheshwori', 'Sanopool', 'Sheshmati', 'Tarkeshwor'] },
      { name: 'Tokha Municipality', rate: 100, places: ['Jhor', 'Jhor Waterfall'] },
    ],
  },
];

// ───────────── helpers (no need to edit below this line) ─────────────
const manualNames = new Set(manualLocations.map((d) => d.district));
export const locations: DistrictData[] = [
  ...manualLocations,
  ...generatedLocations.filter((d) => !manualNames.has(d.district)),
].sort((a, b) => a.district.localeCompare(b.district));

export type DeliveryArea = 'kathmandu-valley' | 'outside-valley';

export const isValleyDistrict = (district?: string | null) => !!district && VALLEY_DISTRICTS.includes(district);
export const areaOf = (district?: string | null): DeliveryArea | '' =>
  !district ? '' : isValleyDistrict(district) ? 'kathmandu-valley' : 'outside-valley';

/** What the customer pays on top of the product price. */
export const extraCharge = (rate: number) => Math.max(0, rate - INCLUDED_DELIVERY);

export const districtNames = locations.map((d) => d.district);
export const municipalitiesOf = (district?: string | null) =>
  locations.find((d) => d.district === district)?.municipalities ?? [];
export const findMunicipality = (district?: string | null, municipality?: string | null) =>
  municipalitiesOf(district).find((m) => m.name === municipality);

const norm = (s: string) => s.trim().toLowerCase().replace(/\s+/g, ' ');

/** Rate for a typed place: exact known place → its rate, otherwise the municipality rate. */
export function rateFor(m: Municipality, spot?: string | null) {
  const s = norm(spot ?? '');
  if (s && m.placeRates) {
    for (const [k, v] of Object.entries(m.placeRates)) if (norm(k) === s) return v;
  }
  return m.rate;
}

export type DeliveryQuote = {
  /** NRS the customer pays on top of the product price. null = to be confirmed separately. */
  charge: number | null;
  place: { district: string; place: string; spot: string; rate: number } | null;
  error?: string;
};

/** Same calculation on the website, the order API and the admin. */
export function quoteDelivery(
  area: DeliveryArea,
  district?: string | null,
  municipality?: string | null,
  spot?: string | null
): DeliveryQuote {
  if (district && areaOf(district) !== area) {
    return { charge: null, place: null, error: 'That district does not match the delivery zone.' };
  }
  const m = findMunicipality(district, municipality);
  if (!district || !m) return { charge: area === 'kathmandu-valley' ? 0 : null, place: null };
  const rate = rateFor(m, spot);
  return {
    charge: extraCharge(rate),
    place: { district, place: m.name, spot: (spot ?? '').trim(), rate },
  };
}

/** Text saved on the order, e.g. "Kalanki, Kathmandu Metropolitan City, Kathmandu". */
export function deliveryLabel(area: DeliveryArea, quote: DeliveryQuote): string {
  if (quote.place) {
    return [quote.place.spot, quote.place.place, quote.place.district].filter(Boolean).join(', ');
  }
  return area === 'kathmandu-valley' ? 'Kathmandu Valley' : 'Outside valley (not listed)';
}
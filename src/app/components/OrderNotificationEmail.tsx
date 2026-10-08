type OrderItem = {
  name: string;
  size?: string;
  color?: string;
  qty: number;
  price: string | number;
};

type Props = {
  orderId: string;
  fullName: string;
  email?: string;
  phone: string;
  address: string;
  city: string;
  deliveryArea: 'kathmandu-valley' | 'outside-valley';
  paymentMethod: 'cod';
  notes?: string;
  items: OrderItem[];
  total: number;
  deliveryCharge?: number | null; // extra delivery charge in NRS, null = to be confirmed
  deliveryPlace?: string;
};

export default function OrderNotificationEmail({
  orderId,
  fullName,
  email,
  phone,
  address,
  city,
  deliveryArea,
  paymentMethod,
  notes,
  items,
  total,
  deliveryCharge,
  deliveryPlace,
}: Props) {
  // when no charge info is passed, behave exactly as before
  const confirmLater =
    deliveryCharge === undefined ? deliveryArea === 'outside-valley' : deliveryCharge === null;
  const hasExtraCharge = typeof deliveryCharge === 'number' && deliveryCharge > 0;

  return (
    <div
      style={{
        fontFamily: 'Arial, sans-serif',
        color: '#1a1a1a',
        maxWidth: 560,
        margin: '0 auto',
      }}
    >
      <h2 style={{ marginBottom: 4 }}>New order received</h2>

      <p style={{ color: '#666', marginTop: 0 }}>
        Order #{orderId}
      </p>

      <table
        style={{
          width: '100%',
          borderCollapse: 'collapse',
          marginBottom: 20,
        }}
      >
        <tbody>
          <tr>
            <td
              style={{
                padding: '4px 0',
                fontWeight: 'bold',
                width: 120,
              }}
            >
              Name
            </td>
            <td style={{ padding: '4px 0' }}>{fullName}</td>
          </tr>

          {email && (
            <tr>
              <td style={{ padding: '4px 0', fontWeight: 'bold' }}>
                Email
              </td>
              <td style={{ padding: '4px 0' }}>{email}</td>
            </tr>
          )}

          <tr>
            <td style={{ padding: '4px 0', fontWeight: 'bold' }}>
              Phone
            </td>
            <td style={{ padding: '4px 0' }}>{phone}</td>
          </tr>

          <tr>
            <td style={{ padding: '4px 0', fontWeight: 'bold' }}>
              Address
            </td>
            <td style={{ padding: '4px 0' }}>
              {address}, {city}
            </td>
          </tr>

          <tr>
            <td style={{ padding: '4px 0', fontWeight: 'bold' }}>
              Delivery
            </td>
            <td style={{ padding: '4px 0' }}>
              {deliveryArea === 'kathmandu-valley'
                ? 'Kathmandu Valley'
                : 'Outside Kathmandu Valley'}
            </td>
          </tr>

          <tr>
            <td style={{ padding: '4px 0', fontWeight: 'bold' }}>
              Payment
            </td>
            <td style={{ padding: '4px 0' }}>
              Cash on Delivery
            </td>
          </tr>

          {notes && (
            <tr>
              <td style={{ padding: '4px 0', fontWeight: 'bold' }}>
                Notes
              </td>
              <td style={{ padding: '4px 0' }}>{notes}</td>
            </tr>
          )}
        </tbody>
      </table>

      <h3
        style={{
          marginBottom: 8,
          borderTop: '1px solid #eee',
          paddingTop: 16,
        }}
      >
        Items
      </h3>

      <table
        style={{
          width: '100%',
          borderCollapse: 'collapse',
        }}
      >
        <thead>
          <tr
            style={{
              textAlign: 'left',
              borderBottom: '1px solid #eee',
            }}
          >
            <th style={{ padding: '6px 4px' }}>Item</th>
            <th style={{ padding: '6px 4px' }}>Qty</th>
            <th style={{ padding: '6px 4px' }}>Price</th>
          </tr>
        </thead>

        <tbody>
          {items.map((item, i) => (
            <tr
              key={i}
              style={{
                borderBottom: '1px solid #f2f2f2',
              }}
            >
              <td style={{ padding: '6px 4px' }}>
                {item.name}
                {item.size
                  ? ` (${item.size}${
                      item.color ? `, ${item.color}` : ''
                    })`
                  : ''}
              </td>

              <td style={{ padding: '6px 4px' }}>
                {item.qty}
              </td>

              <td style={{ padding: '6px 4px' }}>
                {item.price}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div
        style={{
          marginTop: 16,
          paddingTop: 16,
          borderTop: '1px solid #eee',
        }}
      >
        <p
          style={{
            fontWeight: 'bold',
            fontSize: 16,
            margin: 0,
          }}
        >
          Order total: NRS {total}
        </p>

        {confirmLater ? (
          <>
            <p style={{ margin: '8px 0 0', color: '#666' }}>
              Delivery charge: To be confirmed
            </p>

            <p style={{ margin: '8px 0 0', color: '#666' }}>
              Final payable amount: To be confirmed
            </p>
          </>
        ) : hasExtraCharge ? (
          <p style={{ margin: '8px 0 0', color: '#666' }}>
            Includes NRS {deliveryCharge} extra delivery charge
            {deliveryPlace ? ` (${deliveryPlace})` : ''}.
          </p>
        ) : (
          <p style={{ margin: '8px 0 0', color: '#666' }}>
            Delivery is included in the order total.
          </p>
        )}
      </div>
    </div>
  );
}
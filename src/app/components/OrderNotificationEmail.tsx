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
  notes?: string;
  items: OrderItem[];
  total: number;
};

export default function OrderNotificationEmail({
  orderId,
  fullName,
  email,
  phone,
  address,
  city,
  notes,
  items,
  total,
}: Props) {
  return (
    <div style={{ fontFamily: 'Arial, sans-serif', color: '#1a1a1a', maxWidth: 560, margin: '0 auto' }}>
      <h2 style={{ marginBottom: 4 }}>New order received</h2>
      <p style={{ color: '#666', marginTop: 0 }}>Order #{orderId}</p>

      <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 20 }}>
        <tbody>
          <tr>
            <td style={{ padding: '4px 0', fontWeight: 'bold', width: 100 }}>Name</td>
            <td style={{ padding: '4px 0' }}>{fullName}</td>
          </tr>
          {email && (
            <tr>
              <td style={{ padding: '4px 0', fontWeight: 'bold' }}>Email</td>
              <td style={{ padding: '4px 0' }}>{email}</td>
            </tr>
          )}
          <tr>
            <td style={{ padding: '4px 0', fontWeight: 'bold' }}>Phone</td>
            <td style={{ padding: '4px 0' }}>{phone}</td>
          </tr>
          <tr>
            <td style={{ padding: '4px 0', fontWeight: 'bold' }}>Address</td>
            <td style={{ padding: '4px 0' }}>{address}, {city}</td>
          </tr>
          {notes && (
            <tr>
              <td style={{ padding: '4px 0', fontWeight: 'bold' }}>Notes</td>
              <td style={{ padding: '4px 0' }}>{notes}</td>
            </tr>
          )}
        </tbody>
      </table>

      <h3 style={{ marginBottom: 8, borderTop: '1px solid #eee', paddingTop: 16 }}>Items</h3>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ textAlign: 'left', borderBottom: '1px solid #eee' }}>
            <th style={{ padding: '6px 4px' }}>Item</th>
            <th style={{ padding: '6px 4px' }}>Qty</th>
            <th style={{ padding: '6px 4px' }}>Price</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, i) => (
            <tr key={i} style={{ borderBottom: '1px solid #f2f2f2' }}>
              <td style={{ padding: '6px 4px' }}>
                {item.name}
                {item.size ? ` (${item.size}${item.color ? `, ${item.color}` : ''})` : ''}
              </td>
              <td style={{ padding: '6px 4px' }}>{item.qty}</td>
              <td style={{ padding: '6px 4px' }}>{item.price}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <p style={{ fontWeight: 'bold', fontSize: 16, marginTop: 16 }}>Total: {total}</p>
    </div>
  );
}
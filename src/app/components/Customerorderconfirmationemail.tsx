
type Props = {
  name: string;
  orderId: string;
  total: number;
  deliveryArea: 'kathmandu-valley' | 'outside-valley';
};

export default function CustomerOrderConfirmationEmail({
  name,
  orderId,
  total,
  deliveryArea,
}: Props) {
  const isOutsideValley = deliveryArea === 'outside-valley';

  return (
    <div
      style={{
        fontFamily: 'Arial, sans-serif',
        color: '#1a1a1a',
        maxWidth: 560,
        margin: '0 auto',
        lineHeight: 1.6,
      }}
    >
      <h2 style={{ marginBottom: 4 }}>
        Thank you for your order, {name}!
      </h2>

      <p style={{ color: '#666', marginTop: 0 }}>
        Order #{orderId}
      </p>

      <p>
        We&apos;ve received your order and it&apos;s now being reviewed by our
        team. We&apos;ll reach out shortly to confirm the details and arrange
        payment.
      </p>

      <p>
        Once your order has been packed and shipped, we&apos;ll update you on
        its status so you know exactly when to expect delivery.
      </p>

      <div
        style={{
          margin: '20px 0',
          padding: '16px',
          border: '1px solid #eee',
        }}
      >
        <p style={{ margin: 0, fontWeight: 'bold' }}>
          Order total: NRS {total}
        </p>

        {isOutsideValley ? (
          <>
            <p style={{ margin: '8px 0 0', color: '#666' }}>
              Delivery: To be confirmed separately
            </p>

            <p style={{ margin: '8px 0 0', color: '#666' }}>
              Final payable amount: To be confirmed
            </p>
          </>
        ) : (
          <p style={{ margin: '8px 0 0', color: '#666' }}>
            Delivery within Kathmandu Valley is included in the price above.
          </p>
        )}
      </div>

      <p>
        If you have any questions in the meantime, feel free to reply directly
        to this email and we&apos;ll get back to you as soon as we can.
      </p>

      <p style={{ marginTop: 24 }}>
        Thank you for shopping with us!
        <br />
        The RYCE Team
      </p>
    </div>
  );
}


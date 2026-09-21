type Props = {
  name: string;
  orderId: string;
  total: number;
};

export default function CustomerOrderConfirmationEmail({ name, orderId, total }: Props) {
  return (
    <div style={{ fontFamily: 'Arial, sans-serif', color: '#1a1a1a', maxWidth: 560, margin: '0 auto', lineHeight: 1.6 }}>
      <h2 style={{ marginBottom: 4 }}>Thank you for your order, {name}!</h2>
      <p style={{ color: '#666', marginTop: 0 }}>Order #{orderId}</p>

      <p>
        We&apos;ve received your order and it&apos;s now being reviewed by our team.
        We&apos;ll reach out shortly to confirm the details and arrange payment.
      </p>

      <p>
        Once your order has been packed and shipped, we&apos;ll update you on
        its status so you know exactly when to expect delivery.
      </p>

      <p style={{ fontWeight: 'bold', margin: '20px 0' }}>Order total: {total}</p>

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
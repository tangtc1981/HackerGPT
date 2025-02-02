export const getCryptoPaymentStatus = async (token: string) => {
  const url = process.env.NEXT_PUBLIC_CRYPTO_PAYMENT_STATUS || '';
  const res = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json();
  let status = '';

  if (data.status) {
    if (data.status === 'trialing') {
      return null;
    } else if (data.status === 'active') {
      if (!data.ends_at) {
        return null;
      }
      status = 'Your subscription is active.';
    } else if (data.status === 'confirmation-pending') {
      status = 'Waiting for blockchain confirmation.';
    } else if (data.status === 'payment-failed') {
      status =
        'Blockchain confirmation failed. Please try again or contact support.';
    } else if (data.status === 'expired') {
      status = 'Your subscription has expired.';
    }

    if (data.ends_at) {
      const date = new Date(data.ends_at).toLocaleDateString();
      if (data.status === 'expired') {
        status += ` It expired on ${date}`;
      } else {
        if (data.status !== 'confirmation-pending') {
          status += ` Your subscription will end on ${date}`;
        }
      }
    }

    return status;
  } else {
    return ` There was an error fetching your payment status. Please reload the page or contact us. ${JSON.stringify(data)}`;
  }
};

// =============================================================
// Vercel Serverless Function: /api/pay
// Proxies PayHero STK Push request to avoid CORS issues
// =============================================================

const BASIC_AUTH = 'RU85R1NXZGR2TUpWb0RDV0p3VUQ6ZWlnWW5pRUNDeHVFUE10YkkzMENyYk10YWFQRnNNdUhoUHBiTk5UUA==';
const CHANNEL_ID = 6770;
const CALLBACK_URL = 'https://helapesa.vercel.app/api/callback';

function setCors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}

export default async function handler(req, res) {
  setCors(res);

  // Handle CORS preflight — MUST come before method check
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { amount, phone_number, external_reference, customer_name, description } = req.body || {};

  if (!amount || !phone_number) {
    return res.status(400).json({ error: 'amount and phone_number are required.' });
  }

  const extRef = external_reference || ('HELAPESA-' + Date.now());

  const payload = {
    amount: Number(amount),
    phone_number,
    channel_id: CHANNEL_ID,
    provider: 'm-pesa',
    external_reference: extRef,
    callback_url: CALLBACK_URL,
    customer_name: customer_name || 'Hela Pesa Customer',
    description: description || 'Hela Pesa Service Fee'
  };

  try {
    const response = await fetch('https://backend.payhero.co.ke/api/v2/payments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Basic ' + BASIC_AUTH
      },
      body: JSON.stringify(payload)
    });

    const text = await response.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      data = { raw: text };
    }

    if (!response.ok) {
      return res.status(response.status).json({
        error: data.message || data.error || 'PayHero error',
        details: data
      });
    }

    // Ensure reference is always returned
    if (!data.reference) {
      data.reference = extRef;
    }

    return res.status(200).json(data);
  } catch (err) {
    console.error('PayHero STK Push error:', err);
    return res.status(500).json({ error: 'Internal server error. Please try again.' });
  }
}

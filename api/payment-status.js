// =============================================================
// Vercel Serverless Function: /api/payment-status
// Proxies PayHero transaction status check to avoid CORS issues
// =============================================================

const BASIC_AUTH = 'RU85R1NXZGR2TUpWb0RDV0p3VUQ6ZWlnWW5pRUNDeHVFUE10YkkzMENyYk10YWFQRnNNdUhoUHBiTk5UUA==';

function setCors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}

export default async function handler(req, res) {
  setCors(res);

  // Handle CORS preflight — MUST come before method check
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { reference } = req.query;

  if (!reference) {
    return res.status(400).json({ error: 'reference query param is required.' });
  }

  try {
    const response = await fetch(
      `https://backend.payhero.co.ke/api/v2/transaction-status?reference=${encodeURIComponent(reference)}`,
      {
        method: 'GET',
        headers: {
          'Authorization': 'Basic ' + BASIC_AUTH
        }
      }
    );

    const text = await response.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      data = { raw: text };
    }

    if (!response.ok) {
      return res.status(response.status).json({
        error: data.message || 'Could not fetch status',
        details: data
      });
    }

    return res.status(200).json(data);
  } catch (err) {
    console.error('PayHero status check error:', err);
    return res.status(500).json({ error: 'Internal server error. Please try again.' });
  }
}

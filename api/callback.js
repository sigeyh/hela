// =============================================================
// Vercel Serverless Function: /api/callback
// Receives PayHero payment webhook callbacks
// =============================================================

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'POST') {
    try {
      const payload = req.body;
      console.log('PayHero Callback received:', JSON.stringify(payload, null, 2));

      // PayHero sends: { status, reference, amount, phone_number, ... }
      // You can store this in a database (e.g. Firebase, PlanetScale) here
      // For now, we just acknowledge receipt
      return res.status(200).json({ success: true, message: 'Callback received' });
    } catch (err) {
      console.error('Callback error:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  // GET endpoint to manually check if a callback was received
  // Can be extended to query a DB record
  return res.status(200).json({ message: 'Hela Pesa PayHero callback endpoint is live.' });
}

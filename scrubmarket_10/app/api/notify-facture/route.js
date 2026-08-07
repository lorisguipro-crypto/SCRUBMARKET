export const runtime = 'nodejs';

function esc(s) {
  return String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// Prévient l'acheteur qu'une facture l'attend dans son espace ScrubMarket.
export async function POST(request) {
  try {
    const { email, numero, vendeur } = await request.json();
    const apiKey = process.env.RESEND_API_KEY;
    if (!email || !apiKey) return Response.json({ ok: false });

    const html = `
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f2f1ed;margin:0;padding:32px 0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
  <tr><td align="center">
    <table role="presentation" width="480" cellpadding="0" cellspacing="0" style="width:480px;max-width:92%;background:#fbfbf9;border:1px solid #e6e5e0;border-radius:16px;overflow:hidden;">
      <tr><td style="padding:26px 36px 8px;border-bottom:1px solid #e6e5e0;">
        <span style="font-size:16px;font-weight:600;letter-spacing:2.4px;text-transform:uppercase;color:#3f4a48;">ScrubMarket</span>
      </td></tr>
      <tr><td style="padding:30px 36px 8px;color:#3f4a48;">
        <h1 style="margin:0 0 12px;font-size:21px;font-weight:600;">Une facture vous attend</h1>
        <p style="margin:0 0 22px;font-size:15px;line-height:1.6;">La facture <strong>N°&nbsp;${esc(numero)}</strong> émise par <strong>${esc(vendeur)}</strong> est disponible dans votre espace ScrubMarket. Connectez-vous avec cette adresse email pour la consulter et la télécharger en PDF.</p>
      </td></tr>
      <tr><td align="center" style="padding:0 36px 30px;">
        <table role="presentation" cellpadding="0" cellspacing="0"><tr>
          <td style="border-radius:10px;background:#2f8f7d;">
            <a href="https://www.scrub-market.com/compte" style="display:inline-block;padding:14px 30px;font-size:15px;font-weight:700;color:#fff;text-decoration:none;border-radius:10px;">Voir ma facture</a>
          </td>
        </tr></table>
      </td></tr>
      <tr><td style="padding:16px 36px 24px;border-top:1px solid #e6e5e0;">
        <p style="margin:0;font-size:12px;color:#8c9794;">ScrubMarket &middot; réservé aux professionnels de santé.</p>
      </td></tr>
    </table>
  </td></tr>
</table>`;

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: 'ScrubMarket <contact@scrub-market.com>',
        to: [email],
        subject: `Votre facture ${numero || ''} est disponible`,
        html,
      }),
    });
    return Response.json({ ok: res.ok });
  } catch (_) {
    return Response.json({ ok: false });
  }
}

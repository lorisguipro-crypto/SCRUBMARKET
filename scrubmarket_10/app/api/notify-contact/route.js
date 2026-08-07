import { createClient } from '@supabase/supabase-js';

export const runtime = 'nodejs';

function esc(s) {
  return String(s || '')
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// Notifie le vendeur par email quand un acheteur remplit le formulaire de contact.
// N'échoue jamais bruyamment : la demande est déjà enregistrée côté client,
// l'email est un "plus". On répond 200 même si l'envoi n'aboutit pas.
export async function POST(request) {
  try {
    const { annonceId, nom, email, message } = await request.json();
    if (!annonceId || !email) {
      return Response.json({ ok: false, error: 'missing' }, { status: 400 });
    }

    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) return Response.json({ ok: false, error: 'no_resend_key' });

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    const supabase = createClient(url, anon, { auth: { persistSession: false } });

    const { data: annonce } = await supabase
      .from('annonces')
      .select('titre, vendeur_email')
      .eq('id', annonceId)
      .single();

    if (!annonce?.vendeur_email) {
      return Response.json({ ok: false, error: 'no_seller' });
    }

    const titre = annonce.titre || 'votre annonce';
    const html = `
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f2f1ed;margin:0;padding:32px 0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
  <tr><td align="center">
    <table role="presentation" width="500" cellpadding="0" cellspacing="0" style="width:500px;max-width:92%;background:#fbfbf9;border:1px solid #e6e5e0;border-radius:16px;overflow:hidden;">
      <tr><td style="padding:26px 36px 8px;border-bottom:1px solid #e6e5e0;">
        <span style="font-size:16px;font-weight:600;letter-spacing:2.4px;text-transform:uppercase;color:#3f4a48;">ScrubMarket</span>
      </td></tr>
      <tr><td style="padding:30px 36px 6px;color:#3f4a48;">
        <h1 style="margin:0 0 12px;font-size:21px;font-weight:600;color:#3f4a48;">Nouvelle demande sur votre annonce</h1>
        <p style="margin:0 0 20px;font-size:15px;line-height:1.6;">Un professionnel s&rsquo;intéresse à votre annonce <strong>«&nbsp;${esc(titre)}&nbsp;»</strong>.</p>
      </td></tr>
      <tr><td style="padding:0 36px 8px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f2f1ed;border:1px solid #e6e5e0;border-radius:12px;">
          <tr><td style="padding:16px 18px;font-size:14px;color:#3f4a48;line-height:1.6;">
            <div style="font-family:'IBM Plex Mono',monospace;font-size:11px;letter-spacing:.04em;text-transform:uppercase;color:#8c9794;margin-bottom:8px;">De la part de</div>
            <div><strong>${esc(nom) || 'Un professionnel'}</strong></div>
            <div style="color:#2f8f7d;">${esc(email)}</div>
            ${message ? `<div style="margin-top:12px;padding-top:12px;border-top:1px solid #e6e5e0;white-space:pre-wrap;">${esc(message)}</div>` : ''}
          </td></tr>
        </table>
      </td></tr>
      <tr><td style="padding:18px 36px 26px;">
        <p style="margin:0;font-size:14px;line-height:1.6;color:#3f4a48;">Pour lui répondre, il vous suffit de <strong>répondre directement à cet email</strong> — votre message lui parviendra.</p>
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
        to: [annonce.vendeur_email],
        reply_to: email,
        subject: `Nouvelle demande — ${titre}`,
        html,
      }),
    });

    return Response.json({ ok: res.ok });
  } catch (_) {
    return Response.json({ ok: false, error: 'exception' });
  }
}

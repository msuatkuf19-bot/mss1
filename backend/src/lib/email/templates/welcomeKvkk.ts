interface WelcomeEmailData {
  name: string;
  loginEmail: string;
  loginUrl: string;
  tempPassword?: string;
  includePassword?: boolean;
  restaurantName?: string;
}

/**
 * Base URL oluşturma - logo ve panel linkleri için
 */
const getBaseUrl = (): string => {
  return (
    process.env.FRONTEND_URL ||
    process.env.NEXT_PUBLIC_APP_URL ||
    process.env.APP_URL ||
    process.env.CORS_ORIGIN ||
    'https://www.menuben.com'
  );
};

/**
 * Logo URL - Cloudinary CDN (absolute URL)
 */
const getLogoUrl = (): string => {
  // Cloudinary CDN URL - her zaman erişilebilir
  return 'https://res.cloudinary.com/dvgetqbza/image/upload/v1735506735/logos/benmedya.png';
};

export const getWelcomeKvkkEmailTemplate = (data: WelcomeEmailData) => {
  const { name, loginEmail, loginUrl, tempPassword, includePassword = false, restaurantName } = data;
  
  const kvkkContactEmail = process.env.KVKK_CONTACT_EMAIL || 'kvkk@menuben.com';
  const supportEmail = process.env.SUPPORT_EMAIL || 'destek@menuben.com';
  const logoUrl = getLogoUrl();
  const currentYear = new Date().getFullYear();
  const baseUrl = getBaseUrl().replace(/\/$/, '');
  const panelUrl = `${baseUrl}/login`;

  // HTML Template - Modern Light Theme (Kurumsal)
  const html = `
<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>Menü Ben'e Hoş Geldiniz</title>
  <!--[if mso]>
  <style type="text/css">
    body, table, td {font-family: Arial, Helvetica, sans-serif !important;}
  </style>
  <![endif]-->
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #F6F8FB; -webkit-font-smoothing: antialiased;">
  
  <!-- Outer Container -->
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #F6F8FB; padding: 40px 16px;">
    <tr>
      <td align="center">
        
        <!-- Main Card -->
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width: 600px; width: 100%; background-color: #FFFFFF; border-radius: 16px; box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08); overflow: hidden;">
          
          <!-- Header with Logo -->
          <tr>
            <td align="center" style="background-color: #FFFFFF; padding: 32px 40px 24px 40px; border-bottom: 1px solid #E5E7EB;">
              <img src="${logoUrl}" alt="Ben Medya" width="140" height="auto" style="display: block; max-width: 140px; height: auto; border: 0;" />
              <p style="margin: 12px 0 0 0; color: #64748B; font-size: 13px; font-weight: 500; letter-spacing: 0.5px;">QR Menü Yönetim Sistemi</p>
            </td>
          </tr>

          <!-- Main Content -->
          <tr>
            <td style="padding: 32px 40px 40px 40px;">
              
              <!-- Welcome Title -->
              <h1 style="margin: 0 0 8px 0; color: #0F172A; font-size: 24px; font-weight: 700; line-height: 1.3;">
                Hoş geldiniz, ${name || 'Değerli Kullanıcı'}
              </h1>
              
              <!-- Success Message -->
              ${restaurantName ? `
              <p style="margin: 0 0 24px 0; color: #059669; font-size: 15px; font-weight: 600;">
                ✓ <strong>${restaurantName}</strong> işletmeniz başarıyla oluşturuldu.
              </p>
              ` : `
              <p style="margin: 0 0 24px 0; color: #059669; font-size: 15px; font-weight: 600;">
                ✓ QR menü paneliniz başarıyla oluşturuldu.
              </p>
              `}

              <!-- Description -->
              <p style="margin: 0 0 28px 0; color: #475569; font-size: 15px; line-height: 1.7;">
                Artık işletmenizin dijital menüsünü kolayca yönetebilir, QR kodlarınızı oluşturabilir ve müşterilerinize modern bir deneyim sunabilirsiniz.
              </p>

              <!-- Credentials Card -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #F8FAFC; border-radius: 12px; margin-bottom: 24px; border: 1px solid #E2E8F0;">
                <tr>
                  <td style="padding: 24px;">
                    <p style="margin: 0 0 6px 0; color: #64748B; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600;">📧 Giriş E-Postanız</p>
                    <p style="margin: 0 0 0 0; color: #0B5FFF; font-size: 16px; font-weight: 600;">
                      <a href="mailto:${loginEmail}" style="color: #0B5FFF; text-decoration: none;">${loginEmail}</a>
                    </p>
                    
                    ${includePassword && tempPassword ? `
                    <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #E2E8F0;">
                      <p style="margin: 0 0 8px 0; color: #64748B; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600;">🔑 Geçici Şifreniz</p>
                      <table role="presentation" cellspacing="0" cellpadding="0" border="0">
                        <tr>
                          <td style="background-color: #FEF3C7; border: 2px solid #F59E0B; border-radius: 8px; padding: 10px 16px;">
                            <span style="color: #92400E; font-size: 18px; font-weight: 700; font-family: 'Courier New', monospace; letter-spacing: 1px;">${tempPassword}</span>
                          </td>
                        </tr>
                      </table>
                      <p style="margin: 12px 0 0 0; color: #D97706; font-size: 13px; font-weight: 500;">
                        ⚠️ İlk girişten sonra şifrenizi değiştirmenizi öneririz.
                      </p>
                    </div>
                    ` : `
                    <p style="margin: 16px 0 0 0; color: #64748B; font-size: 13px;">🔐 Şifreniz admin tarafından belirlenmiştir.</p>
                    `}
                  </td>
                </tr>
              </table>

              <!-- CTA Button -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                <tr>
                  <td align="center" style="padding: 8px 0 32px 0;">
                    <!--[if mso]>
                    <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="${panelUrl}" style="height:52px;v-text-anchor:middle;width:220px;" arcsize="12%" strokecolor="#FF7A18" fillcolor="#FF7A18">
                      <w:anchorlock/>
                      <center style="color:#ffffff;font-family:sans-serif;font-size:16px;font-weight:bold;">Panele Git →</center>
                    </v:roundrect>
                    <![endif]-->
                    <!--[if !mso]><!-->
                    <a href="${panelUrl}" target="_blank" style="display: inline-block; padding: 16px 48px; background-color: #FF7A18; color: #FFFFFF; text-decoration: none; border-radius: 10px; font-weight: 700; font-size: 16px; text-align: center; mso-hide: all;">
                      Panele Git →
                    </a>
                    <!--<![endif]-->
                  </td>
                </tr>
              </table>

              <!-- Quick Start Guide -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #F0FDF4; border-radius: 12px; margin-bottom: 24px; border: 1px solid #BBF7D0;">
                <tr>
                  <td style="padding: 24px;">
                    <p style="margin: 0 0 16px 0; color: #166534; font-size: 16px; font-weight: 700;">🚀 Hızlı Başlangıç</p>
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                      <tr>
                        <td style="padding: 6px 0; color: #166534; font-size: 14px;">
                          <span style="color: #22C55E; margin-right: 8px;">✓</span> Menü ve kategorileri ekleyin
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 6px 0; color: #166534; font-size: 14px;">
                          <span style="color: #22C55E; margin-right: 8px;">✓</span> Masa / QR kodları oluşturun
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 6px 0; color: #166534; font-size: 14px;">
                          <span style="color: #22C55E; margin-right: 8px;">✓</span> Tema ve görünümü yönetin
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 6px 0; color: #166534; font-size: 14px;">
                          <span style="color: #22C55E; margin-right: 8px;">✓</span> Analizleri takip edin
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- KVKK Section -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #F8FAFC; border-radius: 12px; border: 1px solid #E2E8F0;">
                <tr>
                  <td style="padding: 20px 24px;">
                    <p style="margin: 0 0 12px 0; color: #475569; font-size: 13px; font-weight: 600;">📋 KVKK Bilgilendirmesi</p>
                    <p style="margin: 0 0 10px 0; color: #64748B; font-size: 12px; line-height: 1.6;">
                      Bu e-posta, Menü Ben (QR Kod) hizmeti kapsamında adınıza bir kullanıcı hesabı ve işletme kaydı oluşturulması nedeniyle gönderilmiştir.
                    </p>
                    <p style="margin: 0 0 10px 0; color: #64748B; font-size: 12px; line-height: 1.6;">
                      Kişisel verileriniz ve işletme verileriniz; hizmetin mevzuata uygun, eksiksiz ve sağlıklı bir şekilde sunulması, müşterilerinizin işletmenizle hızlı ve etkin iletişim kurabilmesi ile operasyonel süreçlerin yürütülmesi amaçlarıyla, 6698 sayılı Kişisel Verilerin Korunması Kanunu ("KVKK") kapsamında işlenmektedir.
                    </p>
                    <p style="margin: 0; color: #64748B; font-size: 11px;">
                      KVKK hakları için: <a href="mailto:${kvkkContactEmail}" style="color: #0B5FFF; text-decoration: none;">${kvkkContactEmail}</a> | 
                      Destek: <a href="mailto:${supportEmail}" style="color: #0B5FFF; text-decoration: none;">${supportEmail}</a>
                    </p>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="background-color: #F8FAFC; padding: 24px 40px; border-top: 1px solid #E5E7EB;">
              <p style="margin: 0 0 6px 0; color: #94A3B8; font-size: 12px;">Bu e-posta otomatik olarak gönderilmiştir.</p>
              <p style="margin: 0; color: #94A3B8; font-size: 11px;">© ${currentYear} Menü Ben — Tüm hakları saklıdır.</p>
            </td>
          </tr>

        </table>
        
      </td>
    </tr>
  </table>
</body>
</html>
  `;

  // Plain Text Template
  const text = `
════════════════════════════════════════
MENÜ BEN'E HOŞ GELDİNİZ
════════════════════════════════════════

Hoş geldiniz, ${name || 'Değerli Kullanıcı'}

${restaurantName ? `✓ ${restaurantName} işletmeniz başarıyla oluşturuldu.` : '✓ QR menü paneliniz başarıyla oluşturuldu.'}

Artık işletmenizin dijital menüsünü kolayca yönetebilir, QR kodlarınızı oluşturabilir ve müşterilerinize modern bir deneyim sunabilirsiniz.

────────────────────────────────────────
📧 GİRİŞ BİLGİLERİNİZ
────────────────────────────────────────
E-posta: ${loginEmail}
${includePassword && tempPassword ? `🔑 Geçici Şifre: ${tempPassword}\n⚠️ İlk girişten sonra şifrenizi değiştirmenizi öneririz.` : '🔐 Şifreniz admin tarafından belirlenmiştir.'}

🔗 Panel Linki: ${panelUrl}

────────────────────────────────────────
🚀 HIZLI BAŞLANGIÇ
────────────────────────────────────────
✓ Menü ve kategorileri ekleyin
✓ Masa / QR kodları oluşturun
✓ Tema ve görünümü yönetin
✓ Analizleri takip edin

────────────────────────────────────────
📋 KVKK BİLGİLENDİRMESİ
────────────────────────────────────────
Bu e-posta, Menü Ben (QR Kod) hizmeti kapsamında adınıza bir kullanıcı hesabı ve işletme kaydı oluşturulması nedeniyle gönderilmiştir.

Kişisel verileriniz ve işletme verileriniz; hizmetin mevzuata uygun, eksiksiz ve sağlıklı bir şekilde sunulması, müşterilerinizin işletmenizle hızlı ve etkin iletişim kurabilmesi ile operasyonel süreçlerin yürütülmesi amaçlarıyla, 6698 sayılı Kişisel Verilerin Korunması Kanunu ("KVKK") kapsamında işlenmektedir.

KVKK hakları için: ${kvkkContactEmail}
Destek: ${supportEmail}

════════════════════════════════════════
Bu e-posta otomatik olarak gönderilmiştir.
© ${currentYear} Menü Ben — Tüm hakları saklıdır.
  `;

  return { html, text };
};

export const getWelcomeEmailSubject = (restaurantName?: string): string => {
  if (restaurantName) {
    return `Menü Ben'e Hoş Geldiniz — ${restaurantName}`;
  }
  return "Menü Ben'e Hoş Geldiniz 🎉";
};

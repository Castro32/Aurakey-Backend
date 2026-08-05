// import { Resend } from 'resend';
// import dotenv from 'dotenv';
// dotenv.config();

// const resend = new Resend(process.env.RESEND_API_KEY);

// const FROM = process.env.EMAIL_FROM as string;
// const TO = process.env.EMAIL_TO as string;

// interface ContactData {
//   firstName: string;
//   lastName: string;
//   email: string;
//   phone?: string;
//   interest?: string;
//   message?: string;
// }

// interface ListingData {
//   ownerName: string;
//   email: string;
//   phone: string;
//   propertyType: string;
//   location: string;
//   price: string;
//   bedrooms?: string;
//   description?: string;
//   listingType: string;
// }

// export const sendContactEmail = async (data: ContactData): Promise<void> => {
//   await resend.emails.send({
//     from: FROM,
//     to: TO,
//     reply_to: data.email,
//     subject: `New enquiry from ${data.firstName} ${data.lastName}`,
//     html: `
//       <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 32px;">
//         <div style="background: #114238; padding: 24px; border-radius: 4px 4px 0 0;">
//           <h1 style="color: #E5BF67; font-size: 20px; margin: 0;">New Enquiry — Aura Key Properties</h1>
//         </div>
//         <div style="background: #f7f4ef; padding: 24px; border-radius: 0 0 4px 4px;">
//           <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
//             <tr><td style="padding: 8px 0; color: #666; width: 140px;">Name</td><td style="padding: 8px 0; font-weight: 600;">${data.firstName} ${data.lastName}</td></tr>
//             <tr><td style="padding: 8px 0; color: #666;">Email</td><td style="padding: 8px 0;"><a href="mailto:${data.email}" style="color: #114238;">${data.email}</a></td></tr>
//             <tr><td style="padding: 8px 0; color: #666;">Phone</td><td style="padding: 8px 0;">${data.phone || '—'}</td></tr>
//             <tr><td style="padding: 8px 0; color: #666;">Interest</td><td style="padding: 8px 0;">${data.interest || '—'}</td></tr>
//             <tr><td style="padding: 8px 0; color: #666; vertical-align: top;">Message</td><td style="padding: 8px 0;">${data.message || '—'}</td></tr>
//           </table>
//           <p style="margin-top: 24px; font-size: 12px; color: #aaa;">Received via aurakey.ae contact form</p>
//         </div>
//       </div>
//     `,
//   });

//   // Auto-reply to the client
//   await resend.emails.send({
//     from: FROM,
//     to: data.email,
//     subject: 'Thank you for reaching out — Aura Key Properties',
//     html: `
//       <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 32px;">
//         <div style="background: #114238; padding: 24px; border-radius: 4px 4px 0 0;">
//           <h1 style="color: #E5BF67; font-size: 20px; margin: 0;">Aura Key Properties</h1>
//         </div>
//         <div style="background: #f7f4ef; padding: 32px; border-radius: 0 0 4px 4px;">
//           <p style="font-size: 15px; color: #141615;">Dear ${data.firstName},</p>
//           <p style="font-size: 14px; color: #555; line-height: 1.8;">
//             Thank you for getting in touch with Aura Key Properties. We have received your enquiry and a member of our team will be in contact with you within 24 hours.
//           </p>
//           <p style="font-size: 14px; color: #555; line-height: 1.8;">
//             In the meantime, feel free to explore our latest property listings at
//             <a href="https://aurakey.ae" style="color: #114238;">aurakey.ae</a>.
//           </p>
//           <p style="font-size: 14px; color: #555; margin-top: 24px;">Warm regards,<br><strong style="color: #114238;">The Aura Key Properties Team</strong></p>
//         </div>
//       </div>
//     `,
//   });
// };

// export const sendListingEmail = async (data: ListingData): Promise<void> => {
//   await resend.emails.send({
//     from: FROM,
//     to: TO,
//     reply_to: data.email,
//     subject: `New Property Listing Request — ${data.propertyType} in ${data.location}`,
//     html: `
//       <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 32px;">
//         <div style="background: #114238; padding: 24px; border-radius: 4px 4px 0 0;">
//           <h1 style="color: #E5BF67; font-size: 20px; margin: 0;">List Your Property — Submission</h1>
//         </div>
//         <div style="background: #f7f4ef; padding: 24px; border-radius: 0 0 4px 4px;">
//           <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
//             <tr><td style="padding: 8px 0; color: #666; width: 160px;">Owner Name</td><td style="padding: 8px 0; font-weight: 600;">${data.ownerName}</td></tr>
//             <tr><td style="padding: 8px 0; color: #666;">Email</td><td style="padding: 8px 0;">${data.email}</td></tr>
//             <tr><td style="padding: 8px 0; color: #666;">Phone</td><td style="padding: 8px 0;">${data.phone}</td></tr>
//             <tr><td style="padding: 8px 0; color: #666;">Property Type</td><td style="padding: 8px 0;">${data.propertyType}</td></tr>
//             <tr><td style="padding: 8px 0; color: #666;">Location</td><td style="padding: 8px 0;">${data.location}</td></tr>
//             <tr><td style="padding: 8px 0; color: #666;">Price</td><td style="padding: 8px 0;">${data.price}</td></tr>
//             <tr><td style="padding: 8px 0; color: #666;">Bedrooms</td><td style="padding: 8px 0;">${data.bedrooms || '—'}</td></tr>
//             <tr><td style="padding: 8px 0; color: #666;">Listing Type</td><td style="padding: 8px 0;">${data.listingType}</td></tr>
//             <tr><td style="padding: 8px 0; color: #666; vertical-align: top;">Description</td><td style="padding: 8px 0;">${data.description || '—'}</td></tr>
//           </table>
//         </div>
//       </div>
//     `,
//   });
// };
import { Resend } from 'resend';
import dotenv from 'dotenv';
dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM = process.env.EMAIL_FROM as string;
const TO   = process.env.EMAIL_TO as string;

interface ContactData {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  interest?: string;
  message?: string;
}

interface BrochureData {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  propertyTitle: string;
}

interface ListingData {
  ownerName: string;
  email: string;
  phone: string;
  propertyType: string;
  location: string;
  price: string;
  bedrooms?: string;
  description?: string;
  listingType: string;
}

const emailWrapper = (headerTitle: string, body: string) => `
<div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:32px;">
  <div style="background:#114238;padding:24px;border-radius:4px 4px 0 0;">
    <h1 style="color:#E5BF67;font-size:18px;margin:0;">${headerTitle}</h1>
  </div>
  <div style="background:#f7f4ef;padding:28px;border-radius:0 0 4px 4px;">
    ${body}
    <p style="margin-top:24px;font-size:11px;color:#aaa;">Received via aurakey.ae</p>
  </div>
</div>`;

const row = (label: string, value: string) =>
  `<tr><td style="padding:7px 0;color:#666;width:160px;font-size:13px;">${label}</td><td style="padding:7px 0;font-size:13px;font-weight:600;">${value || '—'}</td></tr>`;

// ── Contact form email ────────────────────────────────────────────────────────
export const sendContactEmail = async (data: ContactData): Promise<void> => {
  await resend.emails.send({
    from: FROM,
    to: TO,
    reply_to: data.email,
    subject: `New enquiry from ${data.firstName} ${data.lastName}`,
    html: emailWrapper('New Enquiry — Aura Key Properties', `
      <table style="width:100%;border-collapse:collapse;">
        ${row('Name', `${data.firstName} ${data.lastName}`)}
        ${row('Email', data.email)}
        ${row('Phone', data.phone || '—')}
        ${row('Interest', data.interest || '—')}
        ${row('Message', data.message || '—')}
      </table>
    `),
  });

  // Auto-reply
  await resend.emails.send({
    from: FROM,
    to: data.email,
    subject: 'Thank you for reaching out — Aura Key Properties',
    html: emailWrapper('Aura Key Properties', `
      <p style="font-size:15px;color:#141615;">Dear ${data.firstName},</p>
      <p style="font-size:14px;color:#555;line-height:1.8;">
        Thank you for getting in touch. A member of our advisory team will contact you within 24 hours.
      </p>
      <p style="font-size:14px;color:#555;line-height:1.8;">
        In the meantime, explore our latest listings at <a href="https://aurakey.ae" style="color:#114238;">aurakey.ae</a>.
      </p>
      <p style="font-size:14px;color:#555;margin-top:24px;">Warm regards,<br><strong style="color:#114238;">The Aura Key Properties Team</strong></p>
    `),
  });
};

// ── Brochure download email ───────────────────────────────────────────────────
export const sendBrochureEmail = async (data: BrochureData): Promise<void> => {
  // Notify the team
  await resend.emails.send({
    from: FROM,
    to: TO,
    reply_to: data.email,
    subject: `Brochure downloaded — ${data.propertyTitle}`,
    html: emailWrapper(`Brochure Download — ${data.propertyTitle}`, `
      <p style="font-size:13px;color:#555;margin-bottom:16px;">
        A visitor has downloaded the brochure for <strong style="color:#114238;">${data.propertyTitle}</strong>.
      </p>
      <table style="width:100%;border-collapse:collapse;">
        ${row('Name', `${data.firstName} ${data.lastName}`)}
        ${row('Email', data.email)}
        ${row('Phone', data.phone || '—')}
        ${row('Property', data.propertyTitle)}
      </table>
    `),
  });

  // Confirmation to the downloader
  await resend.emails.send({
    from: FROM,
    to: data.email,
    subject: `Your brochure for ${data.propertyTitle} — Aura Key Properties`,
    html: emailWrapper('Aura Key Properties', `
      <p style="font-size:15px;color:#141615;">Dear ${data.firstName},</p>
      <p style="font-size:14px;color:#555;line-height:1.8;">
        Thank you for your interest in <strong style="color:#114238;">${data.propertyTitle}</strong>. 
        Your brochure has been downloaded successfully.
      </p>
      <p style="font-size:14px;color:#555;line-height:1.8;">
        One of our property advisors will be in touch shortly to discuss this opportunity in more detail 
        and answer any questions you may have.
      </p>
      <p style="font-size:14px;color:#555;margin-top:24px;">Warm regards,<br><strong style="color:#114238;">The Aura Key Properties Team</strong></p>
    `),
  });
};

// ── Listing submission email ──────────────────────────────────────────────────
export const sendListingEmail = async (data: ListingData): Promise<void> => {
  await resend.emails.send({
    from: FROM,
    to: TO,
    reply_to: data.email,
    subject: `New Listing Request — ${data.propertyType} in ${data.location}`,
    html: emailWrapper('List Your Property — Submission', `
      <table style="width:100%;border-collapse:collapse;">
        ${row('Owner Name', data.ownerName)}
        ${row('Email', data.email)}
        ${row('Phone', data.phone)}
        ${row('Property Type', data.propertyType)}
        ${row('Location', data.location)}
        ${row('Price', data.price)}
        ${row('Bedrooms', data.bedrooms || '—')}
        ${row('Listing Type', data.listingType)}
        ${row('Description', data.description || '—')}
      </table>
    `),
  });
};
interface WANotification {
  name: string;
  email: string;
  phone?: string;
  type: 'contact' | 'listing';
  interest?: string;
}

export const sendWhatsAppNotification = async (data: WANotification): Promise<void> => {
  const number = process.env.WHATSAPP_NUMBER;
  if (!number) return;

  let message = '';

  if (data.type === 'contact') {
    message = `*New Aura Key Enquiry*%0A%0A*Name:* ${data.name}%0A*Email:* ${data.email}%0A*Phone:* ${data.phone || 'N/A'}%0A*Interest:* ${data.interest || 'General'}`;
  } else {
    message = `*New Property Listing Request*%0A%0A*Owner:* ${data.name}%0A*Email:* ${data.email}%0A*Phone:* ${data.phone || 'N/A'}%0A*Type:* ${data.interest || 'Property'}`;
  }

  // In production: use WhatsApp Business API (e.g. Twilio or Meta Cloud API)
  // This constructs the wa.me deep link — swap with API call when ready
  const waLink = `https://wa.me/${number}?text=${message}`;

  console.log(`[WhatsApp] Notification ready: ${waLink}`);
  // TODO: Replace with Twilio WhatsApp API call:
  // await twilioClient.messages.create({
  //   from: 'whatsapp:+14155238886',
  //   to: `whatsapp:+${number}`,
  //   body: message.replace(/%0A/g, '\n').replace(/\*/g, '')
  // });
};
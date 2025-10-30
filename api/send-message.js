// api/send-message.js (for Vercel)
// Place this file in /api folder in your project root

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { message } = req.body;

    if (!message || message.trim().length === 0) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Get IP address (works on Vercel)
    const ip = req.headers['x-forwarded-for']?.split(',')[0] || 
               req.headers['x-real-ip'] || 
               req.socket.remoteAddress || 
               'Unknown';

    // Get additional info
    const userAgent = req.headers['user-agent'] || 'Unknown';
    const timestamp = new Date().toISOString();
    const referer = req.headers['referer'] || 'Direct';

    // Create message data
    const messageData = {
      message: message.trim(),
      ip: ip,
      userAgent: userAgent,
      timestamp: timestamp,
      referer: referer
    };

    // Store the message (multiple options below)
    await storeMessage(messageData);

    return res.status(200).json({ 
      success: true, 
      message: 'Message received successfully' 
    });

  } catch (error) {
    console.error('Error processing message:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

// OPTION 1: Store in a JSON file (simple, but has limitations on serverless)
async function storeMessage(data) {
  // This won't work well on serverless - use Option 2 or 3 instead
  // Just logging for now
  console.log('Message received:', data);
}

// OPTION 2: Send to your email via API
async function sendToEmail(data) {
  // Using a free service like EmailJS, SendGrid, or Resend
  // Example with fetch to an email service:
  
  const emailBody = `
    New Anonymous Message Received!
    
    Message: ${data.message}
    
    Details:
    - IP Address: ${data.ip}
    - User Agent: ${data.userAgent}
    - Timestamp: ${data.timestamp}
    - Referer: ${data.referer}
  `;

  // Send email here (integrate with your chosen service)
  // Example with SendGrid, Resend, etc.
}

// OPTION 3: Store in a free database
async function storeInDatabase(data) {
  // Options:
  // - Supabase (free tier)
  // - MongoDB Atlas (free tier)
  // - Firebase Firestore (free tier)
  // - Airtable (free tier)
  
  // Example with fetch to Supabase:
  // const response = await fetch('YOUR_SUPABASE_URL/rest/v1/messages', {
  //   method: 'POST',
  //   headers: {
  //     'Content-Type': 'application/json',
  //     'apikey': 'YOUR_SUPABASE_KEY',
  //     'Authorization': 'Bearer YOUR_SUPABASE_KEY'
  //   },
  //   body: JSON.stringify(data)
  // });
}

// OPTION 4: Send to Discord/Telegram webhook (easiest!)
async function sendToWebhook(data) {
  const webhookUrl = 'YOUR_DISCORD_OR_TELEGRAM_WEBHOOK_URL';
  
  const discordMessage = {
    embeds: [{
      title: '📨 New Anonymous Message',
      description: data.message,
      color: 5814783,
      fields: [
        { name: '🌐 IP Address', value: data.ip, inline: true },
        { name: '🕒 Time', value: data.timestamp, inline: true },
        { name: '🖥️ User Agent', value: data.userAgent },
        { name: '🔗 Referer', value: data.referer }
      ]
    }]
  };

  await fetch(webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(discordMessage)
  });
}
import { NextResponse } from 'next/server';

function escapeHtml(unsafe: string) {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

export async function POST(request: Request) {
  try {
    const { name, email, message, subject, source } = await request.json();

    if (!name || !email || !message) {
      return NextResponse.json(
        { success: false, message: 'Name, email, and message are required.' },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email) || email.length > 254) {
      return NextResponse.json(
        { success: false, message: 'Invalid email address.' },
        { status: 400 }
      );
    }

    if (name.length > 100 || message.length > 3000) {
      return NextResponse.json(
        { success: false, message: 'Input payload exceeds maximum allowed limit.' },
        { status: 400 }
      );
    }

    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!chatId) {
      console.error('TELEGRAM_CHAT_ID environment variable is not set.');
      return NextResponse.json(
        { success: false, message: 'Telegram Chat ID is not configured. Please set TELEGRAM_CHAT_ID in .env.' },
        { status: 500 }
      );
    }

    const text = `<b>📩 New Contact Form Submission</b>\n\n` +
      `<b>Name:</b> ${escapeHtml(name)}\n` +
      `<b>Email:</b> ${escapeHtml(email)}\n` +
      (subject ? `<b>Subject:</b> ${escapeHtml(subject)}\n` : '') +
      (source ? `<b>Source:</b> ${escapeHtml(source)}\n` : '') +
      `\n<b>Message:</b>\n${escapeHtml(message)}`;

    const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: text,
        parse_mode: 'HTML',
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Telegram API Error:', errorData);
      return NextResponse.json(
        { success: false, message: 'Failed to send message to Telegram.' },
        { status: 502 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Thank you for your message! I'll get back to you soon.",
    });
  } catch (error) {
    console.error('Error handling contact form:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error.' },
      { status: 500 }
    );
  }
}

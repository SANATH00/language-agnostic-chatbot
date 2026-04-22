import { NextResponse } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

const RESPONSES = {
  fee:         'The fee deadline is March 20. Please check the official portal.',
  exam:        'Exam timetables will be released soon. Check the notice board.',
  scholarship: 'Scholarship applications are open. Visit the admin office.',
  hostel:      'For hostel queries contact the warden office.',
  library:     'Library is open from 9am to 6pm on weekdays.',
  hello:       'Hello! How can I help you today?',
  default:     'Please contact the admin office for more details.',
};

function getRuleBasedResponse(message) {
  const m = message.toLowerCase();
  if (m.includes('fee'))                        return RESPONSES.fee;
  if (m.includes('exam'))                       return RESPONSES.exam;
  if (m.includes('scholarship'))                return RESPONSES.scholarship;
  if (m.includes('hostel'))                     return RESPONSES.hostel;
  if (m.includes('library'))                    return RESPONSES.library;
  if (m.includes('hello') || m.includes('hi'))  return RESPONSES.hello;
  return RESPONSES.default;
}

export async function POST(req) {
  try {
    const { message, language, token } = await req.json();
    const m = message.toLowerCase().trim();
    let reply = '';
    let source = null;

    const isSummarize = m.includes('summarize') || m.includes('summarise') || m.includes('summary');

    if (isSummarize && token) {
      const sumRes = await fetch(`${API_URL}/summarize-pdf`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (sumRes.ok) {
  const sumData = await sumRes.json();
     if (sumData && sumData.summary) {
          reply = `Summary of ${sumData.filename || 'uploaded PDF'}:\n\n${sumData.summary}`;
          source = sumData.filename || null;
      } else {
          reply = 'Could not generate summary. Please try again.';
        }
        }

    } else if (token) {
      const ragRes = await fetch(`${API_URL}/rag-response`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ question: message, language })
      });
      if (ragRes.ok) {
        const ragData = await ragRes.json();
        if (ragData.found_in_document) {
          reply = ragData.answer;
          source = ragData.source;
        }
      }
    }

    if (!reply) {
      reply = getRuleBasedResponse(message);
    }

    if (language && language !== 'English' && reply) {
      const transRes = await fetch(`${API_URL}/translate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: reply, target_language: language })
      });
      if (transRes.ok) {
        const transData = await transRes.json();
        reply = transData.translated_text;
      }
    }

    return NextResponse.json({ reply, source });

  } catch (error) {
    console.error('Chat error:', error);
    return NextResponse.json({ reply: 'Connection error. Please try again.', source: null });
  }
}
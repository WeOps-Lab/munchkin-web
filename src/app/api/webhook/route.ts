import { NextRequest, NextResponse } from 'next/server';

// 配置API
export const config = {
  api: {
    bodyParser: true,
  },
};

// 处理POST请求
export const POST = async (req: NextRequest) => {
  try {
    const { sender, message } = await req.json();
    const payload = { sender, message };

    const response = await fetch('http://104.215.58.237:40010/webhooks/rest/webhook', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
      credentials: 'include',
    });

    if (!response.ok) {
      return NextResponse.json({ message: 'Network response was not ok' }, { status: response.status });
    }

    const json = await response.json();
    return NextResponse.json(json);
  } catch (error) {
    console.error('Fetch failed:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
};

// 处理其他方法的请求
export const GET = async () => {
  return NextResponse.json({ message: 'Method Not Allowed' }, { status: 405 });
};

export const PUT = async () => {
  return NextResponse.json({ message: 'Method Not Allowed' }, { status: 405 });
};

export const DELETE = async () => {
  return NextResponse.json({ message: 'Method Not Allowed' }, { status: 405 });
};

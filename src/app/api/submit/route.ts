import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    
    const data = {
      firstName: formData.get('firstName'),
      lastName: formData.get('lastName'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      username: formData.get('username'),
      password: formData.get('password'),
      terms: formData.get('terms'),
      file: formData.get('file'),
    };

    console.log('Form submitted:', data);

    return NextResponse.json({ success: true });

  } catch (error) {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}

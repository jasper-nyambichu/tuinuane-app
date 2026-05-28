import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

const adminClient = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET() {
  const { data, error } = await adminClient
    .from('leads')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ data })
}

export async function POST(req: NextRequest) {
  const body = await req.json()

  const { data, error } = await adminClient
    .from('leads')
    .insert([{
      name: body.name,
      phone: body.phone,
      email: body.email,
      message: body.message,
    }])
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  try {
    await resend.emails.send({
      from: 'Tuinuane System <noreply@tuinuanedigitals.co.ke>',
      to: process.env.ADMIN_EMAIL!,
      subject: `📩 New Contact Message — ${body.name}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${body.name}</p>
        <p><strong>Phone:</strong> ${body.phone}</p>
        <p><strong>Email:</strong> ${body.email}</p>
        <p><strong>Message:</strong> ${body.message}</p>
        <p><a href="${process.env.NEXT_PUBLIC_SITE_URL}/admin/leads">View in Admin →</a></p>
      `,
    })

    await resend.emails.send({
      from: 'Tuinuane Digitals <hello@tuinuanedigitals.co.ke>',
      to: body.email,
      subject: '✅ We got your message!',
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto">
          <h2 style="color:#3b82f6">Hi ${body.name},</h2>
          <p>Thank you for reaching out to Tuinuane Digitals!</p>
          <p>We have received your message and will get back to you <strong>within 24 hours</strong>.</p>
          <p>Need a faster response? WhatsApp or call us:<br/>
          <strong>+254 700 000 000</strong></p>
          <hr/>
          <p style="color:#888;font-size:12px">Tuinuane Digitals — Modern software for African businesses</p>
        </div>
      `,
    })
  } catch (emailError) {
    console.error('Email sending failed:', emailError)
  }

  return NextResponse.json({ data }, { status: 201 })
}
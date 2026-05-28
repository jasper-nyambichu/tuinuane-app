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
    .from('quotes')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ data })
}

export async function POST(req: NextRequest) {
  const body = await req.json()

  const anonClient = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const { data, error } = await anonClient
    .from('quotes')
    .insert([{
      name: body.name,
      phone: body.phone,
      email: body.email,
      business_name: body.businessName,
      product_interest: body.productInterest,
      description: body.description,
    }])
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Notify admin
  await resend.emails.send({
    from: 'Tuinuane System <noreply@tuinuanedigitals.co.ke>',
    to: process.env.ADMIN_EMAIL!,
    subject: `🔔 New Quote Request — ${body.businessName}`,
    html: `
      <h2>New Quote Request</h2>
      <table style="border-collapse:collapse;width:100%">
        <tr><td style="padding:8px;border:1px solid #eee"><strong>Name</strong></td><td style="padding:8px;border:1px solid #eee">${body.name}</td></tr>
        <tr><td style="padding:8px;border:1px solid #eee"><strong>Phone</strong></td><td style="padding:8px;border:1px solid #eee">${body.phone}</td></tr>
        <tr><td style="padding:8px;border:1px solid #eee"><strong>Business</strong></td><td style="padding:8px;border:1px solid #eee">${body.businessName}</td></tr>
        <tr><td style="padding:8px;border:1px solid #eee"><strong>Product</strong></td><td style="padding:8px;border:1px solid #eee">${body.productInterest}</td></tr>
        <tr><td style="padding:8px;border:1px solid #eee"><strong>Description</strong></td><td style="padding:8px;border:1px solid #eee">${body.description}</td></tr>
      </table>
      <p><a href="${process.env.NEXT_PUBLIC_SITE_URL}/admin/proposals">View in Admin →</a></p>
    `,
  })

  // Auto reply
  await resend.emails.send({
    from: 'Tuinuane Digitals <hello@tuinuanedigitals.co.ke>',
    to: body.email,
    subject: `✅ We received your request — ${body.businessName}`,
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto">
        <h2 style="color:#3b82f6">Thank you, ${body.name}!</h2>
        <p>We have received your request for <strong>${body.productInterest}</strong> for <strong>${body.businessName}</strong>.</p>
        <p>Here is what happens next:</p>
        <ol>
          <li>Our team reviews your request <strong>within 2 hours</strong></li>
          <li>We prepare a custom proposal with scope, timeline and pricing</li>
          <li>We send it to you <strong>within 24 hours</strong></li>
        </ol>
        <p>Need faster response? WhatsApp or call us:<br/>
        <strong>+254 700 000 000</strong></p>
        <hr/>
        <p style="color:#888;font-size:12px">Tuinuane Digitals — Modern software for African businesses</p>
      </div>
    `,
  })

  return NextResponse.json({ data }, { status: 201 })
}
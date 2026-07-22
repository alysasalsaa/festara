import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  try {
    const { to, subject, message } = await req.json();

    if (!to || !subject || !message) {
      return NextResponse.json({ success: false, error: "to, subject, dan message wajib diisi" }, { status: 400 });
    }

    const { error } = await resend.emails.send({
      from: "Festara <notifikasi@festara.id>",
      to,
      subject: `[Festara] ${subject}`,
      html: `<div style="font-family: sans-serif; font-size: 14px; color: #1A3A3C; line-height: 1.6;">${message}</div>`,
    });

    if (error) {
      console.error("Gagal kirim email ke vendor:", error);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("Notify vendor error:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
import { NextRequest, NextResponse } from "next/server";
import midtransClient from "midtrans-client";

export async function POST(req: NextRequest) {
  try {
    const { orderId, amount } = await req.json();

    if (!orderId || !amount) {
      return NextResponse.json({ success: false, error: "orderId dan amount wajib diisi" }, { status: 400 });
    }

    const core = new midtransClient.CoreApi({
      isProduction: false,
      serverKey: process.env.MIDTRANS_SERVER_KEY!,
      clientKey: process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY!,
    });

    const parameter = {
      payment_type: "qris",
      transaction_details: {
        order_id: orderId,
        gross_amount: amount,
      },
    };

    const chargeResponse = await core.charge(parameter);

    return NextResponse.json({ success: true, data: chargeResponse });
  } catch (err: any) {
    console.error("Midtrans charge error:", err);
    return NextResponse.json({ success: false, error: err.message || "Gagal membuat transaksi" }, { status: 500 });
  }
}
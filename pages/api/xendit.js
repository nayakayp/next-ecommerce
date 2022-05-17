import Xendit from "xendit-node";

const xendit = new Xendit({
  secretKey: process.env.NEXT_PUBLIC_XENDIT_SECRET_KEY,
});

const { QrCode } = xendit;
const q = new QrCode({});

export default async function handler(req, res) {
  if (req.method === "POST") {
    console.log(q);
    try {
      let qrcode = await q.createCode({
        externalID: Date.now().toString(),
        type: QrCode.Type.Dynamic,
        callbackURL:
          "https://next-ecommerce-two-steel.vercel.app/payment_success",
        amount: 10000,
        metadata: {
          meta2: "data2",
        },
      });
      console.log("created QR code", qrcode); // eslint-disable-line no-console

      qrcode = await q.getCode({ externalID: qrcode.external_id });
      console.log("retrieved QR code", qrcode); // eslint-disable-line no-console

      const payment = await q.simulate({ externalID: qrcode.external_id });
      console.log("simulated payment", payment); // eslint-disable-line no-console

      let payments = await q.getPayments({
        externalID: qrcode.external_id,
        from: "2021-01-04T08:09:30.000Z",
        to: new Date().toISOString(),
        limit: 10,
      });
      // eslint-disable-next-line no-console
      console.log("retrieved payments", payments);
    } catch (error) {
      console.log("error cuy: ", error.message);
    }
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
}

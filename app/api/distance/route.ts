import { NextRequest, NextResponse } from "next/server";
import { DELIVERY } from "@/lib/data";

/* ---------------------------------------------------------------------------
   POST /api/distance — { address } → { ok, km, fee } via Google Routes API.
   Sans GOOGLE_MAPS_SERVER_KEY : { ok:false, reason:"no-key" } (le front
   affiche alors « livraison confirmée par Annie »).
--------------------------------------------------------------------------- */

export async function POST(req: NextRequest) {
  const key = process.env.GOOGLE_MAPS_SERVER_KEY;
  let address = "";
  try {
    const body = await req.json();
    address = String(body.address ?? "").slice(0, 200).trim();
  } catch {
    return NextResponse.json({ ok: false, reason: "bad-request" }, { status: 400 });
  }
  if (address.length < 5) {
    return NextResponse.json({ ok: false, reason: "address-too-short" }, { status: 400 });
  }
  if (!key) {
    return NextResponse.json({ ok: false, reason: "no-key" });
  }

  try {
    const res = await fetch("https://routes.googleapis.com/directions/v2:computeRoutes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": key,
        "X-Goog-FieldMask": "routes.distanceMeters",
      },
      body: JSON.stringify({
        origin: { address: DELIVERY.origin },
        destination: { address: `${address}, Suisse` },
        travelMode: "DRIVE",
      }),
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) throw new Error(`routes-api ${res.status}`);
    const data = await res.json();
    const meters = data?.routes?.[0]?.distanceMeters;
    if (typeof meters !== "number") {
      return NextResponse.json({ ok: false, reason: "not-found" });
    }
    const km = Math.ceil(meters / 1000);
    const fee = Math.max(0, km - DELIVERY.freeKm) * DELIVERY.chfPerKm;
    return NextResponse.json({ ok: true, km, fee });
  } catch {
    return NextResponse.json({ ok: false, reason: "error" });
  }
}

"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import CounterAnimation from "@/components/CounterAnimation";

export default function StatsSection() {
  const [vendorCount, setVendorCount] = useState(0);
  const [bookingCount, setBookingCount] = useState(0);
  const [satisfaction, setSatisfaction] = useState(0);
  const [cityCount, setCityCount] = useState(0);

  useEffect(() => {
    async function fetchCounts() {
      const { count: vendors } = await supabase
        .from("vendors")
        .select("*", { count: "exact", head: true });

      const { count: bookings } = await supabase
        .from("bookings")
        .select("*", { count: "exact", head: true })
        .eq("status", "completed");

      const { data: reviews } = await supabase
        .from("reviews")
        .select("rating");

      const { data: locations } = await supabase
        .from("vendors")
        .select("location")
        .not("location", "is", null);

      setVendorCount(vendors || 0);
      setBookingCount(bookings || 0);

      if (reviews && reviews.length > 0) {
        const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
        setSatisfaction(Math.round((avgRating / 5) * 100));
      } else {
        setSatisfaction(0);
      }

      if (locations) {
        const uniqueCities = new Set(locations.map((v) => v.location));
        setCityCount(uniqueCities.size);
      }
    }

    fetchCounts();
  }, []);

  return (
    <div className="bg-gradient-to-br from-white/80 to-[#DBEBC9]/60 backdrop-blur rounded-3xl p-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
      <div>
        <p className="text-4xl font-extrabold text-[#1CABB4]">
          <CounterAnimation target={vendorCount} suffix="+" />
        </p>
        <p className="text-sm text-[#16302e] mt-1">Vendor Terdaftar</p>
      </div>
      <div>
        <p className="text-4xl font-extrabold text-[#1CABB4]">
          <CounterAnimation target={bookingCount} suffix="+" />
        </p>
        <p className="text-sm text-[#16302e] mt-1">Booking Selesai</p>
      </div>
      <div>
        <p className="text-4xl font-extrabold text-[#1CABB4]">
          <CounterAnimation target={satisfaction} suffix="%" />
        </p>
        <p className="text-sm text-[#16302e] mt-1">Kepuasan Klien</p>
      </div>
      <div>
        <p className="text-4xl font-extrabold text-[#1CABB4]">
          <CounterAnimation target={cityCount} suffix="+" />
        </p>
        <p className="text-sm text-[#16302e] mt-1">Kota di Indonesia</p>
      </div>
    </div>
  );
}
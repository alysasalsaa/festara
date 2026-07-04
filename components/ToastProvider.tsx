"use client";
import { Toaster } from "react-hot-toast";

export default function ToastProvider() {
  return (
    <Toaster position="top-right" toastOptions={{
      style: {
        background: "#fff",
        color: "#0D545A",
        border: "1px solid #D4EAC8",
        borderRadius: "16px",
        fontSize: "13px",
      },
      success: { iconTheme: { primary: "#1CABB4", secondary: "#fff" } },
    }} />
  );
}
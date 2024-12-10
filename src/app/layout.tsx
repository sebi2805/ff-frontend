import type { Metadata } from "next";
import React, { Suspense } from "react";

import "./globals.css";
import "react-toastify/dist/ReactToastify.css";
import "react-big-calendar/lib/css/react-big-calendar.css";

export const metadata: Metadata = {
  title: "Fit Flow",
  description: "An app for tracking your fitness progress",
};

const LazyToastContainer = React.lazy(() =>
  import("react-toastify").then((module) => ({
    default: module.ToastContainer,
  }))
);

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`antialiased`}>
        {children}
        {/* I dont want toastify to mess up our SSR */}
        <Suspense fallback={null}>
          <LazyToastContainer />
        </Suspense>
      </body>
    </html>
  );
}

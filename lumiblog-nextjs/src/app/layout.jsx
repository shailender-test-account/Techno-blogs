import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import ReduxProvider from "@/redux/ReduxProvider";

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-inter",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-playfair",
});

export const metadata = {
  title: "LumiBlog - Stories that Inspire",
  description: "Thoughtful articles on lifestyle, travel, wellness and everything in between.",
};

export default function RootLayout({ children }) {

  



  return (
    <html lang="en" className={`scroll-smooth ${inter.variable} ${playfair.variable}`}>
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
        />
      </head>
      <body className="antialiased text-brand-dark selection:bg-brand-lightPink selection:text-brand-pink w-full overflow-x-hidden">
        <ReduxProvider>{children}</ReduxProvider>
        <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
      </body>
    </html>
  );
}

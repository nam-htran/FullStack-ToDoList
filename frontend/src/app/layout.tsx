import type { Metadata } from "next";
import "./globals.css";
import { GoogleOAuthProvider } from '@react-oauth/google';

export const metadata: Metadata = {
  title: "ToDoApp",
  description: "Project design by NextJS + NodeJS + JSON Server + DaisyUI",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="my-10 mx-auto max-w-2xl">
        {/* Bọc children trong GoogleOAuthProvider và cung cấp clientId */}
        <GoogleOAuthProvider clientId={process.env.GOOGLE_CLIENT_ID as string}>
          <div>{children}</div>
        </GoogleOAuthProvider>
      </body>
    </html>
  );
}

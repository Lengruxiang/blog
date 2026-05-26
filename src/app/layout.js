import { Geist, Geist_Mono } from 'next/font/google';
import Header from '@/components/Header';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata = {
  title: '我的博客',
  description: '个人博客 - 记录生活与想法',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="zh-CN"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <footer className="tb-footer">
          &copy; {new Date().getFullYear()} 我的博客 &mdash; Powered by Next.js
        </footer>
      </body>
    </html>
  );
}

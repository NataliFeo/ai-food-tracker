import type { Metadata, Viewport } from 'next';
import './globals.css';
export const metadata: Metadata = { title:'AI Food Tracker — питание в балансе', description:'Дневник питания с AI: анализ еды по фото и тексту, индивидуальная норма калорий и БЖУ. Без регистрации.', icons: {icon:'/icon.svg'} };
export const viewport: Viewport = {width:'device-width', initialScale:1, themeColor:'#244c3a'};
export default function RootLayout({children}: Readonly<{children:React.ReactNode}>) { return <html lang="ru"><body>{children}</body></html>; }

export const dynamic = 'force-dynamic'
import { auth } from '@/auth'
import { redirect } from 'next/navigation'

export default async function ProfileLayout({
    children,
    params
}: Readonly<{
    children: React.ReactNode;
    params: Promise<{ lang: string }>
}>) {
    const { lang } = await params;
    const session = await auth();
    if (!session) {
        redirect(`/${lang}/auth/login`)
    }
    
    return (
        children
    );
}

'use client';
import * as React from 'react';
import { notFound, useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useSearchParams } from "next/navigation";
import styles from "/public/css/template/loading.module.css";
import Image from "next/image";
import { verifyPayment } from '@/lib/services/products.services';
import { PaymentData } from '@/types/products.types';
import Link from '@/components/localized-link';
import { Trans } from '@lingui/react/macro';
import LoadingSpin from '@/components/ui/loading-spin';

export default function SlugPage() {
    const [data, setData] = useState<PaymentData>()
    const [loading, setLoading] = useState(true)
    const searchParams = useSearchParams();

    const tc = searchParams.get("tc");

    const [isSuccess, setIsSuccess] = useState(false);

    React.useLayoutEffect(() => {
        setLoading(true)
        console.log(tc)
        if (tc) {
            try {
                verifyPayment(tc).then((res) => {
                    document.head.title = res.data?.status === "COMPLETE" ? "پرداخت موفق" : "پرداخت ناموفق"
                    console.log(res)
                    setData(res.data)
                    if (res.data?.status === "COMPLETE") {
                        setIsSuccess(true)
                    }
                }).catch((res) => {
                    setData(res.response.data.data)
                }).finally(() => {
                    setLoading(false)
                })
            } catch {
                notFound()
            }

        } else {
            notFound()
        }
    }, [tc]);


    if (loading) {
        return (<div className='h-screen flex justify-center items-center text-black gap-3'>
            <LoadingSpin className='text-black' />
            <Trans>
                لطفا صبر کنید...
            </Trans>
        </div>)
    }
    return (
        <main className='xl:container px-5 xl:px-0 mt-28 min-h-screen pb-[100px]'>
            {/* <h1>Payment</h1>
            <p>Slug: {slug?.[1]}</p> */}
            <div className="flex flex-col items-center">
                <div className={`flex justify-center items-center h-24 w-full max-w-[1173px] rounded-[15px] text-white text-2xl font-bold ${isSuccess ? 'bg-[#2FB338]' : 'bg-[#F42222]'}`}>
                    {isSuccess ?
                        <Trans>پرداخت موفقیت آمیز بود</Trans>
                        :
                        <Trans>پرداخت ناموفق بود</Trans>
                    }
                </div>
                <div className='flex flex-col items-center gap-5 mt-[52px]'>
                    <span>

                        {isSuccess ? <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M60 10C32.45 10 10 32.45 10 60C10 87.55 32.45 110 60 110C87.55 110 110 87.55 110 60C110 32.45 87.55 10 60 10ZM83.9 48.5L55.55 76.85C54.85 77.55 53.9 77.95 52.9 77.95C51.9 77.95 50.95 77.55 50.25 76.85L36.1 62.7C34.65 61.25 34.65 58.85 36.1 57.4C37.55 55.95 39.95 55.95 41.4 57.4L52.9 68.9L78.6 43.2C80.05 41.75 82.45 41.75 83.9 43.2C85.35 44.65 85.35 47 83.9 48.5Z" fill="#2FB338" />
                        </svg> : <svg width="121" height="121" viewBox="0 0 121 121" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M60.5002 10.0835C32.7206 10.0835 10.0835 32.7206 10.0835 60.5002C10.0835 88.2798 32.7206 110.917 60.5002 110.917C88.2798 110.917 110.917 88.2798 110.917 60.5002C110.917 32.7206 88.2798 10.0835 60.5002 10.0835ZM77.4402 72.096C78.9023 73.5581 78.9023 75.9781 77.4402 77.4402C76.6839 78.1964 75.726 78.5493 74.7681 78.5493C73.8102 78.5493 72.8522 78.1964 72.096 77.4402L60.5002 65.8443L48.9043 77.4402C48.1481 78.1964 47.1902 78.5493 46.2323 78.5493C45.2743 78.5493 44.3164 78.1964 43.5602 77.4402C42.0981 75.9781 42.0981 73.5581 43.5602 72.096L55.156 60.5002L43.5602 48.9043C42.0981 47.4422 42.0981 45.0223 43.5602 43.5602C45.0223 42.0981 47.4422 42.0981 48.9043 43.5602L60.5002 55.156L72.096 43.5602C73.5581 42.0981 75.9781 42.0981 77.4402 43.5602C78.9023 45.0223 78.9023 47.4422 77.4402 48.9043L65.8443 60.5002L77.4402 72.096Z" fill="#F42222" />
                        </svg>
                        }
                    </span>
                    {isSuccess ? <span className='text-2xl font-bold text-[#2FB338]'>
                        <Trans>
                            پرداخت با موفقیت انجام شد
                        </Trans>
                    </span> : <span className='text-2xl font-bold text-[#F42222]'>

                        <Trans>پرداخت ناموفق بود</Trans>

                    </span>}
                </div>
                <div className='flex flex-col gap-12 pt-[60px] pb-[80px] px-5 w-full max-w-[751px] bg-white rounded-[20px] mt-[55px]'>
                    <ul className='space-y-12 text-xl w-full max-w-[497px] mx-auto'>
                        <li className='flex justify-between items-center'>
                            <span className='font-bold text-[#232323]'>
                                <Trans>
                                    مبلغ
                                </Trans>:
                            </span>
                            <span className='text-[#4C4C4C] flex gap-2'>
                                {data?.amount.toLocaleString() || " - "} <Trans>ریال</Trans>
                            </span>
                        </li>
                        <li className='flex justify-between items-center'>
                            <span className='font-bold text-[#232323]'>
                                <Trans>
                                    شماره سفارش
                                </Trans>:
                            </span>
                            <span className='text-[#4C4C4C]'>
                                {data?.order || " - "}
                            </span>
                        </li>
                        <li className='flex justify-between items-center'>
                            <span className='font-bold text-[#232323]'>
                                <Trans>
                                    بانک پرداخت
                                </Trans>:
                            </span>
                            <span className='text-[#4C4C4C]'>
                                درگاه پرداخت زرین پال
                            </span>
                        </li>
                        <li className='flex justify-between items-center'>
                            <span className='font-bold text-[#232323]'>
                                <Trans>
                                    شماره پیگیری پرداخت
                                </Trans>:
                            </span>
                            <span className='text-[#4C4C4C]'>
                                {tc}
                            </span>
                        </li>
                    </ul>
                    {!isSuccess && <Link href='/' className='w-full max-w-[496px] mx-auto'>
                        <button className='h-10 w-full text-sm bg-primary text-white rounded-[10px]'>
                            <Trans>بازگشت به صفحه اول سایت</Trans>
                        </button>
                    </Link>}
                    {isSuccess && data?.order_payed_status && <Link href={`/profile/orders`} className='w-full max-w-[496px] mx-auto'>
                        <button className='h-10 w-full text-sm bg-primary text-white rounded-[10px]'>
                            <Trans>
                                مشاهده سفارشات
                            </Trans>
                        </button>
                    </Link>}
                </div>

            </div>
        </main>
    );
}
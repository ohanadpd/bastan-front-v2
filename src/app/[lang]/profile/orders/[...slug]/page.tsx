import { initLingui } from '@/initLingui';
import { Trans } from '@lingui/react/macro';
import * as React from 'react';
import Image from 'next/image';
import Link from '@/components/localized-link';
import { fetchOrderDetail } from '@/lib/services/products.services';
import { formatIsoToJalali } from '@/lib/utils';
import { msg } from '@lingui/core/macro';
import { getI18nInstance } from '@/appRouterI18n';

export async function generateMetadata({ params }: PageProps) {
    const { lang } = await params;
    const i18n = getI18nInstance(lang);
    return {
        title: i18n._(msg`جزییات سفارش`),
    };
}

interface PageProps {
    params: Promise<{
        lang: string;
        slug: string;
    }>;
}

const statusList = [
    msg`در حال پردازش`,
    msg`انجام شده`,
    msg`لغو شده`,
    msg`در حال ارسال`
]

export default async function OrderDetailPage({ params }: PageProps) {
    const { lang, slug } = await params;
    const i18n = initLingui(lang);

    const { data } = await fetchOrderDetail(slug[0])
    return (
        <main className="container max-w-[1280px] mx-auto mt-[140px] mb-[172px] xl:mb-[102px]">
            <h1 className="text-2xl xl:text-[32px] font-bold text-center text-primary">
                <Trans>جزییات سفارش</Trans> {data.id}
            </h1>

            <div className="bg-white px-4 py-5 xl:p-6 rounded-[10px] mt-8 xl:mt-9">
                <h3 className="font-semibold text-lg">
                    <Trans>جزییات سفارش</Trans>
                </h3>
                <hr className="mt-2 xl:mt-3 mb-5 xl:mb-7" />
                <div className="flex flex-col xl:flex-row xl:justify-between gap-7">
                    <ul className="space-y-5 w-full xl:max-w-[492px]">
                        <li className="flex items-center justify-between">
                            <span className="text-sm font-semibold text-gray4">
                                <Trans>شماره سفارش</Trans>:
                            </span>
                            <span className="text-sm font-semibold text-gray2">
                                {data.id}
                            </span>
                        </li>
                        <li className="flex items-center justify-between">
                            <span className="text-sm font-semibold text-gray4">
                                <Trans>نام</Trans>:
                            </span>
                            <span className="text-sm font-semibold text-gray2">
                                {data.address.receiver_fullname}
                            </span>
                        </li>
                        <li className="flex items-center justify-between">
                            <span className="text-sm font-semibold text-gray4">
                                <Trans>شماره تماس</Trans>:
                            </span>
                            <span dir='ltr' className="text-sm font-semibold text-gray2">
                                {data.address.receiver_mobile_number}
                            </span>
                        </li>
                        {/* <li className="flex items-center justify-between">
                            <span className="text-sm font-semibold text-gray4">
                                <Trans>استان</Trans>:
                            </span>
                            <span className="text-sm font-semibold text-gray2">
                                {" - "}
                            </span>
                        </li>
                        <li className="flex items-center justify-between">
                            <span className="text-sm font-semibold text-gray4">
                                <Trans>شهر</Trans>:
                            </span>
                            <span className="text-sm font-semibold text-gray2">
                                {" - "}
                            </span>
                        </li> */}
                        <li className="flex items-center justify-between">
                            <span className="text-sm font-semibold text-gray4">
                                <Trans>آدرس</Trans>:
                            </span>
                            <span className="text-sm font-semibold text-gray2 line-clamp-2 w-3/5 text-end">
                                {data.address.address}
                            </span>
                        </li>
                    </ul>
                    <ul className="space-y-5 w-full xl:max-w-[492px]">
                        <li className="flex items-center justify-between">
                            <span className="text-sm font-semibold text-gray4">
                                <Trans>روش پرداخت</Trans>:
                            </span>
                            <span className="text-sm font-semibold text-gray2">
                                {data.payment_method[0][1]}
                            </span>
                        </li>
                        <li className="flex items-center justify-between">
                            <span className="text-sm font-semibold text-gray4">
                                <Trans>روش ارسال</Trans>:
                            </span>
                            <span className="text-sm font-semibold text-gray2">
                                {data.delivery_method.title || " - "}
                            </span>
                        </li>
                        <li className="flex items-center justify-between">
                            <span className="text-sm font-semibold text-gray4">
                                <Trans>صورت حساب</Trans>:
                            </span>
                            <span className="text-sm font-semibold text-gray2">
                                {(data.get_total_amount - data.delivery_method.delivery_price).toLocaleString()} <Trans>ریال</Trans>
                            </span>
                        </li>
                        <li className="flex items-center justify-between">
                            <span className="text-sm font-semibold text-gray4">
                                <Trans>وضعیت سفارش</Trans>:
                            </span>
                            <span className="text-sm font-semibold text-gray2">
                                {i18n._(statusList[data.status - 1])}
                            </span>
                        </li>
                        <li className="flex items-center justify-between">
                            <span className="text-sm font-semibold text-gray4">
                                <Trans>تاریخ ثبت سفارش</Trans>:
                            </span>
                            <span className="text-sm font-semibold text-gray2">
                                {formatIsoToJalali(data.created.toString())}
                            </span>
                        </li>
                        <li className="flex items-center justify-between">
                            <span className="text-sm font-semibold text-gray4">
                                <Trans>قابل پرداخت</Trans>:
                            </span>
                            <span className="text-sm font-semibold text-gray2">
                                {data.get_total_amount.toLocaleString()} <Trans>ریال</Trans>
                            </span>
                        </li>
                    </ul>
                </div>
            </div>

            <div className="bg-white px-4 py-5 xl:p-6 rounded-[10px] mt-7 xl:mt-6 overflow-hidden">
                <div className="overflow-x-auto xl:overflow-x-visible scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                    <table className="w-full min-w-[1180px] table-auto">
                        <thead className="text-sm text-gray2 font-semibold">
                            <tr className="[&>th]:pb-5 [&>th]:border-b-[0.6px] [&>th]:border-border">
                                <th>
                                    <Trans>محصول</Trans>
                                </th>
                                <th className="text-start">
                                    <Trans>نام</Trans>
                                </th>
                                <th>
                                    <Trans>قیمت</Trans>
                                </th>
                                <th>
                                    <Trans>تخفیف(ریال)</Trans>
                                </th>
                                <th>
                                    <Trans>مالیات</Trans>
                                </th>
                                <th>
                                    <Trans>تعداد</Trans>
                                </th>
                                <th>
                                    <Trans>واحد</Trans>
                                </th>
                                <th>
                                    <Trans>قیمت کل(ریال)</Trans>
                                </th>
                                <th>
                                    <Trans>روش پرداخت</Trans>
                                </th>
                                <th>
                                    <Trans>وضعیت</Trans>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.items.map((item, index) => (
                                <tr key={index} className="group [&>td]:py-5 [&>td]:border-b-[0.6px] [&>td]:border-border text-sm text-gray2 hover:text-primary transition-all duration-300">
                                    <td className="text-center">
                                        {item.variant.image && <Link href={`#`}>
                                            <Image width={100} height={100} src={item.variant.image} alt={item.variant.variant_name}
                                                className="object-cover object-center w-full h-full !size-12 mx-auto rounded-[3.57px] aspect-square" />
                                        </Link>}
                                    </td>
                                    <td className="text-start">
                                        {item.variant.variant_name}
                                    </td>
                                    <td className="text-center text-sm">
                                        {item.variant.price.toLocaleString()}
                                    </td>
                                    <td className="text-center text-sm">
                                        {item.variant?.discount?.toLocaleString() || " - "}
                                    </td>
                                    <td className="text-center text-sm">
                                        {item.variant?.tax ? (item.variant.tax / 100 * (item.variant.price - item.variant.discount)).toLocaleString() : " - "}
                                    </td>
                                    <td className="text-center text-sm">
                                        {item.quantity}
                                    </td>
                                    <td className="text-center text-sm">
                                        {item.unit}
                                    </td>
                                    <td className="text-center text-sm">
                                        {item.get_price.toLocaleString()}
                                    </td>
                                    <td className="text-center text-sm">
                                        {data.payment_method[0][1]}
                                    </td>
                                    <td className="text-center text-sm">
                                        {i18n._(statusList[data.status - 1])}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="flex flex-col xl:flex-row justify-between mt-5 xl:mt-[26px]">
                    <ul className="space-y-5 w-full xl:max-w-[492px]">
                        <li className="flex items-center justify-between">
                            <span className="text-sm font-semibold text-gray4">
                                <Trans>جمع کل اقلام</Trans>({data.items.reduce((sum, i) => sum + i.quantity, 0)}):
                            </span>
                            <span className="text-sm font-semibold text-gray2">
                                {data.get_total_amount.toLocaleString()} <Trans>ریال</Trans>
                            </span>
                        </li>
                        <li className="flex items-center justify-between">
                            <span className="text-sm font-semibold text-gray4">
                                <Trans>تخفیف</Trans>:
                            </span>
                            <span className="text-sm font-semibold text-gray2">
                                {data.discount.toLocaleString()} <Trans>ریال</Trans>
                            </span>
                        </li>
                        <li className="flex items-center justify-between">
                            <span className="text-sm font-semibold text-gray4">
                                <Trans>شماره تماس</Trans>:
                            </span>
                            <span dir='ltr' className="text-sm font-semibold text-gray2">
                                {data.address.receiver_mobile_number}
                            </span>
                        </li>
                        <li className="flex items-center justify-between">
                            <span className="text-sm font-semibold text-gray4">
                                <Trans>هزینه ارسال</Trans>:
                            </span>
                            <span className="text-sm font-semibold text-gray2">
                                {data.delivery_method.delivery_price.toLocaleString()} <Trans>ریال</Trans>
                            </span>
                        </li>
                    </ul>
                    <ul className="space-y-5 w-full xl:max-w-[492px]">
                        <li className="flex items-center justify-between">
                            <span className="text-sm font-semibold text-gray4">
                                <Trans>مالیات</Trans>:
                            </span>
                            <span className="text-sm font-semibold text-gray2">
                                {(data.items.reduce((sum, i) => sum + (i.variant.tax / 100 * (i.variant.price - i.variant.discount)), 0).toLocaleString())} <Trans>ریال</Trans>
                            </span>
                        </li>
                        <li className="flex items-center justify-between">
                            <span className="text-sm font-semibold text-gray4">
                                <Trans>مبلغ قابل پرداخت</Trans>:
                            </span>
                            <span className="text-sm font-semibold text-gray2">
                                {data.get_total_amount.toLocaleString()} <Trans>ریال</Trans>
                            </span>
                        </li>
                    </ul>
                </div>
            </div>
        </main>
    );
}
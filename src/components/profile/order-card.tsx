import * as React from 'react';
import { Trans, useLingui } from '@lingui/react/macro';
import Image from 'next/image';
import { Button } from '../ui/button';
import { Order } from '@/types/products.types';
import { msg } from '@lingui/core/macro';
import { formatIsoToJalali } from '@/lib/utils';
import Link from '@/components/localized-link';

const statusList = [
    msg`در حال پردازش`,
    msg`انجام شده`,
    msg`لغو شده`,
    msg`در حال ارسال`
]

export default function OrderCard({ data }: { data: Order }) {
    const { i18n } = useLingui();

    return (
        <div className="flex flex-col bg-white rounded-[10px] p-5 xl:px-7 xl:py-6">
            <div className="flex items-center justify-between">
                <h3 className="font-semibold">
                    <Trans>سفارش</Trans> {data.id}
                </h3>

                <Link href={`/profile/orders/${data.id}`}>
                    <Button variant='outline' className='px-5 h-10 text-sm'>
                        <Trans>جزییات سفارش</Trans>
                    </Button>
                </Link>
            </div>
            <hr className="mt-2 xl:mt-3 mb-5" />
            <div className="flex flex-col gap-6 md:flex-row md:items-start xl:justify-between">
                <div className="flex items-center gap-2 shrink-0">
                    {data.items.map(item => (
                        item.variant.image && <Image key={item.variant.id} width={107} height={107} src={item.variant.image} alt={item.variant.variant_name} className="!size-[107px] object-cover object-center rounded-[3.57px]" />
                    ))}
                </div>
                <div className="flex flex-col gap-5">
                    <div className="flex items-center justify-between md:justify-start gap-5 text-gray2">
                        <span className="text-sm font-semibold">
                            <Trans>وضعیت سفارش</Trans>:
                        </span>
                        <span className="flex items-center justify-center px-[14px] h-8 text-sm bg-primary-light border-[1px] border-primary rounded-full text-primary">
                            {i18n._(statusList[data.status - 1])}
                        </span>
                    </div>
                    <div className="flex items-center gap-2 text-gray2 text-sm">
                        <span className="font-semibold">
                            <Trans>تاریخ ثبت سفارش</Trans>:
                        </span> {formatIsoToJalali(data.created.toString())}
                    </div>
                    <div className="text-gray2 line-clamp-1 text-sm">
                        <span className="font-semibold">
                            <Trans>آدرس</Trans>:
                        </span> <span>بلوار یکمبلوار یکمبلوار یکمبلوار یکمبلوار یکمبلوار یکمبلوار یکمبلوار یکمبلوار یکم</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray2 text-sm">
                        <span className="font-semibold">
                            <Trans>روش پرداخت</Trans>:
                        </span> {data.payment_method[0][1] || " - "}
                    </div>
                    <div className="flex items-center gap-2 text-gray2 text-sm">
                        <span className="font-semibold">
                            <Trans>مبلغ</Trans>:
                        </span> {data.get_total_amount.toLocaleString()} <Trans>ریال</Trans>
                    </div>
                </div>
            </div>
        </div>
    );
}
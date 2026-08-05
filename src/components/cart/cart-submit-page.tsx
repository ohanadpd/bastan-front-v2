'use client';
import * as React from 'react';
import { Button } from '@/components/ui/button';
import Link from '@/components/localized-link';
import { Trans } from '@lingui/react/macro';
import { CartList, DeliveryMethods, DiscountData } from '@/types/products.types';
import { Address } from '@/types/accounts.types';
import Image from 'next/image';
import { useSettingsStore } from '@/store/settingsStore';
import { useState } from 'react';
import { checkOut, verifyDiscountCode } from '@/lib/services/products.services';
import LoadingSpin from '../ui/loading-spin';
import { TickCircle } from 'iconsax-reactjs';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

interface PageProps {
    data: {
        cartList: CartList,
        addressList: Address[],
        deliveryMethods: DeliveryMethods[]
    }
}

interface Discount {
    code: string;
    data: DiscountData | null;
    loading: boolean;
}
export default function CartSubmitPage({ data }: PageProps) {
    const [discountCode, setDiscountCode] = useState<Discount>()
    const settings = useSettingsStore(state => state.settings);
    const { cartList, addressList, deliveryMethods } = data;
    const [delivery, setDelivery] = useState<DeliveryMethods>();
    const router = useRouter();
    const [loading, setLoading] = useState(false)

    const discountChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        setDiscountCode({
            code: e.target.value,
            data: null,
            loading: false
        })
    }

    const verifyDiscountHandler = (e: any) => {
        e.preventDefault();
        if (discountCode?.code) {
            setDiscountCode(prev => ({
                code: prev?.code || discountCode.code,
                data: null,
                loading: true
            }))
            verifyDiscountCode(discountCode.code).then(res => {
                setDiscountCode(prev => ({
                    code: prev?.code || discountCode.code,
                    data: res.data,
                    loading: false
                }))
            }).catch(() => {
                setDiscountCode(prev => ({
                    code: prev?.code || discountCode.code,
                    data: {
                        success: false,
                        discount_percentage: 0
                    },
                    loading: false
                }))
            })

        }
    }

    const submitHandler = (formData: FormData) => {
        
        const order_description = formData.get("order_description") as string;
        const address = formData.get("address") as string;
        const delivery = formData.get("delivery") as string;

        if (!delivery)
            toast.error(<Trans>یک روش ارسال انتخاب کنید.</Trans>)
        if (!address)
            toast.error(<Trans>یک آدرس انتخاب کنید.</Trans>)
        if (delivery && address) {
            setLoading(true);
            try {
                checkOut({
                    order_description: order_description,
                    address_id: address,
                    delivery_method: delivery,
                    discount_code: discountCode?.code ? discountCode.code : ""
                }).then((res) => {
                    if (res.data.payment.gateway_link) {
                        toast.info(<Trans>درحال انتقال به درگاه پرداخت...</Trans>)
                        try {
                            router.push(res.data.payment.gateway_link)
                        } catch {
                            toast.error(<Trans>خطا در انتفال به درگاه پرداخت!</Trans>)
                        }

                    } else {
                        toast.error(<Trans>خطا در برقراری ارتباط</Trans>)
                    }
                }).finally(()=>{
                    setLoading(false);
                })
            } catch {
                toast.error(<Trans>خطا در برقراری ارتباط</Trans>)
            }

        }

    }
    return (
        <main className="container mt-[140px] mb-[172px] xl:mb-[102px]">

            <form action={submitHandler} className="flex flex-col xl:flex-row gap-6 xl:gap-10">
                <div
                    className="xl:hidden flex flex-col gap-6 items-center justify-center fixed bottom-0 inset-x-0 h-[121px] bg-white z-30 px-5 border-t-[0.6px] border-border">
                    <div className="flex items-center justify-between w-full text-sm">
                        <span className="font-semibold">
                            <Trans>مبلغ قابل پرداخت</Trans>:
                        </span>
                        <span>
                            {discountCode?.data?.success ? <>{cartList.total_price - (cartList.total_price * (discountCode.data.discount_percentage / 100))} <Trans>ریال</Trans></> : <>{cartList.total_price} <Trans>ریال</Trans></>}
                        </span>
                    </div>
                    <Button disabled={cartList.items.length == 0} type="submit" className="w-full h-8 text-sm">
                        <Trans>
                            تایید و ادامه
                        </Trans>
                    </Button>
                </div>
                <div className="flex flex-col gap-5 w-full">
                    <div className="w-full bg-white rounded-[10px] p-5">
                        <div className="flex items-center justify-between pb-4 border-b-[1px] gap-2 border-border">
                            <h3 className="font-bold">
                                <Trans>
                                    سبد خرید شما ({cartList.items.length} قلم کالا)
                                </Trans>
                            </h3>
                            <Link href="/cart">
                                <Button variant='outline' className='h-10 px-2 xl:px-6 text-sm'>
                                    <Trans>
                                        ویرایش سبد خرید
                                    </Trans>
                                </Button>
                            </Link>
                        </div>
                        <div className="flex items-center flex-wrap mt-[22px] xl:mt-[30px] gap-x-6 gap-y-5 xl:gap-[26px]">

                            {cartList.items.map((item, index) => (
                                <div className="group flex flex-col gap-4" key={index}>
                                    {item.variant.image && <div className='relative size-[138px] xl:size-[150px] rounded-[4.6px] xl:rounded-[5px] overflow-hidden'>
                                        <Image src={item.variant.image} alt={item.name} fill
                                            className="object-cover object-center group-hover:scale-105 transition-all duration-300" />
                                    </div>}
                                    <div
                                        className="flex items-center justify-center rounded-full border-[1px] border-primary bg-primary-light h-9 xl:h-10 text-primary">
                                        {item.quantity} <Trans>پاکت</Trans>
                                    </div>
                                </div>
                            ))}

                        </div>
                    </div>
                    <div className="w-full bg-white rounded-[10px] p-5">
                        <div className="flex items-center justify-between pb-4 border-b-[1px] border-border">
                            <h3 className="font-bold">
                                <Trans>
                                    انتخاب آدرس
                                </Trans>
                            </h3>
                            <Link href="/profile/addresses/new">
                                <Button variant='outline' className='h-10 px-2 xl:px-6 text-sm'>
                                    <Trans>
                                        افزودن آدرس جدید
                                    </Trans>
                                </Button>
                            </Link>
                        </div>
                        <div className="flex flex-col gap-8 mt-6 xl:mt-9">

                            {addressList.length > 0 ? addressList.map((item) => (
                                <div key={item.id}>
                                    <div className="flex items-center gap-2">
                                        <input type="radio" name="address" value={item.id} />
                                        <label htmlFor="address-1">
                                            <h3 className="font-semibold">
                                                {item.title}
                                            </h3>
                                        </label>
                                    </div>
                                    <p className="text-sm">
                                        {item.address}
                                    </p>
                                </div>
                            )) :
                                <span className='text-sm'>
                                    <Trans>آدرسی وجود ندارد!</Trans>
                                </span>
                            }

                        </div>
                    </div>

                    <div className="w-full bg-white rounded-[10px] p-5">
                        <div className="flex items-center justify-between pb-4 border-b-[1px] border-border">
                            <h3 className="font-bold">
                                <Trans>
                                    روش ارسال
                                </Trans>
                            </h3>
                        </div>
                        <div className="flex flex-col gap-8 mt-6 xl:mt-9">

                            {deliveryMethods.length > 0 && deliveryMethods.map((item) => (
                                <div key={item.id} onClick={() => setDelivery(item)}>
                                    <div className="flex items-center gap-2">
                                        <input type="radio" name="delivery" value={item.id} />
                                        <label htmlFor="delivery-1">
                                            <h3 className="font-semibold">
                                                {item.title}
                                            </h3>
                                        </label>
                                    </div>
                                    <p className="text-sm">
                                        {item.description}
                                    </p>
                                </div>
                            ))}


                        </div>
                    </div>

                    <div className="w-full bg-white rounded-[10px] p-5">
                        <div className="flex items-center justify-between pb-4 border-b-[1px] border-border">
                            <h3 className="font-bold">
                                <Trans>
                                    کد تخفیف
                                </Trans>
                            </h3>
                        </div>
                        <div className="flex flex-col xl:flex-row items-end gap-5 mt-3 xl:mt-[18px]">
                            <div className="flex flex-col gap-2 w-full">
                                <label htmlFor="discount-code" className="font-semibold">
                                    <Trans>کد تخفیف</Trans>:
                                </label>
                                <input type="text" placeholder="کد تخفیف خود را وارد کنید" onChange={discountChangeHandler} value={discountCode?.code} className='h-10 px-3 text-sm border-[0.6px] border-[#D2D2D2] rounded-[5px]' />
                            </div>
                            <Button variant={discountCode?.data?.success ? 'solid' : 'outline'} onClick={verifyDiscountHandler} className='group flex justify-center gap-1 items-center h-10 px-2 xl:px-8 text-sm shrink-0 w-full xl:w-auto'>
                                {discountCode?.loading != true && !discountCode?.data && <Trans>
                                    تایید کد تخفیف
                                </Trans>}
                                {discountCode?.loading == true && <LoadingSpin className='text-primary m-0 group-hover:text-white' />}

                                {discountCode?.loading != true && discountCode?.data?.success &&
                                    <>
                                        <Trans>کد معتبر</Trans>
                                        <TickCircle size={20} color='white' variant='Bold' />
                                    </>}
                                {discountCode?.loading != true && discountCode?.data?.success == false && <Trans>کد نامعتبر</Trans>}
                            </Button>
                        </div>
                    </div>

                    <div className="w-full bg-white rounded-[10px] p-5">
                        <div className="flex items-center justify-between pb-4 border-b-[1px] border-border">
                            <h3 className="font-bold">
                                <Trans>
                                    توضیحات سفارش
                                </Trans>
                            </h3>
                        </div>
                        <div className="flex flex-col xl:flex-row items-end gap-5 mt-3 xl:mt-[18px]">
                            <div className="flex flex-col gap-2 w-full">
                                <label htmlFor="discount-code" className="font-semibold">
                                    <Trans>یادداشت (اختیاری)</Trans>:
                                </label>
                                <textarea rows={7} name="order_description" className='p-3 text-sm border-[0.6px] border-[#D2D2D2] rounded-[5px]' />
                            </div>
                        </div>
                    </div>
                </div>


                <div
                    className="flex flex-col items-center gap-5 xl:gap-10 w-full xl:max-w-[280px] shrink-0 rounded-[10px] bg-white p-5 h-fit">
                    <h3 className="font-semibold">
                        <Trans>
                            خلاصه سفارش
                        </Trans>
                    </h3>
                    <div className="flex flex-col text-gray2 text-[13px] w-full">
                        <div className="flex items-center justify-between">
                            <span className="font-semibold">
                                <Trans>
                                    قیمت کل
                                </Trans>:
                            </span>
                            <span>
                                {cartList.total_price.toLocaleString()} <Trans>ریال</Trans>
                            </span>
                        </div>
                        <hr className="my-4" />
                        <div className="flex items-center justify-between">
                            <span className="font-semibold">
                                <Trans>هزینه ارسال</Trans> :
                            </span>
                            <span>
                                {delivery?.delivery_price ? <>{delivery?.delivery_price} <Trans>ریال</Trans></> : "-"}
                            </span>
                        </div>
                        <hr className="my-4" />
                        <div className="flex items-center justify-between">
                            <span className="font-semibold">
                                <Trans>مالیات</Trans>:
                            </span>
                            <span>
                                123.000 <Trans>ریال</Trans>
                            </span>
                        </div>
                        <hr className="my-4" />
                        <div className="flex items-center justify-between">
                            <span className="font-semibold">
                                <Trans>قابل پرداخت</Trans>:
                            </span>
                            <span>
                                {discountCode?.data?.success ? <>{cartList.total_price - (cartList.total_price * (discountCode.data.discount_percentage / 100))} <Trans>ریال</Trans></> : <>{cartList.total_price} <Trans>ریال</Trans></>}
                            </span>
                        </div>
                        <hr className="my-4" />
                        <p className="text-sm text-gray2">
                            <Trans>
                                خریداز {settings?.name || ""} به منزله تایید <span><Link href="#" className="text-primary underline me-1"> قوانین و مقررات</Link></span> سایت است
                            </Trans>
                        </p>
                    </div>
                    <Button type="submit" className="hidden xl:block w-full h-8 text-sm ">
                        {!loading ? <Trans>
                            تایید و ادامه
                        </Trans> : <LoadingSpin className='text-white mx-auto' />}
                    </Button>
                </div>

            </form>
        </main>
    );
}
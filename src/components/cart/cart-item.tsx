'use client';
import Image from 'next/image';
import * as React from 'react';
import { useState } from 'react';
import type { CartItem } from '@/types/products.types';
import { getMediaUrl } from '@/lib/utils';
import { deleteCartItem, updateCartItem } from '@/lib/services/products.services';
import { toast } from 'sonner';
import { Trans } from '@lingui/react/macro';
import LoadingSpin from '../ui/loading-spin';
import { useCartStore } from '@/store/cartStore';

export default function CartItem({ item }: { item: CartItem }) {
    const [quantity, setQuantity] = useState(item.quantity)
    const [loading, setLoading] = useState(false)
    const cart = useCartStore((state) => state.cart);
    const removeItem = useCartStore((state) => state.removeItem);
    const updateItem = useCartStore((state) => state.updateItem);
    const updateItemQuantity = useCartStore((state) => state.updateItemQuantity);
    const [isUpdateLoading, setIsUpdateLoading] = useState(false);

    // Sync local quantity with item prop when it changes from store
    React.useEffect(() => {
        setQuantity(item.quantity);
    }, [item.quantity]);

    const addQuantitiy = async () => {
        const newQuantity = quantity + 1;
        // Update store immediately to preserve order
        // updateItemQuantity(item.id, newQuantity);
        const success = await updateCartHandler(newQuantity);
        if (success) {
            setQuantity(newQuantity);
        }
    }

    const subtractQuantity = () => {
        const newQuantity = quantity > 0 ? quantity - 1 : 0;
        setQuantity(newQuantity);
        if (newQuantity > 0) {
            // Update store immediately to preserve order
            // updateItemQuantity(item.id, newQuantity);
            updateCartHandler(newQuantity);
        }
    };

    const updateCartHandler = async (quantity: number) => {
        if (quantity > 0 && item.id) {
            setIsUpdateLoading(true);

            try {
                const res = await updateCartItem(item.id, {
                    variant_id: item.variant.id,
                    quantity,
                });

                updateItem(res.data);
                return true;
            }
            catch (err: any) {
                if (err.status === 400)
                    toast.error(<Trans>مقدار وارد شده بیش از حد مجاز است!</Trans>);
                return false;
            }
            finally {
                setIsUpdateLoading(false);
            }
        }
    };

    const deleteHandler = React.useCallback(() => {
        setLoading(true)
        deleteCartItem(item.id).then((res) => {
            toast.success(<Trans>محصول با موفقیت حذف شد.</Trans>);
            removeItem(item.id)

        }).finally(() => {
            setLoading(false)
        })
    }, [item.id, removeItem])

    React.useEffect(() => {
        if (quantity < 1) {
            deleteHandler();
            return;
        }
    }, [quantity, deleteHandler]);

    return (
        <div className="relative flex flex-col xl:flex-row pb-10 border-b-[1px] border-border gap-10 xl:gap-8">
            <button onClick={deleteHandler} className="absolute top-0 end-0 flex items-center justify-center bg-[#F6F6F6] rounded-[5px] size-10 text-[#C30B0B] hover:bg-[#C30B0B] hover:text-white transition-all duration-300">
                {!loading ? <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17.5 4.98356C14.725 4.70856 11.9333 4.56689 9.15 4.56689C7.5 4.56689 5.85 4.65023 4.2 4.81689L2.5 4.98356" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M7.08398 4.1415L7.26732 3.04984C7.40065 2.25817 7.50065 1.6665 8.90898 1.6665H11.0923C12.5007 1.6665 12.609 2.2915 12.734 3.05817L12.9173 4.1415" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M15.7077 7.6167L15.166 16.0084C15.0743 17.3167 14.9993 18.3334 12.6743 18.3334H7.32435C4.99935 18.3334 4.92435 17.3167 4.83268 16.0084L4.29102 7.6167" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M8.60742 13.75H11.3824" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M7.91602 10.4165H12.0827" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg> : <LoadingSpin className='ml-0 mr-0' />}

            </button>
            <div className="flex flex-col gap-4 max-w-[208px]">
                {item.variant.image && <Image width={208} height={202} src={getMediaUrl(item.variant.image)} alt={item.name || 'product image'}
                    className="w-[208px] h-[202px] object-cover object-center shrink-0 rounded-[5px]" />}
                <div className="flex justify-between items-center relative">
                    <button onClick={subtractQuantity} type="button" data-target="product-1" data-action="decrease"
                        className="size-8 flex items-center justify-center bg-bg rounded-[5px] border-[1px] border-primary text-primary hover:bg-primary hover:text-white transition-all duration-300">-</button>
                    <span>{isUpdateLoading ? <LoadingSpin className='ml-0 mr-0 text-primary' /> : quantity}</span>
                    <button onClick={addQuantitiy} type="button" data-target="product-1" data-action="increase"
                        className="size-8 flex items-center justify-center bg-bg rounded-[5px] border-[1px] border-primary text-primary hover:bg-primary hover:text-white transition-all duration-300">+</button>
                </div>
            </div>
            <div className="w-full xl:max-w-[421px]">
                <h3 className="xl:text-lg font-bold">
                    {item.name}
                </h3>
                <div className="mt-6 text-gray2">
                    {item.variant.attribute_values.map((attribute) => (
                        <React.Fragment key={attribute.id}>
                            <div className="flex items-center justify-between">
                                <span className="text-sm  font-semibold">
                                    {attribute.attribute_name}:
                                </span>
                                <span className="text-sm">
                                    {attribute.value || '-'}
                                </span>
                            </div>
                            <hr className="my-[18px]" />
                        </React.Fragment>
                    ))}
                    {/* <div className="flex items-center justify-between">
                        <span className="text-sm  font-semibold">
                            موارد مصرف:
                        </span>
                        <span className="text-sm">
                            کف
                        </span>
                    </div>
                    <hr className="my-[18px]" /> */}
                    <div className="flex items-center justify-between">
                        <span className="text-sm  font-semibold">
                            <Trans>قیمت واحد</Trans>:
                        </span>
                        <span className="text-sm">
                            {item.variant.price.toLocaleString()} <Trans>ریال</Trans>
                        </span>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                        <span className="text-sm  font-semibold">
                            <Trans>قیمت کل</Trans>:
                        </span>
                        <span className="text-sm">
                            {(quantity * item.variant.price).toLocaleString()} <Trans>ریال</Trans>
                        </span>
                    </div>
                    <hr className="my-[18px]" />
                    {item.variant.tax > 0 && <div className="flex items-center justify-between">
                        <span className="text-sm  font-semibold">
                            <Trans>مالیات</Trans>:
                        </span>
                        <span className="text-sm">
                            {item.variant.tax.toLocaleString()} <Trans>درصد</Trans>
                        </span>
                    </div>}
                    <div className="flex items-center justify-between mt-2">
                        <span className="text-sm  font-semibold">
                            <Trans>مبلغ تمام شده</Trans>:
                        </span>
                        <span className="text-sm">
                            {item.subtotal.toLocaleString()} <Trans>ریال</Trans>
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
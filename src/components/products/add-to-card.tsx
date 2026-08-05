'use client';
import { useState } from 'react';
import { Button } from '../ui/button';
import { Bag2, CallCalling } from 'iconsax-reactjs';
import { Trans } from '@lingui/react/macro';
import QuantityControl from '../ui/quantity-control';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';
import { addToCart as addToCartService } from '@/lib/services/products.services';
import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';

export default function ProductsAddToCard({ variantId, initialAmount, stockQuantity, phoneNumber, isMobile }: { variantId: number, initialAmount?: number, stockQuantity: number, phoneNumber: string, isMobile: boolean }) {
    const [quantity, setQuantity] = useState(initialAmount ?? 1);
    const { data: session } = useSession();
    const [showPhoneNumber, setShowPhoneNumber] = useState(false);

    const addToCart = async () => {
        if (!session) {
            // router.push('/auth/login')
            toast.error(<Trans>برای افزودن به سبد خرید باید وارد حساب کاربری خود شوید.</Trans>)
        }
        else {
            addToCartService({
                variant_id: variantId,
                quantity: quantity
            }).then((res) => {
                if (res.code === 201) {
                    toast.success(<Trans>به سبد خرید اضافه شد.</Trans>)
                }
                else {
                    toast.error(<Trans>خطایی رخ داده است.</Trans>)
                }
            })
        }
    }

    return (
        <>
            {/* <hr className='my-4 border-[#D2D2D2]' /> */}
            {/* <div>
                <QuantityControl quantity={quantity} onChange={setQuantity} />
            </div> */}
            {/* <Button disabled={quantity > stockQuantity} className={cn(quantity > stockQuantity && " opacity-50", 'mt-5 h-10 flex items-center justify-center gap-4 text-white text-sm')} onClick={addToCart}>
                <Trans>
                    افزودن به سبد خرید
                </Trans>
                <Bag2 size={20} color='currentColor' />
            </Button> */}
            <a href={isMobile ? `tel:${phoneNumber}` : `#`}>
                <Button
                    onClick={() => setShowPhoneNumber(true)}
                    className={cn('w-full mt-5 h-10 flex items-center justify-center gap-4 text-white text-sm')}>
                    <Trans>
                        استعلام از کارخانه
                    </Trans>
                    <CallCalling size={20} color='currentColor' />
                </Button>
            </a>
            <AnimatePresence>
                {showPhoneNumber && <motion.span
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className={cn('text-xs text-center text-[#3B3B3B] mt-2 bg-primary-light rounded-sm w-fit p-1 mx-auto')}>
                    <Trans>برای استعلام تماس بگیرید</Trans>:
                    <br />
                    <span>
                        {phoneNumber}
                    </span>
                </motion.span>}
            </AnimatePresence>
        </>
    );
}
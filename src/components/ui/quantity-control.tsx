'use client';
import { cn } from '@/lib/utils';

export default function QuantityControl({ className, quantity, onChange }: { className?: string, quantity: number, onChange: (quantity: number) => void }) {
    const addQuantitiy = () => {
        onChange(quantity + 1);
    }

    const subtractQuantity = () => {
        onChange(quantity > 1 ? quantity - 1 : 1);
    };

    return (
        <div className={cn("relative", className)}>
            <input
                type="number"
                className="product-quantity text-center !appearance-none outline-none border-none bg-transparent w-full h-8 text-xs"
                value={quantity}
                step="1"
                min={1}
                onChange={(e) => {
                    const newValue = Number(e.target.value);
                    onChange(newValue);
                }}
            />
            <button onClick={addQuantitiy} type="button" data-target="product-1" data-action="increase"
                className="absolute left-0 top-0 size-8 flex items-center justify-center bg-bg rounded-[5px] border-[1px] border-primary text-primary hover:bg-primary hover:text-white transition-all duration-300">+</button>
            <button onClick={subtractQuantity} type="button" data-target="product-1" data-action="decrease"
                className="absolute right-0 top-0 size-8 flex items-center justify-center bg-bg rounded-[5px] border-[1px] border-primary text-primary hover:bg-primary hover:text-white transition-all duration-300">-</button>
        </div>
    );
}
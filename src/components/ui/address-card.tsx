import { Trans } from '@lingui/react/macro';
import { Edit, TickSquare, Trash } from 'iconsax-reactjs';
import * as React from 'react';
import Link from '@/components/localized-link';
import DeleteAddressDialog from '../profile/delete-address-dialog';


interface CardProps {
    addressId: number;
    title: string;
    address: string;
    recipientName: string;
    phone: string;
    is_default?: boolean;
}

export default function AddressCard({ addressId, title, address, recipientName, phone, is_default }: CardProps) {
    return (
        <div className="group flex flex-col bg-white rounded-[10px] p-5 xl:min-w-[280px] xl:max-w-[280px] hover:outline outline-[1px] outline-primary">
            <div className="flex items-center justify-between">
                <div className='flex items-center gap-2'>
                    {is_default && <TickSquare size={16} color='var(--primary)' />}
                    <h3 className="text-lg font-semibold">
                        {title}
                    </h3>
                </div>
                <div className="flex items-center gap-1">
                    <Link href={`/profile/addresses/${addressId}`} className="cursor-pointer flex items-center justify-center size-8 rounded-[5px] bg-[#F6F6F6] text-primary hover:bg-primary hover:text-white transition-all duration-300">
                        <Edit size={16} color='currentColor' />
                    </Link>
                    <DeleteAddressDialog addressId={addressId} />
                </div>
            </div>
            <hr className="mt-2 mb-6" />
            <ul className="space-y-4">
                <li className="line-clamp-2 text-sm xl:max-w-[300px]">
                    <span className="font-semibold"><Trans>آدرس</Trans> :</span> {address}
                </li>
                <li className="line-clamp-2 text-sm">
                    <span className="font-semibold"><Trans>نام تحویل گیرنده</Trans> :</span> {recipientName}
                </li>
                <li className="line-clamp-2 text-sm">
                    <span className="font-semibold"><Trans>شماره تلفن</Trans> :</span> <span dir="ltr">{phone}</span>
                </li>
            </ul>
        </div>
    );
}
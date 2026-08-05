'use client';
import { Address } from '@/types/accounts.types';
import * as React from 'react';
import AddressCard from '@/components/ui/address-card';
import { useState, useEffect } from 'react';
import { useAddressStore } from '@/store/addressStore';

export default function AddressList({ addresses }: { addresses: Address[] }) {
    const addressList = useAddressStore((state) => state.addresses);
    const setAddressList = useAddressStore((state) => state.setAddresses)

    const [list, setList] = useState(addresses)

    useEffect(() => {
        setAddressList(addresses)
    }, [addresses, setAddressList])

    return (
        <div className="flex flex-col xl:flex-row xl:justify-center gap-4 xl:gap-5 flex-wrap mt-8 xl:mt-14 mb-12 xl:mb-11">
            {addressList?.map((item, index) => (
                <AddressCard key={index} is_default={item.is_default} addressId={item.id} title={item.title} address={item.address} recipientName={item.receiver_fullname} phone={item.receiver_mobile_number} />
            ))}

            {!addressList || addressList.length === 0 && <div className="mt-8 xl:mt-12 mb-11 xl:mb-6">
                <p className="text-center xl:text-xl text-gray3">
                    متاسفانه هنوز هیچ آدرسی وجود ندارد !
                </p>
            </div>}
        </div>
    );
}
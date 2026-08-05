'use client';
import * as React from 'react';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Trash } from 'iconsax-reactjs';
import { Trans } from '@lingui/react/macro';
import { toast } from 'sonner';
import LoadingSpin from '../ui/loading-spin';
import { deleteAddress } from '@/lib/services/account.services';
import { useAddressStore } from '@/store/addressStore';

export default function DeleteAddressDialog({ addressId }: { addressId: number }) {
    const [loading, setLoading] = React.useState(false)
    const [open, setOpen] = React.useState(false)
    const removeAddressItem = useAddressStore((state) => state.removeItem)

    const deleteHandler = async (e: React.MouseEvent) => {
        e.preventDefault()
        setLoading(true)

        deleteAddress(addressId).then(() => {
            setOpen(false)
            toast.success(<Trans>با موفقیت حذف شد.</Trans>)
            removeAddressItem(addressId)
        }).finally(() => {
            setLoading(false)
        })
    }

    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger>
                <span className="cursor-pointer flex items-center justify-center size-8 rounded-[5px] bg-[#F6F6F6] text-[#C30B0B] hover:bg-[#C30B0B] hover:text-white transition-all duration-300">
                    <Trash size={16} color='currentColor' />
                </span>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        <Trans>
                            حذف آدرس
                        </Trans>
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        <Trans>
                            آیا از حذف این آدرس مطمئن هستید؟
                        </Trans>
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel><Trans>انصراف</Trans></AlertDialogCancel>
                    <AlertDialogAction onClick={deleteHandler} disabled={loading}>
                        {
                            !loading ?
                                <Trans>حذف</Trans>
                                :
                                <LoadingSpin className='ml-0 mr-0' />
                        }
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
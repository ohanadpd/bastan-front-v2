import * as React from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { SearchNormal } from 'iconsax-reactjs';
import { Trans } from '@lingui/react/macro';
import { Button } from '../ui/button';
import AgenciesMapFilter from './map-filter';

export default function FilterAgencyModal() {
    return (
        <Dialog>
            <DialogTrigger asChild className='w-full max-w-[244px]'>
                <Button className='flex items-center justify-center gap-2 h-10 w-full text-sm'>
                    <Trans>
                        جست و جو بین نمایندگی ها
                    </Trans>
                    <SearchNormal className='size-6' variant='Bold' color='#fff' />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]  bg-white">
                <DialogHeader>
                    <DialogTitle className='text-[#161616] font-bold'>جست و جو بین نمایندگان</DialogTitle>
                </DialogHeader>
                <div>
                    <AgenciesMapFilter />
                </div>
            </DialogContent>
        </Dialog>
    );
}
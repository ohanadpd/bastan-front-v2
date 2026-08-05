import * as React from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Eye } from 'iconsax-reactjs';
import { Trans } from '@lingui/react/macro';
import { Button } from '../ui/button';
import { AgencyCard } from './agency-card';
import { Agency } from '@/types/agency.types';
import { Representation } from '@/types/representation.types';


export default function AllAgencyModal({ agenciesData, handleSelectAgency, selectedCard }: { agenciesData: Representation[], handleSelectAgency: (coordinates: [number, number]) => void, selectedCard: number | undefined }) {
    const [show, setShow] = React.useState(false);
    const handleClick = (longitude: number, latitude: number) => {
        handleSelectAgency([longitude, latitude]);
        setShow(false);
    }

    return (
        <Dialog open={show} onOpenChange={setShow}>
            <DialogTrigger asChild className='w-full max-w-[244px]'>
                <Button className='flex items-center justify-center gap-2 h-10 w-full text-sm'>
                    <Trans>
                        دیدن همه نمایندگی ها
                    </Trans>
                    <Eye className='size-6' variant='Bold' color='#fff' />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] bg-white px-4">
                <DialogHeader>
                    <DialogTitle className='text-[#161616] font-bold'>همه نمایندگی ها</DialogTitle>
                </DialogHeader>
                <div className='flex flex-col gap-4 overflow-y-auto max-h-[400px] flex-1 no-scrollbar'>
                    {agenciesData.map((agency) => (
                        <AgencyCard key={agency.pk} agency={agency} 
                        onClick={() => handleClick(agency.longitude, agency.latitude)} 
                        isActive={agency.pk === selectedCard}
                        />
                    ))}
                </div>
            </DialogContent>
        </Dialog>
    );
}
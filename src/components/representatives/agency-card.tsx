
import * as React from 'react';
import { Location, Pointer } from 'iconsax-reactjs';
import { cn } from '@/lib/utils';
import { Representation } from '@/types/representation.types';
import { Trans } from '@lingui/react/macro';
import { useSession } from 'next-auth/react'
import { ExternalLink } from 'lucide-react';
import Link from 'next/link';

type AgencyCardProps = React.ComponentPropsWithRef<'div'> & {
    agency?: Representation;
    isActive: boolean;
};

const AgencyCard = React.forwardRef<HTMLDivElement, AgencyCardProps>(
    ({ className, agency, isActive, ...props }, ref) => {
        const { data: session } = useSession()

        return <div ref={ref} {...props} className={cn('cursor-pointer flex flex-col gap-5 border-[1px] border-[#A9A9A9] rounded-[10px] p-[18px]', isActive && "!border-primary", className)}>
            <h4 className={cn('text-[#303030] font-bold', isActive && "!text-primary")}>
                {agency?.name}
            </h4>
            <div className='flex flex-col gap-4 text-sm'>
                <div className='flex items-center gap-2'>
                    <Location className='size-5 text-primary' variant='Bold' color='currentColor' />
                    <span className='flex items-center gap-1'>
                        <span className='text-sm text-[#808080]'>
                            <Trans>نماینده</Trans>:
                        </span>
                        {`${agency?.manager_first_name}`}
                    </span>
                </div>
                <div className='flex items-center gap-2'>
                    <Location className='size-5 text-primary' variant='Bold' color='currentColor' />
                    <span className='flex items-center gap-1'>
                        <span className='text-sm text-[#808080]'>
                            <Trans>تلفن تماس</Trans>:
                        </span>
                        {session ?
                            <span>
                                {agency?.phone_number?.replace(/\s/g, "") || "-"}
                            </span>
                            :
                            <Link href={'/auth/login'}
                                className='flex gap-1 bg-primary text-white rounded-[5px] p-1 text-xs hover:text-white hover:bg-primary-dark text-nowrap'>
                                <Trans>
                                    لطفا وارد شوید
                                </Trans>
                                <ExternalLink size={16} />
                            </Link>}
                    </span>
                </div>
                <div className='flex items-center gap-2'>
                    <Location className='size-5 text-primary' variant='Bold' color='currentColor' />
                    <span className='flex items-center gap-1'>
                        <span className='text-sm text-[#808080]'>
                            <Trans>استان</Trans>/<Trans>شهر</Trans>:
                        </span>
                        {`${agency?.province.name} - ${agency?.city.name}`}
                    </span>
                </div>
                <div className='flex items-start gap-2'>
                    <Location className='size-5 text-primary shrink-0' variant='Bold' color='currentColor' />
                    <span className='flex  gap-1'>
                        <span className='text-sm text-[#808080]'>
                            <Trans>آدرس</Trans>:
                        </span>
                        {agency?.address}
                    </span>
                </div>
            </div>
        </div>;
    }
);

AgencyCard.displayName = 'AgencyCard';
export { AgencyCard };

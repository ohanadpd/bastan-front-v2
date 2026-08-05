import * as React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';
import { FAQ } from '@/types/terms.types';

export default function HomeFaqList({ data }: { data: FAQ[] }) {
    return (
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-5 w-full'>
            {
                data.map((item, index) => (
                    <Accordion key={index} type="single" collapsible className="w-full h-fit bg-white border-[#D7D7D7] border-[0.6px] rounded-[5px] ps-[18px] pe-[14px] *:border-none">
                        <AccordionItem value={`item-${index}`}>
                            <AccordionTrigger className="hover:no-underline text-[#252525] font-semibold text-base min-h-[60px] text-start">
                                {item.title}
                            </AccordionTrigger>
                            <AccordionContent className="text-sm text-[#5C5C5C]">
                                {item.text}
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                ))
            }
        </div>
    );
}
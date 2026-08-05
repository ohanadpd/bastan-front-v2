'use client';
import * as React from 'react';
import { Button } from '@/components/ui/button';
import { FilterSquare } from 'iconsax-reactjs';
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer"
import { Trans } from '@lingui/react/macro';
import ProductsFilter from './filter';

export default function ProductsMobileFilter() {
    return (
        <>
            <Drawer>
                <DrawerTrigger className='flex justify-center items-center gap-1 min-w-fit px-3 !h-10 border-[1px] border-primary text-primary bg-transparent hover:bg-primary hover:text-white rounded-[5px] xl:hidden'>
                    <FilterSquare size={24} color='currentColor' />
                    فیلتر ها
                </DrawerTrigger>
                <DrawerContent>
                    <DrawerHeader className='flex justify-start'>
                        <DrawerTitle>
                            <Trans>
                                فیلتر محصولات
                            </Trans>
                        </DrawerTitle>
                    </DrawerHeader>
                    <ProductsFilter />
                </DrawerContent>
            </Drawer>
        </>
    );
}
'use client';
import * as React from 'react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../ui/collapsible';
import { Checkbox } from '../ui/checkbox';
import { Button } from '../ui/button';
import { Trans } from '@lingui/react/macro';
import { useState, useEffect, useTransition } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import LoadingSpin from '../ui/loading-spin';
import { Category, Brand, AttributeValue } from '@/types/products.types';
import { fetchAttributeValues, fetchProductBrands, fetchProductCategories } from '@/lib/services/products.services';
import { Slider } from "@/components/ui/slider"
import { cn } from "@/lib/utils"

interface Filters {
    category: string[];
    brand: string[];
    attr: string[];
}

export default function ProductsFilter() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [isPending, startTransition] = useTransition();

    const [categories, setCategories] = useState<Category[]>()
    const [brands, setBrands] = useState<Brand[]>()
    const [priceRange, setPriceRange] = useState<number[]>()
    const [attributes, setAttributes] = useState<AttributeValue[]>()

    const [groupedAttr, setGroupedAttr] = useState<Record<string, AttributeValue[]>>();

    const [filters, setFilters] = useState<Filters>({
        category: [],
        brand: [],
        attr: []
    });

    function groupByAttributeName(values: AttributeValue[]) {
        return values.reduce<Record<string, AttributeValue[]>>((acc, item) => {
            if (!acc[item.attribute_name]) {
                acc[item.attribute_name] = [];
            }
            acc[item.attribute_name].push(item);
            return acc;
        }, {});
    }

    // Initialize filters from URL parameters on component mount
    useEffect(() => {
        const categoryParams = searchParams.getAll('category');
        const brandParams = searchParams.getAll('brand');
        const attrParams = searchParams.getAll('attr');
        setFilters({
            category: categoryParams,
            brand: brandParams,
            attr: attrParams
        });
    }, [searchParams]);


    useEffect(() => {
        fetchProductCategories().then((res) => {
            setCategories(res.data.results)
        })
        fetchProductBrands().then((res) => {
            setBrands(res.data.results)
        })

        fetchAttributeValues({ page: 1, limit: 100, attribute__filter_display: true }).then((res) => {
            setAttributes(res.data.results)
        })
    }, [])

    useEffect(() => {
        let grouped;
        if (attributes)
            grouped = groupByAttributeName(attributes)
        setGroupedAttr(grouped);
    }, [attributes])

    const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>, type: "min" | "max") => {
        const value = Number(e.target.value);
        if (isNaN(value)) return;

        setPriceRange((prev) => {
            // fallback in case prev is somehow undefined
            const newRange = prev ? [...prev] : [0, 0];
            if (type === "min") newRange[0] = value;
            if (type === "max") newRange[1] = value;
            return newRange;
        });
    };


    const handleCategoryChange = (categoryId: string, checked: boolean) => {
        setFilters(prev => ({
            ...prev,
            category: checked
                ? [...prev.category, categoryId]
                : prev.category.filter(id => id !== categoryId)
        }));
    };

    const handleBrandChange = (brandId: string, checked: boolean) => {
        setFilters(prev => ({
            ...prev,
            brand: checked
                ? [...prev.brand, brandId]
                : prev.brand.filter(id => id !== brandId)
        }));
    };


    const handleAttrChange = (attrId: string, checked: boolean) => {
        setFilters(prev => ({
            ...prev,
            attr: checked
                ? [...prev.attr, attrId]
                : prev.attr.filter(id => id !== attrId)
        }));
    };

    // Apply filters to URL
    const applyFilters = () => {
        const params = new URLSearchParams(searchParams);

        // Clear existing category parameters
        params.delete('category');

        // Clear existing brand parameters
        params.delete('brand');

        // Clear existing brand parameters
        params.delete('minprice');

        // Clear existing brand parameters
        params.delete('maxprice');

        params.delete('attr');

        // Add new category parameters
        filters.category.forEach(categoryId => {
            params.append('category', categoryId);
        });

        // Add new brand parameters
        filters.brand.forEach(brandId => {
            params.append('brand', brandId);
        });

        // Add new attribute parameters
        filters.attr.forEach(attrId => {
            params.append('attr', attrId);
        });

        if (priceRange && priceRange[0])
            params.append('minprice', String(priceRange[0]))

        if (priceRange && priceRange[1])
            params.append('maxprice', String(priceRange[1]))

        startTransition(() => {
            router.push(`${pathname}?${params.toString()}`, { scroll: false });
        });
    };

    return (
        <div className='w-full bg-white rounded-[5px] py-[18px] px-3'>

            <div className='flex items-center gap-2'>
                <span>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M5.43935 4.43335H10.5527C10.9793 4.43335 11.326 4.78002 11.326 5.20668V6.06002C11.326 6.37335 11.1327 6.76002 10.9393 6.95335L9.27268 8.42668C9.03935 8.62002 8.88602 9.00668 8.88602 9.32002V10.9867C8.88602 11.22 8.73268 11.5267 8.53935 11.6467L7.99935 11.9867C7.49268 12.3 6.79935 11.9467 6.79935 11.3267V9.27335C6.79935 9.00002 6.64602 8.65335 6.48602 8.46002L5.01268 6.90668C4.81935 6.72002 4.66602 6.36668 4.66602 6.13335V5.24668C4.66602 4.78002 5.01268 4.43335 5.43935 4.43335Z" stroke="#424242" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M6.00065 14.6666H10.0007C13.334 14.6666 14.6673 13.3333 14.6673 9.99998V5.99998C14.6673 2.66665 13.334 1.33331 10.0007 1.33331H6.00065C2.66732 1.33331 1.33398 2.66665 1.33398 5.99998V9.99998C1.33398 13.3333 2.66732 14.6666 6.00065 14.6666Z" stroke="#424242" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </span>
                <span className='text-sm text-[#231F20]'>
                    <Trans>فیلتر ها</Trans>:
                </span>
            </div>
            <div className='flex flex-col gap-2 mt-5'>
                {categories && categories?.length > 0 && <Collapsible className='[&[data-state="open"]>button>svg]:rotate-180 bg-[#F6F6F6] rounded-[5px] px-2'>
                    <CollapsibleTrigger className='w-full flex items-center justify-between text-sm text-[#231F20] min-h-12'>
                        <Trans>
                            دسته بندی
                        </Trans>
                        <svg className={'transition-transform duration-300 [&[data-state="open"]]:rotate-180'} width="21" height="20" viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M17.1004 7.45831L11.6671 12.8916C11.0254 13.5333 9.97539 13.5333 9.33372 12.8916L3.90039 7.45831" stroke="#231F20" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </CollapsibleTrigger>
                    <CollapsibleContent className='collapsible-content'>
                        <hr className='border-[#989898] border-t-[0.6px] pb-[10px]' />
                        <div className='flex flex-col gap-4 text-xs text-[#231F20] pb-5'>
                            {categories?.map((item) => (
                                <div key={item.id} className='flex items-center gap-1'>
                                    <Checkbox
                                        id={`ctg-${item.slug}`}
                                        checked={filters.category.includes(String(item.id))}
                                        onCheckedChange={(checked) => handleCategoryChange(String(item.id), !!checked)}
                                    />
                                    <label htmlFor={`ctg-${item.slug}`}>
                                        {item.name}
                                    </label>
                                </div>
                            ))}

                        </div>
                    </CollapsibleContent>
                </Collapsible>}
                {brands && brands?.length > 0 && <Collapsible className='[&[data-state="open"]>button>svg]:rotate-180 bg-[#F6F6F6] rounded-[5px] px-2'>
                    <CollapsibleTrigger className='w-full flex items-center justify-between text-sm text-[#231F20] min-h-12'>
                        <Trans>
                            برند
                        </Trans>
                        <svg className={'transition-transform duration-300 [&[data-state="open"]]:rotate-180'} width="21" height="20" viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M17.1004 7.45831L11.6671 12.8916C11.0254 13.5333 9.97539 13.5333 9.33372 12.8916L3.90039 7.45831" stroke="#231F20" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </CollapsibleTrigger>
                    <CollapsibleContent className='collapsible-content'>
                        <hr className='border-[#989898] border-t-[0.6px] pb-[10px]' />
                        <div className='flex flex-col gap-4 text-xs text-[#231F20] pb-5'>
                            {brands?.map((item) => (
                                <div key={item.id} className='flex items-center gap-1'>
                                    <Checkbox
                                        id={`brand-${item.id}`}
                                        checked={filters.brand.includes(String(item.id))}
                                        onCheckedChange={(checked) => handleBrandChange(String(item.id), !!checked)}
                                    />
                                    <label htmlFor={`brand-${item.id}`}>
                                        {item.name}
                                    </label>
                                </div>
                            ))}

                        </div>
                    </CollapsibleContent>
                </Collapsible>}

                {<Collapsible className='[&[data-state="open"]>button>svg]:rotate-180 bg-[#F6F6F6] rounded-[5px] px-2'>
                    <CollapsibleTrigger className='w-full flex items-center justify-between text-sm text-[#231F20] min-h-12'>
                        <Trans>
                            محدوده قیمت
                        </Trans>
                        <svg className={'transition-transform duration-300 [&[data-state="open"]]:rotate-180'} width="21" height="20" viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M17.1004 7.45831L11.6671 12.8916C11.0254 13.5333 9.97539 13.5333 9.33372 12.8916L3.90039 7.45831" stroke="#231F20" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </CollapsibleTrigger>
                    <CollapsibleContent className='collapsible-content'>
                        <hr className='border-[#989898] border-t-[0.6px] pb-[10px]' />
                        <div className='flex flex-col gap-4 text-xs text-[#231F20] pb-5'>
                            <div className='flex flex-col gap-2'>
                                <div className='flex items-center gap-1'>
                                    <span className='text-sm font-semibold'>
                                        <Trans>
                                            از
                                        </Trans>
                                    </span>
                                    <input type="text" className='w-full rounded-[5px] h-10 px-2' value={priceRange && priceRange[0] || '0'} onChange={(e) => handlePriceChange(e, 'min')} />
                                    {/* <svg style={{ width: "18px", height: "18px", fill: "#424750" }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 14"><path fillRule="evenodd" d="M3.057 1.742L3.821 1l.78.75-.776.741-.768-.749zm3.23 2.48c0 .622-.16 1.111-.478 1.467-.201.221-.462.39-.783.505a3.251 3.251 0 01-1.083.163h-.555c-.421 0-.801-.074-1.139-.223a2.045 2.045 0 01-.9-.738A2.238 2.238 0 011 4.148c0-.059.001-.117.004-.176.03-.55.204-1.158.525-1.827l1.095.484c-.257.532-.397 1-.419 1.403-.002.04-.004.08-.004.12 0 .252.055.458.166.618a.887.887 0 00.5.354c.085.028.178.048.278.06.079.01.16.014.243.014h.555c.458 0 .769-.081.933-.244.14-.139.21-.383.21-.731V2.02h1.2v2.202zm5.433 3.184l-.72-.7.709-.706.735.707-.724.7zm-2.856.308c.542 0 .973.19 1.293.569.297.346.445.777.445 1.293v.364h.18v-.004h.41c.221 0 .377-.028.467-.084.093-.055.14-.14.14-.258v-.069c.004-.243.017-1.044 0-1.115L13 8.05v1.574a1.4 1.4 0 01-.287.863c-.306.405-.804.607-1.495.607h-.627c-.061.733-.434 1.257-1.117 1.573-.267.122-.58.21-.937.265a5.845 5.845 0 01-.914.067v-1.159c.612 0 1.072-.082 1.38-.247.25-.132.376-.298.376-.499h-.515c-.436 0-.807-.113-1.113-.339-.367-.273-.55-.667-.55-1.18 0-.488.122-.901.367-1.24.296-.415.728-.622 1.296-.622zm.533 2.226v-.364c0-.217-.048-.389-.143-.516a.464.464 0 00-.39-.187.478.478 0 00-.396.187.705.705 0 00-.136.449.65.65 0 00.003.067c.008.125.066.22.177.283.093.054.21.08.352.08h.533zM9.5 6.707l.72.7.724-.7L10.209 6l-.709.707zm-6.694 4.888h.03c.433-.01.745-.106.937-.29.024.012.065.035.12.068l.074.039.081.042c.135.073.261.133.379.18.345.146.67.22.977.22a1.216 1.216 0 00.87-.34c.3-.285.449-.714.449-1.286a2.19 2.19 0 00-.335-1.145c-.299-.457-.732-.685-1.3-.685-.502 0-.916.192-1.242.575-.113.132-.21.284-.294.456-.032.062-.06.125-.084.191a.504.504 0 00-.03.078 1.67 1.67 0 00-.022.06c-.103.309-.171.485-.205.53-.072.09-.214.14-.427.147-.123-.005-.209-.03-.256-.076-.057-.054-.085-.153-.085-.297V7l-1.201-.5v3.562c0 .261.048.496.143.703.071.158.168.296.29.413.123.118.266.211.43.28.198.084.42.13.665.136v.001h.036zm2.752-1.014a.778.778 0 00.044-.353.868.868 0 00-.165-.47c-.1-.134-.217-.201-.35-.201-.18 0-.33.103-.447.31-.042.071-.08.158-.114.262a2.434 2.434 0 00-.04.12l-.015.053-.015.046c.142.118.323.216.544.293.18.062.325.092.433.092.044 0 .086-.05.125-.152z" clipRule="evenodd"></path></svg> */}
                                    <span className='font-bold'>
                                        <Trans>
                                            ریال
                                        </Trans>
                                    </span>
                                </div>
                                <div className='flex items-center gap-1'>
                                    <span className='text-sm font-semibold'>
                                        <Trans>
                                            تا
                                        </Trans>
                                    </span>
                                    <input type="text" className='w-full rounded-[5px] h-10 px-2' value={priceRange && priceRange[1] || ''} onChange={(e) => handlePriceChange(e, 'max')} />
                                    {/* <svg style={{ width: "18px", height: "18px", fill: "#424750" }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 14"><path fillRule="evenodd" d="M3.057 1.742L3.821 1l.78.75-.776.741-.768-.749zm3.23 2.48c0 .622-.16 1.111-.478 1.467-.201.221-.462.39-.783.505a3.251 3.251 0 01-1.083.163h-.555c-.421 0-.801-.074-1.139-.223a2.045 2.045 0 01-.9-.738A2.238 2.238 0 011 4.148c0-.059.001-.117.004-.176.03-.55.204-1.158.525-1.827l1.095.484c-.257.532-.397 1-.419 1.403-.002.04-.004.08-.004.12 0 .252.055.458.166.618a.887.887 0 00.5.354c.085.028.178.048.278.06.079.01.16.014.243.014h.555c.458 0 .769-.081.933-.244.14-.139.21-.383.21-.731V2.02h1.2v2.202zm5.433 3.184l-.72-.7.709-.706.735.707-.724.7zm-2.856.308c.542 0 .973.19 1.293.569.297.346.445.777.445 1.293v.364h.18v-.004h.41c.221 0 .377-.028.467-.084.093-.055.14-.14.14-.258v-.069c.004-.243.017-1.044 0-1.115L13 8.05v1.574a1.4 1.4 0 01-.287.863c-.306.405-.804.607-1.495.607h-.627c-.061.733-.434 1.257-1.117 1.573-.267.122-.58.21-.937.265a5.845 5.845 0 01-.914.067v-1.159c.612 0 1.072-.082 1.38-.247.25-.132.376-.298.376-.499h-.515c-.436 0-.807-.113-1.113-.339-.367-.273-.55-.667-.55-1.18 0-.488.122-.901.367-1.24.296-.415.728-.622 1.296-.622zm.533 2.226v-.364c0-.217-.048-.389-.143-.516a.464.464 0 00-.39-.187.478.478 0 00-.396.187.705.705 0 00-.136.449.65.65 0 00.003.067c.008.125.066.22.177.283.093.054.21.08.352.08h.533zM9.5 6.707l.72.7.724-.7L10.209 6l-.709.707zm-6.694 4.888h.03c.433-.01.745-.106.937-.29.024.012.065.035.12.068l.074.039.081.042c.135.073.261.133.379.18.345.146.67.22.977.22a1.216 1.216 0 00.87-.34c.3-.285.449-.714.449-1.286a2.19 2.19 0 00-.335-1.145c-.299-.457-.732-.685-1.3-.685-.502 0-.916.192-1.242.575-.113.132-.21.284-.294.456-.032.062-.06.125-.084.191a.504.504 0 00-.03.078 1.67 1.67 0 00-.022.06c-.103.309-.171.485-.205.53-.072.09-.214.14-.427.147-.123-.005-.209-.03-.256-.076-.057-.054-.085-.153-.085-.297V7l-1.201-.5v3.562c0 .261.048.496.143.703.071.158.168.296.29.413.123.118.266.211.43.28.198.084.42.13.665.136v.001h.036zm2.752-1.014a.778.778 0 00.044-.353.868.868 0 00-.165-.47c-.1-.134-.217-.201-.35-.201-.18 0-.33.103-.447.31-.042.071-.08.158-.114.262a2.434 2.434 0 00-.04.12l-.015.053-.015.046c.142.118.323.216.544.293.18.062.325.092.433.092.044 0 .086-.05.125-.152z" clipRule="evenodd"></path></svg> */}
                                    <span className='font-bold'>
                                        <Trans>
                                            ریال
                                        </Trans>
                                    </span>
                                </div>
                            </div>
                            <Slider
                                defaultValue={[0, 100]}
                                max={100}
                                step={1}
                                onValueChange={(value) => setPriceRange(value)}
                                className={cn("mt-2")}
                            />

                        </div>
                    </CollapsibleContent>
                </Collapsible>}

                {groupedAttr && Object.keys(groupedAttr).length > 0 &&
                    Object.entries(groupedAttr).map(([attributeName, items], index) => {
                        return (
                            <Collapsible key={index} className='[&[data-state="open"]>button>svg]:rotate-180 bg-[#F6F6F6] rounded-[5px] px-2'>
                                <CollapsibleTrigger className='w-full flex items-center justify-between text-sm text-[#231F20] min-h-12'>
                                    {attributeName}
                                    <svg className={'transition-transform duration-300 [&[data-state="open"]]:rotate-180'} width="21" height="20" viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M17.1004 7.45831L11.6671 12.8916C11.0254 13.5333 9.97539 13.5333 9.33372 12.8916L3.90039 7.45831" stroke="#231F20" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </CollapsibleTrigger>
                                <CollapsibleContent className='collapsible-content'>
                                    <hr className='border-[#989898] border-t-[0.6px] pb-[10px]' />
                                    <div className='flex flex-col gap-4 text-xs text-[#231F20] pb-5'>
                                        {items?.map((item) => (
                                            <div key={item.id} className='flex items-center gap-1'>
                                                <Checkbox
                                                    id={`attr-${item.id}`}
                                                    checked={filters.attr.includes(String(item.id))}
                                                    onCheckedChange={(checked) => handleAttrChange(String(item.id), !!checked)}
                                                />
                                                <label dir='ltr' htmlFor={`attr-${item.id}`}>
                                                    {item.value}
                                                </label>
                                            </div>
                                        ))}

                                    </div>
                                </CollapsibleContent>
                            </Collapsible>
                        );
                    })
                }
            </div>
            <Button
                className='mt-6 text-sm w-full h-12 xl:h-8'
                onClick={applyFilters}
            // disabled={filters.category.length === 0}
            >
                {isPending ? (
                    <span className='flex items-center justify-center'>
                        <LoadingSpin />
                    </span>
                ) : (
                    <Trans>
                        اعمال فیلتر
                    </Trans>
                )}
            </Button>
        </div>
    );
}
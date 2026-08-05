'use client'

import { Trans, useLingui, } from '@lingui/react/macro';
import { msg } from '@lingui/core/macro'
import { Select, SelectValue, SelectTrigger, SelectContent, SelectItem } from '@/components/ui/select';
import { Button } from '../ui/button';
import { Formik, Form, Field, ErrorMessage, useFormikContext } from 'formik';
import * as Yup from 'yup';
import { useEffect, useState } from 'react';
import { fetchCityList, fetchProvinceList } from '@/lib/services/area.services';
import { ICity, IProvince } from '@/types/area.types';
import { submitIndividualAgencyApplication } from '@/lib/services/representation.services';
import { toast } from 'sonner';
interface FormValues {
    full_name: string;
    national_code: string;
    phone_number: string;
    phone: string;
    postal_code: string;
    province: string;
    city: string;
    description: string;
}

export default function ApplyForm() {
    const [provinceList, setProvinceList] = useState<IProvince[]>()
    const [cityList, setCityList] = useState<ICity[]>()

    const { i18n } = useLingui()

    // Initial form values
    const initialValues: FormValues = {
        full_name: '',
        national_code: '',
        phone_number: '',
        phone: '',
        postal_code: '',
        province: '',
        city: '',
        description: ''
    };

    // Validation schema using Yup
    const validationSchema = Yup.object({
        full_name: Yup.string()
            .min(2, i18n._(msg`نام باید حداقل ۲ کاراکتر باشد`))
            .required(i18n._(msg`نام و نام خانوادگی الزامی است`)),
        national_code: Yup.string()
            .matches(/^\d{10}$/, i18n._(msg`کد ملی باید ۱۰ رقم باشد`))
            .required(i18n._(msg`کد ملی الزامی است`)),
        phone_number: Yup.string()
            .matches(/^09\d{9}$/, i18n._(msg`شماره موبایل معتبر نیست`))
            .required(i18n._(msg`شماره موبایل الزامی است`)),
        phone: Yup.string()
            .matches(/^\d{8,11}$/, i18n._(msg`تلفن ثابت معتبر نیست`))
            .required(i18n._(msg`تلفن ثابت الزامی است`)),
        province: Yup.string()
            .required(i18n._(msg`انتخاب استان الزامی است`)),
        city: Yup.string()
            .required(i18n._(msg`انتخاب شهر الزامی است`)),
        description: Yup.string()
            .min(10, i18n._(msg`توضیحات باید حداقل ۱۰ کاراکتر باشد`))
    });

    // Form submission handler
    const handleSubmit = (values: FormValues, { setSubmitting, resetForm }: any) => {
        console.log('Form submitted:', values);
        // Here you would typically send the data to your API


        // فقط بخاطر غلط املایی داشتن بکند :/
        const { description, ...res } = values;

        submitIndividualAgencyApplication({ ...res, desceription: description }).then((res) => {
            toast.success(<Trans>اطلاعات شما با موفقیت ارسال شد.</Trans>)
        }).catch(() => {
            toast.error(<Trans>خطایی رخ داده است لطفا بعدا امتحان کنید!</Trans>)
        })

        setSubmitting(false);
        resetForm(); // Uncomment to reset form after submission
    };

    useEffect(() => {
        fetchProvinceList(1, 32).then((res) => setProvinceList(res.data.results));
    }, []);

    return (
        <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
        >
            {({ isSubmitting, setFieldValue, values, errors, touched }) => (
                <Form className='grid grid-cols-1 xl:grid-cols-2 gap-4'>
                    <ProvinceCityWatcher setCityList={setCityList} />
                    <div>
                        <label
                            className='block font-semibold mb-4 transition-colors duration-300'>
                            <Trans>
                                نام و نام خانوادگی
                            </Trans>*:
                        </label>
                        <Field
                            name="full_name"
                            placeholder={i18n._(msg`نام و نام خانوادگی`)}
                            className={`bg-white text-sm w-full px-4 py-3 border-[1px] rounded-[5px] focus:ring-[1px] focus:ring-primary focus:border-primary transition-all duration-300 ${errors.full_name && touched.full_name ? 'border-red-500' : 'border-[#D3D3D3]'}`}
                        />
                        <ErrorMessage name="full_name" component="div" className="text-red-500 text-xs mt-1" />
                    </div>

                    <div>
                        <label
                            className='block font-semibold mb-4 transition-colors duration-300'>
                            <Trans>
                                کد ملی
                            </Trans>*:
                        </label>
                        <Field
                            name="national_code"
                            placeholder={i18n._(msg`کد ملی`)}
                            className={`bg-white text-sm w-full px-4 py-3 border-[1px] rounded-[5px] focus:ring-[1px] focus:ring-primary focus:border-primary transition-all duration-300 ${errors.national_code && touched.national_code ? 'border-red-500' : 'border-[#D3D3D3]'}`}
                        />
                        <ErrorMessage name="national_code" component="div" className="text-red-500 text-xs mt-1" />
                    </div>

                    <div>
                        <label
                            className='block font-semibold mb-4 transition-colors duration-300'>
                            <Trans>
                                شماره موبایل
                            </Trans>*:
                        </label>
                        <Field
                            name="phone_number"
                            placeholder={i18n._(msg`شماره موبایل`)}
                            className={`bg-white text-sm w-full px-4 py-3 border-[1px] rounded-[5px] focus:ring-[1px] focus:ring-primary focus:border-primary transition-all duration-300 ${errors.phone_number && touched.phone_number ? 'border-red-500' : 'border-[#D3D3D3]'}`}
                        />
                        <ErrorMessage name="phone_number" component="div" className="text-red-500 text-xs mt-1" />
                    </div>

                    <div>
                        <label
                            className='block font-semibold mb-4 transition-colors duration-300'>
                            <Trans>
                                تلفن ثابت
                            </Trans>*:
                        </label>
                        <Field
                            name="phone"
                            placeholder={i18n._(msg`تلفن ثابت`)}
                            className={`bg-white text-sm w-full px-4 py-3 border-[1px] rounded-[5px] focus:ring-[1px] focus:ring-primary focus:border-primary transition-all duration-300 ${errors.phone && touched.phone ? 'border-red-500' : 'border-[#D3D3D3]'}`}
                        />
                        <ErrorMessage name="phone" component="div" className="text-red-500 text-xs mt-1" />
                    </div>

                    <div className='grid grid-cols-1 xl:grid-cols-3 gap-5 col-span-full'>
                        <div>
                            <label
                                className='block font-semibold mb-4 transition-colors duration-300'>
                                <Trans>
                                    نمایندگی جهت استان
                                </Trans>*:
                            </label>
                            <Select
                                value={values.province}
                                onValueChange={(value) => setFieldValue('province', value)}
                            >
                                <SelectTrigger
                                    className={`w-full !h-12 border-[1px] rounded-[5px] px-3 transition-all duration-300 ${errors.province && touched.province ? 'border-red-500' : 'border-[#D3D3D3]'}`}
                                >
                                    <SelectValue placeholder={i18n._(msg`نمایندگی جهت استان`)} />
                                </SelectTrigger>
                                <SelectContent className='max-h-[300px] overflow-y-auto no-scrollbar'>
                                    {provinceList?.map((option) => (
                                        <SelectItem key={option.id} value={String(option.id)}>
                                            {option.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <ErrorMessage name="province" component="div" className="text-red-500 text-xs mt-1" />
                        </div>

                        <div>
                            <label
                                className='block font-semibold mb-4 transition-colors duration-300'>
                                <Trans>
                                    نمایندگی جهت شهر*:
                                </Trans>
                            </label>
                            <Select
                                value={values.city}
                                onValueChange={(value) => setFieldValue('city', value)}
                                disabled={!values.province}
                            >
                                <SelectTrigger
                                    className={`w-full !h-12 border-[1px] rounded-[5px] px-3 transition-all duration-300 ${errors.city && touched.city ? 'border-red-500' : 'border-[#D3D3D3]'}`}
                                >
                                    <SelectValue placeholder={i18n._(msg`نمایندگی جهت شهر`)} />
                                </SelectTrigger>
                                <SelectContent className='max-h-[300px] overflow-y-auto no-scrollbar'>
                                    {cityList?.map((option) => (
                                        <SelectItem key={option.id} value={String(option.id)}>
                                            {option.name}
                                        </SelectItem>
                                    ))}
                                    {!cityList && <span className='text-xs py-1'>لطفا صبر کنید...</span>}
                                </SelectContent>
                            </Select>
                            <ErrorMessage name="city" component="div" className="text-red-500 text-xs mt-1" />
                        </div>

                        <div className='col-span'>
                            <label
                                className='block font-semibold mb-4 transition-colors duration-300'>
                                <Trans>
                                    کد پستی:
                                </Trans>
                            </label>
                            <Field
                                name="postal_code"
                                placeholder={i18n._(msg`کد پستی`)}
                                className={`bg-white text-sm w-full px-4 py-3 border-[1px] rounded-[5px] focus:ring-[1px] focus:ring-primary focus:border-primary transition-all duration-300 ${errors.postal_code && touched.postal_code ? 'border-red-500' : 'border-[#D3D3D3]'}`}
                            />
                            <ErrorMessage name="postal_code" component="div" className="text-red-500 text-xs mt-1" />
                        </div>

                    </div>

                    <div className='col-span-full'>
                        <label
                            className='block font-semibold mb-4 transition-colors duration-300'>
                            <Trans>
                                توضیحات
                            </Trans>
                        </label>
                        <Field
                            as="textarea"
                            name="description"
                            className={`bg-white text-sm w-full px-4 py-3 border-[1px] rounded-[5px] focus:ring-[1px] focus:ring-primary focus:border-primary transition-all duration-300 ${errors.description && touched.description ? 'border-red-500' : 'border-[#D3D3D3]'}`}
                            rows={4}
                            placeholder={i18n._(msg`توضیحات خود را وارد کنید`)}
                        />
                        <ErrorMessage name="description" component="div" className="text-red-500 text-xs mt-1" />
                    </div>

                    <div className='flex justify-center col-span-full mt-[57px]'>
                        <Button
                            type='submit'
                            className='h-12 min-w-[285px]'
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <Trans>در حال ارسال...</Trans>
                            ) : (
                                <Trans>ارسال</Trans>
                            )}
                        </Button>
                    </div>
                </Form>
            )}
        </Formik>
    );
}

const ProvinceCityWatcher = ({
    setCityList
}: {
    setCityList: React.Dispatch<React.SetStateAction<ICity[] | undefined>>;
}) => {
    const { values } = useFormikContext<FormValues>();

    useEffect(() => {
        setCityList([]);
        const getCities = async () => {
            if (values.province) {
                const cityRes = await fetchCityList(Number(values.province), 1, 100);
                setCityList(cityRes.data.results);
            } else {
                setCityList([]);
            }
        };
        getCities();
    }, [values.province, setCityList]);

    return null; // چون فقط برای واکنش به تغییرات استفاده میشه
};
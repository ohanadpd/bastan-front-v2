'use client';
import * as React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Button } from '../ui/button';
import { Trans, useLingui } from '@lingui/react/macro';
import { msg } from '@lingui/core/macro';
import { createAddress, updateAddress } from '@/lib/services/account.services';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

// Define the form values interface
interface AddressFormValues {
    title: string;
    receiver_mobile_number: string;
    receiver_fullname: string;
    address: string;
    is_default: boolean;
}



export default function AddressForm({ id, initial }: { id?: number, initial?: AddressFormValues }) {
    const { i18n } = useLingui();
    const router = useRouter()
    // Initial form values
    const initialValues: AddressFormValues = {
        title: initial?.title || '',
        receiver_mobile_number: initial?.receiver_mobile_number.replace(/ /g, '') || '',
        receiver_fullname: initial?.receiver_fullname || '',
        address: initial?.address || '',
        is_default: initial?.is_default || false
    };

    // Validation schema using Yup
    const validationSchema = Yup.object({
        title: Yup.string()
            .min(3, i18n._(msg`نام باید حداقل ۳ کاراکتر باشد`))
            .required(i18n._(msg`نام الزامی است`)),
        receiver_mobile_number: Yup.string()
            .min(8, i18n._(msg`شماره موبایل باید حداقل ۸ کاراکتر باشد`))
            .required(i18n._(msg`شماره موبایل الزامی است`))
            .matches(/^09[0-9]{9}$/, i18n._(msg`شماره موبایل معتبر نیست`)),
        receiver_fullname: Yup.string()
            .min(2, i18n._(msg`نام گیرنده باید حداقل ۲ کاراکتر باشد`))
            .required(i18n._(msg`نام گیرنده الزامی است`)),
        address: Yup.string()
            .min(2, i18n._(msg`آدرس باید حداقل ۲ کاراکتر باشد`))
            .required(i18n._(msg`آدرس الزامی است`)),
    });

    // Form submission handler
    const handleSubmit = (values: AddressFormValues) => {
        if (id) {
            updateAddress(id, values).then(res => {
                if (res.code === 201) {
                    toast.success(<Trans>آدرس با موفقیت ویرایش شد.</Trans>)
                    setTimeout(() => {
                        router.replace('/profile/addresses')
                    }, 1000)
                }
            }).catch(err => {
                toast.error(<Trans>خطا در ارسال اطلاعاعت.</Trans>)
            })
        } else {
            createAddress(values).then(res => {
                if (res.code === 201) {
                    toast.success(<Trans>آدرس با موفقیت ذخیره شد.</Trans>)
                    setTimeout(() => {
                        router.replace('/profile/addresses')
                    }, 1000)
                }
            }).catch(err => {
                toast.error(<Trans>خطا در ارسال اطلاعاعت.</Trans>)
            })
        }
    };

    return (
        <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
        >
            {({ errors, touched }) => (
                <Form>
                    <div className='grid grid-cols-1 xl:grid-cols-2 gap-5 xl:gap-x-5 xl:gap-y-6 mt-8 xl:mt-[55px] max-w-[780px] mx-auto'>
                        {/* Name Field */}
                        <div className='flex flex-col gap-3 xl:gap-4'>
                            <label htmlFor="title" className='text-[#4D4D4D] font-semibold'>
                                <Trans>نام</Trans>:
                            </label>
                            <Field
                                type="text"
                                id="title"
                                name="title"
                                placeholder={i18n._(msg`نام`)}
                                className={`bg-white text-sm w-full h-12 xl:h-14 px-4 py-3 border-[1px] rounded-[5px] focus:ring-[1px] focus:ring-primary focus:border-primary transition-all duration-300 ${errors.title && touched.title ? 'border-red-500' : ''
                                    }`}
                            />
                            <ErrorMessage name="title" component="div" className="text-red-500 text-sm" />
                        </div>

                        {/* Phone Field */}
                        <div className='flex flex-col gap-3 xl:gap-4'>
                            <label htmlFor="receiver_mobile_number" className='text-[#4D4D4D] font-semibold'>
                                <Trans>شماره موبایل</Trans>:
                            </label>
                            <Field
                                type="text"
                                id="receiver_mobile_number"
                                name="receiver_mobile_number"
                                placeholder={i18n._(msg`شماره موبایل`)}
                                className={`bg-white text-sm w-full h-12 xl:h-14 px-4 py-3 border-[1px] rounded-[5px] focus:ring-[1px] focus:ring-primary focus:border-primary transition-all duration-300 ${errors.receiver_mobile_number && touched.receiver_mobile_number ? 'border-red-500' : ''
                                    }`}
                            />
                            <ErrorMessage name="receiver_mobile_number" component="div" className="text-red-500 text-sm" />
                        </div>

                        {/* Receiver Name Field */}
                        <div className='flex flex-col gap-3 xl:gap-4 col-span-full'>
                            <label htmlFor="receiver_fullname" className='text-[#4D4D4D] font-semibold'>
                                <Trans>نام تحویل گیرنده</Trans>:
                            </label>
                            <Field
                                type="text"
                                id="receiver_fullname"
                                name="receiver_fullname"
                                placeholder={i18n._(msg`نام تحویل گیرنده`)}
                                className={`bg-white text-sm w-full h-12 xl:h-14 px-4 py-3 border-[1px] rounded-[5px] focus:ring-[1px] focus:ring-primary focus:border-primary transition-all duration-300 ${errors.receiver_fullname && touched.receiver_fullname ? 'border-red-500' : ''
                                    }`}
                            />
                            <ErrorMessage name="receiver_fullname" component="div" className="text-red-500 text-sm" />
                        </div>

                        {/* Address Field */}
                        <div className='flex flex-col gap-3 xl:gap-4 col-span-full'>
                            <label htmlFor="address" className='text-[#4D4D4D] font-semibold'>
                                <Trans>آدرس</Trans>:
                            </label>
                            <Field
                                as="textarea"
                                type="text"
                                id="address"
                                name="address"
                                rows={4}
                                placeholder={i18n._(msg`آدرس`)}
                                className={`bg-white text-sm w-full px-4 py-3 border-[1px] rounded-[5px] focus:ring-[1px] focus:ring-primary focus:border-primary transition-all duration-300 ${errors.address && touched.address ? 'border-red-500' : ''
                                    }`}
                            />
                            <ErrorMessage name="address" component="div" className="text-red-500 text-sm" />
                        </div>
                        <div className='flex items-center gap-2 col-span-full'>
                            <Field type="checkbox" id="is_default" name="is_default" />
                            <label htmlFor="is_default" className='text-sm xl:text-base font-semibold'>
                                <Trans>
                                    انتخاب به عنوان ادرس پیش فرض
                                </Trans>
                            </label>
                        </div>
                    </div>

                    <div className='flex justify-center mt-8 xl:mt-12'>
                        <Button type="submit" className='h-10 xl:h-12 w-full max-w-[232px] xl:max-w-[285px]'>
                            <Trans>ذخیره</Trans>
                        </Button>
                    </div>
                </Form>
            )}
        </Formik>
    );
}
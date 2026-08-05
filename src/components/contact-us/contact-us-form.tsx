'use client';

import { Trans, useLingui } from '@lingui/react/macro';
import { t, msg } from '@lingui/core/macro';
import * as React from 'react';
import { useFormik, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import { Button } from '../ui/button';
import { sendContactForm } from '@/lib/services/contact-us.services';
import { toast } from "sonner"

interface FormValues {
    fullname: string;
    phone: string;
    message: string;
}

export default function ContactUsForm() {
    const { i18n } = useLingui();
    
    const initialValues: FormValues = {
        fullname: '',
        phone: '',
        message: '',
    };

    const validationSchema = Yup.object({
        fullname: Yup.string()
            .min(2, i18n._(msg`نام باید حداقل ۲ کاراکتر باشد`))
            .required(i18n._(msg`نام و نام خانوادگی الزامی است`)),
        phone: Yup.string()
            .matches(/^09\d{9}$/, i18n._(msg`شماره تماس معتبر نیست (مثال: 09123456789)`))
            .required(i18n._(msg`شماره تماس الزامی است`)),
        message: Yup.string()
            .min(10, i18n._(msg`درخواست باید حداقل ۱۰ کاراکتر باشد`))
            .required(i18n._(msg`درخواست الزامی است`)),
    });

    const onSubmit = (values: FormValues, { resetForm }: FormikHelpers<FormValues>) => {
        console.log('Contact Form Submitted:', values);
        // Here you can add your form submission logic (API call, etc.)
        sendContactForm(values).then((res) => {
            toast.success(i18n._(msg`درخواست شما با موفقیت ارسال شد`));
        }).catch(()=>{
            toast.error(i18n._(msg`درخواست شما با خطا مواجه شد. لطفاً دوباره تلاش کنید.`));
        })
        resetForm();
    };

    const formik = useFormik<FormValues>({
        initialValues,
        validationSchema,
        onSubmit,
    });

    return (
        <form 
            onSubmit={formik.handleSubmit}
            className='grid grid-cols-1 xl:grid-cols-2 gap-x-5 gap-y-6'
        >
            <div className='flex flex-col gap-4'>
                <label htmlFor="fullname" className='text-[#4D4D4D] font-semibold'>
                    <Trans>نام و نام خانوادگی</Trans>*:
                </label>
                <input 
                    type="text" 
                    id="fullname" 
                    {...formik.getFieldProps('fullname')}
                    className={`bg-white text-sm w-full px-4 py-3 border-[1px] rounded-[5px] focus:ring-[1px] focus:ring-primary focus:border-primary transition-all duration-300 ${
                        formik.touched.fullname && formik.errors.fullname
                            ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                            : ''
                    }`}
                />
                {formik.touched.fullname && formik.errors.fullname && (
                    <span className="text-red-500 text-sm">{formik.errors.fullname}</span>
                )}
            </div>
            <div className='flex flex-col gap-4'>
                <label htmlFor="phone" className='text-[#4D4D4D] font-semibold'>
                    <Trans>شماره تماس</Trans>*:
                </label>
                <input 
                    type="text" 
                    id="phone" 
                    {...formik.getFieldProps('phone')}
                    className={`bg-white text-sm w-full px-4 py-3 border-[1px] rounded-[5px] focus:ring-[1px] focus:ring-primary focus:border-primary transition-all duration-300 ${
                        formik.touched.phone && formik.errors.phone
                            ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                            : ''
                    }`}
                />
                {formik.touched.phone && formik.errors.phone && (
                    <span className="text-red-500 text-sm">{formik.errors.phone}</span>
                )}
            </div>
            <div className='col-span-full flex flex-col gap-4'>
                <label htmlFor="message" className='text-[#4D4D4D] font-semibold'>
                    <Trans>درخواست</Trans>*:
                </label>
                <textarea 
                    rows={4} 
                    id="message" 
                    {...formik.getFieldProps('message')}
                    className={`bg-white text-sm w-full px-4 py-3 border-[1px] rounded-[5px] focus:ring-[1px] focus:ring-primary focus:border-primary transition-all duration-300 ${
                        formik.touched.message && formik.errors.message
                            ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                            : ''
                    }`}
                />
                {formik.touched.message && formik.errors.message && (
                    <span className="text-red-500 text-sm">{formik.errors.message}</span>
                )}
            </div>
            <div className='flex justify-center col-span-full mt-8'>
                <Button 
                    type="submit"
                    disabled={formik.isSubmitting}
                    className='h-12 min-w-[285px]'
                >
                    <Trans>ارسال</Trans>
                </Button>
            </div>
        </form>
    );
}
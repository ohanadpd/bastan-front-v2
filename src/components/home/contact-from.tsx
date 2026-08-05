'use client';

import { Trans } from '@lingui/react/macro';
import { msg } from '@lingui/core/macro';
import * as React from 'react';
import { useFormik, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import { Button } from '../ui/button';
import { useLingui } from '@lingui/react/macro';
import { cn } from '@/lib/utils';
import { sendContactForm } from '@/lib/services/contact-us.services';
import { toast } from 'sonner';

interface FormValues {
    name: string;
    phone: string;
    message: string;
}

export default function HomeContactForm({textColor="#FFFFFF"}:{textColor?:string}) {
    const { i18n } = useLingui();
    
    const initialValues: FormValues = {
        name: '',
        phone: '',
        message: '',
    };

    const validationSchema = Yup.object({
        name: Yup.string().required(i18n._(msg`نام الزامی است`)),
        phone: Yup.string()
            .matches(/^09\d{9}$/, i18n._(msg`شماره تماس معتبر نیست`)) // e.g. 09123456789
            .required(i18n._(msg`شماره تماس الزامی است`)),
        message: Yup.string()
            .required(i18n._(msg`توضیحات الزامی است`))
            .min(10, i18n._(msg`حداقل ۱۰ کاراکتر وارد کنید`)),
    });

    const onSubmit = (values: FormValues, { resetForm }: FormikHelpers<FormValues>) => {
        console.log('Form Submitted:', values);
        sendContactForm({fullname: values.name, phone: values.phone, message: values.message}).then((res) => {
            toast.success(<Trans>فرم با موفقیت ارسال شد</Trans>);
        }).catch(()=>{
            toast.error(<Trans>فرم با خطا مواجه شد. لطفاً دوباره تلاش کنید.</Trans>);
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
            className="flex flex-col gap-10"
        >
            <div className='flex flex-col xl:flex-row gap-5 mt-14'>

                <div className="flex flex-col gap-5 xl:gap-[35px] w-full">
                    <div className="flex flex-col gap-2">
                        <label htmlFor="name" className={cn("font-semibold")} style={{color: textColor}}>
                            <Trans>نام و نام خانوادگی</Trans>:
                        </label>
                        <input
                            type="text"
                            id="name"
                            {...formik.getFieldProps('name')}
                            className={`w-full h-14 bg-white px-4 border-[1px] rounded-[5px] focus:ring-[1px] focus:ring-primary focus:border-primary ${formik.touched.name && formik.errors.name
                                    ? 'border-red-500'
                                    : 'border-[#D3D3D3]'
                                }`}
                        />
                        {formik.touched.name && formik.errors.name && (
                            <span className="text-red-500 text-sm">{formik.errors.name}</span>
                        )}
                    </div>

                    <div className="flex flex-col gap-2">
                        <label htmlFor="phone" className="font-semibold" style={{color: textColor}}>
                            <Trans>شماره تماس</Trans>*:
                        </label>
                        <input
                            type="text"
                            id="phone"
                            {...formik.getFieldProps('phone')}
                            className={`w-full h-14 bg-white px-4 border-[1px] rounded-[5px] focus:ring-[1px] focus:ring-primary focus:border-primary ${formik.touched.phone && formik.errors.phone
                                    ? 'border-red-500'
                                    : 'border-[#D3D3D3]'
                                }`}
                        />
                        {formik.touched.phone && formik.errors.phone && (
                            <span className="text-red-500 text-sm">{formik.errors.phone}</span>
                        )}
                    </div>
                </div>

                <div className="w-full xl:max-w-[645px] flex flex-col gap-2">
                    <label htmlFor="message" className="font-semibold" style={{color: textColor}}>
                        <Trans>توضیحات</Trans>*:
                    </label>
                    <textarea
                        id="message"
                        {...formik.getFieldProps('message')}
                        className={`w-full h-[187px] xl:h-full bg-white p-4 border-[1px] rounded-[5px] focus:ring-[1px] focus:ring-primary focus:border-primary ${formik.touched.message && formik.errors.message
                                ? 'border-red-500'
                                : 'border-[#D3D3D3]'
                            }`}
                    />
                    {formik.touched.message && formik.errors.message && (
                        <span className="text-red-500 text-sm">{formik.errors.message}</span>
                    )}
                </div>
            </div>
            <Button className='w-full xl:max-w-[285px]'>
                <Trans>ارسال</Trans>
            </Button>
        </form>
    );
}

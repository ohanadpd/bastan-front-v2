'use client';
import * as React from 'react';
import { msg } from '@lingui/core/macro';
import { Trans, useLingui } from '@lingui/react/macro';
import { useFormik, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import { Button } from './button';
import { toast } from 'sonner';
import { sendNewsletter } from '@/lib/services/settigns.services';

interface FormValues {
    phone_number: string;
}

export default function FooterNewsletter() {
    const { i18n } = useLingui();

    const initialValues: FormValues = {
        phone_number: '',
    };

    const validationSchema = Yup.object({
        phone_number: Yup.string().required(i18n._(msg`شماره موبایل الزامی است`)),
    });

    const onSubmit = async (values: FormValues, { resetForm }: FormikHelpers<FormValues>) => {
        try {
            // TODO: Replace with actual newsletter subscription API call
            console.log('Newsletter subscription:', values);
            sendNewsletter({ phone_number: values.phone_number }).then(() => {
                toast.success(i18n._(msg`با موفقیت در خبرنامه عضو شدید`));
                resetForm();
            }).catch(()=>{
                toast.error(i18n._(msg`خطایی رخ داد. لطفاً دوباره تلاش کنید.`));
            })

        } catch (error) {
            toast.error(i18n._(msg`خطایی رخ داد. لطفاً دوباره تلاش کنید.`));
        }
    };

    const formik = useFormik<FormValues>({
        initialValues,
        validationSchema,
        onSubmit,
    });

    return (
        <form
            onSubmit={formik.handleSubmit}
            className='bg-white h-14 py-2 px-[10px] border border-[#B3B3B3] flex items-center justify-between w-full max-w-[455px] mx-auto mt-8 rounded-[5px]'
        >
            <div className='flex-1 h-full relative'>
                <input
                    type="tel"
                    id="phone_number"
                    {...formik.getFieldProps('phone_number')}
                    placeholder={i18n._(msg`برای عضویت در خبر نامه شماره موبایل خود را وارد کنید`)}
                    className={`w-full h-full text-sm placeholder:text-[#828282] bg-transparent outline-none text-right ${formik.touched.phone_number && formik.errors.phone_number
                            ? 'text-red-500'
                            : ''
                        }`}
                />
                {formik.touched.phone_number && formik.errors.phone_number && (
                    <span className="absolute -bottom-8 start-0 text-red-500 text-xs whitespace-nowrap">
                        {formik.errors.phone_number}
                    </span>
                )}
            </div>
            <Button
                type="submit"
                disabled={formik.isSubmitting}
                className='min-w-fit px-5 h-10 rounded-[5px]'
            >
                <Trans>عضویت</Trans>
            </Button>
        </form>
    );
}
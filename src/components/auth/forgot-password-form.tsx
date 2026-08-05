'use client'
import { Trans, useLingui } from '@lingui/react/macro';
import * as React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Button } from '@/components/ui/button';
import { default as Link } from '@/components/localized-link';
import LoadingSpin from '../ui/loading-spin';
import { sendOtp } from '@/lib/services/account.services';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { toast } from 'sonner';
import { msg } from '@lingui/core/macro';

// Initial form values
const initialValues = {
    phone: ''
};

export default function AuthForgotPasswordForm() {
    const { i18n } = useLingui();
    
    const router = useRouter();
    const setOtpType = useAuthStore((state) => state.setOtpType);
    const setPhone = useAuthStore((state) => state.setPhone);

    // Validation schema using Yup
    const validationSchema = Yup.object({
        phone: Yup.string()
            .required(i18n._(msg`شماره موبایل الزامی است`))
            .matches(/^09[0-9]{9}$/, i18n._(msg`فرمت شماره موبایل صحیح نیست (09xxxxxxxxx)`))
    });

    const handleSubmit = async (values: typeof initialValues, { setSubmitting }: any) => {
        try {
            await sendOtp({
                mobile_number: values.phone,
                type: 1
            });
            setOtpType(1);
            setPhone(values.phone);
            toast.success(<Trans>کد تایید با موفقیت ارسال شد.</Trans>);
            setTimeout(() => (
                router.replace('/auth/verify')
            ), 1000)

        } catch (error) {
            console.error('Registration error:', error);
            toast.error(<Trans>خطا در ارسال کد تایید. لطفا دوباره تلاش کنید.</Trans>);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className='flex flex-col items-center gap-8 xl:gap-10 w-full max-w-[508px] px-4 py-6 xl:p-12 border-[1px] border-[#D2D2D2] rounded-[10px]'>
            <div className='flex flex-col items-center gap-2'>
                <h1 className='font-bold text-primary text-2xl xl:text-[32px]'>
                    <Trans>
                        فراموشی رمز عبور
                    </Trans>
                </h1>
                <p className='text-sm xl:text-base text-center text-[#231F20]'>
                    <Trans>
                        برای تغییر رمز عبور شماره موبایل خود را وارد کنید
                    </Trans>
                </p>
            </div>

            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
            >
                {({ isSubmitting, errors, touched }) => (
                    <Form className='w-full max-w-[356px] flex flex-col gap-6'>
                        <div className='flex flex-col gap-3 xl:gap-4'>
                            <label htmlFor="phone" className='text-[#4D4D4D] font-semibold'>
                                <Trans>شماره موبایل</Trans>*:
                            </label>
                            <Field
                                type="text"
                                id="phone"
                                name="phone"
                                placeholder="09xxxxxxxxx"
                                className={`bg-white text-sm w-full h-12 xl:h-14 px-4 py-3 border-[1px] rounded-[5px] focus:ring-[1px] focus:ring-primary focus:border-primary transition-all duration-300 ${errors.phone && touched.phone
                                    ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                                    : 'border-gray-300'
                                    }`}
                            />
                            <ErrorMessage
                                name="phone"
                                component="div"
                                className="text-red-500 text-sm mt-1"
                            />
                        </div>

                        <div className='w-full flex flex-col items-center gap-2'>
                            <Button
                                type="submit"
                                disabled={isSubmitting}
                                className='h-10 xl:h-12 w-full max-w-[285px] disabled:opacity-50 disabled:cursor-not-allowed'
                            >
                                {isSubmitting ? (
                                    <span className="flex justify-center items-center gap-2">
                                        <LoadingSpin />
                                        لطفا صبر کنید...
                                    </span>
                                ) : (
                                    <Trans>ثبت و ادامه</Trans>
                                )}
                            </Button>
                            <p className='text-sm text-[#231F20]'>
                                حساب کاربری ندارید؟ <Link href={`/auth/register`} className='text-primary'>ثبت نام</Link> کنید
                            </p>
                        </div>
                    </Form>
                )}
            </Formik>
        </div>
    );
}
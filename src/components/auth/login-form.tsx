'use client'
import { Trans, useLingui } from '@lingui/react/macro';
import * as React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Button } from '@/components/ui/button';
import { default as Link } from '@/components/localized-link';
import { signIn } from "next-auth/react";
import { useRouter } from 'next/navigation';
import LoadingSpin from '../ui/loading-spin';
import { msg } from '@lingui/core/macro';
import { Eye, EyeSlash } from 'iconsax-reactjs';
import { useState } from 'react';



// Initial form values
const initialValues = {
    phone: '',
    password: ''
};


export default function AuthLoginForm() {
    const { i18n } = useLingui();

    const [authError, setAuthError] = useState<string | null>(null)
    const router = useRouter()

    const [showPassword, setShowPassword] = useState(false)

    // Validation schema using Yup
    const validationSchema = Yup.object({
        phone: Yup.string()
            .required(i18n._(msg`شماره موبایل الزامی است`))
            .matches(/^09[0-9]{9}$/, i18n._(msg`فرمت شماره موبایل صحیح نیست (09xxxxxxxxx)`)),
        password: Yup.string()
            .required(i18n._(msg`رمز عبور الزامی است`))
            .min(8, i18n._(msg`رمز عبور باید حداقل ۸ کاراکتر باشد`))
            .max(32, i18n._(msg`رمز عبور باید حداکثر ۳۲ کاراکتر باشد`))
    });

    const handleSubmit = async (values: typeof initialValues, { setSubmitting }: any) => {
        try {
            console.log('Form submitted:', values);
            // Here you would typically make an API call
            // await registerUser(values.phone);

            // For now, just simulate a delay
            await new Promise(resolve => setTimeout(resolve, 1000));
            setAuthError(null)
            const result = await signIn("credentials", {
                mobile_number: values.phone,
                password: values.password,
                redirect: false,
            });
            console.log('signIn result:', result)
            if (result?.error) {
                // Map known NextAuth credential errors to a friendly Persian message
                const errorCode = result.error
                const message =
                    errorCode === 'Invalid identifier or password' || errorCode === 'CredentialsSignin'
                        ? 'شماره موبایل یا رمز عبور نادرست است'
                        : errorCode === 'CallbackRouteError'
                            ? 'خطای ارتباط با سرور احراز هویت. تنظیمات سرور را بررسی کنید.'
                            : 'ورود ناموفق بود. لطفاً مجدداً تلاش کنید.'
                setAuthError(message)
                return
            }
            // Optional: handle success (e.g., redirect) — left minimal per request
            // You can use router.push or check result?.url
            router.replace('/')
        } catch (error) {
            console.error('Registration error:', error);
            setAuthError('خطا در ورود. لطفاً دوباره تلاش کنید.')
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className='flex flex-col items-center gap-8 xl:gap-10 w-full max-w-[508px] px-4 py-6 xl:p-12 border-[1px] border-[#D2D2D2] rounded-[10px]'>
            <div className='flex flex-col items-center gap-2'>
                <h1 className='font-bold text-primary text-2xl xl:text-[32px]'>
                    <Trans>
                        ورود
                    </Trans>
                </h1>
                <p className='text-sm xl:text-base text-center text-[#231F20]'>
                    <Trans>
                        لطفا وارد حساب کاربری خود شوید
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
                        <div className='flex flex-col gap-8'>
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
                            <div className='flex flex-col gap-3 xl:gap-4'>
                                <label htmlFor="password" className='text-[#4D4D4D] font-semibold'>
                                    <Trans>رمز عبور</Trans>*:
                                </label>
                                <div className='relative'>
                                    <Field
                                        type={showPassword ? "text" :"password"}
                                        id="password"
                                        name="password"
                                        placeholder="********"
                                        className={`bg-white text-sm w-full h-12 xl:h-14 px-4 py-3 border-[1px] rounded-[5px] focus:ring-[1px] focus:ring-primary focus:border-primary transition-all duration-300 ${errors.password && touched.password
                                            ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                                            : 'border-gray-300'
                                            }`}
                                    />
                                    <span
                                        className='cursor-pointer absolute end-2 top-1 translate-y-1/2 text-gray-400'
                                        onClick={() => setShowPassword(prev => !prev)}
                                    >
                                        {!showPassword && <Eye />}
                                        {showPassword && <EyeSlash />}
                                    </span>
                                </div>
                                <ErrorMessage
                                    name="password"
                                    component="div"
                                    className="text-red-500 text-sm mt-1"
                                />
                            </div>
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
                                        <Trans>
                                            در حال ورود...
                                        </Trans>
                                    </span>
                                ) : (
                                    <Trans>ورود</Trans>
                                )}
                            </Button>
                            {authError && (
                                <div className='w-full max-w-[285px] text-sm text-red-600 text-center'>
                                    {authError}
                                </div>
                            )}
                            <p className='text-sm text-[#231F20]'>
                                <Trans>حساب کاربری ندارید؟ <Link href={`/auth/register`} className='text-primary'>ثبت نام</Link> کنید</Trans>
                            </p>
                            <p className='text-sm text-[#231F20]'>
                                <Link href={`/auth/forgot-password`} className='hover:text-primary'><Trans>رمز عبور را فراموش کرده اید؟</Trans></Link>
                            </p>
                        </div>
                    </Form>
                )}
            </Formik>
        </div>
    );
}
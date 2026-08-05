'use client'
import { Trans, useLingui } from '@lingui/react/macro';
import * as React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Button } from '@/components/ui/button';
import { default as Link } from '@/components/localized-link';
import { signIn } from "next-auth/react";
import { notFound, useRouter } from 'next/navigation';
import LoadingSpin from '../ui/loading-spin';
import { msg } from '@lingui/core/macro';
import { useAuthStore } from '@/store/authStore';
import { registerAccount } from '@/lib/services/account.services';
import { toast } from 'sonner';
import { Eye, EyeSlash } from 'iconsax-reactjs';
import { useState } from 'react';


// Initial form values
const initialValues = {
    full_name: '',
    password: '',
    confirmPassword: ''
};

export default function AuthCompleteRegisterForm() {
    const token = useAuthStore((state) => state.registerToken);
    const setToken = useAuthStore((state) => state.setRegisterToken);
    const phone = useAuthStore((state) => state.phone);
    const setPhone = useAuthStore((state) => state.setPhone);

    const { i18n } = useLingui();

    const [authError, setAuthError] = useState<string | null>(null)
    const router = useRouter()

    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmationPassword, setShowConfirmationPassword] = useState(false)

    // Validation schema using Yup
    const validationSchema = Yup.object({
        full_name: Yup.string()
            .required(i18n._(msg`نام و نام خانوادگی الزامی است`)),
        password: Yup.string()
            .required(i18n._(msg`رمز عبور الزامی است`))
            .min(8, i18n._(msg`رمز عبور باید حداقل ۸ کاراکتر باشد`))
            .max(32, i18n._(msg`رمز عبور باید حداکثر ۳۲ کاراکتر باشد`)),
        confirmPassword: Yup.string()
            .required(i18n._(msg`تکرار رمز عبور الزامی است`))
            .oneOf([Yup.ref('password')], i18n._(msg`رمز عبور و تکرار آن باید یکسان باشند`))
    });

    const handleSubmit = async (values: typeof initialValues, { setSubmitting }: any) => {
        try {
            if (phone && token) {
                const res = await registerAccount({
                    mobile_number: phone,
                    full_name: values.full_name,
                    password: values.confirmPassword,
                    token: token
                });
                console.log(res)
                if (res.data.access) {
                    const result = await signIn("token-login", {
                        accessToken: res.data.access,
                        refreshToken: res.data.refresh,
                        phone: res.data.user.mobile_number,
                        redirect: false,
                    });
                    if (result?.error) {
                        // Map known NextAuth credential errors to a friendly Persian message
                        const errorCode = result.error
                        setAuthError(errorCode)
                        return
                    } else {
                        toast.success(<Trans>با موفقیت وارد شدید.</Trans>)

                    }
                }
            }
            router.replace('/')

        } catch (error) {
            console.error('Registration error:', error);
            setAuthError('خطا در ورود. لطفاً دوباره تلاش کنید.')
        } finally {
            setSubmitting(false);
        }
    };

    if (!phone && !token)
        notFound()

    return (
        <div className='flex flex-col items-center gap-8 xl:gap-10 w-full max-w-[508px] px-4 py-6 xl:p-12 border-[1px] border-[#D2D2D2] rounded-[10px]'>
            <div className='flex flex-col items-center gap-2'>
                <h1 className='font-bold text-primary text-2xl xl:text-[32px]'>
                    <Trans>
                        تکمیل ثبت نام
                    </Trans>
                </h1>
                <p className='text-sm xl:text-base text-center text-[#231F20]'>
                    <Trans>
                        اطلاعت خود را برای ثبت نام وارد کنید.
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
                                <label htmlFor="password" className='text-[#4D4D4D] font-semibold'>
                                    <Trans>نام و نام خانوادگی</Trans>
                                </label>
                                <Field
                                    type="full_name"
                                    id="full_name"
                                    name="full_name"
                                    placeholder={i18n._(msg`نام و نام خانوادگی`)}
                                    className={`bg-white text-sm w-full h-12 xl:h-14 px-4 py-3 border-[1px] rounded-[5px] focus:ring-[1px] focus:ring-primary focus:border-primary transition-all duration-300 ${errors.password && touched.password
                                        ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                                        : 'border-gray-300'
                                        }`}
                                />
                                <ErrorMessage
                                    name="full_name"
                                    component="div"
                                    className="text-red-500 text-sm mt-1"
                                />
                            </div>
                            <div className='flex flex-col gap-3 xl:gap-4'>
                                <label htmlFor="password" className='text-[#4D4D4D] font-semibold'>
                                    <Trans>رمز عبور</Trans>
                                </label>
                                <div className='relative'>
                                    <Field
                                        type={showPassword ? "text" : "password"}
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
                            <div className='flex flex-col gap-3 xl:gap-4'>
                                <label htmlFor="confirmPassword" className='text-[#4D4D4D] font-semibold'>
                                    <Trans>تکرار رمز عبور</Trans>
                                </label>
                                <div className='relative'>
                                    <Field
                                        type={showConfirmationPassword ? "text" : "password"}
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        placeholder="********"
                                        className={`bg-white text-sm w-full h-12 xl:h-14 px-4 py-3 border-[1px] rounded-[5px] focus:ring-[1px] focus:ring-primary focus:border-primary transition-all duration-300 ${errors.confirmPassword && touched.confirmPassword
                                            ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                                            : 'border-gray-300'
                                            }`}
                                    />
                                    <span
                                        className='cursor-pointer absolute end-2 top-1 translate-y-1/2 text-gray-400'
                                        onClick={() => setShowConfirmationPassword(prev => !prev)}
                                    >
                                        {!showConfirmationPassword && <Eye />}
                                        {showConfirmationPassword && <EyeSlash />}
                                    </span>
                                </div>
                                <ErrorMessage
                                    name="confirmPassword"
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
                                        لطفا صبر کنید...
                                    </span>
                                ) : (
                                    <Trans>ثبت نام</Trans>
                                )}
                            </Button>
                        </div>
                    </Form>
                )}
            </Formik>
        </div>
    );
}
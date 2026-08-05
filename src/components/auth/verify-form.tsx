'use client'
import { Trans, useLingui } from '@lingui/react/macro';
import * as React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Button } from '@/components/ui/button';
import { default as Link } from '@/components/localized-link';
import { useAuthStore } from '@/store/authStore';
import { notFound, useRouter } from 'next/navigation';
import { verifyOtp } from '@/lib/services/account.services';
import { toast } from 'sonner';
import { msg } from '@lingui/core/macro';
import { useState } from 'react';



// Initial form values
const initialValues = {
    verificationCode: ''
};

export default function AuthVerifyForm() {
    const { i18n } = useLingui();

    const phoneNumber = useAuthStore((state) => state.phone);
    const otpType = useAuthStore((state) => state.otpType);
    const setOtpType = useAuthStore((state) => state.setOtpType);
    const setPhoneNumber = useAuthStore((state) => state.setPhone);
    const setForgotPasswordToken = useAuthStore((state) => state.setForgotPasswordToken);
    const setRegisterToken = useAuthStore((state) => state.setRegisterToken);

    const [inputRefs] = useState(() => Array.from({ length: 4 }, () => React.createRef<HTMLInputElement>()));

    const router = useRouter()

    if (!phoneNumber && !otpType)
        notFound()

    // Validation schema using Yup
    const validationSchema = Yup.object({
        verificationCode: Yup.string()
            .required(i18n._(msg`کد تایید الزامی است`))
            .length(4, i18n._(msg`کد تایید باید 4 رقم باشد`))
            .matches(/^[0-9]{4}$/, i18n._(msg`کد تایید باید شامل 4 رقم باشد`))
    });

    const handleSubmit = async (values: typeof initialValues, { setSubmitting }: any) => {
        try {
            console.log('Verification code submitted:', values);
            if (phoneNumber)
                verifyOtp({ mobile_number: phoneNumber, code: values.verificationCode }).then(res => {
                    if (otpType === 1) {
                        setForgotPasswordToken(res.data.token)
                        toast.success(<Trans>کد تایید با موفقیت وارد شد!</Trans>);
                        setTimeout(() => {
                            router.replace('/auth/password-confirmation');
                            // setOtpType(null);
                            // setPhoneNumber(null);
                        }, 1000)
                    } else if (otpType === 2) {
                        setRegisterToken(res.data.token)
                        toast.success(<Trans>کد تایید با موفقیت وارد شد!</Trans>);
                        setTimeout(() => {
                            router.replace('/auth/register-complete');
                        }, 1000)
                    }
                }).catch(() => {
                    toast.error(<Trans>خطا در تایید کد. لطفا دوباره تلاش کنید.</Trans>);
                })
        } catch (error) {
            console.error('Verification error:', error);
            toast.error(<Trans>خطا در تایید کد. لطفا دوباره تلاش کنید.</Trans>);
        } finally {
            setSubmitting(false);
        }
    };

    const handleInputChange = (index: number, value: string, setFieldValue: any, values: any) => {
        // Only allow single digits
        if (value.length > 1) {
            value = value.slice(-1);
        }

        // Only allow numbers
        if (!/^\d*$/.test(value)) {
            return;
        }

        // Update the verification code
        const newCode = values.verificationCode.split('');
        newCode[index] = value;
        const updatedCode = newCode.join('');
        setFieldValue('verificationCode', updatedCode);

        // Move to next input if value is entered
        if (value && index < 3 && inputRefs[index + 1]) {
            inputRefs[index + 1].current?.focus();
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent, setFieldValue: any, values: any) => {
        // Handle backspace
        if (e.key === 'Backspace') {
            const newCode = values.verificationCode.split('');
            newCode[index] = '';
            const updatedCode = newCode.join('');
            setFieldValue('verificationCode', updatedCode);

            // Move to previous input if current is empty
            if (index > 0) {
                inputRefs[index - 1].current?.focus();
            }
        }
        // Handle paste
        else if (e.key === 'v' && (e.ctrlKey || e.metaKey)) {
            e.preventDefault();
            navigator.clipboard.readText().then(text => {
                const digits = text.replace(/\D/g, '').slice(0, 5);
                setFieldValue('verificationCode', digits);

                // Focus the last filled input or the first empty one
                const focusIndex = Math.min(digits.length, 3);
                if (inputRefs[focusIndex]) {
                    inputRefs[focusIndex].current?.focus();
                }
            });
        }
    };

    return (
        <div className='flex flex-col items-center gap-8 xl:gap-10 w-full max-w-[508px] px-4 py-6 xl:p-12 border-[1px] border-[#D2D2D2] rounded-[10px]'>
            <div className='flex flex-col items-center gap-2'>
                <h1 className='font-bold text-primary text-2xl xl:text-[32px]'>
                    <Trans>
                        تایید شماره موبایل
                    </Trans>
                </h1>
                <p className='text-sm xl:text-base text-center text-[#231F20]'>
                    <Trans>
                        کد تایید به شماره موبایل {phoneNumber} ارسال شد
                    </Trans>
                </p>
            </div>

            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
            >
                {({ isSubmitting, errors, touched, setFieldValue, values }) => (
                    <Form className='w-full max-w-[356px] flex flex-col gap-6'>
                        <div className='flex flex-col gap-3 xl:gap-4'>
                            <label htmlFor="verificationCode" className='text-[#4D4D4D] font-semibold'>
                                <Trans>کد تایید:</Trans>
                            </label>
                            <div dir='ltr' className='flex items-center justify-center gap-2'>
                                {Array.from({ length: 4 }).map((_, index) => (
                                    <input
                                        key={index}
                                        ref={inputRefs[index]}
                                        type="text"
                                        inputMode="numeric"
                                        maxLength={1}
                                        value={values.verificationCode[index] || ''}
                                        onChange={(e) => handleInputChange(index, e.target.value, setFieldValue, values)}
                                        onKeyDown={(e) => handleKeyDown(index, e, setFieldValue, values)}
                                        className={`bg-white text-center text-lg font-semibold w-[42px] h-12 px-2 py-3 border-[1px] rounded-[5px] focus:ring-[1px] focus:ring-primary focus:border-primary transition-all duration-300 focus:outline-none ${errors.verificationCode && touched.verificationCode
                                            ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                                            : 'border-gray-300'
                                            }`}
                                    />
                                ))}
                            </div>
                            {errors.verificationCode && touched.verificationCode && (
                                <div className="text-red-500 text-sm text-center">
                                    {errors.verificationCode}
                                </div>
                            )}
                        </div>

                        <div className='w-full flex flex-col items-center gap-2'>
                            <Button
                                type="submit"
                                disabled={isSubmitting}
                                className='h-10 xl:h-12 w-full max-w-[285px] disabled:opacity-50 disabled:cursor-not-allowed'
                            >
                                {isSubmitting ? (
                                    <span className="flex justify-center items-center gap-2">
                                        لطفا صبر کنید...
                                    </span>
                                ) : (
                                    <Trans>ثبت و ادامه</Trans>
                                )}
                            </Button>
                            <p className='text-sm text-[#231F20]'>
                                <Trans>
                                    شماره موبایل اشتباه است؟ <Link href={`/auth/register`} className='text-primary'>ویرایش</Link> کنید
                                </Trans>
                            </p>
                        </div>
                    </Form>
                )}
            </Formik>
        </div>
    );
}
'use client';
import * as React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Button } from '../ui/button';
import { Trans, useLingui } from '@lingui/react/macro';
import { msg } from '@lingui/core/macro';
import { Account } from '@/types/accounts.types';
import { updateProfile } from '@/lib/services/account.services';
import { toast } from 'sonner';
import { useState } from 'react';

// Define the form values interface
interface UserInfoFormValues {
    username: string;
    full_name: string;
    email: string;
    phone: string;
}

export default function ProfileUserInfoForm({ initialValues: account }: { initialValues: Account }) {
    const [accountData, setAccountData] = useState<Account>(account);
    const { i18n } = useLingui();

    // Initial form values
    const initialValues: UserInfoFormValues = {
        username: accountData.username || '',
        full_name: accountData.full_name || '',
        email: accountData.email || '',
        phone: accountData.mobile_number.replace(/ /g, '') || '',
    };

    // Validation schema using Yup
    const validationSchema = Yup.object({
        username: Yup.string()
            .min(3, i18n._(msg`نام کاربری باید حداقل ۳ کاراکتر باشد`)),
            // .required(i18n._(msg`نام کاربری الزامی است`)),
        email: Yup.string()
            .email(i18n._(msg`فرمت ایمیل معتبر نیست`)),
            // .required(i18n._(msg`ایمیل الزامی است`)),
        phone: Yup.string()
            .matches(/^09[0-9]{9}$/, i18n._(msg`شماره موبایل معتبر نیست`))
            .required(i18n._(msg`شماره موبایل الزامی است`)),
    });

    // Form submission handler
    const handleSubmit = (values: UserInfoFormValues) => {
        updateProfile(values).then((res) => {
            toast.success(i18n._(msg`اطلاعات شما با موفقیت ثبت شد`));
            setAccountData(res.data);
        }).catch((err) => {
            console.log(err)
            toast.error(i18n._(msg`اطلاعات شما با خطا مواجه شد. لطفاً دوباره تلاش کنید.`));
        });
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
                        {/* Username Field */}
                        <div className='flex flex-col gap-3 xl:gap-4'>
                            <label htmlFor="username" className='text-[#4D4D4D] font-semibold'>
                                <Trans>نام کاربری</Trans>:
                            </label>
                            <Field
                                type="text"
                                id="username"
                                name="username"
                                placeholder={i18n._(msg`نام کاربری`)}
                                className={`bg-white text-sm w-full h-12 xl:h-14 px-4 py-3 border-[1px] rounded-[5px] focus:ring-[1px] focus:ring-primary focus:border-primary transition-all duration-300 ${
                                    errors.username && touched.username ? 'border-red-500' : ''
                                }`}
                            />
                            <ErrorMessage name="username" component="div" className="text-red-500 text-sm" />
                        </div>

                        {/* Password Field */}
                        {/* <div className='flex flex-col gap-3 xl:gap-4'>
                            <label htmlFor="password" className='text-[#4D4D4D] font-semibold'>
                                <Trans>رمز عبور</Trans>:
                            </label>
                            <Field
                                type="password"
                                id="password"
                                name="password"
                                placeholder={i18n._(msg`رمز عبور`)}
                                className={`bg-white text-sm w-full h-12 xl:h-14 px-4 py-3 border-[1px] rounded-[5px] focus:ring-[1px] focus:ring-primary focus:border-primary transition-all duration-300 ${
                                    errors.password && touched.password ? 'border-red-500' : ''
                                }`}
                            />
                            <ErrorMessage name="password" component="div" className="text-red-500 text-sm" />
                        </div> */}

                        {/* First Name Field */}
                        <div className='flex flex-col gap-3 xl:gap-4'>
                            <label htmlFor="full_name" className='text-[#4D4D4D] font-semibold'>
                                <Trans>نام و نام خانوادگی</Trans>:
                            </label>
                            <Field
                                type="text"
                                id="full_name"
                                name="full_name"
                                placeholder={i18n._(msg`نام و نام خانوادگی`)}
                                className={`bg-white text-sm w-full h-12 xl:h-14 px-4 py-3 border-[1px] rounded-[5px] focus:ring-[1px] focus:ring-primary focus:border-primary transition-all duration-300 ${
                                    errors.full_name && touched.full_name ? 'border-red-500' : ''
                                }`}
                            />
                            <ErrorMessage name="full_name" component="div" className="text-red-500 text-sm" />
                        </div>

                        {/* Last Name Field */}
                        {/* <div className='flex flex-col gap-3 xl:gap-4'>
                            <label htmlFor="lastName" className='text-[#4D4D4D] font-semibold'>
                                <Trans>نام خانوادگی</Trans>:
                            </label>
                            <Field
                                type="text"
                                id="lastName"
                                name="lastName"
                                placeholder={i18n._(msg`نام خانوادگی`)}
                                className={`bg-white text-sm w-full h-12 xl:h-14 px-4 py-3 border-[1px] rounded-[5px] focus:ring-[1px] focus:ring-primary focus:border-primary transition-all duration-300 ${
                                    errors.lastName && touched.lastName ? 'border-red-500' : ''
                                }`}
                            />
                            <ErrorMessage name="lastName" component="div" className="text-red-500 text-sm" />
                        </div> */}

                        {/* Email Field */}
                        <div className='flex flex-col gap-3 xl:gap-4'>
                            <label htmlFor="email" className='text-[#4D4D4D] font-semibold'>
                                <Trans>ایمیل</Trans>:
                            </label>
                            <Field
                                type="email"
                                id="email"
                                name="email"
                                placeholder={i18n._(msg`ایمیل`)}
                                className={`bg-white text-sm w-full h-12 xl:h-14 px-4 py-3 border-[1px] rounded-[5px] focus:ring-[1px] focus:ring-primary focus:border-primary transition-all duration-300 ${
                                    errors.email && touched.email ? 'border-red-500' : ''
                                }`}
                            />
                            <ErrorMessage name="email" component="div" className="text-red-500 text-sm" />
                        </div>

                        {/* Phone Field */}
                        <div className='flex flex-col gap-3 xl:gap-4'>
                            <label htmlFor="phone" className='text-[#4D4D4D] font-semibold'>
                                <Trans>شماره موبایل</Trans>:
                            </label>
                            <Field
                                type="text"
                                id="phone"
                                name="phone"
                                disabled
                                placeholder={i18n._(msg`شماره موبایل`)}
                                className={`cursor-not-allowed  opacity-50 bg-white text-sm w-full h-12 xl:h-14 px-4 py-3 border-[1px] rounded-[5px] focus:ring-[1px] focus:ring-primary focus:border-primary transition-all duration-300 ${
                                    errors.phone && touched.phone ? 'border-red-500' : ''
                                }`}
                            />
                            <ErrorMessage name="phone" component="div" className="text-red-500 text-sm" />
                        </div>
                    </div>

                    <div className='flex justify-center mt-8 xl:mt-12'>
                        <Button type="submit" className='h-10 xl:h-12 w-full max-w-[232px] xl:max-w-[285px]'>
                            <Trans>ذخیره تغییرات</Trans>
                        </Button>
                    </div>
                </Form>
            )}
        </Formik>
    );
}
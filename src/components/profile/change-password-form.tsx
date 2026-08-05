'use client';
import * as React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Button } from '../ui/button';
import { Trans, useLingui } from '@lingui/react/macro';
import { msg } from '@lingui/core/macro';
import { changePassword } from '@/lib/services/account.services';
import { toast } from 'sonner';
import LoadingSpin from '../ui/loading-spin';
import { Eye, EyeSlash } from 'iconsax-reactjs';
import { useState } from 'react';

// Define the form values interface
interface ChangePasswordFormValues {
    password: string;
    confirmPassword: string;
    newPassword: string;
}

export default function ChangePasswordForm() {
    const { i18n } = useLingui();

    const [showPassword, setShowPassword] = useState(false)
    const [showNewPassword, setShowNewPassword] = useState(false)
    const [showConfirmationPassword, setShowConfirmationPassword] = useState(false)

    // Initial form values
    const initialValues: ChangePasswordFormValues = {
        password: '',
        newPassword: '',
        confirmPassword: '',
    };

    // Validation schema using Yup
    const validationSchema = Yup.object({
        password: Yup.string()
            .min(8, i18n._(msg`رمز عبور باید حداقل ۸ کاراکتر باشد`))
            .required(i18n._(msg`رمز عبور الزامی است`)),
        confirmPassword: Yup.string()
            .required(i18n._(msg`تکرار رمز عبور الزامی است`))
            .oneOf([Yup.ref('newPassword')], i18n._(msg`رمز عبور و تکرار آن باید یکسان باشند`)),
        newPassword: Yup.string()
            .min(8, i18n._(msg`رمز عبور باید حداقل ۸ کاراکتر باشد`))
            .required(i18n._(msg`رمز عبور جدید الزامی است`)),
    });

    // Form submission handler
    const handleSubmit = (values: ChangePasswordFormValues, { resetForm }: { resetForm: () => void }) => {
        changePassword({ old_password: values.password, new_password: values.newPassword }).then(res => {
            toast.success(i18n._(msg`رمز عبور با موفقیت تغییر یافت.`));
            resetForm();
        }).catch(err => {
            toast.success(i18n._(msg`درخواست با خطا مواجه شد. لطفا دوباره تلاش کنید.`));
        })
    };

    return (
        <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
        >
            {({ isSubmitting, errors, touched }) => (
                <Form>
                    <div className='grid grid-cols-1 gap-5 xl:gap-x-5 xl:gap-y-6 mt-8 xl:mt-[55px] max-w-[780px] mx-auto'>
                        {/* Password Field */}
                        <div className='flex flex-col gap-3 xl:gap-4'>
                            <label htmlFor="password" className='text-[#4D4D4D] font-semibold'>
                                <Trans>رمز عبور</Trans>:
                            </label>
                            <div className='relative flex items-center'>
                                <Field
                                    type={showPassword ? "text" : "password"}
                                    id="password"
                                    name="password"
                                    placeholder={i18n._(msg`رمز عبور`)}
                                    className={`bg-white text-sm w-full h-12 xl:h-14 px-4 py-3 border-[1px] rounded-[5px] focus:ring-[1px] focus:ring-primary focus:border-primary transition-all duration-300 ${errors.password && touched.password ? 'border-red-500' : ''
                                        }`}
                                />
                                {!showPassword ? <Eye size={20} onClick={() => setShowPassword(prev => !prev)} className=' absolute end-3 text-gray-400' /> : <EyeSlash size={20} onClick={() => setShowPassword(prev => !prev)} className=' absolute end-3 text-gray-400' />}
                            </div>
                            <ErrorMessage name="password" component="div" className="text-red-500 text-sm" />
                        </div>


                        {/* New Password Field */}
                        <div className='flex flex-col gap-3 xl:gap-4'>
                            <label htmlFor="newPassword" className='text-[#4D4D4D] font-semibold'>
                                <Trans>رمز عبور جدید</Trans>:
                            </label>
                            <div className='relative flex items-center'>
                                <Field
                                    type={showNewPassword ? "text" : "password"}
                                    id="newPassword"
                                    name="newPassword"
                                    placeholder={i18n._(msg`رمز عبور`)}
                                    className={`bg-white text-sm w-full h-12 xl:h-14 px-4 py-3 border-[1px] rounded-[5px] focus:ring-[1px] focus:ring-primary focus:border-primary transition-all duration-300 ${errors.password && touched.password ? 'border-red-500' : ''
                                        }`}
                                />
                                {!showNewPassword ? <Eye size={20} onClick={() => setShowNewPassword(prev => !prev)} className=' absolute end-3 text-gray-400' /> : <EyeSlash size={20} onClick={() => setShowNewPassword(prev => !prev)} className=' absolute end-3 text-gray-400' />}
                            </div>
                            <ErrorMessage name="newPassword" component="div" className="text-red-500 text-sm" />
                        </div>

                        {/* Confirm Password Field */}
                        <div className='flex flex-col gap-3 xl:gap-4'>
                            <label htmlFor="confirmPassword" className='text-[#4D4D4D] font-semibold'>
                                <Trans>تکرار رمز عبور جدید</Trans>:
                            </label>
                            <div className='relative flex items-center'>
                                <Field
                                    type={showConfirmationPassword ? "text" : "password"}
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    placeholder={i18n._(msg`رمز عبور`)}
                                    className={`bg-white text-sm w-full h-12 xl:h-14 px-4 py-3 border-[1px] rounded-[5px] focus:ring-[1px] focus:ring-primary focus:border-primary transition-all duration-300 ${errors.password && touched.password ? 'border-red-500' : ''
                                        }`}
                                />
                                {!showConfirmationPassword ? <Eye size={20} onClick={() => setShowConfirmationPassword(prev => !prev)} className=' absolute end-3 text-gray-400' /> : <EyeSlash size={20} onClick={() => setShowConfirmationPassword(prev => !prev)} className=' absolute end-3 text-gray-400' />}
                            </div>
                            <ErrorMessage name="confirmPassword" component="div" className="text-red-500 text-sm" />
                        </div>
                    </div>

                    <div className='flex justify-center mt-8 xl:mt-12'>
                        <Button type="submit" className='h-10 xl:h-12 w-full max-w-[232px] xl:max-w-[285px]'>

                            {isSubmitting ? (
                                <span className="flex justify-center items-center gap-2">
                                    <LoadingSpin />
                                    لطفا صبر کنید...
                                </span>
                            ) : (
                                <Trans>ذخیره تغییرات</Trans>
                            )}
                        </Button>
                    </div>
                </Form>
            )}
        </Formik>
    );
}
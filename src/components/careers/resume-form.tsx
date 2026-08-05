'use client';
import * as React from 'react';
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { CheckIcon, ChevronLeft, ChevronRight, UserIcon, GraduationCapIcon, BriefcaseIcon, AwardIcon, PlusIcon, TrashIcon } from 'lucide-react';
import JalaliDateInput from './jalali-date-input';
import { Select, SelectValue, SelectTrigger, SelectContent, SelectItem } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { msg } from '@lingui/core/macro'
import { Trans, useLingui } from '@lingui/react/macro';
import { MessageDescriptor } from '@lingui/core';
import { sendResume } from '@/lib/services/employment.services';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { Position } from '@/types/employment.types';

// Validation schemas for each step
const personalInfoSchema = Yup.object({
    fullname: Yup.string()
        .min(2, msg`نام کامل باید حداقل 2 کاراکتر باشد`)
        .max(50, msg`نام نمی‌تواند بیش از 50 کاراکتر باشد`)
        .required(msg`نام الزامی است`),
    father_name: Yup.string()
        .min(2, msg`نام پدر باید حداقل 2 کاراکتر باشد`)
        .max(50, msg`نام پدر نمی‌تواند بیش از 50 کاراکتر باشد`)
        .required(msg`نام پدر الزامی است`),
    national_code: Yup.string()
        .matches(/^\d{10}$/, msg`کد ملی باید 10 رقم باشد`)
        .required(msg`کد ملی الزامی است`),
    mobile_phone: Yup.string()
        .matches(/^09\d{9}$/, msg`شماره موبایل معتبر نیست`)
        .required(msg`شماره موبایل الزامی است`),
    emergency_phone: Yup.string()
        .matches(/^09\d{9}$/, msg`شماره موبایل معتبر نیست`)
        .required(msg`شماره موبایل الزامی است`),
    relative: Yup.string()
        .required(msg`نسبت الزامی است`),

    marital_status: Yup.string()
        .required(msg`وضعیت تاهل الزامی است`),
    date_of_birth: Yup.string()
        .required(msg`تاریخ تولد الزامی است`),
    military_service_status: Yup.string()
        .required(msg`وضعیت نظام وظیفه الزامی است`),
    housingStatus: Yup.string()
        .required(msg`وضعیت مسکن الزامی است`),
});

const educationSchema = Yup.object({
    education: Yup.string()
        .required(msg`لطفا مقطع تحصیلی را انتخاب کنید`),
    major: Yup.string()
        .required(msg`لطفا رشته تحصیلی را وارد کنید`),
    university: Yup.string().required(msg`نام دانشگاه الزامی است`),
    gpa: Yup.number()
        .min(0, msg`معدل نمی‌تواند منفی باشد`)
        .max(20, msg`معدل نمی‌تواند بیش از 20 باشد`)
        .required(msg`معدل الزامی است`),
    study_period: Yup.string(),
    education_place: Yup.string(),
    disease_history: Yup.string()
        .required(msg`لطفا سابقه بیماری را مشخص کنید`),
    surgery_and_disability_history: Yup.string(),
    requested_salary: Yup.number()
        .typeError(msg`حقوق درخواستی باید عدد باش`)
        .required(msg`لطفا حقوق درخواستی را وارد کنید`)
        .min(0, msg`حقوق درخواستی نمی‌تواند منفی باشد`),
    requested_job: Yup.string()
        .required(msg`لطفا شغل مورد درخواست را وارد کنید`),
    work_time: Yup.string()
        .required(msg`لطفا زمان کاری را انتخاب کنید`),
    job_applicant_in: Yup.string()
        .required(msg`لطفا محل استخدام را انتخاب کنید`),
    resumeFile: Yup.mixed()
        .required(msg`لطفا فایل رزومه را آپلود کنید`)
});

const coursesSchema = Yup.object({
    training_courses: Yup.array().of(
        Yup.object({
            title_of_the_training_and_skill_course: Yup.string(),
            name_of_educational_institution: Yup.string(),
            training_period: Yup.number().min(0),
            year_of_acquisition: Yup.number()
                .min(1990, msg`سال برگزاری معتبر نیست`)
                .max(new Date().getFullYear(), msg`سال برگزاری نمی‌تواند در آینده باشد`),
            certificate_of_obtaining_degree: Yup.string()
        })
    )
});

const workExperienceSchema = Yup.object({
    work_experiences: Yup.array().of(
        Yup.object({
            title_of_work_experience: Yup.string(),
            address: Yup.string(),
            collaboration_period: Yup.string(),
            type_of_cooperation: Yup.string(),
            reason_of_termination_cooperation: Yup.string(),
            phone: Yup.string(),
            salary_at_the_time_of_termination_of_cooperation: Yup.string(),
            job_applicant_in: Yup.string(),
        })
    )
});

// Complete validation schema
const completeSchema = personalInfoSchema
    .concat(educationSchema)
    .concat(coursesSchema)
    .concat(workExperienceSchema);

// Form data type
interface FormData {
    // Personal Info
    fullname: string;
    father_name: string;
    national_code: string;
    mobile_phone: string;
    emergency_phone: string;
    relative: string;
    address: string;
    marital_status: string;
    date_of_birth: string;
    military_service_status: string;
    housingStatus: string;

    // Education
    education: string;
    major: string;
    university: string;
    gpa: number;
    study_period: string;
    education_place: string;
    disease_history: string;
    surgery_and_disability_history: string;
    requested_salary: number;
    requested_job: string;
    work_time: string;
    job_applicant_in: string;
    resumeFile: File;

    // Courses
    training_courses: Array<{
        title_of_the_training_and_skill_course: string;
        name_of_educational_institution: string;
        training_period: number;
        year_of_acquisition: number;
        certificate_of_obtaining_degree: string;
    }>;

    // Work Experience
    work_experiences: Array<{
        title_of_work_experience: string;
        address: string;
        collaboration_period: string;
        type_of_cooperation: string;
        reason_of_termination_cooperation: string;
        phone: string;
        salary_at_the_time_of_termination_of_cooperation: string;
        possibility_of_presenting_certificate: string;
    }>;
}

const initialValues: FormData = {
    fullname: '',
    father_name: '',
    national_code: '',
    mobile_phone: '',
    emergency_phone: '',
    relative: '',
    address: '',
    marital_status: '',
    date_of_birth: '',
    military_service_status: '',
    housingStatus: '',
    // Education
    education: '',
    major: '',
    university: '',
    gpa: 0,
    study_period: '',
    education_place: '',
    disease_history: '',
    surgery_and_disability_history: '',
    requested_salary: 0,
    requested_job: '',
    work_time: '',
    job_applicant_in: '',
    resumeFile: new File([], ''),
    training_courses: [{ title_of_the_training_and_skill_course: '', name_of_educational_institution: '', training_period: 0, year_of_acquisition: new Date().getFullYear(), certificate_of_obtaining_degree: '' }],
    work_experiences: [{ title_of_work_experience: '', address: '', collaboration_period: '', type_of_cooperation: '', reason_of_termination_cooperation: '', phone: '', salary_at_the_time_of_termination_of_cooperation: '', possibility_of_presenting_certificate: '' }]
};

// Step configuration
const steps = [
    {
        name:  msg`اطلاعات شخصی`,
        schema: personalInfoSchema,
        fields: ['fullname', 'father_name', 'national_code', 'mobile_phone', 'emergency_phone', 'relative', 'address', 'marital_status', 'date_of_birth', 'military_service_status', 'housingStatus']
    },
    {
        name: msg`اطلاعات تحصیلی و شغلی`,
        schema: educationSchema,
        fields: ['education', 'major', 'university', 'gpa', 'study_period', 'education_place', 'disease_history', 'surgery_and_disability_history', 'requested_salary', 'requested_job', 'work_time', 'job_applicant_in', 'resumeFile']
    },
    {
        name: msg`دوره‌های آموزشی`,
        schema: coursesSchema,
        fields: ['training_courses']
    },
    {
        name: msg`سوابق کاری`,
        schema: workExperienceSchema,
        fields: ['work_experiences']
    }
];

// Input component with error handling
const MagicInput: React.FC<{
    name: string;
    label: string;
    type?: string;
    placeholder?: string;
    as?: 'input' | 'textarea' | 'select';
    options?: { value: string; label: string }[];
    className?: string;
}> = ({ name, label, type = 'text', placeholder, as = 'input', options, className }) => {
    const { i18n } = useLingui();
    const [isFocused, setIsFocused] = React.useState(false);

    return (
        <div
            className={className}
        >
            <label
                htmlFor={name}
                className={`block font-semibold mb-4 transition-colors duration-300 ${isFocused ? 'text-primary' : 'text-gray-700'
                    }`}
            >
                {label}
            </label>
            <Field name={name}>
                {({ field, meta }: any) => (
                    <>
                        {as === 'textarea' ? (
                            <textarea
                                {...field}
                                id={name}
                                placeholder={placeholder}
                                className={`text-sm w-full px-4 py-3 border-[1px] rounded-[5px] focus:ring-[1px] focus:ring-primary focus:border-primary transition-all duration-300 ${meta.touched && meta.error ? 'border-red-500 shake' : 'border-[#D3D3D3]'
                                    }`}
                                rows={4}
                                onFocus={() => setIsFocused(true)}
                                onBlur={() => setIsFocused(false)}
                            />
                        ) : as === 'select' ? (
                            <Select
                                value={field.value || ''}
                                onValueChange={(value) => {
                                    field.onChange({ target: { name: field.name, value } });
                                    setIsFocused(false);
                                }}
                            >
                                <SelectTrigger
                                    className={`w-full !h-12 border-[1px] rounded-[5px] px-3 transition-all duration-300 ${meta.touched && meta.error ? 'border-red-500 shake' : 'border-[#D3D3D3]'
                                        }`}
                                    onFocus={() => setIsFocused(true)}
                                    onBlur={() => setIsFocused(false)}
                                >
                                    <SelectValue placeholder={placeholder} />
                                </SelectTrigger>
                                <SelectContent className='max-h-[300px] overflow-y-auto no-scrollbar'>
                                    {options?.map((option) => (
                                        <SelectItem key={option.value} value={option.value}>
                                            {option.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        ) : (
                            <input
                                {...field}
                                type={type}
                                id={name}
                                placeholder={placeholder}
                                className={`bg-white text-sm w-full px-4 py-3 border-[1px] rounded-[5px] focus:ring-[1px] focus:ring-primary focus:border-primary transition-all duration-300 ${meta.touched && meta.error ? 'border-red-500 shake' : 'border-[#D3D3D3]'
                                    }`}
                                onFocus={() => setIsFocused(true)}
                                onBlur={() => setIsFocused(false)}
                            />
                        )}
                    </>
                )}
            </Field>
            <ErrorMessage name={name}>
                {(errorMsg) => (
                    <motion.div
                        className="text-red-500 text-sm mt-1"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                    >
                        {typeof errorMsg === 'string' ? errorMsg : i18n._(errorMsg)}
                    </motion.div>
                )}
            </ErrorMessage>
        </div>
    );
};

// Dynamic Array Field Component
const DynamicArrayField: React.FC<{
    name: string;
    render: (index: number, remove: () => void) => React.ReactNode;
    addLabel: string;
    initialItem: any;
}> = ({ name, render, addLabel, initialItem }) => {
    return (
        <div>
            <Field name={name}>
                {({ field, form }: any) => (
                    <div>
                        {field.value.map((_: any, index: number) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="bg-gray-50 rounded-lg mb-4 relative"
                            >
                                {field.value.length > 1 && (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            const newValue = [...field.value];
                                            newValue.splice(index, 1);
                                            form.setFieldValue(name, newValue);
                                        }}
                                        className="absolute top-2 end-2 text-red-500 hover:text-red-700 transition-colors z-10"
                                    >
                                        <TrashIcon className="w-4 h-4" />
                                    </button>
                                )}
                                {render(index, () => {
                                    const newValue = [...field.value];
                                    newValue.splice(index, 1);
                                    form.setFieldValue(name, newValue);
                                })}
                            </motion.div>
                        ))}
                        <motion.button
                            type="button"
                            onClick={() => {
                                form.setFieldValue(name, [...field.value, initialItem]);
                            }}
                            className="flex items-center gap-2 text-primary hover:text-primary-dark transition-colors"
                        >
                            <PlusIcon className="w-4 h-4" />
                            {addLabel}
                        </motion.button>
                    </div>
                )}
            </Field>
        </div>
    );
};

export default function CareersResumeForm({positions}:{positions: Position[]}) {
    const { i18n } = useLingui();
    const router = useRouter();
    const [currentStep, setCurrentStep] = React.useState(0);
    const [completedSteps, setCompletedSteps] = React.useState<number[]>([]);
    const [formProgress, setFormProgress] = React.useState(0);
    const [autoSaveStatus, setAutoSaveStatus] = React.useState<'idle' | 'saving' | 'saved'>('idle');

    // Auto-save functionality
    const autoSave = React.useCallback(async (values: FormData) => {
        setAutoSaveStatus('saving');
        try {
            // Simulate auto-save to localStorage
            localStorage.setItem('resumeFormData', JSON.stringify(values));
            setTimeout(() => {
                setAutoSaveStatus('saved');
                setTimeout(() => setAutoSaveStatus('idle'), 2000);
            }, 500);
        } catch (error) {
            console.error('Auto-save failed:', error);
            setAutoSaveStatus('idle');
        }
    }, []);

    // Calculate form progress
    React.useEffect(() => {
        const progress = ((completedSteps.length + (currentStep > 0 ? 1 : 0)) / steps.length) * 100;
        setFormProgress(progress);
    }, [completedSteps, currentStep]);

    const handleNext = async (values: FormData, formikHelpers: FormikHelpers<FormData>) => {
        try {
            const currentFields = steps[currentStep].fields;
            const stepData = currentFields.reduce((acc, field) => {
                acc[field] = values[field as keyof FormData];
                return acc;
            }, {} as any);

            // Filter out empty training courses when moving from step 2 (courses step)
            if (currentStep === 2) {
                const filteredCourses = values.training_courses.filter(course =>
                    course.title_of_the_training_and_skill_course &&
                    course.title_of_the_training_and_skill_course.trim() !== ''
                );
                stepData.training_courses = filteredCourses;
                // Update the form values with filtered courses
                formikHelpers.setFieldValue('training_courses', filteredCourses);
            }

            // Filter out empty work experiences when moving from step 3 (experiences step)
            if (currentStep === 3) {
                const filteredExperiences = values.work_experiences.filter(exp =>
                    exp.title_of_work_experience &&
                    exp.title_of_work_experience.trim() !== ''
                );
                stepData.work_experiences = filteredExperiences;
                // Update the form values with filtered experiences
                formikHelpers.setFieldValue('work_experiences', filteredExperiences);
            }

            await steps[currentStep].schema.validate(stepData, { abortEarly: false });

            if (!completedSteps.includes(currentStep)) {
                setCompletedSteps([...completedSteps, currentStep]);
            }

            // Auto-save on successful validation
            autoSave(values);

            if (currentStep < steps.length - 1) {
                setCurrentStep(currentStep + 1);
            } else {
                // If we're on the last step, submit the form
                await handleSubmit(values);
            }
        } catch (error: any) {
            if (error.inner) {
                const touchedFields = error.inner.reduce((acc: any, err: any) => {
                    acc[err.path] = true;
                    return acc;
                }, {});
                formikHelpers.setTouched(touchedFields);
            }
        }
    };

    const handleBack = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    const handleSubmit = async (values: FormData) => {
        try {
            // Filter out empty training courses
            const filteredValues = {
                ...values,
                training_courses: values.training_courses.filter(course =>
                    course.title_of_the_training_and_skill_course &&
                    course.title_of_the_training_and_skill_course.trim() !== ''
                ),
                work_experiences: values.work_experiences.filter(exp =>
                    exp.title_of_work_experience &&
                    exp.title_of_work_experience.trim() !== ''
                )
            };

            await completeSchema.validate(filteredValues, { abortEarly: false });
            console.log('Form submitted:', filteredValues);
            sendResume(filteredValues).then((res)=>{
                toast.success(<Trans>مشخصات شما با موفقیت ارسال شد.</Trans>);
                // Redirect to careers page after successful submission
                setTimeout(() => {
                    router.push('/careers');
                }, 2000); // Wait 2 seconds to show the success message
            }).catch((err)=>{
                toast.error(<Trans>خطایی رخ داده است لطفا بعدا امتحان کنید.</Trans>)
            })
            
        } catch (error) {
            console.error('Form submission error:', error);
        }
    };

    // Load saved data on component mount
    React.useEffect(() => {
        const savedData = localStorage.getItem('resumeFormData');
        if (savedData) {
            try {
                const parsedData = JSON.parse(savedData);
                // You could use setValues here if you want to restore the form
                console.log('Saved form data found:', parsedData);
            } catch (error) {
                console.error('Failed to parse saved data:', error);
            }
        }
    }, []);

    const handleTabClick = (index: number) => {
        setCurrentStep(index);
    };

    return (
        <div className="container max-w-[930px] mx-auto relative">
            {/* Tabs */}
            <div className="flex justify-center gap-4 mb-4 flex-wrap">
                {steps.map((tab, index) => (
                    <button
                        key={index}
                        // onClick={() => handleTabClick(index)}
                        className={`h-8 px-2 rounded transition-colors text-sm ${currentStep === index
                            ? 'bg-primary text-white font-bold'
                            : 'bg-transparent text-[#696969] hover:text-primary'
                            }`}
                    >
                        {i18n._(tab.name)}
                    </button>
                ))}
            </div>
            <Formik
                initialValues={initialValues}
                validationSchema={steps[currentStep].schema}
                onSubmit={handleSubmit}
                enableReinitialize
            >
                {(formikHelpers) => {
                    const { values, errors, touched, isSubmitting } = formikHelpers;
                    return (
                        <Form>

                            {/* Step Indicator */}
                            <div className="flex items-center justify-between mb-8">

                            </div>

                            {/* Form Content */}
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={currentStep}
                                    initial={{ opacity: 0, x: 50 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -50 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    {currentStep === 0 && (
                                        <div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                                <MagicInput name="fullname" label={i18n._(msg`نام`)} placeholder={i18n._(msg`نام خود را وارد کنید`)} />
                                                <MagicInput name="father_name" label={i18n._(msg`نام پدر`)} placeholder={i18n._(msg`نام پدر خود را وارد کنید`)} />
                                                <MagicInput name="national_code" label={i18n._(msg`کد ملی`)} placeholder={i18n._(msg`کد ملی 10 رقمی`)} />
                                                <MagicInput name="mobile_phone" label={i18n._(msg`شماره موبایل`)} placeholder={i18n._(msg`09123456789`)} />
                                                <MagicInput name="emergency_phone" label={i18n._(msg`شماره موبایل اضطراری`)} placeholder={i18n._(msg`09123456789`)} />
                                                <div>
                                                    <label
                                                        className={`block font-semibold mb-4 transition-colors duration-300 text-gray-700
                                                            `}
                                                    >
                                                        {i18n._(msg`تاریخ تولد`)}
                                                    </label>
                                                    <JalaliDateInput onDateChange={(date) => { formikHelpers.setFieldValue('date_of_birth', date) }} />
                                                    <ErrorMessage name="date_of_birth">
                                                        {(errorMsg) => (
                                                            <motion.div
                                                                className="text-red-500 text-sm mt-1"
                                                                initial={{ opacity: 0, y: -10 }}
                                                                animate={{ opacity: 1, y: 0 }}
                                                                exit={{ opacity: 0, y: -10 }}
                                                            >
                                                                {typeof errorMsg === 'string' ? errorMsg : i18n._(errorMsg)}
                                                            </motion.div>
                                                        )}
                                                    </ErrorMessage>
                                                </div>
                                                <MagicInput
                                                    name="relative"
                                                    label={i18n._(msg`نسبت`)}
                                                    as="select"
                                                    placeholder={i18n._(msg`نسبت خود را انتخاب کنید`)}
                                                    options={[
                                                        { value: '1', label: i18n._(msg`پدر`) },
                                                        { value: '2', label: i18n._(msg`مادر`) },
                                                        { value: '3', label: i18n._(msg`همسر`) },
                                                        { value: '4', label: i18n._(msg`شوهر`) },
                                                        { value: '5', label: i18n._(msg`خواهر`) },
                                                        { value: '6', label: i18n._(msg`برادر`) },
                                                        { value: '7', label: i18n._(msg`دوست`) },
                                                        { value: '8', label: i18n._(msg`سایر`) },
                                                    ]}
                                                />
                                                <MagicInput
                                                 name="marital_status" 
                                                 label={i18n._(msg`وضعیت تاهل`)} 
                                                 placeholder={i18n._(msg`وضعیت تاهل خود را انتخاب کنید`)}
                                                 as="select"
                                                 options={[
                                                    { value: '1', label: i18n._(msg`مجرد`) },
                                                    { value: '2', label: i18n._(msg`متاهل`) },
                                                    { value: '3', label: i18n._(msg`متارکه`) },
                                                 ]} />
                                                <MagicInput
                                                    name="military_service_status"
                                                    label={i18n._(msg`وضعیت نظام وظیفه`)}
                                                    placeholder={i18n._(msg`وضعیت نظام وظیفه خود را انتخاب کنید`)}
                                                    as="select"
                                                    options={[
                                                        { value: '1', label: i18n._(msg`پایان خدمت`) },
                                                        { value: '2', label: i18n._(msg`معافیت دائم`) },
                                                        { value: '3', label: i18n._(msg`معافیت پزشکی`) },
                                                        { value: '4', label: i18n._(msg`کفالت دائم`) },
                                                        { value: '5', label: i18n._(msg`معافیت تحصیلی`) },
                                                        { value: '6', label: i18n._(msg`عدم مشمول`) },
                                                    ]}
                                                />
                                                <MagicInput 
                                                name="housingStatus"
                                                 label={i18n._(msg`وضعیت مسکن`)} 
                                                 placeholder={i18n._(msg`وضعیت مسکن خود را انتخاب کنید`)}
                                                 as="select"
                                                 options={[
                                                    { value: '1', label: i18n._(msg`شخصی`) },
                                                    { value: '2', label: i18n._(msg`متعلق به پدر`) },
                                                    { value: '3', label: i18n._(msg`اجاره ای`) },
                                                    { value: '4', label: i18n._(msg`متعلق به وابستگان`) },
                                                 ]} />
                                            </div>
                                        </div>
                                    )}

                                    {currentStep === 1 && (
                                        <div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <MagicInput
                                                    name="education"
                                                    label={i18n._(msg`آخرین مقطع تحصیلی*`)}
                                                    as="select"
                                                    placeholder={i18n._(msg`مدرک تحصیلی خود را انتخاب کنید`)}
                                                    options={[
                                                        { value: '1', label: i18n._(msg`زیر دیپلم / سیکل`) },
                                                        { value: '2', label: i18n._(msg`دیپلم`) },
                                                        { value: '3', label: i18n._(msg`کاردانی`) },
                                                        { value: '4', label: i18n._(msg`کارشناسی`) },
                                                        { value: '5', label: i18n._(msg`کارشناسی ارشد و بالاتر`) }
                                                    ]}
                                                />
                                                <MagicInput name="major" label={i18n._(msg`رشته تحصیلی*`)} placeholder={i18n._(msg`رشته تحصیلی خود را وارد کنید`)} />
                                                <MagicInput name="university" label={i18n._(msg`نام دانشگاه*`)} placeholder={i18n._(msg`نام دانشگاه یا موسسه آموزشی`)} />
                                                <MagicInput name="gpa" label={i18n._(msg`معدل آخرین مدرک تحصیلی`)} type="number" placeholder={i18n._(msg`معدل آخرین مدرک تحصیلی`)} />
                                                <MagicInput name="study_period" label={i18n._(msg`مدت تحصیل آخرین مدرک`)} type="number" placeholder={i18n._(msg`مدت تحصیل آخرین مدرک`)} />
                                                <MagicInput name="education_place" label={i18n._(msg`محل تحصیل آخرین مدرک`)} placeholder={i18n._(msg`محل تحصیل آخرین مدرک`)} />
                                                <MagicInput
                                                    name="disease_history"
                                                    label={i18n._(msg`سابقه بیماری دارید؟*`)}
                                                    as="select"
                                                    placeholder={i18n._(msg`سابقه بیماری`)}
                                                    options={[
                                                        { value: '0', label: i18n._(msg`بله`) },
                                                        { value: '1', label: i18n._(msg`خیر`) },
                                                    ]} />

                                                <MagicInput name="surgery_and_disability_history" label={i18n._(msg`در صورت وجود عمل جراحی و یا نقض عضو نام ببرید`)} placeholder={i18n._(msg`در صورت وجود عمل جراحی و یا نقض عضو نام ببرید`)} className='col-span-full' />
                                                <MagicInput name="requested_salary" label={i18n._(msg`حقوق مورد درخواست(تومان)*`)} type="number" placeholder={i18n._(msg`حقوق درخواستی`)} />
                                                <MagicInput name="requested_job" label={i18n._(msg`شغل مورد درخواست*`)} type="text" placeholder={i18n._(msg`شغل مورد درخواست`)} />
                                                <MagicInput name="work_time" label={i18n._(msg`زمان کاری*`)} as="select" placeholder={i18n._(msg`زمان کاری`)} options={[
                                                    { value: '1', label: i18n._(msg`تک شیفت`) },
                                                    { value: '2', label: i18n._(msg`دو شیفت`) },
                                                    { value: '3', label: i18n._(msg`سه شیفت`) },
                                                ]} />
                                                <MagicInput name="job_applicant_in" label={i18n._(msg`متقاضی استخدام در*`)} as="select" placeholder={i18n._(msg`محل استخدام`)} options={positions.map((item)=>(
                                                        { value: String(item.id), label: item.position }
                                                ))} />
                                                <div className="col-span-full">
                                                    <label className="block font-semibold mb-4 text-gray-700">{i18n._(msg`آپلود رزومه*`)}</label>
                                                    <Field name="resumeFile">
                                                        {({ field, form, meta }: any) => (
                                                            <div>
                                                                <input
                                                                    type="file"
                                                                    accept=".pdf,.doc,.docx"
                                                                    onChange={(event) => {
                                                                        const file = event.currentTarget.files?.[0];
                                                                        form.setFieldValue('resumeFile', file || new File([], ''));
                                                                    }}
                                                                    className={`w-full px-4 py-3 border-[1px] rounded-[5px] focus:ring-[1px] focus:ring-primary focus:border-primary transition-all duration-300 ${meta.touched && meta.error ? 'border-red-500' : 'border-[#D3D3D3]'}`}
                                                                />
                                                                {meta.touched && meta.error && (
                                                                    <div className="text-red-500 text-sm mt-1">{meta.error}</div>
                                                                )}
                                                            </div>
                                                        )}
                                                    </Field>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {currentStep === 2 && (
                                        <div>
                                            <h3 className="text-2xl font-bold mb-6 text-gray-800">{i18n._(msg`دوره‌های آموزشی`)}</h3>
                                            <p className="text-sm text-gray-600 mb-4">
                                                {i18n._(msg`دوره‌های آموزشی اختیاری هستند. اگر عنوان دوره را خالی بگذارید، آن دوره در فرم نهایی درج نخواهد شد.`)}
                                            </p>
                                            <DynamicArrayField
                                                name="training_courses"
                                                addLabel={i18n._(msg`افزودن دوره جدید`)}
                                                initialItem={{ title_of_the_training_and_skill_course: '', name_of_educational_institution: '', training_period: 0, year_of_acquisition: new Date().getFullYear(), certificate_of_obtaining_degree: '' }}
                                                render={(index) => {
                                                    const currentCourseTitle = values.training_courses[index]?.title_of_the_training_and_skill_course || '';
                                                    const isEmpty = !currentCourseTitle.trim();

                                                    return (
                                                        <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 transition-opacity duration-300 ${isEmpty ? 'opacity-100' : 'opacity-100'}`}>
                                                            <MagicInput
                                                                name={`training_courses.${index}.title_of_the_training_and_skill_course`}
                                                                label={i18n._(msg`عنوان دوره آموزشی`)}
                                                                placeholder={i18n._(msg`نام دوره آموزشی`)}
                                                            />
                                                            <MagicInput
                                                                name={`training_courses.${index}.name_of_educational_institution`}
                                                                label={i18n._(msg`نام موسسه`)}
                                                                placeholder={i18n._(msg`نام موسسه برگزارکننده`)}
                                                            />
                                                            <MagicInput
                                                                name={`training_courses.${index}.training_period`}
                                                                label={i18n._(msg`مدت دوره (ساعت)`)}
                                                                type="number"
                                                                placeholder={i18n._(msg`تعداد ساعات`)}
                                                            />
                                                            <MagicInput
                                                                name={`training_courses.${index}.year_of_acquisition`}
                                                                label={i18n._(msg`سال اخذ`)}
                                                                type="number"
                                                                placeholder="1402"
                                                            />
                                                            <MagicInput
                                                                name={`training_courses.${index}.certificate_of_obtaining_degree`}
                                                                label={i18n._(msg`گواهینامه ارایه اخذ مدرک`)}
                                                                as="select"
                                                                placeholder={i18n._(msg`گواهینامه ارایه اخذ مدرک`)}
                                                                options={[
                                                                    { value: '0', label: i18n._(msg`صادر نشده`) },
                                                                    { value: '1', label: i18n._(msg`صادر شده`) },
                                                                ]}
                                                            />
                                                            {isEmpty && (
                                                                <div className="col-span-full text-center text-sm text-gray-500 italic">
                                                                    {i18n._(msg`این دوره در فرم نهایی درج نخواهد شد`)}
                                                                </div>
                                                            )}
                                                        </div>
                                                    );
                                                }}
                                            />
                                        </div>
                                    )}

                                    {currentStep === 3 && (
                                        <div>
                                            <h3 className="text-2xl font-bold mb-6 text-gray-800">{i18n._(msg`سوابق کاری`)}</h3>
                                            <p className="text-sm text-gray-600 mb-4">
                                                {i18n._(msg`سوابق کاری اختیاری هستند. اگر عنوان شغل را خالی بگذارید، آن سابقه در فرم نهایی درج نخواهد شد.`)}
                                            </p>
                                            <DynamicArrayField
                                                name="work_experiences"
                                                addLabel={i18n._(msg`افزودن سابقه کاری جدید`)}
                                                initialItem={{
                                                    title_of_work_experience: '',
                                                    address: '',
                                                    startDate: '',
                                                    collaboration_period: '',
                                                    type_of_cooperation: '',
                                                    reason_of_termination_cooperation: '',
                                                    phone: '',
                                                    salary_at_the_time_of_termination_of_cooperation: '',
                                                    possibility_of_presenting_certificate: ''
                                                }}
                                                render={(index) => {
                                                    const currentJobTitle = values.work_experiences[index]?.title_of_work_experience || '';
                                                    const isEmpty = !currentJobTitle.trim();

                                                    return (
                                                        <div className={`transition-opacity duration-300 ${isEmpty ? 'opacity-100' : 'opacity-100'}`}>
                                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                                <MagicInput
                                                                    name={`work_experiences.${index}.title_of_work_experience`}
                                                                    label={i18n._(msg`عنوان سابقه کار`)}
                                                                    placeholder={i18n._(msg`عنوان سابقه کار`)}
                                                                />
                                                                <MagicInput
                                                                    name={`work_experiences.${index}.address`}
                                                                    label={i18n._(msg`نام و آدرس محل کار`)}
                                                                    placeholder={i18n._(msg`نام و آدرس محل کار`)}
                                                                />
                                                                <MagicInput
                                                                    name={`work_experiences.${index}.phone`}
                                                                    label={i18n._(msg`تلفن محل کار`)}
                                                                    placeholder={i18n._(msg`تلفن محل کار`)}
                                                                />
                                                                <MagicInput
                                                                    name={`work_experiences.${index}.collaboration_period`}
                                                                    label={i18n._(msg`مدت همکاری`)}
                                                                    placeholder={i18n._(msg`مدت همکاری`)}
                                                                    type="string"
                                                                />
                                                                <MagicInput
                                                                    name={`work_experiences.${index}.type_of_cooperation`}
                                                                    label={i18n._(msg`مدت همکاری`)}
                                                                    placeholder={i18n._(msg`مدت همکاری`)}
                                                                    as="select"
                                                                    options={[
                                                                        { value: '1', label: i18n._(msg`تمام وقت`) },
                                                                        { value: '2', label: i18n._(msg`پاره وقت`) },
                                                                    ]}
                                                                />
                                                                <MagicInput
                                                                    name={`work_experiences.${index}.reason_of_termination_cooperation`}
                                                                    label={i18n._(msg`علت قطع همکاری`)}
                                                                    placeholder={i18n._(msg`علت قطع همکاری`)}

                                                                />
                                                                <MagicInput
                                                                    name={`work_experiences.${index}.salary_at_the_time_of_termination_of_cooperation`}
                                                                    label={i18n._(msg`حقوق در زمان قطع همکاری`)}
                                                                    placeholder={i18n._(msg`حقوق در زمان قطع همکاری`)}

                                                                />
                                                                <MagicInput
                                                                    name={`work_experiences.${index}.possibility_of_presenting_certificate`}
                                                                    label={i18n._(msg`امکان ارایه گواهینامه دارید؟`)}
                                                                    placeholder={i18n._(msg`امکان ارایه گواهینامه دارید؟`)}
                                                                    as='select'
                                                                    options={[
                                                                        { value: '1', label: i18n._(msg`بله`) },
                                                                        { value: '0', label: i18n._(msg`خیر`) },
                                                                    ]}

                                                                />
                                                            </div>

                                                            {isEmpty && (
                                                                <div className="text-center text-sm text-gray-500 italic mt-2">
                                                                    {i18n._(msg`این سابقه کاری در فرم نهایی درج نخواهد شد`)}
                                                                </div>
                                                            )}
                                                        </div>
                                                    );
                                                }}
                                            />
                                        </div>
                                    )}
                                </motion.div>
                            </AnimatePresence>

                            {/* Navigation Buttons */}
                            <div className={cn("flex justify-between mt-6", currentStep === 0 && 'justify-center')}>
                                {currentStep > 0 && <Button
                                    type="button"
                                    onClick={handleBack}
                                    disabled={currentStep === 0}
                                    className={`flex items-center justify-center gap-2 ${currentStep === 0 ? 'opacity-50 cursor-not-allowed' : ''
                                        }`}
                                >
                                    {i18n._(msg`مرحله قبل`)}
                                </Button>}

                                {currentStep < steps.length - 1 ? (
                                    <Button
                                        type="button"
                                        onClick={() => handleNext(values, formikHelpers)}
                                        className={cn("flex items-center justify-center gap-2", currentStep === 0 && 'min-w-[285px]')}
                                    >
                                        {i18n._(msg`مرحله بعد`)}
                                    </Button>
                                ) : (
                                    <Button
                                        type="button"
                                        onClick={() => handleNext(values, formikHelpers)}
                                        disabled={isSubmitting}
                                        className="flex items-center justify-center gap-2"
                                    >
                                        {isSubmitting ? i18n._(msg`در حال ارسال...`) : i18n._(msg`ارسال فرم`)}
                                        <CheckIcon className="w-4 h-4" />
                                    </Button>
                                )}
                            </div>
                        </Form>
                    );
                }}
            </Formik>
        </div>
    );
}
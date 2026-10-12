"use client";

import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Trans, useLingui } from "@lingui/react/macro";
import { msg } from "@lingui/core/macro";

const initialValues = {
  phone: "",
};

function normalizeDigits(value: string) {
  return value
    .replace(/[۰-۹]/g, (digit) =>
      String("۰۱۲۳۴۵۶۷۸۹".indexOf(digit)),
    )
    .replace(/[٠-٩]/g, (digit) =>
      String("٠١٢٣٤٥٦٧٨٩".indexOf(digit)),
    );
}

export default function AuthLoginForm() {
  const { i18n } = useLingui();

  const validationSchema = Yup.object({
    phone: Yup.string()
      .required(i18n._(msg`شماره موبایل الزامی است`))
      .matches(
        /^09[0-9]{9}$/,
        i18n._(msg`شماره موبایل را به‌صورت 09xxxxxxxxx وارد کنید`),
      ),
  });

  return (
    <div
        className="
            flex min-h-[420px] w-full flex-col items-center
            rounded-[10px] border border-[#D2D2D2]
            bg-[#FAFAFA] px-5 py-8
            xl:border-[#E5E5E5]
            xl:min-h-[550px] xl:w-[46%]
            xl:max-w-[540px] xl:px-12 xl:py-12
        "
        >
      <h1 className="text-[20px] font-bold text-black xl:text-[22px]">
        <Trans>ورود</Trans>
      </h1>

      <p className="mt-2 text-center text-[14px]  text-[#231F20] ">
        <Trans>
          برای ورود به سامانه، شماره موبایل خود را وارد کنید.
        </Trans>
      </p>

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={(_, { setSubmitting }) => {
          setSubmitting(false);
        }}
      >
        {({
          values,
          errors,
          touched,
          isSubmitting,
          setFieldValue,
        }) => (
          <Form className="mt-16 w-full max-w-[380px] xl:mt-20">
            <div className="flex flex-col gap-3">
              <label
                htmlFor="phone"
                className="text-[14px] text-[#4D4D4D] xl:text-[16px]"
              >
                <Trans>شماره موبایل</Trans>
                <span aria-hidden="true"> *:</span>
              </label>

              <Field
                id="phone"
                name="phone"
                type="tel"
                inputMode="numeric"
                autoComplete="tel-national"
                maxLength={11}
                dir="ltr"
                value={values.phone}
                onChange={(
                  event: React.ChangeEvent<HTMLInputElement>,
                ) => {
                  setFieldValue(
                    "phone",
                    normalizeDigits(event.target.value),
                  );
                }}
                aria-required="true"
                aria-invalid={Boolean(errors.phone && touched.phone)}
                aria-describedby={
                  errors.phone && touched.phone
                    ? "phone-error"
                    : undefined
                }
                className={`
                  h-12 w-full rounded-[5px] border
                  bg-white px-4 text-[14px] text-[#353535]
                  outline-none transition-colors
                  focus:border-primary
                  ${
                    errors.phone && touched.phone
                      ? "border-red-500"
                      : "border-[#EEEEEE]"
                  }
                `}
              />

              <ErrorMessage
                id="phone-error"
                name="phone"
                component="p"
                className="text-[12px] text-red-600"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="
                mx-auto mt-14 flex h-12 w-full max-w-[285px]
                items-center justify-center rounded-[5px]
                bg-primary text-[14px] text-white
                transition-colors hover:bg-primary-dark
                disabled:opacity-50 xl:mt-20
              "
            >
              <Trans>ورود</Trans>
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
}
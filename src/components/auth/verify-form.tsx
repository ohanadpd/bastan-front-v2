"use client";

import {
  useId,
  useRef,
  useState,
  type ClipboardEvent,
  type FormEvent,
  type KeyboardEvent,
} from "react";
import { Trans, useLingui } from "@lingui/react/macro";
import { ChevronLeft } from "lucide-react";

import Link from "@/components/localized-link";
import { useAuthStore } from "@/store/authStore";

const CODE_LENGTH = 5;

function normalizeDigits(value: string) {
  return value
    .replace(/[۰-۹]/g, (digit) =>
      String("۰۱۲۳۴۵۶۷۸۹".indexOf(digit)),
    )
    .replace(/[٠-٩]/g, (digit) =>
      String("٠١٢٣٤٥٦٧٨٩".indexOf(digit)),
    )
    .replace(/\D/g, "");
}

export default function AuthVerifyForm() {
  const { t } = useLingui();
  const errorId = useId();

  const phoneNumber = useAuthStore((state) => state.phone);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const [digits, setDigits] = useState<string[]>(
    () => Array(CODE_LENGTH).fill(""),
  );

  const [hasError, setHasError] = useState(false);

  function fillDigits(index: number, value: string) {
    const normalized = normalizeDigits(value);

    if (!normalized) return;

    const startIndex =
      normalized.length >= CODE_LENGTH ? 0 : index;

    const incoming = normalized.slice(
      0,
      CODE_LENGTH - startIndex,
    );

    setDigits((previous) => {
      const next = [...previous];

      for (let offset = 0; offset < incoming.length; offset++) {
        next[startIndex + offset] = incoming[offset];
      }

      return next;
    });

    setHasError(false);

    inputRefs.current[
      Math.min(startIndex + incoming.length, CODE_LENGTH - 1)
    ]?.focus();
  }

  function handleChange(index: number, value: string) {
    if (value === "") {
      setDigits((previous) => {
        const next = [...previous];
        next[index] = "";
        return next;
      });

      setHasError(false);
      return;
    }

    fillDigits(index, value);
  }

  function handlePaste(
    index: number,
    event: ClipboardEvent<HTMLInputElement>,
  ) {
    event.preventDefault();
    fillDigits(index, event.clipboardData.getData("text"));
  }

  function handleKeyDown(
    index: number,
    event: KeyboardEvent<HTMLInputElement>,
  ) {
    if (event.key === "Backspace") {
      event.preventDefault();

      const targetIndex =
        digits[index] || index === 0 ? index : index - 1;

      setDigits((previous) => {
        const next = [...previous];
        next[targetIndex] = "";
        return next;
      });

      setHasError(false);
      inputRefs.current[targetIndex]?.focus();
    }

    if (event.key === "ArrowLeft" && index > 0) {
      event.preventDefault();
      inputRefs.current[index - 1]?.focus();
    }

    if (
      event.key === "ArrowRight" &&
      index < CODE_LENGTH - 1
    ) {
      event.preventDefault();
      inputRefs.current[index + 1]?.focus();
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (digits.some((digit) => !digit)) {
      setHasError(true);

      const emptyIndex = digits.findIndex((digit) => !digit);
      inputRefs.current[emptyIndex]?.focus();
      return;
    }

    setHasError(false);

    // اتصال به API در مرحله بعد اضافه می‌شود.
  }

  return (
    <div
      className="
        flex min-h-[420px] w-full flex-col items-center
        rounded-[10px] border border-[#D2D2D2]
        bg-[#FAFAFA] px-5 py-8
        xl:min-h-[550px] xl:w-[46%] xl:max-w-[540px]
        xl:border-[#E5E5E5] xl:px-10 xl:py-12
      "
    >
      <h1 className="text-center text-[20px] font-bold text-black xl:text-[22px]">
        <Trans>کد یکبار مصرف</Trans>
      </h1>

      <p className="mt-3 text-center text-[14px] text-[#353535]">
        <Trans>برای ورود به سامانه، کد را وارد کنید.</Trans>
      </p>

      <Link
        href="/auth/login"
        className="mt-4 inline-flex items-center justify-center gap-1 text-[12px] text-[#353535] hover:text-primary"
      >
        <ChevronLeft
          size={14}
          aria-hidden="true"
          className="rtl:rotate-180"
        />
        <Trans>ویرایش شماره موبایل</Trans>
      </Link>

      <form
        onSubmit={handleSubmit}
        className="mt-14 flex w-full max-w-[380px] flex-1 flex-col xl:mt-20"
      >
        <p className="text-center text-[12px] leading-6 text-[#595959]">
          {phoneNumber ? (
            <Trans>
              کد یکبار مصرف به شماره موبایل{" "}
              <bdi dir="ltr">{phoneNumber}</bdi> ارسال شده است.
            </Trans>
          ) : (
            <Trans>
              کد یکبار مصرف ارسال‌شده به شماره موبایل خود را وارد کنید.
            </Trans>
          )}
        </p>

        <div
          role="group"
          aria-label={t`کد یکبار مصرف`}
          dir="ltr"
          className="mt-4 flex items-center justify-center gap-2"
        >
          {digits.map((digit, index) => (
            <input
              key={index}
              ref={(element) => {
                inputRefs.current[index] = element;
              }}
              type="text"
              inputMode="numeric"
              autoComplete={
                index === 0 ? "one-time-code" : "off"
              }
              maxLength={CODE_LENGTH}
              value={digit}
              aria-label={t`رقم ${index + 1} کد تایید`}
              aria-required="true"
              aria-invalid={hasError}
              aria-describedby={hasError ? errorId : undefined}
              onFocus={(event) => event.target.select()}
              onChange={(event) =>
                handleChange(index, event.target.value)
              }
              onPaste={(event) => handlePaste(index, event)}
              onKeyDown={(event) => handleKeyDown(index, event)}
              className={`
                h-[48px] w-[44px] rounded-[5px] border
                bg-white text-center text-[20px]
                text-[#353535] outline-none
                transition-colors focus:border-primary
                sm:h-[52px] sm:w-[48px]
                ${
                  hasError
                    ? "border-red-500"
                    : "border-[#EEEEEE]"
                }
              `}
            />
          ))}
        </div>

        {hasError && (
          <p
            id={errorId}
            role="alert"
            className="mt-3 text-center text-[12px] text-red-600"
          >
            <Trans>کد تایید باید شامل ۵ رقم باشد.</Trans>
          </p>
        )}

        <button
          type="submit"
          className="
            mx-auto mt-16 flex h-12 w-full max-w-[285px]
            items-center justify-center rounded-[5px]
            bg-primary text-[14px] text-white
            transition-colors hover:bg-[#820008]
            xl:mt-20
          "
        >
          <Trans>ورود</Trans>
        </button>
      </form>
    </div>
  );
}
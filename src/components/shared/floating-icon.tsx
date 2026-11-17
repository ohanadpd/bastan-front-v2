import Image from "next/image";

export default function FloatingIcon() {
  return (
    <a className="fixed bottom-5 left-5 z-50 flex h-20 w-20 items-center justify-center sm:bottom-8 sm:left-8 sm:h-24 sm:w-24">
      <span className="floating-icon-shadow" aria-hidden="true" />

      <Image
        src="/images/floating-icon.png"
        alt=""
        width={96}
        height={96}
        className="floating-icon-image relative z-10 h-full w-full object-contain"
      />
    </a>
  );
}

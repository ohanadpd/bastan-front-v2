export interface FactoryProjectData {
  id: string;
  status: string;
  title: string;
  area: string;
  progress: number;
  amount: string;
  profit: string;
  deadline: string;
}

interface FactoryProjectCardProps {
  data: FactoryProjectData;
}

export default function FactoryProjectCard({
  data,
}: FactoryProjectCardProps) {
  const progress = Math.min(100, Math.max(0, data.progress));

  return (
    <div
      dir="rtl"
      className="group h-[245px] w-full rounded-[10px] border border-[#E3E3E3] bg-white px-[10px] py-[14px]"
    >
      <div className="flex justify-start">
        <span className="rounded-full bg-[#E4FFE6] px-[12px] py-[5px] font-dana text-[10px] font-normal text-[#22471D]">
          {data.status}
        </span>
      </div>

      <div className="mt-[18px] text-start">
        <h3 className="font-morabba text-[16px] font-bold text-[#252525] transition-colors group-hover:text-primary">
          {data.title}
        </h3>

        <p className="mt-1 font-dana text-[14px] font-normal text-[#666666]">
          {data.area}
        </p>
      </div>

      <div className="mt-[18px]">
        <div
          role="progressbar"
          aria-label={`تأمین سرمایه ${data.title}`}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={progress}
          className="h-[7px] w-full overflow-hidden rounded-full bg-[#F3EDE0]"
        >
          <div
            className="h-full bg-[#C9A35A]"
            style={{ width: `${progress}%` }}
          />
        </div>

        <p className="mt-2 text-start font-dana text-[12px] text-[#666666]">
          {progress.toLocaleString("fa-IR")}٪ تامین شده
        </p>
      </div>

      <div className="mt-[18px] flex items-center justify-between border-t border-[#E8E8E8] pt-[12px]">
        <div className="text-center">
          <p className="font-dana text-[13px] font-bold text-black">
            {data.amount}
          </p>

          <span className="font-dana text-[12px] text-[#979797]">
            توکن (ریال)
          </span>
        </div>

        <div className="text-center">
          <p className="font-dana text-[13px] font-bold text-[#159B8E]">
            {data.profit}
          </p>

          <span className="font-dana text-[12px] text-[#979797]">
            سود تخمینی
          </span>
        </div>

        <div className="text-center">
          <p className="font-dana text-[13px] font-bold text-black">
            {data.deadline}
          </p>

          <span className="font-dana text-[12px] text-[#979797]">
            تا سررسید
          </span>
        </div>
      </div>
    </div>
  );
}
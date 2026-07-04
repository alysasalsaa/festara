export default function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.06)] overflow-hidden">
      <div className="aspect-square skeleton" />
      <div className="p-3 space-y-2">
        <div className="h-3 w-20 skeleton rounded-full" />
        <div className="h-4 skeleton rounded-full" />
        <div className="h-4 w-3/4 skeleton rounded-full" />
        <div className="h-5 w-1/2 skeleton rounded-full" />
        <div className="flex justify-between">
          <div className="h-3 w-16 skeleton rounded-full" />
          <div className="h-3 w-12 skeleton rounded-full" />
        </div>
      </div>
    </div>
  );
}

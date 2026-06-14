// Loading placeholder that mirrors the RoomCard layout (shown while rooms load).
export default function RoomCardSkeleton() {
  return (
    <div className="bg-white rounded-xl2 overflow-hidden shadow-sm2 flex flex-col animate-pulse">
      <div className="h-60 bg-beige-2" />
      <div className="p-6 flex flex-col flex-1">
        <div className="flex items-start justify-between gap-3">
          <div className="h-5 w-32 bg-beige-2 rounded" />
          <div className="h-5 w-16 bg-beige-2 rounded" />
        </div>
        <div className="h-3 w-full bg-beige-2 rounded mt-4" />
        <div className="h-3 w-3/4 bg-beige-2 rounded mt-2" />
        <div className="flex gap-2 mt-5">
          <div className="h-6 w-16 bg-beige-2 rounded-full" />
          <div className="h-6 w-12 bg-beige-2 rounded-full" />
          <div className="h-6 w-20 bg-beige-2 rounded-full" />
        </div>
        <div className="flex items-center justify-between mt-5 pt-5 border-t border-black/5">
          <div className="h-4 w-10 bg-beige-2 rounded" />
          <div className="h-9 w-24 bg-beige-2 rounded-lg" />
        </div>
      </div>
    </div>
  )
}

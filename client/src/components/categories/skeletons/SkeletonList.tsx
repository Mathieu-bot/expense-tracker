import { Skeleton } from "../../../ui";

const CategoriesSkeletonList = () => {
  return (
    <ul className="divide-y divide-white/10 bg-gradient-to-br from-primary-light/10 to-primary-dark/10 backdrop-blur-xl rounded-2xl border border-white/5 shadow-lg overflow-hidden">
      {Array.from({ length: 5 }).map((_, i) => (
        <li key={i} className="p-3">
          <div className="grid grid-cols-1 md:grid-cols-12 items-center gap-3">
            <div className="md:col-span-4">
              <Skeleton variant="text" className="bg-white/10" />
            </div>
            <div className="md:col-span-6">
              <Skeleton variant="text" className="bg-white/5" />
            </div>
            <div className="md:col-span-2">
              <Skeleton height={32} rounded="rounded-md" className="bg-white/10" />
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default CategoriesSkeletonList;

import { Skeleton } from "../../../ui";

const CategoriesSkeletonGrid = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <Skeleton key={i} height={112} rounded="rounded-2xl" className="bg-white/10 border border-white/5" />
      ))}
    </div>
  );
};

export default CategoriesSkeletonGrid;

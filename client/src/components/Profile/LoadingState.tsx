
export const LoadingState = () => {
  return (
    <div className="min-h-screen ml-10 flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-light/70">Loading profile...</p>
      </div>
    </div>
  );
};
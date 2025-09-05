export const LoadingState = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-6" />
        <p className="text-light/70 text-lg">Loading your profile...</p>
        <p className="text-light/40 text-sm mt-2">
          Just a moment while we prepare everything
        </p>
      </div>
    </div>
  );
};

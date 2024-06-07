export function FullPageLoader() {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="w-full h-full flex items-center justify-center">
        <div className="animate-spin">
          <div className="h-12 w-12 rounded-full border-t-2 border-b-2 border-orange-600 border-t-orange-600 border-b-orange-600"></div>
        </div>
      </div>
    </div>
  );
}

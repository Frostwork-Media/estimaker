export function Avatar({ avatar }: { avatar?: string }) {
  return (
    <div
      style={
        avatar
          ? {
              backgroundImage: `url(${avatar})`,
              backgroundSize: "cover",
              backgroundPosition: "center center",
              backgroundRepeat: "no-repeat",
            }
          : {}
      }
      className="w-5 h-5 bg-blue-600 rounded-full shrink-0 flex items-center justify-center text-gray-500 text-sm font-semibold"
    />
  );
}

export function WindowControls() {
  return (
    <div className="flex gap-2">
      <div className="h-3 w-3 rounded-full bg-red-500 transition-transform hover:scale-110" />
      <div className="h-3 w-3 rounded-full bg-yellow-500 transition-transform hover:scale-110" />
      <div className="h-3 w-3 rounded-full bg-green-500 transition-transform hover:scale-110" />
    </div>
  );
}

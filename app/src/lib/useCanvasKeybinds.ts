import { useEffect } from "react";

/**
 * This captures key events on the window when the canvas
 * is on the screen.
 */
export function useCanvasKeybinds() {
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      // Check if the user tried to paste, and if so, prevent it.
      if ((e.ctrlKey || e.metaKey) && e.key === "v") {
        e.preventDefault();
        void (async () => {
          // Check if what is on the clipboard is an image.
          const clipboardItems = await navigator.clipboard.read();
          const image = clipboardItems.find((item) => {
            return item.types.includes("image/png");
          });
          // Log it
          console.log(image);

          // If it is an image, convert it to a blob and then to a file.
        })();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, []);
}

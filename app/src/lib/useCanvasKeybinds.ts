import { useCallback, useEffect } from "react";

import { useToast } from "@/components/ui/use-toast";

/**
 * This captures key events on the window when the canvas
 * is on the screen.
 */
export function useCanvasKeybinds() {
  const { toast } = useToast();

  // upload image
  const uploadImage = useCallback(
    async (_file: File) => {
      toast({
        title: "Uploading...",
        variant: "default",
        duration: 3000,
      });

      // const formData = new FormData();
      // formData.append("file", file);
      // const res = await fetch("/api/upload", {
      //   method: "POST",
      //   body: formData,
      // });
      // const json = await res.json();
      // return json.url;
    },
    [toast]
  );

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
          if (image) {
            const blob = await image.getType("image/png");
            const file = new File([blob], "image.png", {
              type: "image/png",
            });
            const url = await uploadImage(file);
            console.log(url);
          }

          // If it is an image, convert it to a blob and then to a file.
        })();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [uploadImage]);
}

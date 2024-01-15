import * as amplitude from "@amplitude/analytics-browser";
import { useEffect } from "react";

export function useAmplitude() {
  useEffect(() => {
    if (import.meta.env.VITE_AMPLITUDE_KEY) {
      amplitude.init(import.meta.env.VITE_AMPLITUDE_KEY);
    }
  }, []);
}

export function amplitudeRegisterUser(userId: string) {
  amplitude.setUserId(userId);
}

export { amplitude };

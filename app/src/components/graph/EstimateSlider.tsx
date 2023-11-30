import { useEffect, useReducer } from "react";

import { Slider } from "@/components/ui/slider";
import { parseLinkValue } from "@/lib/estimateSliderHelpers";
import { LinkWithSelfId, useUpdateEstimateLink } from "@/lib/store";

/** 
What I need to know:
- whether the slider is representing a range or a single number
- whether all of those numbers are between 0 and 1 or not
*/

// Define action types
type Action =
  | { type: "SET_LOCAL_VALUE"; payload: number[] }
  | { type: "SET_SLIDER_PROPS"; payload: ReturnType<typeof getSliderProps> };

// Define state type
type State = {
  localValue: number[];
  isPercentage: boolean;
  min: number;
  max: number;
  step: number;
};

const initialState: State = {
  localValue: [0.2, 0.5],
  isPercentage: false,
  min: 0,
  max: 1,
  step: 0.01,
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "SET_LOCAL_VALUE":
      return {
        ...state,
        localValue: action.payload,
      };
    case "SET_SLIDER_PROPS":
      return {
        ...state,
        ...action.payload,
      };
  }
}

export function EstimateSlider<T extends LinkWithSelfId>({
  link,
}: {
  link: T;
}) {
  const update = useUpdateEstimateLink();

  const [state, dispatch] = useReducer(reducer, initialState, () => {
    const sliderProps = getSliderProps(link.value);

    return { ...initialState, ...sliderProps };
  });

  // get the value
  // regex the value into an array of numbers
  // determine whether the numbers are between 0 and 1 inclusive
  // return the min, max and value props to the slider
  // when dragging, update the component value, and the value in the store, but don't listen for changes in the store
  // when the user stops dragging, re-process the value and min and max

  useEffect(() => {
    dispatch({
      type: "SET_SLIDER_PROPS",
      payload: getSliderProps(link.value),
    });
  }, [link.value]);

  return (
    <div className="nodrag py-2">
      <Slider
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
        value={state.localValue}
        onValueChange={(value) => {
          dispatch({ type: "SET_LOCAL_VALUE", payload: value });
        }}
        onPointerUp={() => {
          const value = state.localValue;
          update({ id: link.selfId, value: numToStrValue(value) });
        }}
        min={state.min}
        max={state.max}
        step={state.step}
      />
    </div>
  );
}

function getSliderProps(value: string) {
  const localValue = parseLinkValue(value);

  // isPercentage is true if all numbers are between 0 and 1 inclusive
  const isPercentage = localValue.every((value) => value >= 0 && value <= 1);

  let min, max;

  if (isPercentage) {
    min = 0;
    max = 1;
  } else {
    const smallest = Math.min(...localValue);
    const largest = Math.max(...localValue);

    // if both numbers are positive, set min to 0
    if (smallest >= 0 && largest >= 0) {
      min = 0;
      max = closestPowerOfTen(largest);
      // if both numbers are negative, set max to 0
    } else if (smallest <= 0 && largest <= 0) {
      min = closestPowerOfTen(smallest);
      max = 0;
    } else {
      min = closestPowerOfTen(smallest);
      max = closestPowerOfTen(largest);
    }
  }

  // the step should divide the range into 100
  const step = Math.abs((max - min) / 100);
  return { min, max, isPercentage, step, localValue };
}

function numToStrValue(num: number[]): string {
  if (num.length === 1) {
    return num[0].toString();
  } else {
    return num.join(" to ");
  }
}

function closestPowerOfTen(n: number) {
  const sign = Math.sign(n);
  const power = Math.ceil(Math.log10(Math.abs(n)));
  return sign * Math.pow(10, power);
}

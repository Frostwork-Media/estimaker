import {
  result,
  resultMap,
  SqDict,
  SqDictValue,
  SqError,
  SqValue,
} from "@quri/squiggle-lang";

import { useRunnerState, useSquiggle } from "../lib/squiggle-hooks";

type SquiggleOutput = {
  output: result<
    {
      result: SqValue;
      bindings: SqDict;
    },
    SqError
  >;
  code: string;
  executionId: number;
  executionTime: number;
};

function getResultVariables({
  output,
}: SquiggleOutput): result<SqDictValue, SqError> {
  return resultMap(output, (value) => value.bindings.asValue());
}

function getResultValue({
  output,
}: SquiggleOutput): result<SqValue, SqError> | undefined {
  if (output.ok) {
    const isResult = output.value.result.tag !== "Void";
    return isResult ? { ok: true, value: output.value.result } : undefined;
  } else {
    return output;
  }
}

export function useSquiggleRunResult(code: string) {
  const runnerState = useRunnerState(code);

  const [squiggleOutput, { isRunning }] = useSquiggle({
    code: runnerState.renderedCode,
    executionId: runnerState.executionId,
  });

  let resultVariables: result<SqDictValue, SqError> | undefined = undefined,
    resultItem: result<SqValue, SqError> | undefined = undefined;
  if (squiggleOutput) {
    resultVariables = getResultVariables(squiggleOutput);
    resultItem = getResultValue(squiggleOutput);
  }

  return {
    squiggleOutput,
    resultVariables,
    resultItem,
    isRunning,
  };
}

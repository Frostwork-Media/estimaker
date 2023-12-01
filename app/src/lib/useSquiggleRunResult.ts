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

  let variableWithErrorName: string | null = null;
  if (squiggleOutput?.output.ok === false) {
    variableWithErrorName = variableWithError(squiggleOutput, code);
  }

  return {
    squiggleOutput,
    resultVariables,
    resultItem,
    isRunning,
    variableWithErrorName,
  };
}

function variableWithError(
  output?: SquiggleOutput,
  code?: string
): string | null {
  if (!output) return null;
  if (!code) return null;
  if (output.output.ok) return null;
  if (output.output.value.tag === "compile") {
    const line = output.output.value.location().start.line;
    const lines = code.split("\n");
    if (lines.length < line) return null;
    const variableLine = lines[line - 1];
    const variable = variableLine.split(" ")[0];
    return variable;
  }

  return null;
}

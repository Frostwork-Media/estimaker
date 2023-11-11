import {
  Env,
  result,
  SqDict,
  SqError,
  SqProject,
  SqValue,
} from "@quri/squiggle-lang";
import { useEffect, useMemo, useReducer, useState } from "react";

// Props needed for a standalone execution.
type StandaloneExecutionProps = {
  project?: undefined;
  environment?: Env;
  continues?: undefined;
};

// Props needed when executing inside a project.
type ProjectExecutionProps = {
  /** The project that this execution is part of */
  project: SqProject;
  environment?: undefined;
  /** What other squiggle sources from the project to continue. Default [] */
  continues?: string[];
};

type SquiggleArgs = {
  code: string;
  sourceId?: string;
  executionId?: number;
} & (StandaloneExecutionProps | ProjectExecutionProps);

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

type UseSquiggleOutput = [
  SquiggleOutput | undefined,
  {
    project: SqProject;
    isRunning: boolean;
    sourceId: string;
  },
];

// this array's identity must be constant because it's used in useEffect below
const defaultContinues: string[] = [];

export function useSquiggle(args: SquiggleArgs): UseSquiggleOutput {
  // random; https://stackoverflow.com/a/12502559
  // TODO - React.useId?
  const sourceId = useMemo(() => {
    return args.sourceId ?? Math.random().toString(36).slice(2);
  }, [args.sourceId]);

  const projectArg = "project" in args ? args.project : undefined;
  const environment = "environment" in args ? args.environment : undefined;
  const continues =
    "continues" in args ? args.continues ?? defaultContinues : defaultContinues;

  const project = useMemo(() => {
    if (projectArg) {
      return projectArg;
    } else {
      const p = SqProject.create();
      if (environment) {
        p.setEnvironment(environment);
      }
      return p;
    }
  }, [projectArg, environment]);

  const [isRunning, setIsRunning] = useState(false);

  const [squiggleOutput, setSquiggleOutput] = useState<
    SquiggleOutput | undefined
  >(undefined);

  const { executionId = 1 } = args;

  useEffect(
    () => {
      // TODO - cancel previous run if already running
      setIsRunning(true);

      const act = async () => {
        const startTime = Date.now();
        project.setSource(sourceId, args.code);
        project.setContinues(sourceId, continues);
        await project.run(sourceId);
        const output = project.getOutput(sourceId);
        setSquiggleOutput({
          output,
          code: args.code,
          executionId,
          executionTime: Date.now() - startTime,
        });
        setIsRunning(false);
      };

      if (typeof MessageChannel === "undefined") {
        setTimeout(act, 10);
      } else {
        // trick from https://stackoverflow.com/a/56727837
        const channel = new MessageChannel();
        channel.port1.onmessage = act;
        requestAnimationFrame(function () {
          channel.port2.postMessage(undefined);
        });
      }
    },
    // This complains about executionId not being used inside the function body.
    // This is on purpose, as executionId simply allows you to run the squiggle
    // code again
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [args.code, executionId, sourceId, continues, project]
  );

  useEffect(() => {
    return () => {
      project.removeSource(sourceId);
    };
  }, [project, sourceId]);

  return [
    squiggleOutput,
    {
      project,
      isRunning,
      sourceId,
    },
  ];
}

type InternalState = {
  autorunMode: boolean;
  renderedCode: string;
  executionId: number;
};

const buildInitialState = (): InternalState => ({
  autorunMode: true,
  renderedCode: "",
  executionId: 0,
});

type Action =
  | {
      type: "SET_AUTORUN_MODE";
      value: boolean;
      code: string;
    }
  | {
      type: "RUN";
      code: string;
    };

const reducer = (state: InternalState, action: Action): InternalState => {
  switch (action.type) {
    case "SET_AUTORUN_MODE":
      return {
        ...state,
        autorunMode: action.value,
      };
    case "RUN":
      return {
        ...state,
        renderedCode: action.code,
        executionId: state.executionId + 1,
      };
  }
};

type RunnerState = {
  run: () => void;
  autorunMode: boolean;
  code: string;
  renderedCode: string;
  executionId: number;
  setAutorunMode: (newValue: boolean) => void;
};

export function useRunnerState(code: string): RunnerState {
  const [state, dispatch] = useReducer(reducer, undefined, buildInitialState);

  const run = () => {
    dispatch({ type: "RUN", code });
  };

  if (state.autorunMode && state.renderedCode !== code) {
    run();
  }

  return {
    run,
    autorunMode: state.autorunMode,
    code,
    renderedCode: state.renderedCode,
    executionId: state.executionId,
    setAutorunMode: (newValue: boolean) => {
      dispatch({ type: "SET_AUTORUN_MODE", value: newValue, code });
    },
  };
}

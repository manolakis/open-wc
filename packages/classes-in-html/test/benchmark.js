const setupExecutions = (benchmarks, iterations) => {
  const benchmarkNames = Object.keys(benchmarks);
  const executions = [];

  for (let i = 0; i < iterations; i += 1) {
    benchmarkNames.forEach(name =>
      executions.push({
        name,
        func: benchmarks[name],
      }),
    );
  }

  return executions;
};

const execute = async ({ name, func }) => {
  const startTime = performance.now();
  await Promise.resolve(func());
  const endTime = performance.now();

  return {
    name,
    stats: {
      startTime,
      endTime,
      elapsed: endTime - startTime,
    },
  };
};

class Benchmark {
  constructor(iterations) {
    this.iterations = Math.max(iterations, 1);
    this.benchmarks = {};
  }

  add(benchmarkFn) {
    const key = Object.keys(this.benchmarks).length;
    this.benchmarks[key] = benchmarkFn;

    return this;
  }

  async run() {
    const executions = await setupExecutions(this.benchmarks, this.iterations).reduce(
      async (accumulator, execution) => {
        const acc = await accumulator;
        const { name, stats } = await execute(execution);

        acc[name] = acc[name] || [];
        acc[name].push(stats);

        return acc;
      },
      Promise.resolve({}),
    );

    return Object.values(
      Object.keys(executions).reduce((acc, name) => {
        acc[name] = executions[name].reduce(
          (previous, { elapsed }) => ({
            totalTime: previous.totalTime + elapsed,
          }),
          { totalTime: 0 },
        );

        acc[name] = {
          ...acc[name],
          tpe: acc[name].totalTime / this.iterations,
          ops: (1000 /* 1 second */ * this.iterations) / acc[name].totalTime,
        };

        return acc;
      }, {}),
    );
  }
}

export const createSuite = ({ minIterations = 1000 } = {}) => new Benchmark(minIterations);

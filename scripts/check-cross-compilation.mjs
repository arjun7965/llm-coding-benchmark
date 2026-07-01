import {
  crossCompilationUsage,
  parseCrossCompilationArgs,
  runCrossCompilation,
} from "../src/cross-compilation.mjs";

try {
  const options = parseCrossCompilationArgs(process.argv.slice(2));
  if (options.help) {
    console.log(crossCompilationUsage);
  } else {
    const summary = runCrossCompilation(options);
    console.log(
      "Cross-compilation check complete:",
      JSON.stringify(summary),
    );
  }
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}

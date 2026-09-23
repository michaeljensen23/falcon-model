/** Resolve extensionless relative imports to `.ts` so node --test can load app modules. */
export async function resolve(specifier, context, nextResolve) {
  if (
    (specifier.startsWith("./") || specifier.startsWith("../")) &&
    !/\.[cm]?[jt]sx?$/.test(specifier)
  ) {
    try {
      return await nextResolve(`${specifier}.ts`, context);
    } catch {
      /* try the original specifier */
    }
  }
  return nextResolve(specifier, context);
}

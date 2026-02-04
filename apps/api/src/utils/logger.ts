export const logError = (err: unknown) => {
  const isError = err instanceof Error;

  if (isError) {
    console.error(`[Stack]: ${err.stack}`);
    console.error(`[Message]: ${err.message}`);
  }
};

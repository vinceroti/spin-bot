function timeout(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
async function sleep(fn, ms) {
  await timeout(ms);
  return fn();
}

export { sleep };

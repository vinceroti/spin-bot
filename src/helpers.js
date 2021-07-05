function timeout(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
async function sleep(fn, ms) {
  await timeout(ms);
  return fn();
}

async function getList(redisClient, id) {
  try {
    const res = await redisClient.lrange(id, 0, -1);
    return !res || !res.length ? null : res;
  } catch (e) {
    console.error(e);
    return `${e} - Failed to get GameList`;
  }
}

export { sleep, getList };

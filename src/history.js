// Last 24 h of power sensors for the chart, from the recorder's 5-minute statistics
// (~288 points per sensor). Shared between card instances and refreshed every 5 minutes.

const REFRESH_MS = 5 * 60 * 1000;
const cache = new Map(); // statistic ids joined -> { at, promise }

// Resolves to { id: [[ms, kW], ...] } with every value in kW.
export async function fetchDay(hass, ids) {
  const key = ids.join(",");
  const hit = cache.get(key);
  if (hit && Date.now() - hit.at < REFRESH_MS) return hit.promise;
  const end = new Date();
  const start = new Date(end.getTime() - 24 * 3600 * 1000);
  const promise = hass
    .callWS({
      type: "recorder/statistics_during_period",
      start_time: start.toISOString(),
      end_time: end.toISOString(),
      statistic_ids: ids,
      period: "5minute",
      types: ["mean"],
      units: { power: "kW" },
    })
    .then((stats) =>
      Object.fromEntries(
        ids.map((id) => [id, (stats[id] ?? []).filter((p) => Number.isFinite(p.mean)).map((p) => [p.start, p.mean])])
      )
    )
    .catch(() => Object.fromEntries(ids.map((id) => [id, []])));
  cache.set(key, { at: Date.now(), promise });
  return promise;
}

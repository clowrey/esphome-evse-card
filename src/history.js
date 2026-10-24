// Last 24 h of power sensors for the chart, from the recorder's 5-minute statistics
// (~288 points per sensor). A sensor without statistics (no state_class: older EVSE firmware)
// falls back to its recorded states, averaged into 5-minute buckets. Shared between card
// instances and refreshed every 5 minutes.

const REFRESH_MS = 5 * 60 * 1000;
const BUCKET_MS = 5 * 60 * 1000;
const cache = new Map(); // statistic ids joined -> { at, promise }

// Value in kW from a state in the sensor's own unit.
function toKw(value, unit) {
  if (unit === "W") return value / 1000;
  if (unit === "MW") return value * 1000;
  return value;
}

// Time-weighted 5-minute means of a [[ms, value]] step series between start and end.
function bucket(points, start, end) {
  const out = [];
  let i = 0;
  let last;
  for (let t = start - (start % BUCKET_MS); t < end; t += BUCKET_MS) {
    const tEnd = Math.min(t + BUCKET_MS, end);
    let sum = 0;
    let covered = 0;
    let cursor = t;
    // NaN marks an unavailable stretch: it adds neither value nor time to the mean.
    while (i < points.length && points[i][0] < tEnd) {
      if (Number.isFinite(last) && points[i][0] > cursor) {
        sum += last * (points[i][0] - cursor);
        covered += points[i][0] - cursor;
      }
      cursor = Math.max(cursor, points[i][0]);
      last = points[i][1];
      i++;
    }
    if (Number.isFinite(last) && tEnd > cursor) {
      sum += last * (tEnd - cursor);
      covered += tEnd - cursor;
    }
    if (covered > 0) out.push([t, sum / covered]);
  }
  return out;
}

async function fromHistory(hass, id, start, end) {
  const unit = hass.states[id]?.attributes?.unit_of_measurement;
  const res = await hass.callWS({
    type: "history/history_during_period",
    start_time: new Date(start).toISOString(),
    end_time: new Date(end).toISOString(),
    entity_ids: [id],
    minimal_response: true,
    no_attributes: true,
    significant_changes_only: false,
  });
  const points = [];
  for (const s of res?.[id] ?? []) {
    const v = parseFloat(s.s);
    const t = (s.lu ?? s.lc) * 1000;
    points.push([Math.max(t, start), Number.isFinite(v) ? toKw(v, unit) : undefined]);
  }
  // Unavailable stretches carry no value; drop them rather than drawing zero.
  const series = [];
  for (const [t, v] of points) {
    if (v === undefined) {
      if (series.length) series.push([t, NaN]);
    } else series.push([t, v]);
  }
  return bucket(series, start, end).filter(([, v]) => Number.isFinite(v));
}

// Resolves to { id: [[ms, kW], ...] } with every value in kW.
export async function fetchDay(hass, ids) {
  const key = ids.join(",");
  const hit = cache.get(key);
  if (hit && Date.now() - hit.at < REFRESH_MS) return hit.promise;
  const end = Date.now();
  const start = end - 24 * 3600 * 1000;
  const promise = (async () => {
    let stats = {};
    try {
      stats = await hass.callWS({
        type: "recorder/statistics_during_period",
        start_time: new Date(start).toISOString(),
        end_time: new Date(end).toISOString(),
        statistic_ids: ids,
        period: "5minute",
        types: ["mean"],
        units: { power: "kW" },
      });
    } catch (e) {
      stats = {};
    }
    const out = {};
    for (const id of ids) {
      const points = (stats[id] ?? []).filter((p) => Number.isFinite(p.mean)).map((p) => [p.start, p.mean]);
      // Statistics only start once the sensor has a state_class; fill the time before that
      // (or all of it) from the recorded states.
      const statsFrom = points.length ? points[0][0] : end;
      if (statsFrom - start <= 2 * BUCKET_MS) {
        out[id] = points;
        continue;
      }
      let before = [];
      try {
        before = await fromHistory(hass, id, start, statsFrom);
      } catch (e) {
        before = [];
      }
      out[id] = [...before.filter(([t]) => t < statsFrom), ...points];
    }
    return out;
  })();
  cache.set(key, { at: Date.now(), promise });
  return promise;
}

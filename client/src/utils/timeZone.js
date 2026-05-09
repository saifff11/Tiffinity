const BUSINESS_TIME_ZONE = "Asia/Kolkata";

const formatNowInIST = () => {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: BUSINESS_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).formatToParts(new Date());

  const getPart = (type) => parts.find((part) => part.type === type)?.value;

  return {
    year: getPart("year") ?? "0000",
    month: getPart("month") ?? "00",
    day: getPart("day") ?? "00",
    hour: Number(getPart("hour") ?? 0),
    minute: Number(getPart("minute") ?? 0),
    second: Number(getPart("second") ?? 0),
  };
};

export const toMinutes = (time = "00:00") => {
  const [hours, minutes] = time.split(":").map(Number);
  return (hours * 60) + minutes;
};

export const getNowPartsInIST = () => formatNowInIST();

export const getTodayDateInIST = () => {
  const now = formatNowInIST();
  return `${now.year}-${now.month}-${now.day}`;
};

export const getCurrentTimeInIST = () => {
  const now = formatNowInIST();
  return `${String(now.hour).padStart(2, "0")}:${String(now.minute).padStart(2, "0")}`;
};

export const getNowMinutesInIST = () => {
  const now = formatNowInIST();
  return (now.hour * 60) + now.minute;
};

export const isCutoffPassedInIST = (cutoffTime) => {
  return getNowMinutesInIST() >= toMinutes(cutoffTime);
};

export const isMenuExpiredInIST = (menu, nowMinutes = getNowMinutesInIST(), today = getTodayDateInIST()) => {
  if (menu?.isExpired) return true;
  if (!menu?.cutoffTime) return false;
  if (!menu?.date) return nowMinutes >= toMinutes(menu.cutoffTime);

  if (menu.date < today) return true;
  if (menu.date > today) return false;

  return nowMinutes >= toMinutes(menu.cutoffTime);
};

export const getTimeRemainingToCutoffInIST = (cutoffTime, showSeconds = false) => {
  const now = formatNowInIST();
  const [hours, minutes] = cutoffTime.split(":").map(Number);

  const nowSeconds = (now.hour * 3600) + (now.minute * 60) + now.second;
  const cutoffSeconds = (hours * 3600) + (minutes * 60);
  const diff = cutoffSeconds - nowSeconds;

  if (diff <= 0) return "Expired";

  const h = Math.floor(diff / 3600);
  const m = Math.floor((diff % 3600) / 60);
  const s = diff % 60;

  if (h > 0) return `${h}h ${m}m remaining`;
  if (m > 0) return `${m}m remaining`;
  if (showSeconds) return `${s}s remaining`;
  return "few seconds remaining";
};

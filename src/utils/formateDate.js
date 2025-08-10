/**
 * Formats a date according to specified options
 * @param {Date|string|number} date - Input date (Date object, ISO string, or timestamp)
 * @param {Object} [options] - Formatting options
 * @param {string} [options.format='local'] - Predefined format style:
 *                      'local' (localized format),
 *                      'iso' (ISO 8601),
 *                      'full' (full date/time),
 *                      'date' (date only),
 *                      'time' (time only),
 *                      'relative' (relative time like "2 days ago")
 * @param {string} [options.custom] - Custom format string using tokens:
 *                      YYYY: 4-digit year, YY: 2-digit year,
 *                      MMMM: full month, MMM: short month, MM: 2-digit month, M: month,
 *                      DD: 2-digit day, D: day,
 *                      dddd: full weekday, ddd: short weekday,
 *                      HH: 24-hour, hh: 12-hour, mm: minutes, ss: seconds,
 *                      SSS: milliseconds, A: AM/PM, Z: timezone offset
 * @param {string} [options.locale='en-US'] - Locale for localization
 * @param {string} [options.timezone] - Timezone (e.g., 'UTC', 'America/New_York')
 * @param {boolean} [options.utc=false] - Use UTC time
 * @returns {string} Formatted date string
 */
export default function formatDate(date, options = {}) {
  // Parse input date
  let parsedDate;
  if (!date) {
    parsedDate = new Date();
  } else if (date instanceof Date) {
    parsedDate = new Date(date);
  } else if (typeof date === "string") {
    parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) {
      // Try parsing non-ISO strings (e.g., "March 21, 2022")
      parsedDate = new Date(Date.parse(date));
    }
  } else if (typeof date === "number") {
    parsedDate = new Date(date);
  } else {
    throw new Error("Invalid date input");
  }

  if (isNaN(parsedDate.getTime())) {
    throw new Error("Invalid date");
  }

  // Apply timezone if specified
  if (options.timezone) {
    try {
      const timezoneDate = new Date(
        parsedDate.toLocaleString("en-US", { timeZone: options.timezone })
      );
      const offset = parsedDate.getTime() - timezoneDate.getTime();
      parsedDate = new Date(parsedDate.getTime() - offset);
    } catch (e) {
      console.warn(`Invalid timezone "${options.timezone}", using local time`);
    }
  } else if (options.utc) {
    parsedDate = new Date(
      parsedDate.getUTCFullYear(),
      parsedDate.getUTCMonth(),
      parsedDate.getUTCDate(),
      parsedDate.getUTCHours(),
      parsedDate.getUTCMinutes(),
      parsedDate.getUTCSeconds(),
      parsedDate.getUTCMilliseconds()
    );
  }

  // Handle predefined formats
  if (options.format && !options.custom) {
    switch (options.format) {
      case "iso":
        return parsedDate.toISOString();
      case "full":
        return parsedDate.toLocaleString(options.locale || "en-US", {
          dateStyle: "full",
          timeStyle: "long",
        });
      case "date":
        return parsedDate.toLocaleDateString(options.locale || "en-US", {
          dateStyle: "long",
        });
      case "time":
        return parsedDate.toLocaleTimeString(options.locale || "en-US", {
          timeStyle: "long",
        });
      case "relative":
        return getRelativeTime(parsedDate, options.locale);
      case "local":
      default:
        return parsedDate.toLocaleString(options.locale || "en-US");
    }
  }

  // Handle custom format
  if (options.custom) {
    return formatWithTokens(parsedDate, options.custom, options.locale);
  }

  // Default fallback
  return parsedDate.toLocaleString(options.locale || "en-US");
}

/**
 * Formats date using custom tokens
 */
function formatWithTokens(date, format, locale = "en-US") {
  const utc = format.includes("Z");

  const pad = (num, length = 2) => num.toString().padStart(length, "0");

  const year = utc ? date.getUTCFullYear() : date.getFullYear();
  const month = utc ? date.getUTCMonth() : date.getMonth();
  const day = utc ? date.getUTCDate() : date.getDate();
  const hours = utc ? date.getUTCHours() : date.getHours();
  const minutes = utc ? date.getUTCMinutes() : date.getMinutes();
  const seconds = utc ? date.getUTCSeconds() : date.getSeconds();
  const milliseconds = utc ? date.getUTCMilliseconds() : date.getMilliseconds();
  const weekday = utc ? date.getUTCDay() : date.getDay();

  const monthNames = new Intl.DateTimeFormat(locale, { month: "long" }).format(
    date
  );
  const shortMonthNames = new Intl.DateTimeFormat(locale, {
    month: "short",
  }).format(date);
  const weekdayNames = new Intl.DateTimeFormat(locale, {
    weekday: "long",
  }).format(date);
  const shortWeekdayNames = new Intl.DateTimeFormat(locale, {
    weekday: "short",
  }).format(date);

  const timezoneOffset = -date.getTimezoneOffset();
  const timezoneHours = Math.floor(Math.abs(timezoneOffset) / 60);
  const timezoneMinutes = Math.abs(timezoneOffset) % 60;
  const timezoneSign = timezoneOffset >= 0 ? "+" : "-";

  const replacements = {
    YYYY: pad(year, 4),
    YY: pad(year % 100),
    MMMM: monthNames,
    MMM: shortMonthNames,
    MM: pad(month + 1),
    M: (month + 1).toString(),
    DD: pad(day),
    D: day.toString(),
    dddd: weekdayNames,
    ddd: shortWeekdayNames,
    HH: pad(hours),
    hh: pad(hours % 12 || 12),
    mm: pad(minutes),
    ss: pad(seconds),
    SSS: pad(milliseconds, 3),
    A: hours < 12 ? "AM" : "PM",
    Z: utc
      ? "Z"
      : `${timezoneSign}${pad(timezoneHours)}:${pad(timezoneMinutes)}`,
  };

  return format.replace(
    /YYYY|YY|MMMM|MMM|MM|M|DD|D|dddd|ddd|HH|hh|mm|ss|SSS|A|Z/g,
    (match) => replacements[match]
  );
}

/**
 * Returns relative time string (e.g., "2 days ago")
 */
function getRelativeTime(date, locale = "en-US") {
  const now = new Date();
  const diff = now - date;
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: "auto" });

  if (days > 7 || days < -7) {
    return formatDate(date, { format: "date", locale });
  } else if (days !== 0) {
    return rtf.format(-days, "day");
  } else if (hours !== 0) {
    return rtf.format(-hours, "hour");
  } else if (minutes !== 0) {
    return rtf.format(-minutes, "minute");
  } else {
    return rtf.format(-seconds, "second");
  }
}

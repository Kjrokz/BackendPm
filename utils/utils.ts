import moment from "moment";

export const isTimeBetween = function (
  startTime: string,
  endTime: string,
  serverTime: string
) {
  let start = moment(startTime, "H:mm:ss");
  let end = moment(endTime, "H:mm:ss");
  let server = moment(serverTime, "H:mm:ss");
  if (end < start) {
    return (
      (server >= start && server <= moment("23:59:59", "h:mm:ss")) ||
      (server >= moment("0:00:00", "h:mm:ss") && server < end)
    );
  }
  return server >= start && server < end;
};

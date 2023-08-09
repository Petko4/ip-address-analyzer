const IPV4_REGEX =
  /(([0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])\/([0-9]|[1-2][0-9]|3[0-2])$/;
// const IPV6_REGEX =
//   /^((([0-9A-Fa-f]{1,4}:){1,6}:)|(([0-9A-Fa-f]{1,4}:){7}))([0-9A-Fa-f]{1,4})\/([0-9]|[1-9][0-9]|1[0-1][0-9]|12[0-8])$}/;

export function isValidIpAddress(ipAddress: string) {
  //TODO IPV6
  if (!ipAddress.match(IPV4_REGEX)) {
    throw new TypeError("Invalid IP address");
  }
}

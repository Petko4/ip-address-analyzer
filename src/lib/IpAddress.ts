// Index represents CIDR notaion, value represents dot decimal notation
const SUBNET_MASKS = [
  [0, 0, 0, 0],
  [128, 0, 0, 0],
  [192, 0, 0, 0],
  [224, 0, 0, 0],
  [240, 0, 0, 0],
  [248, 0, 0, 0],
  [252, 0, 0, 0],
  [254, 0, 0, 0],
  [255, 0, 0, 0],
  [255, 128, 0, 0],
  [255, 192, 0, 0],
  [255, 224, 0, 0],
  [255, 240, 0, 0],
  [255, 248, 0, 0],
  [255, 252, 0, 0],
  [255, 254, 0, 0],
  [255, 255, 0, 0],
  [255, 255, 128, 0],
  [255, 255, 192, 0],
  [255, 255, 224, 0],
  [255, 255, 240, 0],
  [255, 255, 248, 0],
  [255, 255, 252, 0],
  [255, 255, 254, 0],
  [255, 255, 255, 0],
  [255, 255, 255, 128],
  [255, 255, 255, 192],
  [255, 255, 255, 224],
  [255, 255, 255, 240],
  [255, 255, 255, 248],
  [255, 255, 255, 252],
  [255, 255, 255, 254],
  [255, 255, 255, 255],
];

export default class IpAddress {
  _ipAddressOctets: number[];
  _netmaskCidr: number;
  _netmaskOctets: number[];

  constructor(ipAddress: number[], netmask: number | number[]) {
    if (ipAddress.some((octet) => octet < 0 || octet > 255)) {
      throw new RangeError("Some IP address octet is out of range");
    }

    this._ipAddressOctets = ipAddress;

    if (typeof netmask === "number") {
      if (netmask < 0 || netmask > 32) {
        throw new RangeError("Netmask is out of range 0 - 32.");
      }

      this._netmaskCidr = netmask;
      this._netmaskOctets = SUBNET_MASKS[netmask];
    } else {
      if (netmask.some((octet) => octet < 0 || octet > 255)) {
        throw new RangeError("Some netmask octet is out of range.");
      }

      const subnetIndex = SUBNET_MASKS.findIndex((subnet) => {
        return subnet.every((octet, index) => netmask[index] === octet);
      });

      this._netmaskCidr = subnetIndex;
      this._netmaskOctets = SUBNET_MASKS[subnetIndex];
    }
  }

  get ipAddress() {
    return this._ipAddressOctets;
  }

  get netmaskCidr() {
    return this._netmaskCidr;
  }

  get netmask() {
    return this._netmaskOctets;
  }

  get networkAddress() {
    if (this.netmaskCidr === 32 || this.netmaskCidr === 31) {
      return null;
    }
    return this.calculateNetworkAddress(this.ipAddress, this.netmask);
  }

  get wildcardAddress() {
    return this.netmask.map((netmaskOctet) => {
      return 255 - netmaskOctet;
    });
  }

  get broadcastAddress() {
    if (this.netmaskCidr === 32 || this.netmaskCidr === 31) {
      return null;
    }
    return this.calculateBroadcastAddress(this.ipAddress, this.wildcardAddress);
  }

  get firstAvailableAddress() {
    if (this.networkAddress) {
      const firstAddress = this.networkAddress;
      firstAddress[3] = firstAddress[3] | 1;
      return firstAddress;
    }

    if (this.netmaskCidr === 31) {
      return this.calculateNetworkAddress(this.ipAddress, this.netmask);
    }

    return null;
  }

  get lastAvailableAddress() {
    if (this.broadcastAddress) {
      const lastAddress = this.broadcastAddress;
      lastAddress[3] = lastAddress[3] - 1;
      return lastAddress;
    }

    if (this.netmaskCidr === 31) {
      return this.calculateBroadcastAddress(
        this.ipAddress,
        this.wildcardAddress
      );
    }

    return null;
  }

  get ipClass() {
    /*
    Classful Ranges
    A 0.0.0.0 – 127.255.255.255
    B 128.0.0.0 - 191.255.255.255
    C 192.0.0.0 - 223.255.255.255
    D 224.0.0.0 - 239.255.255.255
    E 240.0.0.0 - 255.255.255.255
    */
    if (this.ipAddress[0] >= 0 && this.ipAddress[0] <= 127) {
      return "A";
    }
    if (this.ipAddress[0] >= 128 && this.ipAddress[0] <= 191) {
      return "B";
    }
    if (this.ipAddress[0] >= 192 && this.ipAddress[0] <= 223) {
      return "C";
    }
    if (this.ipAddress[0] >= 224 && this.ipAddress[0] <= 239) {
      return "D";
    }
    if (this.ipAddress[0] >= 240 && this.ipAddress[0] <= 255) {
      return "E";
    }

    throw new RangeError("Not valid classful range.");
  }

  get ipType() {
    // https://en.wikipedia.org/wiki/Reserved_IP_addresses

    if (this.isMatchingSubnet([0, 0, 0, 0], SUBNET_MASKS[8])) {
      return "software - current network";
    }

    if (
      this.isMatchingSubnet([10, 0, 0, 0], SUBNET_MASKS[8]) ||
      this.isMatchingSubnet([100, 64, 0, 0], SUBNET_MASKS[10]) ||
      this.isMatchingSubnet([172, 16, 0, 0], SUBNET_MASKS[12]) ||
      this.isMatchingSubnet([192, 0, 0, 0], SUBNET_MASKS[24]) ||
      this.isMatchingSubnet([192, 168, 0, 0], SUBNET_MASKS[16]) ||
      this.isMatchingSubnet([198, 18, 0, 0], SUBNET_MASKS[15])
    ) {
      return "private network";
    }

    if (this.isMatchingSubnet([127, 0, 0, 0], SUBNET_MASKS[8])) {
      return "host - loopback address to the local host";
    }

    if (this.isMatchingSubnet([169, 254, 0, 0], SUBNET_MASKS[16])) {
      return "subnet - link local address";
    }

    if (
      this.isMatchingSubnet([192, 0, 2, 0], SUBNET_MASKS[24]) ||
      this.isMatchingSubnet([198, 51, 100, 0], SUBNET_MASKS[24]) ||
      this.isMatchingSubnet([203, 0, 113, 0], SUBNET_MASKS[24]) ||
      this.isMatchingSubnet([233, 252, 0, 0], SUBNET_MASKS[24])
    ) {
      return "documentation";
    }

    if (this.isMatchingSubnet([192, 88, 99, 0], SUBNET_MASKS[24])) {
      return "internet - IPv6 to IPv4 relay (2002::/16)";
    }

    if (this.isMatchingSubnet([224, 0, 0, 0], SUBNET_MASKS[24])) {
      return "internet - multicast";
    }
    if (this.isMatchingSubnet([240, 0, 0, 0], SUBNET_MASKS[4])) {
      return "internet - future use";
    }
    if (this.isMatchingSubnet([255, 255, 255, 255], SUBNET_MASKS[32])) {
      return "subnet - limited broadcast";
    }
  }

  get version() {
    //TODO IPv6 support
    return 4;
  }

  private calculateNetworkAddress(ipAddress: number[], netmask: number[]) {
    return ipAddress.map((ipAddressOctet, index) => {
      return ipAddressOctet & netmask[index];
    });
  }

  private calculateBroadcastAddress(
    ipAddress: number[],
    wildcardAddress: number[]
  ) {
    return ipAddress.map((ipAddressOcet, index) => {
      return ipAddressOcet | wildcardAddress[index];
    });
  }

  private isMatchingSubnet(
    // hostIpAddress: number[],
    subnet: number[],
    netmask: number[]
  ) {
    const maskedHostIpAddress = this.ipAddress.map(
      (hostOctet, index) => hostOctet & netmask[index]
    );
    return maskedHostIpAddress.every(
      (hostOctet, index) => hostOctet === subnet[index]
    );
  }
}

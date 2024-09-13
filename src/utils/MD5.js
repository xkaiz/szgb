export const md5 = (string) => {
    const hex_chr = '0123456789abcdef';
  
    const str2binl = (str) => {
      const bin = [];
      for (let i = 0; i < str.length * 8; i += 8) {
        bin[i >> 5] |= (str.charCodeAt(i / 8) & 0xff) << (i % 32);
      }
      return bin;
    };
  
    const binl2hex = (bin) => {
      let hex = '';
      for (let i = 0; i < bin.length * 4; i++) {
        hex += hex_chr.charAt((bin[i >> 2] >> ((i % 4) * 8 + 4)) & 0xf) +hex_chr.charAt((bin[i >> 2] >> ((i % 4) * 8)) & 0xf);
      }
      return hex;
    };
  
    const core_md5 = (bin, len) => {
      bin[len >> 5] |= 0x80 << ((len) % 32);
      bin[(((len + 64) >>> 9) << 4) + 14] = len;
  
      let a = 1732584193;
      let b = -271733879;
      let c = -1732584194;
      let d = 271733878;
  
      for (let i = 0; i < bin.length; i += 16) {
        const olda = a;
        const oldb = b;
        const oldc = c;
        const oldd = d;
  
        a = ff(a, b, c, d, bin[i + 0], 7, -680876936);
        d = ff(d, a, b, c, bin[i + 1], 12, -389564586);
        c = ff(c, d, a, b, bin[i + 2], 17, 606105819);
        b = ff(b, c, d, a, bin[i + 3], 22, -1044525330);
        a = ff(a, b, c, d, bin[i + 4], 7, -176418897);
        d = ff(d, a, b, c, bin[i + 5], 12, 1200080426);
        c = ff(c, d, a, b, bin[i + 6], 17, -1473231341);
        b = ff(b, c, d, a, bin[i + 7], 22, -45705983);
        a = ff(a, b, c, d, bin[i + 8], 7, 1770035416);
        d = ff(d, a, b, c, bin[i + 9], 12, -1958414417);
        c = ff(c, d, a, b, bin[i + 10], 17, -42063);
        b = ff(b, c, d, a, bin[i + 11], 22, -1990404162);
        a = ff(a, b, c, d, bin[i + 12], 7, 1804603682);
        d = ff(d, a, b, c, bin[i + 13], 12, -40341101);
        c = ff(c, d, a, b, bin[i + 14], 17, -1502002290);
        b = ff(b, c, d, a, bin[i + 15], 22, 1236535329);
  
        a = add(a, olda);
        b = add(b, oldb);
        c = add(c, oldc);
        d = add(d, oldd);
      }
      return [a, b, c, d];
    };
  
    const add = (x, y) => {
      return (x + y) & 0xFFFFFFFF;
    };
  
    const ff = (a, b, c, d, x, s, t) => {
      return add(rotateLeft(add(add(a, ((b & c) | (~b & d))), add(x, t)), s), b);
    };
  
    const rotateLeft = (lValue, iShiftBits) => {
      return (lValue << iShiftBits) | (lValue >>> (32 - iShiftBits));
    };
  
    const bin = str2binl(string);
    const md5 = core_md5(bin, string.length * 8);
    return binl2hex(md5);
  };
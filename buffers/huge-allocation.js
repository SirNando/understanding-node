const { Buffer, constants } = require("buffer");

const b = Buffer.alloc(1e9); // 1.000.000.000 bytes = 1 gigabyte

console.log(constants.MAX_LENGTH);

setInterval(() => {
  //   for (index of b) {
  //     b[index] = 0x22;
  //     }

  b.fill(0x22);
}, 5000);

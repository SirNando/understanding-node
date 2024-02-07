const { Buffer } = require("buffer");

const buffer = Buffer.alloc(10000, 0); // Allocates and zero-fills everything

const unsafeBuffer = Buffer.allocUnsafe(2);

const buff = Buffer.allocUnsafeSlow(2); // Will not try to make use of the predefined internal buffer

for (index of buffer) {
  if (buffer[index] !== 0) {
    console.log(
      `Element at position ${index} has value ${buffer[index].toString(2)}`
    );
  }
}

console.log(Buffer.poolSize);

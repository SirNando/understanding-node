// Write binary data to memory
// 0100 1000 0110 1001 0010 0001
const { Buffer } = require("buffer");

const memoryBuffer = Buffer.alloc(3);
memoryBuffer[0] = 0x48;
memoryBuffer[1] = 0x69;
memoryBuffer[2] = 0x21;

console.log(memoryBuffer.toString("utf-8"));

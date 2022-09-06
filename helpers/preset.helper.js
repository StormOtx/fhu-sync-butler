module.exports.checkIfValidPreset = (binary) => {
    return binary[0] & 0x22 && binary[1] & 0x78 && binary[2] & 0x47 && binary[3] & 0x37;
}
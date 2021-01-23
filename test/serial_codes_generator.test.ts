import { SerialCodeGenerator } from '../src/serial_codes_generator';

const serialCodeGeneratorObj = new SerialCodeGenerator();
let nextUniqueSerialCode = serialCodeGeneratorObj.getNextUniqueSerialCode('999999');
console.log("Next unique serial code :", nextUniqueSerialCode);

// Generate complete unique serial sequence 
// while (nextUniqueSerialCode && nextUniqueSerialCode != '999999') {
//     nextUniqueSerialCode = serialCodeGeneratorObj.getNextUniqueSerialCode(nextUniqueSerialCode);
//     console.log('Next unique serial code :', nextUniqueSerialCode);
// }





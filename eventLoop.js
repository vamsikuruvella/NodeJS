const fs = require("fs");

setImmediate(() => console.log("setImmediate"));

console.log("third line");

setTimeout(function (){console.log("Timeout ")}, 1000);

Promise.resolve().then(() => console.log("Promise"));

fs.readFile("./file.txt", "utf8", () => {

    console.log("File Reading CB");
});

process.nextTick(() => console.log("nextTick"));

console.log("Last line of the file.");




// const fs = require("fs");

// setImmediate(() => console.log("setImmediate"));

// setTimeout(function (){console.log("Timeout ")}, 1000);

// Promise.resolve().then(() => console.log("Promise"));

// fs.readFile("./file.txt", "utf8", () => {

//     setTimeout(() => console.log("2nd timer"), 0);

//     process.nextTick(() => console.log("2nd nextTick"));

//     setImmediate(() => console.log("2nd setImmediate"));

//     console.log("File Reading CB");
// });

// process.nextTick(() => console.log("nextTick"));

// console.log("Last line of the file.");





// setImmediate(() => console.log("setImmediate"));

// setTimeout(() => console.log("Timer expired"), 0);

// Promise.resolve().then(() => console.log("Promise"));

// setTimeout(() => {

//     setTimeout(() => console.log("2nd timer"), 0);

//     process.nextTick(() => console.log("2nd nextTick"));

//     setImmediate(() => console.log("2nd setImmediate"));

//     console.log("Long timer callback");

// }, 3000);

// process.nextTick(() => console.log("nextTick"));

// console.log("Last line of the file.");





// const fs = require("fs");

// setImmediate(() => console.log("setImmediate"));

// setTimeout(() => console.log("Timer expired"), 0);

// Promise.resolve().then(() => console.log("Promise"));

// fs.readFile("./file.txt", "utf8", () => {
//     console.log("File Reading CB");
// });

// process.nextTick(() => {
//     process.nextTick(() => {
//         process.nextTick(() => console.log("inner inner nextTick"));
//         console.log("inner nextTick")
//     });
//     console.log("nextTick");
// });

// console.log("Last line of the file.");
// ESM allows 'await' without an 'async' function wrapper
// const response = await fetch('https://example.com');
// const data = await response;

// export default data;
// console.log("Data loaded:", data);

//Common JS
// {
//     "type":"module"
// }

(async () => {
    try {
        const response = await fetch('https://example.com');
        const data = await response;
        console.log("Data loaded:", data);
    } catch (err) {
        console.error(err);
    }
})();

console.log("This logs BEFORE the data because CJS continues executing.");
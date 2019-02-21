'use strict';

const calculator = require('./calculator');

const resultSum = calculator.sum(5, 3);
console.log(`resultSum: ${resultSum}`);

const { substract, mul, div } = calculator;
const resultSubstract = substract(3, 5);
console.log(`resultSubstract: ${resultSubstract}`);

mul(3, 4).then((resultMul) => {
  console.log(`resultMul: ${resultMul}`);
}).catch((err) => {
  console.log('errorMul', err);
});


async function startDiv() {
  try {
    const resultDiv = await div(4, 2);
    console.log(`resultDivAsync: ${resultDiv}`);
  } catch (err) {
    console.log('resultDiv error', err);
  }
}

startDiv();

// treat div as promise
div(4, 2).then((resultDiv) => {
  console.log(`resultDiv: ${resultDiv}`);
}).catch((err) => {
  console.log('resultDiv error', err);
});

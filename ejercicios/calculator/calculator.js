'use strict';

function sum(n1, n2) {
  return n1 + n2;
}

function substract(n1, n2) {
  return n1 - n2;
}

function mul(n1, n2) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(n1 * n2), 2000);
  });
}

async function div(n1, n2) {
  if (n2 === 0) {
    throw new Error('not a valid div');
  }

  return n1 / n2;
}

module.exports = {
  sum,
  substract,
  mul,
  div,
};

function approximateFraction(x: number, maxDenominator = 100): [number, number] {
  let bestNumerator = 1;
  let bestDenominator = 1;
  let minError = Math.abs(x - bestNumerator / bestDenominator);

  for (let d = 1; d <= maxDenominator; d++) {
    const n = Math.round(x * d);
    const err = Math.abs(x - n / d);
    if (err < minError) {
      bestNumerator = n;
      bestDenominator = d;
      minError = err;
    }
  }

  return [bestNumerator, bestDenominator];
}

export default approximateFraction;
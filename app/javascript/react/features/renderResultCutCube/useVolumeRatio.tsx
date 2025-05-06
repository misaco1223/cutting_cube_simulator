import { gcd } from "../getCoordinates/hooks/gcd"

function toIntegerRatio(a: number, b: number, maxDenominator = 100): [number, number] {

    // 小数を分数に近似する
    function approximateFraction(x: number): [number, number] {
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
  
    const [n1, d1] = approximateFraction(a);
    const [n2, d2] = approximateFraction(b);
  
    const ratio1 = n1 * d2;
    const ratio2 = n2 * d1;
  
    const divisor = gcd(ratio1, ratio2);
    return [ratio1 / divisor, ratio2 / divisor];
  }

export default toIntegerRatio
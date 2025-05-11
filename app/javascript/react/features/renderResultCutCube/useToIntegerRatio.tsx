import { gcd } from "../getCoordinates/hooks/gcd"
import approximateFraction from "./useApproximateFraction"

function toIntegerRatio(a: number, b: number, maxDenominator = 100): [number, number] {
  
    const [n1, d1] = approximateFraction(a);
    const [n2, d2] = approximateFraction(b);
  
    const ratio1 = n1 * d2;
    const ratio2 = n2 * d1;
  
    const divisor = gcd(ratio1, ratio2);
    return [ratio1 / divisor, ratio2 / divisor];
  }

export default toIntegerRatio
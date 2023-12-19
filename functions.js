export async function LaGrange(req, res) {
  try {
    const { x, xi, yi } = req.body;

    const xiArray = xi.split(",").map(Number);
    const yiArray = yi.split(",").map(Number);

    function lagrangeInterpolation(x, xi, yi) {
      let result = 0;

      for (let i = 0; i < xi.length; i++) {
        let term = yi[i];

        for (let j = 0; j < xi.length; j++) {
          if (j !== i) {
            term = (term * (x - xi[j])) / (xi[i] - xi[j]);
          }
        }

        result += term;
      }

      return result;
    }

    const result = lagrangeInterpolation(x, xiArray, yiArray);

    return res.status(200).json(`Ответ: ${isNaN(result) ? "Некорректные значения" : result}`);
  } catch (e) {
    console.error(e);
    return res.status(500).json(e.message);
  }
}

export async function Newton(req, res) {
  try {
    const { x, xi, yi } = req.body;

    const xiArray = xi.split(",").map(Number);
    const yiArray = yi.split(",").map(Number);

    function newtonInterpolation(xi, yi) {
      if (xi.length !== yi.length) {
        throw new Error("Массивы xi и yi должны иметь одинаковую длину");
      }

      const n = xi.length;
      const coefficients = [];

      // Расчет разделенных разностей
      const dividedDifferences = [];
      for (let i = 0; i < n; i++) {
        dividedDifferences[i] = yi[i];
      }

      for (let j = 1; j < n; j++) {
        for (let i = n - 1; i >= j; i--) {
          dividedDifferences[i] = (dividedDifferences[i] - dividedDifferences[i - 1]) / (xi[i] - xi[i - j]);
        }
      }

      // Вычисление коэффициентов интерполяционного многочлена Ньютона
      for (let i = 0; i < n; i++) {
        coefficients[i] = dividedDifferences[i];
      }

      // Возвращение функции интерполяции
      return function (x) {
        let result = coefficients[n - 1];
        for (let i = n - 2; i >= 0; i--) {
          result = result * (x - xi[i]) + coefficients[i];
        }
        return result;
      };
    }

    const interpolateFunction = newtonInterpolation(xiArray, yiArray);
    const result = interpolateFunction(x);

    return res.status(200).json(`Ответ: ${isNaN(result) ? "Некорректные значения" : result}`);
  } catch (e) {
    console.error(e);
    return res.status(500).json(e.message);
  }
}

export async function bisection(req, res) {
  try {
    const { func, a, b, e, maxIter } = req.body;
    const myFunction = eval(`(${func})`);
    function bisectionMethod(func, a, b, tol = 1e-6, maxIter = 100) {
      if (func(a) * func(b) > 0) {
        throw new Error("Функция должна иметь разные знаки на концах интервала [a, b]");
      }

      let iterCount = 0;
      let result = [];

      while ((b - a) / 2 > tol && iterCount < maxIter) {
        const c = (a + b) / 2;
        const fc = func(c);
        const diff = Math.abs(c - (iterCount > 0 ? result[iterCount - 1].x : 0));

        result.push({
          step: iterCount + 2,
          x: c,
          fx: fc,
          diff: diff,
        });

        if (fc === 0) {
          break; // Мы нашли точное значение корня
        } else if (fc * func(a) < 0) {
          b = c;
        } else {
          a = c;
        }

        iterCount++;
      }

      return result;
    }
    const result = bisectionMethod(myFunction, a, b, e, maxIter);
    return res.status(200).json(result);
  } catch (e) {
    console.error(e);
    return res.status(500).json(e.message);
  }
}

export async function Elier(req, res) {
  try {
    const { func } = req.body;
    const y0 = Number(req.body.y0);
    const x0 = Number(req.body.x0);
    const h = Number(req.body.h);
    const n = Number(req.body.n);

    const myFunction = eval(`(${func})`);

    function eulerMethod(dydx, y0, x0, h, n) {
      const results = [{ x: x0, y: y0 }];

      for (let i = 1; i <= n; i++) {
        const x = x0 + i * h;
        const y = results[i - 1].y + h * dydx(x0 + (i - 1) * h, results[i - 1].y);

        results.push({ x, y });
      }

      return results;
    }

    const result = eulerMethod(myFunction, y0, x0, h, n);

    return res.status(200).json(result);
  } catch (e) {
    console.error(e);
    return res.status(500).json(e.message);
  }
}

export async function rungeKutt(req, res) {
  try {
    const { func } = req.body;
    const y0 = Number(req.body.y0);
    const x0 = Number(req.body.x0);
    const h = Number(req.body.h);
    const n = Number(req.body.n);

    const myFunction = eval(`(${func})`);

    function rungeKutta(dydx, y0, x0, h, n) {
      const results = [];
      let y = y0;
      let x = x0;

      for (let i = 0; i < n; i++) {
        results.push({ x, y });
        const k1 = h * dydx(x, y);
        const k2 = h * dydx(x + 0.5 * h, y + 0.5 * k1);
        const k3 = h * dydx(x + 0.5 * h, y + 0.5 * k2);
        const k4 = h * dydx(x + h, y + k3);

        y = y + (k1 + 2 * k2 + 2 * k3 + k4) / 6;
        x = x + h;
      }

      return results;
    }

    const result = rungeKutta(myFunction, y0, x0, h, n);

    return res.status(200).json(result);
  } catch (e) {
    console.error(e);
    return res.status(500).json(e.message);
  }
}

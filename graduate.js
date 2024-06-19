import _ from 'lodash'

export const graduate = (length, n, variation) => {
  const m = Math.ceil(n / 2)
  const average = length / n
  if (m < 2) return _.times(n, _.constant(average))
  // to derive this, consider
  // (1) sum(widths) = average * n
  // (2) variation = max / base
  const base = (n % 2) ?
    average * (2 * m - 1) / ((variation + 1) * (m - 1) + 1) :
    average * 2 / (variation + 1)
  const delta = base * (variation - 1) / (m - 1)
  return _.range(n).map(i => base + delta * Math.min(i, n - 1 - i))
}

export const graduateCumulative = (length, n, variation) =>
  graduate(length, n, variation).reduce(
    ({sum, acc}, num) => ({sum: sum + num, acc: [...acc, sum + num]}),
    {sum: 0, acc: [0]}
  ).acc

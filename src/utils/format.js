// Turns 18000 into "Rs. 18,000"
export function formatLKR(amount) {
  return `Rs. ${new Intl.NumberFormat('en-LK').format(amount)}`
}
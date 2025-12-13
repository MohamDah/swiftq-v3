
// Generates a random alphanumeric ID consisting of 7 characters.
export function generateId() {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";

  for (let i = 0; i < 7; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters.charAt(randomIndex);
  }

  return result;
}

export function getCustomerName(customer: {displayNumber: string, customerName: string | null}) {
  return customer.customerName || `${customer.displayNumber}` || 'Unknown Customer'
}
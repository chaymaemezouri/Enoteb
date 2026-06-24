const currencyFormatter = new Intl.NumberFormat('fr-MA', {
  style: 'currency',
  currency: 'MAD',
  maximumFractionDigits: 0,
});

export function formatAmount(amount: string): string {
  const value = Number.parseFloat(amount);

  if (Number.isNaN(value)) {
    return amount;
  }

  return currencyFormatter.format(value);
}

export function formatYear(year: number | null | undefined): string | null {
  if (!year) {
    return null;
  }

  return String(year);
}

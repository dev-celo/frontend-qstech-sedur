export function limparCpfCnpj(value: string): string {
  let cleaned = value.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();

  if (cleaned.length <= 11) {
    cleaned = cleaned.replace(/[^0-9]/g, "");
  }

  return cleaned.slice(0, 14);
}

export function formatCpfCnpj(value: string): string {
  const cleaned = limparCpfCnpj(value);

  if (cleaned.length <= 11) {
    let formatted = "";
    for (let i = 0; i < cleaned.length; i++) {
      if (i === 3) formatted += ".";
      if (i === 6) formatted += ".";
      if (i === 9) formatted += "-";
      formatted += cleaned[i];
    }
    return formatted;
  }

  let formatted = "";
  for (let i = 0; i < cleaned.length; i++) {
    if (i === 2) formatted += ".";
    if (i === 5) formatted += ".";
    if (i === 8) formatted += "/";
    if (i === 12) formatted += "-";
    formatted += cleaned[i];
  }
  return formatted;
}

export function cpfCnpjValido(value: string): boolean {
  return limparCpfCnpj(value).length >= 11;
}

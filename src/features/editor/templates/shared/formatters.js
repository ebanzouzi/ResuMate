export function fullName(cvData) {
  const name = [cvData.firstName, cvData.lastName].filter(Boolean).join(" ");
  return name || "Votre Nom";
}

export function hasText(value) {
  return typeof value === "string" && value.trim().length > 0;
}

export function hasItems(list) {
  return Array.isArray(list) && list.length > 0;
}

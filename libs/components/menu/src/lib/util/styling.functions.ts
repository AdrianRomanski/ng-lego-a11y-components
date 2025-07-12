export function getTopOffset(count: number): string {
  switch (count) {
    case 0:
    case 1:
      return '80%';
    case 2:
      return '90%';
    case 3:
      return '93%';
    case 4:
      return '95%';
    case 5:
      return '96%';
    default:
      return calculateTopOffset(count);
  }
}

function calculateTopOffset(count: number): string {
  const base = 96;
  const extraItems = count - 5;
  const top = base + extraItems * 0.5;
  return `${top}%`;
}

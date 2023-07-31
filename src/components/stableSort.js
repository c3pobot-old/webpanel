function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}
function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}
export default function StableSort(array, order, orderBy) {
  const comparator = getComparator(order, orderBy)
  return  array.sort((a, b) => {
      const order = comparator(a, b);
      if (order !== 0) {
        return order;
      }
      return a[0] - b[0];
    });
}

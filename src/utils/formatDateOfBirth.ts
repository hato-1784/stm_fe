const formatDateOfBirth = (dateOfBirth: string | null): string | null => {
  if (!dateOfBirth) {
    return null;
  }
  const date = new Date(dateOfBirth);
  const year = date.getFullYear();
  const month = date.getMonth() + 1; // 月は0から始まるため+1
  const day = date.getDate();
  return `${year}年${month}月${day}日`;
};

export default formatDateOfBirth;
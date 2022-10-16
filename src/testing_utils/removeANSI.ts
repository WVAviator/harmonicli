const removeANSI = (str: string) => {
  if (!str) return str;
  const newStr = str.replace(
    /[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g,
    ''
  );

  return newStr;
};

export default removeANSI;

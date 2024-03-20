export const isEmailType = (value: string): boolean => {
  if (typeof value === 'string') {
    // Se verifica si el string es un email...
    const regularExpresion = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return regularExpresion.test(value);
  } else {
    return false;
  }
};

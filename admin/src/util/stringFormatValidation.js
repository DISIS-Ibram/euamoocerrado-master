class StringFormatValidation {
  static format(pattern, value) {
    if (typeof pattern !== 'string' || typeof value !== 'string') {
      return value;
    }

    let formatted = '';
    let valueIndex = 0;

    for (let i = 0; i < pattern.length; i++) {
      const patternChar = pattern[i];

      if (patternChar === '0') {
        // Espera um dígito na posição valueIndex
        if (value[valueIndex] && /\d/.test(value[valueIndex])) {
          formatted += value[valueIndex];
          valueIndex++;
        } else {
          // Se não tem dígito suficiente, coloca underline ou espaço
          formatted += '_';
        }
      } else if (patternChar === 'A') {
        // Exemplo: letra obrigatória, só para demonstrar
        if (value[valueIndex] && /[a-zA-Z]/.test(value[valueIndex])) {
          formatted += value[valueIndex];
          valueIndex++;
        } else {
          formatted += '_';
        }
      } else {
        // Qualquer outro caractere na máscara é literal, copia direto
        formatted += patternChar;
        // Não consome caractere do value, só insere literal
      }
    }

    return formatted;
  }
}

export default StringFormatValidation;

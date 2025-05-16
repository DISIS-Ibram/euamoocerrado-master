const validacao = {};


validacao.requerido = value => value ? undefined : 'Este campo não pode ser em branco.'

validacao.req = validacao.requerido

validacao.maxLength = max => value =>
  value && value.length > max ? `O campo não pode ter mais que ${max} caracteres` : undefined

validacao.maxLength15 = validacao.maxLength(15)

validacao.number = value => value && isNaN(Number(value)) ? 'Não é um numero válido' : undefined

validacao.minValue = min => value =>
  value && value < min ? `Precisa ter no mínimo ${min} caracteres` : undefined

validacao.minValue18 = validacao.minValue(18)

validacao.email = value => value && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value) ?
  'Formato de email email inválido' : undefined

validacao.isEmail = value => value && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value) ?
  false : true








export default validacao
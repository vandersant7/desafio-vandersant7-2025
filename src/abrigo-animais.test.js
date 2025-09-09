import { AbrigoAnimais } from './abrigo-animais'

describe('Abrigo de Animais', () => {
  test('Deve rejeitar animal inválido', () => {
    const resultado = new AbrigoAnimais().encontraPessoas(
      'CAIXA,RATO',
      'RATO,BOLA',
      'Lulu'
    )
    expect(resultado.erro).toBe('Animal inválido')
    expect(resultado.lista).toBeFalsy()
  })

  test('Deve encontrar pessoa para um animal', () => {
    const resultado = new AbrigoAnimais().encontraPessoas(
      'RATO,BOLA',
      'RATO,NOVELO',
      'Rex,Fofo'
    )
    expect(resultado.lista[0]).toBe('Fofo - abrigo')
    expect(resultado.lista[1]).toBe('Rex - pessoa 1')
    expect(resultado.lista.length).toBe(2)
    expect(resultado.erro).toBeFalsy()
  })

  test('Deve encontrar pessoa para um animal intercalando brinquedos', () => {
    const resultado = new AbrigoAnimais().encontraPessoas(
      'BOLA,LASER',
      'BOLA,NOVELO,RATO,LASER',
      'Mimi,Fofo,Rex,Bola'
    )

    expect(resultado.lista[0]).toBe('Bola - abrigo')
    expect(resultado.lista[1]).toBe('Fofo - pessoa 2')
    expect(resultado.lista[2]).toBe('Mimi - abrigo')
    expect(resultado.lista[3]).toBe('Rex - abrigo')
    expect(resultado.lista.length).toBe(4)
    expect(resultado.erro).toBeFalsy()
  })

  test('Deve rejeitar pessoa com brinquedos fora de ordem', () => {
    const resultado = new AbrigoAnimais().encontraPessoas(
      'BOLA,RATO',
      'LASER',
      'Rex'
    )
    expect(resultado.lista[0]).toBe('Rex - abrigo')
    expect(resultado.erro).toBeFalsy()
  })

  test('Deve rejeitar pessoa sem todos os brinquedos', () => {
    const resultado = new AbrigoAnimais().encontraPessoas(
      'RATO',
      'LASER',
      'Rex'
    )
    expect(resultado.lista[0]).toBe('Rex - abrigo')
    expect(resultado.erro).toBeFalsy()
  })

  test('Pessoa 1 não pode adotar após 3 animais', () => {
    const resultado = new AbrigoAnimais().encontraPessoas(
      'RATO,BOLA,LASER,CAIXA,NOVELO,SKATE',
      'CAIXA',
      'Rex,Mimi,Bebe,Bola'
    )
    expect(resultado.lista[0]).toBe('Bebe - pessoa 1')
    expect(resultado.lista[1]).toBe('Bola - abrigo') // Pessoa 1 já tem 3
    expect(resultado.lista[2]).toBe('Mimi - pessoa 1')
    expect(resultado.lista[3]).toBe('Rex - pessoa 1')
    expect(resultado.lista.length).toBe(4)
    expect(resultado.erro).toBeFalsy()
  })

});

describe('Abrigo de Animais - Testes adicionais', () => {
  const abrigo = new AbrigoAnimais();

  test('Brinquedo inválido', () => {
    const resultado = abrigo.encontraPessoas("CAIXA,RATO", "RATO,BOLINHA", "Rex");
    expect(resultado.erro).toBe("Brinquedo inválido");
    expect(resultado.lista).toBeFalsy();
  });

  test('Gato com duas pessoas aptas → vai para abrigo', () => {
    const resultado = abrigo.encontraPessoas("BOLA,LASER", "BOLA,LASER", "Mimi,Fofo");
    expect(resultado.lista).toContain("Mimi - abrigo");
    expect(resultado.lista).toContain("Fofo - abrigo");
  });

  test('Loco com companhia → só adota se houver outro animal', () => {
    const resultado = abrigo.encontraPessoas("RATO,BOLA", "RATO,NOVELO", "Rex,Loco");
    expect(resultado.lista).toContain("Rex - pessoa 1");
    expect(resultado.lista).toContain("Loco - abrigo");
  });

  test('Limite de 3 animais por pessoa', () => {
    const resultado = abrigo.encontraPessoas(
      "RATO,BOLA,CAIXA,NOVELO,LASER",
      "RATO,BOLA,CAIXA,NOVELO,LASER",
      "Rex,Bola,Bebe,Loco"
    );
    const pessoa1 = resultado.lista.filter(a => a.includes("pessoa 1"));
    const pessoa2 = resultado.lista.filter(a => a.includes("pessoa 2"));
    expect(pessoa1.length).toBeLessThanOrEqual(3);
    expect(pessoa2.length).toBeLessThanOrEqual(3);
  });
});

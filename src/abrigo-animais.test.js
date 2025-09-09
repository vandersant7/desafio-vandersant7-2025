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

  test('Deve limitar a adoção em 3 animais para a Pessoa 1', () => {
  // Cenário:
  // Pessoa 1 tem brinquedos para 4 animais.
  // Pessoa 2 não tem brinquedos relevantes para não criar conflito.
  // A ordem dos brinquedos da Pessoa 1 está correta para o "Bebe".
  
  const brinquedosPessoa1 = "LASER,RATO,BOLA,CAIXA,NOVELO";
  const brinquedosPessoa2 = "SKATE"; // Brinquedo irrelevante para este teste
  const animaisParaAdocao = "Rex,Bola,Bebe,Zero"; // 4 animais que a Pessoa 1 pode adotar

  const resultado = abrigo.encontraPessoas(
    brinquedosPessoa1,
    brinquedosPessoa2,
    animaisParaAdocao
  );

  // Verificações:
  // 1. Filtramos para ver quantos animais cada pessoa adotou.
  const adocoesPessoa1 = resultado.lista.filter(res => res.includes("pessoa 1"));
  const adocoesPessoa2 = resultado.lista.filter(res => res.includes("pessoa 2"));
  
  // 2. Verificamos qual animal foi para o abrigo por causa do limite.
  const zeroNoAbrigo = resultado.lista.find(res => res.includes("Zero - abrigo"));

  // Asserções (O que esperamos que aconteça):
  // Esperamos que a Pessoa 1 tenha adotado EXATAMENTE 3 animais.
  expect(adocoesPessoa1.length).toBe(3);
  
  // Esperamos que a Pessoa 2 não tenha adotado nenhum.
  expect(adocoesPessoa2.length).toBe(0);

  // Esperamos que o 4º animal (Zero) tenha ido para o abrigo, pois a Pessoa 1 atingiu o limite.
  expect(zeroNoAbrigo).toBe("Zero - abrigo");

  // Checagem extra para garantir que os 3 primeiros foram para a Pessoa 1.
  expect(resultado.lista).toContain("Rex - pessoa 1");
  expect(resultado.lista).toContain("Bola - pessoa 1");
  expect(resultado.lista).toContain("Bebe - pessoa 1");
});
});

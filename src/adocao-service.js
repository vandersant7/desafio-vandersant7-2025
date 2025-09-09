import { AnimaisRepository } from './animais-repository.js'

class AdocaoService {
  constructor() {
    this.repository = new AnimaisRepository()
  }

  processarAdocoes(brinquedosPessoa1, brinquedosPessoa2, animaisOrdem) {
    // Etapa 1: Validar e processar entradas
    const pessoa1 = this._processarBrinquedos(brinquedosPessoa1)
    const pessoa2 = this._processarBrinquedos(brinquedosPessoa2)
    const animais = this._processarAnimais(animaisOrdem)

    // Etapa 2: Determinar quem fica com cada animal
    const resultados = []
    const contadorAdocoes = { pessoa1: 0, pessoa2: 0 }

    // Usamos loop com índice para poder olhar os animais restantes (necessário para Loco)
    for (let i = 0; i < animais.length; i++) {
      const nomeAnimal = animais[i]
      const animal = this.repository.getAnimal(nomeAnimal)
      const restantes = animais.slice(i + 1)

      const destino = this._determinarDestino(
        animal,
        nomeAnimal,
        pessoa1,
        pessoa2,
        contadorAdocoes,
        restantes
      )

      resultados.push(`${nomeAnimal} - ${destino}`)

      // Verificação de segurança antes de incrementar
      if (destino === 'pessoa 1') {
        if (contadorAdocoes.pessoa1 >= 3) {
          throw new Error('Limite de adoções excedido para pessoa 1')
        }
        contadorAdocoes.pessoa1++
      }
      if (destino === 'pessoa 2') {
        if (contadorAdocoes.pessoa2 >= 3) {
          throw new Error('Limite de adoções excedido para pessoa 2')
        }
        contadorAdocoes.pessoa2++
      }
    }

    // Etapa 3: Retornar resultado ordenado alfabeticamente
    return { lista: resultados.sort() }
  }

  _processarBrinquedos(brinquedosStr) {
    if (!brinquedosStr || brinquedosStr.trim() === '') {
      return []
    }

    const brinquedos = brinquedosStr
      .split(',')
      .map((b) => b.trim().toUpperCase())

    // Validar se todos os brinquedos são válidos
    for (const brinquedo of brinquedos) {
      if (!this.repository.isBrinquedoValido(brinquedo)) {
        throw new Error('Brinquedo inválido')
      }
    }

    // Verificar duplicatas
    const brinquedosUnicos = new Set(brinquedos)
    if (brinquedosUnicos.size !== brinquedos.length) {
      throw new Error('Brinquedo inválido')
    }

    return brinquedos
  }

  _processarAnimais(animaisStr) {
    if (!animaisStr || animaisStr.trim() === '') {
      throw new Error('Animal inválido')
    }

    const animais = animaisStr.split(',').map((a) => a.trim())

    // Validar se todos os animais são válidos
    for (const animal of animais) {
      if (!this.repository.isAnimalValido(animal)) {
        throw new Error('Animal inválido')
      }
    }

    // Verificar duplicatas
    const animaisUnicos = new Set(animais)
    if (animaisUnicos.size !== animais.length) {
      throw new Error('Animal inválido')
    }

    return animais
  }

  _determinarDestino(animal, nomeAnimal, brinquedosPessoa1, brinquedosPessoa2, contadorAdocoes, restantes) {
    const pessoa1PodeAdotar = contadorAdocoes.pessoa1 < 3
    const pessoa2PodeAdotar = contadorAdocoes.pessoa2 < 3

    // Auxiliar: verifica se existe algum animal adotável entre os restantes para a pessoa
    const temAlgumAdotavelNosRestantes = (brinquedosPessoa, restantesAnimais) => {
      for (const nome of restantesAnimais) {
        // Removido o return automático para Loco - agora verifica corretamente
        const remAnimal = this.repository.getAnimal(nome)
        if (!remAnimal) continue
        if (this._temTodosBrinquedos(remAnimal.brinquedos, brinquedosPessoa, true)) return true
      }
      return false
    }

    // Caso especial: Loco — precisa de companhia (avaliada apenas nos animais restantes)
    if (nomeAnimal === 'Loco') {
      const pessoa1Qualificada = pessoa1PodeAdotar && temAlgumAdotavelNosRestantes(brinquedosPessoa1, restantes)
      const pessoa2Qualificada = pessoa2PodeAdotar && temAlgumAdotavelNosRestantes(brinquedosPessoa2, restantes)

      if (pessoa1Qualificada && pessoa2Qualificada) return 'abrigo'
      if (pessoa1Qualificada) return 'pessoa 1'
      if (pessoa2Qualificada) return 'pessoa 2'
      return 'abrigo'
    }

    // Para demais animais: verifica se a pessoa tem todos os brinquedos na ordem e se tem vaga
    const pessoa1Qualificada = this._temTodosBrinquedos(animal.brinquedos, brinquedosPessoa1, true) && pessoa1PodeAdotar
    const pessoa2Qualificada = this._temTodosBrinquedos(animal.brinquedos, brinquedosPessoa2, true) && pessoa2PodeAdotar

    // Regra dos gatos: se ambos atendem e é gato -> abrigo
    if (animal.tipo === 'gato' && pessoa1Qualificada && pessoa2Qualificada) return 'abrigo'

    if (pessoa1Qualificada && !pessoa2Qualificada) return 'pessoa 1'
    if (!pessoa1Qualificada && pessoa2Qualificada) return 'pessoa 2'

    if (pessoa1Qualificada && pessoa2Qualificada) {
      // desempata preferindo pessoa 1 se tiver vaga, senão pessoa2, senão abrigo
      if (contadorAdocoes.pessoa1 < 3) return 'pessoa 1'
      if (contadorAdocoes.pessoa2 < 3) return 'pessoa 2'
      return 'abrigo'
    }

    return 'abrigo'
  }

  _temTodosBrinquedos(
    brinquedosAnimal,
    brinquedosPessoa,
    verificarOrdem = true
  ) {
    if (!verificarOrdem) {
      // Para Loco com companhia, só precisa ter todos os brinquedos
      return brinquedosAnimal.every((brinquedo) =>
        brinquedosPessoa.includes(brinquedo)
      )
    }

    // Verificar se todos os brinquedos estão presentes na ordem correta
    let indicePessoa = 0

    for (const brinquedoAnimal of brinquedosAnimal) {
      // Procurar o brinquedo a partir da posição atual
      let encontrou = false
      for (let i = indicePessoa; i < brinquedosPessoa.length; i++) {
        if (brinquedosPessoa[i] === brinquedoAnimal) {
          indicePessoa = i + 1 // Próxima busca começa após esta posição
          encontrou = true
          break
        }
      }

      if (!encontrou) {
        return false // Não encontrou o brinquedo ou está fora de ordem
      }
    }

    return true
  }
}

export { AdocaoService as AdocaoService }
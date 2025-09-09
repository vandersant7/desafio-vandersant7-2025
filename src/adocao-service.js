import { AnimaisRepository } from './animais-repository.js'

class AdocaoService {
  constructor() {
    this.repository = new AnimaisRepository()
  }

  processarAdocoes(brinquedosPessoa1, brinquedosPessoa2, animaisOrdem) {
    
    const pessoa1 = this._processarBrinquedos(brinquedosPessoa1)
    const pessoa2 = this._processarBrinquedos(brinquedosPessoa2)
    const animais = this._processarAnimais(animaisOrdem)

    
    const resultados = []
    const contadorAdocoes = { pessoa1: 0, pessoa2: 0 }

    
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

    
    return { lista: resultados.sort() }
  }

  _processarBrinquedos(brinquedosStr) {
    if (!brinquedosStr || brinquedosStr.trim() === '') {
      return []
    }

    const brinquedos = brinquedosStr
      .split(',')
      .map((b) => b.trim().toUpperCase())

    
    for (const brinquedo of brinquedos) {
      if (!this.repository.isBrinquedoValido(brinquedo)) {
        throw new Error('Brinquedo inválido')
      }
    }

    
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

    
    for (const animal of animais) {
      if (!this.repository.isAnimalValido(animal)) {
        throw new Error('Animal inválido')
      }
    }

    
    const animaisUnicos = new Set(animais)
    if (animaisUnicos.size !== animais.length) {
      throw new Error('Animal inválido')
    }

    return animais
  }

  _determinarDestino(animal, nomeAnimal, brinquedosPessoa1, brinquedosPessoa2, contadorAdocoes) {
    
    const pessoa1Qualificada = 
      this._temTodosBrinquedos(animal.brinquedos, brinquedosPessoa1, true) && 
      contadorAdocoes.pessoa1 < 3;
      
    const pessoa2Qualificada = 
      this._temTodosBrinquedos(animal.brinquedos, brinquedosPessoa2, true) && 
      contadorAdocoes.pessoa2 < 3;

    

    
    
    if (pessoa1Qualificada && pessoa2Qualificada) {
      return 'abrigo';
    }

    
    if (pessoa1Qualificada) {
      return 'pessoa 1';
    }

    
    if (pessoa2Qualificada) {
      return 'pessoa 2';
    }

    
    
    return 'abrigo';
  }

  _temTodosBrinquedos(
    brinquedosAnimal,
    brinquedosPessoa,
    verificarOrdem = true
  ) {
    if (!verificarOrdem) {
      
      return brinquedosAnimal.every((brinquedo) =>
        brinquedosPessoa.includes(brinquedo)
      )
    }

    
    let indicePessoa = 0

    for (const brinquedoAnimal of brinquedosAnimal) {
      
      let encontrou = false
      for (let i = indicePessoa; i < brinquedosPessoa.length; i++) {
        if (brinquedosPessoa[i] === brinquedoAnimal) {
          indicePessoa = i + 1 
          encontrou = true
          break
        }
      }

      if (!encontrou) {
        return false 
      }
    }

    return true
  }
}

export { AdocaoService as AdocaoService }
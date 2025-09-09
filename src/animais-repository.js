class AnimaisRepository {
  constructor() {
    this.animais = {
      Rex: { tipo: 'cão', brinquedos: ['RATO', 'BOLA'] },
      Mimi: { tipo: 'gato', brinquedos: ['BOLA', 'LASER'] },
      Fofo: { tipo: 'gato', brinquedos: ['BOLA', 'RATO', 'LASER'] },
      Zero: { tipo: 'gato', brinquedos: ['RATO', 'BOLA'] },
      Bola: { tipo: 'cão', brinquedos: ['CAIXA', 'NOVELO'] },
      Bebe: { tipo: 'cão', brinquedos: ['LASER', 'RATO', 'BOLA'] },
      Loco: { tipo: 'jabuti', brinquedos: ['SKATE', 'RATO'] },
    }

    this.brinquedosValidos = [
      'RATO',
      'BOLA',
      'LASER',
      'CAIXA',
      'NOVELO',
      'SKATE',
    ]
  }

  getAnimais() {
    return this.animais
  }

  getAnimal(nome) {
    return this.animais[nome] || null
  }

  isAnimalValido(nome) {
    return nome in this.animais
  }

  getBrinquedosValidos() {
    return this.brinquedosValidos
  }

  isBrinquedoValido(brinquedo) {
    return this.brinquedosValidos.includes(brinquedo)
  }
}

export { AnimaisRepository as AnimaisRepository }

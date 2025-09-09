import { AdocaoService } from './adocao-service.js'

class AbrigoAnimais {
  constructor() {
    this.service = new AdocaoService()
  }

  encontraPessoas(brinquedosPessoa1, brinquedosPessoa2, ordemAnimais) {
    try {
      return this.service.processarAdocoes(
        brinquedosPessoa1,
        brinquedosPessoa2,
        ordemAnimais
      )
    } catch (error) {
      return { erro: error.message }
    }
  }
}

export { AbrigoAnimais as AbrigoAnimais }

const abrigo = new AbrigoAnimais()
console.log(abrigo.encontraPessoas('RATO,BOLA', 'RATO,NOVELO', 'Rex,Fofo'))
console.log(abrigo.encontraPessoas('CAIXA,RATO', 'RATO,BOLA', 'Lulu'))
console.log(
  abrigo.encontraPessoas(
    'BOLA,LASER',
    'BOLA,NOVELO,RATO,LASER',
    'Mimi,Fofo,Rex,Bola'
  )
)

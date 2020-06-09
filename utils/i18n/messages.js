const messages = [
  {
    english: {
      caseInformations: 'Statistics about',
      caseInformationsCity: 'City statistics from',
      caseInformationsState: 'State statistics from',
      updatedAt: 'updated at',
      confirmedLabel: 'Confirmed:',
      activeCases: 'Active:',
      deathsLabel: 'Deaths:',
      estimatedPopulation: 'Estimated population:',
      recoveredLabel: 'Recovered:',
      infoProvidedBy: 'Data provided by',
      ministryOfHealthAndWho: 'Brasil.io API',
      useMask: 'TAKE CARE, *WEAR MASK* AND *STAY HOME*!',
      about: 'Type *!about* to know more about the bot.',
      welcomeMessage:
        'Welcome to INFO-19, a chatbot created to spread statistics about *COVID-19* from various countries and states of Brazil. \n\nTo start, type a Brazil state or city starting with a *!(exclamation)* and if you need a full report from all Brazilian states, type *!all*. \n\nIf you need info from another country, type its name starting with a *!(exclamation)*. \nType *!about* to know more about the chatbot and *!invite* to invite me to a group.',
      errorMessage:
        'Sorry, an error happened or the place you typed is not in our database. We are working to fix.',
      notFound:
        'Sorry, I did not understand what you tried to do or I was not able to found your query.',
      aboutMessage:
        'This bot was developed by *César Nascimento(ncesar.com*) using the public API *covid19-brazil-api.now.sh* for countries and *brasil.io* for brazil states and cities. \n\nDo you wanna learn how to code(in pt-br)? Watch me on YouTube, *youtube.com/ncesar*. Wanna talk with me? *oi@ncesar.com*',
      timeOut:
        'Sorry, you have sent too many messages. Wait 10 seconds to send again.',
    },
  },
  {
    portuguese: {
      caseInformations: 'Informações de casos do local',
      caseInformationsCity: 'Informações de casos da cidade',
      caseInformationsState: 'Informações de casos do estado',
      updatedAt: 'atualizadas em',
      confirmedLabel: 'Confirmados:',
      activeCases: 'Ativos:',
      deathsLabel: 'Mortes:',
      estimatedPopulation: 'População estipulada:',
      recoveredLabel: 'Recuperados:',
      infoProvidedBy: 'Informações fornecidas por',
      ministryOfHealthAndWho: 'Brasil.io API',
      useMask: 'PREVINA-SE, *USE MÁSCARA* E *FIQUE EM CASA*!',
      about: 'Digite *!sobre* para saber mais sobre o bot.',
      welcomeMessage:
        'Bem-vindo ao INFO-19, um robô com objetivo de divulgar dados atualizados sobre o *COVID-19* de vários países e estados do Brasil. \n\nPara iniciar, digite o nome ou sigla de algum estado ou o nome de alguma cidade brasileira com um *!(exclamação)* na frente ou simplesmente digite *!brasil* para um relatório geral. \nSe você quiser um relatório de todos os estados do brasil, digite *!todos*. Se você deseja obter informações de um país estrangeiro, digite o nome dele sem acentos, com uma *!(exclamação)* no início e *seguindo o padrão inglês(!Uruguay e não Uruguai, !US e não Estados Unidos)*. \n\nDigite *!sobre* para saber mais informações do robô e *!convite* para me convidar para algum grupo.',
      errorMessage:
        'Desculpe, algum erro aconteceu ou este local não está no nosso banco de dados. Estamos trabalhando para consertar.',
      notFound:
        'Desculpe, não entendi o que você deseja ou não encontrei a palavra-chave que você pesquisou',
      aboutMessage:
        'Esse bot foi desenvolvido por *César Nascimento(ncesar.com*) usando a API pública *covid19-brazil-api.now.sh* para países estrangeiros e *brasil.io* para estados e cidades do Brasil. \n\nQuer aprender a programar? Me assista no YouTube, *youtube.com/ncesar*. Dúvidas, sugestões ou reclamações? *oi@ncesar.com*. *Ajude o bot a continuar no ar, doe qualquer valor pelo picpay para cesar.n*.',
      timeOut:
        'Desculpe mas você enviou muitas mensagens. Aguarde 10 segundos até enviar a próxima.',
    },
  },
];

module.exports = {
  messages,
};

const fs = require('fs');
const qrcode = require('qrcode-terminal');
const axios = require('axios');
const moment = require('moment');
const { Client } = require('whatsapp-web.js');
// const messages = require('./utils/i18n/messages'); TO-DO
// const countries = require('./utils/data/data');
// const states = require('./utils/data/data');

const SESSION_FILE_PATH = './session.json';
let sessionCfg;
if (fs.existsSync(SESSION_FILE_PATH)) {
  sessionCfg = require(SESSION_FILE_PATH);
}

const client = new Client({
  puppeteer: { headless: true },
  session: sessionCfg,
});
// You can use an existing session and avoid scanning a QR code by adding a "session" object to the client options.
// This object must include WABrowserId, WASecretBundle, WAToken1 and WAToken2.

client.initialize();

client.on('qr', (qr) => {
  // NOTE: This event will not be fired if a session is specified.
  console.log('QR RECEIVED', qr);
  qrcode.generate(qr, { small: true });
});

client.on('authenticated', (session) => {
  console.log('AUTHENTICATED', session);
  sessionCfg = session;
  fs.writeFile(SESSION_FILE_PATH, JSON.stringify(session), function (err) {
    if (err) {
      console.error(err);
    }
  });
});

client.on('auth_failure', (msg) => {
  // Fired if session restore was unsuccessfull
  console.error('AUTHENTICATION FAILURE', msg);
});

client.on('ready', () => {
  console.log('READY');
});

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
      ministryOfHealthAndWho: 'State Health Secretary',
      useMask: 'TAKE CARE, *WEAR MASK* AND *STAY HOME*!',
      about: 'Type *!about* to know more about the bot.',
      welcomeMessage:
        'Welcome to INFO-19, a chatbot created to spread statistics about *COVID-19* from various countries and states of Brazil. \n\nTo start, type starting with *!* a Brazilian state *e.g: !sc or !santa catarina* or city with its acronym in brackets if needed *e.g: !city Recife or !city Moreno(PE)* and if you need a full report from all Brazilian states, type *!all*. \n\nIf you need info from another country, type its name starting with a *!(exclamation)*. \nType *!about* to know more about the chatbot.\n\nYou can also add me into groups.',
      errorMessage:
        'Sorry, an error happened or the place you typed is not in our database. We are working to fix.',
      notFound:
        'Sorry, I did not understand what you tried to do or I was not able to found your query.',
      aboutMessage:
        'This bot was developed by *César Nascimento(ncesar.com*) using the public API *covid19-brazil-api.now.sh* for countries and *brasil.io* for brazil states and cities. \n\nDo you wanna learn how to code(in pt-br)? Watch me on YouTube, *youtube.com/ncesar*. Wanna talk with me? *oi@ncesar.com*',
      timeOut:
        'Sorry, you have sent too many messages. Wait 3 seconds to send again.',
      typeHello:
        'Type *hi* to receive more instructions about how to use the bot.',
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
      ministryOfHealthAndWho: 'Secretaria da Saúde do Estado',
      useMask: 'PREVINA-SE, *USE MÁSCARA* E *FIQUE EM CASA*!',
      about: 'Digite *!sobre* para saber mais sobre o bot.',
      welcomeMessage:
        'Bem-vindo ao INFO-19, um robô com objetivo de divulgar dados atualizados sobre o *COVID-19* de vários países, cidades e estados do Brasil. \n\nPara iniciar, digite o nome ou sigla de algum estado *ex: !sc ou !santa catarina* ou o nome de alguma cidade brasileira com a sigla do seu estado entre parênteses, caso seja necessária *ex: !cidade Recife ou !cidade Moreno(PE)* ou simplesmente digite *!brasil* para um relatório geral. \n\nSe você quiser um relatório de todos os estados do brasil, digite *!todos*. Se você deseja obter informações de um país estrangeiro, digite o nome dele sem acentos, com uma *!(exclamação)* no início e *seguindo o padrão inglês ex: !Uruguay e não Uruguai, !US e não Estados Unidos*. \n\nDigite *!sobre* para saber mais informações do robô. \n\nSabia que eu também posso ficar em grupos? É só me adicionar e enviar os comandos.',
      errorMessage:
        'Desculpe, algum erro aconteceu ou este local não está no nosso banco de dados. \n\nLembre-se: para cidades, digite o nome *SEMPRE INICIANDO COM EXCLAMAÇÃO*, respeitando as palavras maiusculas e minúsculas *(ex: Cabo de Santo Agostinho e não cabo de santo agostinho)* e se necessário a sigla, ex: *!cidade Recife ou !cidade Moreno(PE)*, para estados digite *!sp ou !são paulo*, para relatório geral do brasil, digite *!brasil*, para relatório de todos os estados, digite *!todos* e para países, digite o nome em inglês, ex: *!netherlands, !uruguay*.',
      notFound:
        'Desculpe, não entendi o que você deseja ou não encontrei a palavra-chave que você pesquisou. \n\nLembre-se: para cidades, digite o nome *SEMPRE INICIANDO COM EXCLAMAÇÃO* e se necessário a sigla, ex: *!cidade Recife ou !cidade Moreno(PE)*, para estados digite *!sp ou !são paulo*, para relatório geral do brasil, digite *!brasil*, para relatório de todos os estados, digite *!todos* e para países, digite o nome em inglês, ex: *!netherlands, !uruguay*.',
      aboutMessage:
        'Esse bot foi desenvolvido por *César Nascimento(ncesar.com*) usando a API pública *covid19-brazil-api.now.sh* para países estrangeiros e *brasil.io* para estados e cidades do Brasil. \n\nQuer aprender a programar? Me assista no YouTube, *youtube.com/ncesar*. Dúvidas, sugestões ou reclamações? *oi@ncesar.com*. *Ajude o bot a continuar no ar, doe qualquer valor pelo picpay para cesar.n*.',
      timeOut:
        'Desculpe mas você enviou muitas mensagens. Aguarde 3 segundos até enviar a próxima.',
      typeHello:
        'Digite *olá* para receber mais instruções sobre como utilizar o bot.',
    },
  },
];
const countries = [
  '!australia',
  '!austria',
  '!canada',
  '!china',
  '!denmark',
  '!finland',
  '!france',
  '!germany',
  '!iceland',
  '!ireland',
  '!italy',
  '!netherlands',
  '!norway',
  '!russia',
  '!sweden',
  '!switzerland',
  '!united kingdom',
  '!us',
  '!spain',
  '!mexico',
  '!chile',
  '!peru',
  '!colombia',
  '!japan',
  '!ukraine',
  '!afghanistan',
  '!albania',
  '!algeria',
  '!andorra',
  '!angola',
  '!antigua and barbuda',
  '!argentina',
  '!armenia',
  '!azerbaijan',
  '!bahamas',
  '!bahrain',
  '!bangladesh',
  '!barbados',
  '!belarus',
  '!belgium',
  '!belize',
  '!benin',
  '!bhutan',
  '!bolivia',
  '!bosnia and herzegovina',
  '!botswana',
  '!brunei',
  '!bulgaria',
  '!burkina faso',
  '!burma',
  '!burundi',
  '!cabo verde',
  '!cambodia',
  '!cameroon',
  '!central african republic',
  '!chad',
  '!comoros',
  '!costa rica',
  '!croatia',
  '!cuba',
  '!cyprus',
  '!czechia',
  '!diamond princess',
  '!djibouti',
  '!dominica',
  '!dominican republic',
  '!ecuador',
  '!egypt',
  '!el salvador',
  '!equatorial guinea',
  '!eritrea',
  '!estonia',
  '!eswatini',
  '!ethiopia',
  '!fiji',
  '!gabon',
  '!gambia',
  '!georgia',
  '!ghana',
  '!greece',
  '!grenada',
  '!guatemala',
  '!guinea',
  '!guinea-bissau',
  '!guyana',
  '!haiti',
  '!holy see',
  '!honduras',
  '!hungary',
  '!india',
  '!indonesia',
  '!iran',
  '!iraq',
  '!israel',
  '!jamaica',
  '!jordan',
  '!kazakhstan',
  '!kenya',
  '!korea, south',
  '!kosovo',
  '!kuwait',
  '!kyrgyzstan',
  '!laos',
  '!latvia',
  '!lebanon',
  '!lesotho',
  '!liberia',
  '!libya',
  '!liechtenstein',
  '!lithuania',
  '!luxembourg',
  '!ms zaandam',
  '!madagascar',
  '!malawi',
  '!malaysia',
  '!maldives',
  '!mali',
  '!malta',
  '!mauritania',
  '!Mauritius',
  '!moldova',
  '!monaco',
  '!mongolia',
  '!montenegro',
  '!morocco',
  '!mozambique',
  '!namibia',
  '!nepal',
  '!new zealand',
  '!nicaragua',
  '!niger',
  '!nigeria',
  '!north macedonia',
  '!oman',
  '!pakistan',
  '!panama',
  '!papua new guinea',
  '!paraguay',
  '!philippines',
  '!poland',
  '!portugal',
  '!qatar',
  '!romania',
  '!rwanda',
  '!saudi arabia',
  '!senegal',
  '!singapore',
  '!slovakia',
  '!slovenia',
  '!somalia',
  '!south africa',
  '!sri lanka',
  '!sudan',
  '!suriname',
  '!syria',
  '!tajikistan',
  '!tanzania',
  '!thailand',
  '!turkey',
  '!uganda',
  '!uruguay',
  '!venezuela',
  '!vietnam',
  '!zimbabwe',
  '!yemen',
];
const states = [
  '!ac',
  '!al',
  '!am',
  '!ap',
  '!ba',
  '!ce',
  '!df',
  '!es',
  '!go',
  '!ma',
  '!mt',
  '!ms',
  '!mg',
  '!pa',
  '!pb',
  '!pr',
  '!pe',
  '!pi',
  '!rj',
  '!rn',
  '!ro',
  '!rs',
  '!rr',
  '!sc',
  '!se',
  '!sp',
  '!to',
];

const sendSingleCountryInfo = (response, language, locale) => {
  moment.locale(locale);
  return `
  *-------- COVID-19 --------*
  ${language.caseInformations} *${response.country}* ${
    language.updatedAt
  } ${moment(response.updated_at).format('LLL')}

  ${language.confirmedLabel} *${Number(response.confirmed).toLocaleString(
    'pt-BR',
  )}*
  ${language.activeCases} *${Number(response.cases).toLocaleString('pt-BR')}*
  ${language.deathsLabel} *${Number(response.deaths).toLocaleString('pt-BR')}*
  ${language.recoveredLabel} *${Number(response.recovered).toLocaleString(
    'pt-BR',
  )}*
  ${language.infoProvidedBy} *${locale === 'pt-br' ? 'OMS' : 'WHO'}*

  ${language.useMask}
    
  ${language.about}
  
  ${language.typeHello}
  `;
};

const calculatePercentageData = (
  confirmedCases,
  deaths,
  actualDate,
  dayBeforeResponse,
  locale,
) => {
  moment.locale(locale);
  const dayBefore = new Date(new Date().setDate(new Date().getDate() - 2));
  if (moment(dayBefore).format('L') !== actualDate) {
    const confirmedPercentage = parseFloat(
      ((confirmedCases - dayBeforeResponse.confirmed) /
        dayBeforeResponse.confirmed) *
        100,
    ).toFixed(2);
    const deathsPercentage = parseFloat(
      ((deaths - dayBeforeResponse.deaths) / dayBeforeResponse.deaths) * 100,
    ).toFixed(2);
    return `
    ${
      confirmedPercentage > 0
        ? `A quantidade de *casos confirmados* 2 dias atrás *(${moment(
            dayBefore,
          ).format('L')})* era: *${dayBeforeResponse.confirmed.toLocaleString(
            'pt-br',
          )}*. No relatório disponibilizado na data *(${actualDate})* a quantidade é de: *${confirmedCases.toLocaleString(
            'pt-br',
          )}(+${(confirmedCases - dayBeforeResponse.confirmed).toLocaleString(
            'pt-br',
          )} novos casos)*. 
  Isso é um crescimento de *${confirmedPercentage}%* comparado ao dia anterior.`
        : `Não houve aumento de *casos confirmados* entre *${moment(
            dayBefore,
          ).format('L')}* e *${actualDate}* ou os dados ainda não foram atualizados.`
    }
 
  ${
    deathsPercentage > 0
      ? `A quantidade de *mortes* 2 dias atrás *(${moment(dayBefore).format(
          'L',
        )})* era: *${dayBeforeResponse.deaths.toLocaleString(
          'pt-br',
        )}*. No relatório disponibilizado na data *(${actualDate})* a quantidade é de: *${deaths.toLocaleString(
          'pt-br',
        )}(+${(deaths - dayBeforeResponse.deaths).toLocaleString(
          'pt-br',
        )} novas mortes)*. 
  Isso é um crescimento de *${deathsPercentage}%* comparado ao dia anterior.`
      : `Não houve aumento de *mortes* entre *${moment(dayBefore).format(
          'L',
        )}* e *${actualDate}* ou os dados ainda não foram atualizados.`
  }
  `;
  }
};

const sendSingleCityData = (response, language, locale, dayBeforeResponse) => {
  moment.locale(locale);
  return `
  *-------- COVID-19 --------*
  ${language.caseInformationsCity} *${response.city}(${response.state})* ${
    language.updatedAt
  } ${moment(response.date).format('L')}

  ${language.confirmedLabel} *${Number(response.confirmed).toLocaleString(
    'pt-BR',
  )}*
  ${language.deathsLabel} *${Number(response.deaths).toLocaleString('pt-BR')}*
  ${language.estimatedPopulation} *${Number(
    response.estimated_population_2019,
  ).toLocaleString('pt-BR')}*
  ${language.infoProvidedBy} *${language.ministryOfHealthAndWho}*
  ${calculatePercentageData(
    response.confirmed,
    response.deaths,
    moment(response.date).format('L'),
    dayBeforeResponse,
    locale,
  )}
  ${language.useMask}
  
  ${language.about}
  
  ${language.typeHello}
  `;
};

const sendSingleStateData = (response, language, locale, dayBeforeResponse) => {
  moment.locale(locale);
  return `
  *-------- COVID-19 --------*
  ${language.caseInformationsState} *${response.state}* ${
    language.updatedAt
  } ${moment(response.date).format('L')}
  
  ${language.confirmedLabel} *${Number(response.confirmed).toLocaleString(
    'pt-BR',
  )}*
  ${language.deathsLabel} *${Number(response.deaths).toLocaleString('pt-BR')}*
  ${language.estimatedPopulation} *${Number(
    response.estimated_population_2019,
  ).toLocaleString('pt-BR')}*
  ${language.infoProvidedBy} *${language.ministryOfHealthAndWho}*
  ${calculatePercentageData(
    response.confirmed,
    response.deaths,
    moment(response.date).format('L'),
    dayBeforeResponse,
    locale,
  )}
  ${language.useMask}
  
  ${language.about}
  
  ${language.typeHello}
  `;
};

const sendMultipleBrazilianStateInfo = (response, language, locale) => {
  moment.locale(locale);
  let result = '';
  response.map((response) => {
    result += `
    *-------- COVID-19 --------*
    ${language.caseInformationsState} *${response.state}* ${
      language.updatedAt
    } ${moment(response.date).format('L')}
    ${language.confirmedLabel} *${Number(response.confirmed).toLocaleString(
      'pt-BR',
    )}*
    ${language.deathsLabel} *${Number(response.deaths).toLocaleString('pt-BR')}*
    ${language.estimatedPopulation} *${Number(
      response.estimated_population_2019,
    ).toLocaleString('pt-BR')}*
    ${language.infoProvidedBy} *${language.ministryOfHealthAndWho}*
    ${language.typeHello}
    *--------------------------*
    `;
  });
  return result;
};

const sendBrazilData = (
  confirmed,
  deaths,
  date,
  language,
  locale,
  previousConfirmed,
  previousDeaths,
) => {
  const dayBeforeResponse = {
    confirmed: previousConfirmed,
    deaths: previousDeaths,
  };
  moment.locale(locale);
  return `
  *-------- COVID-19 --------*
  ${language.caseInformations} *Brasil* ${language.updatedAt} ${moment(
    date,
  ).format('L')}
  
  ${language.confirmedLabel} *${Number(confirmed).toLocaleString('pt-BR')}*
  ${language.deathsLabel} *${Number(deaths).toLocaleString('pt-BR')}*
  ${language.infoProvidedBy} *${language.ministryOfHealthAndWho}*
  ${calculatePercentageData(
    confirmed,
    deaths,
    moment(date).format('L'),
    dayBeforeResponse,
    locale,
  )}
  ${language.useMask}
  
  ${language.about}
  
  ${language.typeHello}
  `;
};

let cooldowns = {};

client.on('message', async (msg) => {
  // console.log('MESSAGE RECEIVED', msg);
  let language = messages[1].portuguese;
  let momentLocale = 'pt-br';
  if (!msg.from.startsWith(55)) {
    language = messages[0].english;
    momentLocale = 'en';
  }
  const fetchCountryData = async (param) => {
    try {
      let res = await axios.get(
        `https://covid19-brazil-api.now.sh/api/report/v1/${param}`,
      );
      msg.reply(sendSingleCountryInfo(res.data.data, language, momentLocale));
    } catch (error) {
      msg.reply(language.errorMessage);
    }
  };

  const fetchGeneralData = async (param, isCityOnly, isStateOnly, isBrazil) => {
    try {
      const dayBefore = new Date(new Date().setDate(new Date().getDate() - 2));
      const res = await axios.get(
        `https://brasil.io/api/dataset/covid19/caso/data?is_last=True&${param}`,
      );
      const getPreviousData = await axios.get(
        `https://brasil.io/api/dataset/covid19/caso/data?${param}&date=${moment(
          dayBefore,
        ).format('YYYY-MM-DD')}`,
      );
      if (isCityOnly) {
        msg.reply(
          sendSingleCityData(
            res.data.results[0],
            language,
            momentLocale,
            getPreviousData.data.results[0],
          ),
        );
      } else if (isStateOnly) {
        msg.reply(
          sendSingleStateData(
            res.data.results[0],
            language,
            momentLocale,
            getPreviousData.data.results[0],
          ),
        );
      } else if (isBrazil) {
        // TEMPORARY FIX FOR https://stackoverflow.com/questions/62274633/unhandledpromiserejectionwarning-when-using-reduce
        const confirmed = res.data.results.reduce(
          (prev, curr) => prev + curr.confirmed,
          0,
        );
        const deaths = res.data.results.reduce(
          (prev, curr) => prev + curr.deaths,
          0,
        );
        const date = res.data.results[20].date;
        const previousConfirmed = getPreviousData.data.results.reduce(
          (prev, curr) => prev + curr.confirmed,
          0,
        );
        const previousDeaths = getPreviousData.data.results.reduce(
          (prev, curr) => prev + curr.deaths,
          0,
        );
        msg.reply(
          sendBrazilData(
            confirmed,
            deaths,
            date,
            language,
            momentLocale,
            previousConfirmed,
            previousDeaths,
          ),
        );
      } else {
        msg.reply(
          sendMultipleBrazilianStateInfo(
            res.data.results,
            language,
            momentLocale,
          ),
        );
      }
    } catch (error) {
      msg.reply(language.errorMessage);
    }
  };

  const lowerCaseMsg = msg.body.toLowerCase();
  const stateAcronymsArray = states.includes(lowerCaseMsg);
  const countriesArray = countries.includes(lowerCaseMsg);

  const capitalize = (str, lower = false) =>
    (lower ? str.toLowerCase() : str).replace(/(?:^|\s|["'([{])+\S/g, (match) =>
      match.toUpperCase(),
    );

  const authorId = msg.author || msg.from;
  if (msg.body.startsWith('!')) {
    if (cooldowns[authorId] > new Date()) {
      msg.reply(language.timeOut);
    } else {
      if (countriesArray) {
        fetchCountryData(lowerCaseMsg.slice(1));
      } else if (lowerCaseMsg.startsWith('!cidade')) {
        // remover o uppercase em cada palavra e deixar so na primeira
        const placeOnly = msg.body.slice(8);
        const regExp = /\(([^)]+)\)/;
        const stateOnly =
          regExp.exec(placeOnly) !== null
            ? regExp.exec(placeOnly)[1].toUpperCase()
            : '';
        const capitalizedPlaceOnly = capitalize(placeOnly).replace(
          / *\([^)]*\) */g,
          '',
        );
        // shitty workaround since the api is not case-sensitive and i cant rely on the user to type exactly the capitalized city name
        const modifyWordsOptions = [' Dos ', ' Do ', ' De ', ' Da ', ' Das '];
        if (capitalizedPlaceOnly.includes(modifyWordsOptions[0])) {
          const removedUpperCase = capitalizedPlaceOnly.replace(
            modifyWordsOptions[0],
            ' dos ',
          );
          fetchGeneralData(`state=${stateOnly}&city=${removedUpperCase}`, true);
        } else if (capitalizedPlaceOnly.includes(modifyWordsOptions[1])) {
          const removedUpperCase = capitalizedPlaceOnly.replace(
            modifyWordsOptions[1],
            ' do ',
          );
          fetchGeneralData(`state=${stateOnly}&city=${removedUpperCase}`, true);
        } else if (capitalizedPlaceOnly.includes(modifyWordsOptions[2])) {
          const removedUpperCase = capitalizedPlaceOnly.replace(
            modifyWordsOptions[2],
            ' de ',
          );
          fetchGeneralData(`state=${stateOnly}&city=${removedUpperCase}`, true);
        } else if (capitalizedPlaceOnly.includes(modifyWordsOptions[3])) {
          const removedUpperCase = capitalizedPlaceOnly.replace(
            modifyWordsOptions[3],
            ' da ',
          );
          fetchGeneralData(`state=${stateOnly}&city=${removedUpperCase}`, true);
        } else if (capitalizedPlaceOnly.includes(modifyWordsOptions[4])) {
          const removedUpperCase = capitalizedPlaceOnly.replace(
            modifyWordsOptions[4],
            ' das ',
          );
          fetchGeneralData(`state=${stateOnly}&city=${removedUpperCase}`, true);
        } else {
          fetchGeneralData(
            `state=${stateOnly}&city=${capitalizedPlaceOnly}`,
            true,
          );
        }
      } else if (lowerCaseMsg.startsWith('!city')) {
        const placeOnly = msg.body.slice(6);
        const regExp = /\(([^)]+)\)/;
        const stateOnly =
          regExp.exec(placeOnly) !== null
            ? regExp.exec(placeOnly)[1].toUpperCase()
            : '';
        const capitalizedPlaceOnly = capitalize(placeOnly).replace(
          / *\([^)]*\) */g,
          '',
        );
        // shitty workaround since the api is case-sensitive and i cant rely on the user to type exactly the capitalized city name
        // modifyWordsOptions.some(function(curr, index, arr) { another option using some.
        //   if (curr === ' Dos ') {
        //       return true;
        //   }
        //   }); // returns true
        const modifyWordsOptions = [' Dos ', ' Do ', ' De ', ' Da ', ' Das '];
        if (capitalizedPlaceOnly.includes(modifyWordsOptions[0])) {
          const removedUpperCase = capitalizedPlaceOnly.replace(
            modifyWordsOptions[0],
            ' dos ',
          );
          fetchGeneralData(`state=${stateOnly}&city=${removedUpperCase}`, true);
        } else if (capitalizedPlaceOnly.includes(modifyWordsOptions[1])) {
          const removedUpperCase = capitalizedPlaceOnly.replace(
            modifyWordsOptions[1],
            ' do ',
          );
          fetchGeneralData(`state=${stateOnly}&city=${removedUpperCase}`, true);
        } else if (capitalizedPlaceOnly.includes(modifyWordsOptions[2])) {
          const removedUpperCase = capitalizedPlaceOnly.replace(
            modifyWordsOptions[2],
            ' de ',
          );
          fetchGeneralData(`state=${stateOnly}&city=${removedUpperCase}`, true);
        } else if (capitalizedPlaceOnly.includes(modifyWordsOptions[3])) {
          const removedUpperCase = capitalizedPlaceOnly.replace(
            modifyWordsOptions[3],
            ' da ',
          );
          fetchGeneralData(`state=${stateOnly}&city=${removedUpperCase}`, true);
        } else if (capitalizedPlaceOnly.includes(modifyWordsOptions[4])) {
          const removedUpperCase = capitalizedPlaceOnly.replace(
            modifyWordsOptions[4],
            ' das ',
          );
          fetchGeneralData(`state=${stateOnly}&city=${removedUpperCase}`, true);
        } else {
          fetchGeneralData(
            `state=${stateOnly}&city=${capitalizedPlaceOnly}`,
            true,
          );
        }
      } else if (lowerCaseMsg == '!todos' || lowerCaseMsg === '!all') {
        fetchGeneralData('place_type=state', false, false);
      } else if (stateAcronymsArray) {
        const formattedStateMessage = msg.body.slice(1).toUpperCase();
        fetchGeneralData(
          `state=${formattedStateMessage}&place_type=state`,
          false,
          true,
        );
      } else if (lowerCaseMsg === '!brasil' || lowerCaseMsg === '!brazil') {
        fetchGeneralData('place_type=state', false, false, true);
      } else if (lowerCaseMsg === '!acre' || lowerCaseMsg === '!acré') {
        fetchGeneralData('state=AC&place_type=state', false, true);
      } else if (lowerCaseMsg === '!alagoas') {
        fetchGeneralData('state=AL&place_type=state', false, true);
      } else if (lowerCaseMsg === '!amapá' || lowerCaseMsg === '!amapa') {
        fetchGeneralData('state=AP&place_type=state', false, true);
      } else if (lowerCaseMsg === '!amazonas') {
        fetchGeneralData('state=AM&place_type=state', false, true);
      } else if (lowerCaseMsg === '!bahia') {
        fetchGeneralData('state=BH&place_type=state', false, true);
      } else if (lowerCaseMsg === '!ceará' || lowerCaseMsg === '!ceara') {
        fetchGeneralData('state=CE&place_type=state', false, true);
      } else if (
        lowerCaseMsg === '!brasilia' ||
        lowerCaseMsg === '!brasília' ||
        lowerCaseMsg === '!distrito federal'
      ) {
        fetchGeneralData('state=DF&place_type=state', false, true);
      } else if (
        lowerCaseMsg === '!espírito santo' ||
        lowerCaseMsg === '!espirito santo'
      ) {
        fetchGeneralData('state=ES&place_type=state', false, true);
      } else if (lowerCaseMsg === '!goiás' || lowerCaseMsg === '!goias') {
        fetchGeneralData('state=GO&place_type=state', false, true);
      } else if (lowerCaseMsg === '!maranhão' || lowerCaseMsg === '!maranhao') {
        fetchGeneralData('state=MA&place_type=state', false, true);
      } else if (lowerCaseMsg === '!mato grosso') {
        fetchGeneralData('state=MT&place_type=state', false, true);
      } else if (lowerCaseMsg === '!mato grosso do sul') {
        fetchGeneralData('state=MS&place_type=state', false, true);
      } else if (lowerCaseMsg === '!minas gerais') {
        fetchGeneralData('state=MG&place_type=state', false, true);
      } else if (lowerCaseMsg === '!pará' || lowerCaseMsg === '!para') {
        fetchGeneralData('state=PA&place_type=state', false, true);
      } else if (lowerCaseMsg === '!paraíba' || lowerCaseMsg === '!paraiba') {
        fetchGeneralData('state=PB&place_type=state', false, true);
      } else if (lowerCaseMsg === '!paraná' || lowerCaseMsg === '!parana') {
        fetchGeneralData('state=PR&place_type=state', false, true);
      } else if (lowerCaseMsg === '!pernambuco') {
        fetchGeneralData('state=PE&place_type=state', false, true);
      } else if (lowerCaseMsg === '!piaui' || lowerCaseMsg === '!piauí') {
        fetchGeneralData('state=PI&place_type=state', false, true);
      } else if (lowerCaseMsg === '!rio de janeiro') {
        fetchGeneralData('state=RJ&place_type=state', false, true);
      } else if (lowerCaseMsg === '!rio grande do norte') {
        fetchGeneralData('state=RN&place_type=state', false, true);
      } else if (lowerCaseMsg === '!rio grande do sul') {
        fetchGeneralData('state=RS&place_type=state', false, true);
      } else if (lowerCaseMsg === '!rondônia' || lowerCaseMsg === '!rondonia') {
        fetchGeneralData('state=RO&place_type=state', false, true);
      } else if (lowerCaseMsg === '!roraima') {
        fetchGeneralData('state=RR&place_type=state', false, true);
      } else if (lowerCaseMsg === '!santa catarina') {
        fetchGeneralData('state=SC&place_type=state', false, true);
      } else if (
        lowerCaseMsg === '!são paulo' ||
        lowerCaseMsg === '!sao paulo'
      ) {
        fetchGeneralData('state=SP&place_type=state', false, true);
      } else if (lowerCaseMsg === '!sergipe') {
        fetchGeneralData('state=SE&place_type=state', false, true);
      } else if (lowerCaseMsg === '!tocantins') {
        fetchGeneralData('state=TO&place_type=state', false, true);
      } else if (lowerCaseMsg === '!sobre' || lowerCaseMsg === '!about') {
        msg.reply(language.aboutMessage);
      } else {
        msg.reply(language.notFound);
      }
    }
  } else if (
    lowerCaseMsg === 'oi' ||
    lowerCaseMsg === 'olá' ||
    lowerCaseMsg === 'ola' ||
    lowerCaseMsg === 'oi!' ||
    lowerCaseMsg === 'hi' ||
    lowerCaseMsg === '!ola' ||
    lowerCaseMsg === '!olá'
  ) {
    msg.reply(language.welcomeMessage);
  }

  let timeoutUntil = new Date();
  timeoutUntil.setSeconds(timeoutUntil.getSeconds() + 3); // wont be able to use for 10 seconds
  cooldowns[authorId] = timeoutUntil;
});

// client.on('change_battery', (batteryInfo) => {
//   // Battery percentage for attached device has changed
//   const { battery, plugged } = batteryInfo;
//   console.log(`Battery: ${battery}% - Charging? ${plugged}`);
// });

client.on('disconnected', (reason) => {
  console.log('Client was logged out', reason);
});

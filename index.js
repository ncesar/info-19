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
      ministryOfHealthAndWho: 'State Health Secretary(Brasil.io API)',
      useMask: 'TAKE CARE, *WEAR MASK* AND *STAY HOME*!',
      about: 'Type *!about* to know more about the bot.',
      welcomeMessage:
        'Welcome to INFO-19, a chatbot created to spread statistics about *COVID-19* from various countries and states of Brazil. \n\nTo start, type a Brazil state *e.g: !sc or !santa catarina)* or city with its acronym in brackets *(e.g: !city Recife(PE) or !city Moreno(PE)* and if you need a full report from all Brazilian states, type *!all*. \n\nIf you need info from another country, type its name starting with a *!(exclamation)*. \nType *!about* to know more about the chatbot.\n\nYou can also add me into groups.',
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
      ministryOfHealthAndWho: 'Secretaria da Saúde do Estado(Brasil.io API)',
      useMask: 'PREVINA-SE, *USE MÁSCARA* E *FIQUE EM CASA*!',
      about: 'Digite *!sobre* para saber mais sobre o bot.',
      welcomeMessage:
        'Bem-vindo ao INFO-19, um robô com objetivo de divulgar dados atualizados sobre o *COVID-19* de vários países e estados do Brasil. \n\nPara iniciar, digite o nome ou sigla de algum estado *ex: !sc ou !santa catarina* ou o nome de alguma cidade brasileira com a sigla do seu estado entre parênteses *ex: !cidade Recife(PE) ou !cidade Moreno(PE)* ou simplesmente digite *!brasil* para um relatório geral. \n\nSe você quiser um relatório de todos os estados do brasil, digite *!todos*. Se você deseja obter informações de um país estrangeiro, digite o nome dele sem acentos, com uma *!(exclamação)* no início e *seguindo o padrão inglês ex: !Uruguay e não Uruguai, !US e não Estados Unidos*. \n\nDigite *!sobre* para saber mais informações do robô. \n\nSabia que eu também posso ficar em grupos? É só me adicionar e enviar os comandos.',
      errorMessage:
        'Desculpe, algum erro aconteceu ou este local não está no nosso banco de dados. Lembre-se: para cidades, digite o nome e se necessário a sigla, ex: *!cidade Recife ou !cidade Moreno(PE)*, para estados digite *!sp ou !são paulo*, para relatório geral do brasil, digite *!brasil*, para relatório de todos os estados, digite *!todos* e para países, digite o nome em inglês, ex: *!netherlands, !uruguay*.',
      notFound:
        'Desculpe, não entendi o que você deseja ou não encontrei a palavra-chave que você pesquisou.',
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
    'pt-br',
  )}*
  ${language.activeCases} *${Number(response.cases).toLocaleString('pt-br')}*
  ${language.deathsLabel} *${Number(response.deaths).toLocaleString('pt-br')}*
  ${language.recoveredLabel} *${Number(response.recovered).toLocaleString(
    'pt-br',
  )}*
  ${language.infoProvidedBy} *${locale === 'pt-br' ? 'OMS' : 'WHO'}*

  ${language.useMask}
    
  ${language.about}
  
  ${language.typeHello}
  `;
};

const sendSingleCityData = (response, language, locale) => {
  moment.locale(locale);
  return `
  *-------- COVID-19 --------*
  ${language.caseInformationsCity} *${response.city}(${response.state})* ${
    language.updatedAt
  } ${moment(response.date).format('L')}

  ${language.confirmedLabel} *${Number(response.confirmed).toLocaleString(
    'pt-br',
  )}*
  ${language.deathsLabel} *${Number(response.deaths).toLocaleString('pt-br')}*
  ${language.estimatedPopulation} *${Number(
    response.estimated_population_2019,
  ).toLocaleString('pt-br')}*
  ${language.infoProvidedBy} *${language.ministryOfHealthAndWho}*
  
  ${language.useMask}
  
  ${language.about}
  
  ${language.typeHello}
  `;
};

const sendSingleStateData = (response, language, locale) => {
  moment.locale(locale);
  return `
  *-------- COVID-19 --------*
  ${language.caseInformationsState} *${response.state}* ${
    language.updatedAt
  } ${moment(response.date).format('L')}
  
  ${language.confirmedLabel} *${Number(response.confirmed).toLocaleString(
    'pt-br',
  )}*
  ${language.deathsLabel} *${Number(response.deaths).toLocaleString('pt-br')}*
  ${language.estimatedPopulation} *${Number(
    response.estimated_population_2019,
  ).toLocaleString('pt-br')}*
  ${language.infoProvidedBy} *${language.ministryOfHealthAndWho}*
  
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
      'pt-br',
    )}*
    ${language.deathsLabel} *${Number(response.deaths).toLocaleString('pt-br')}*
    ${language.estimatedPopulation} *${Number(
      response.estimated_population_2019,
    ).toLocaleString('pt-br')}*
    ${language.infoProvidedBy} *${language.ministryOfHealthAndWho}*
    ${language.typeHello}
    *--------------------------*
    `;
  });
  return result;
};

const sendBrazilData = (confirmed, deaths, date, language, locale) => {
  moment.locale(locale);
  return `
  *-------- COVID-19 --------*
  ${language.caseInformations} *Brasil* ${language.updatedAt} ${moment(
    date,
  ).format('L')}
  
  ${language.confirmedLabel} *${Number(confirmed).toLocaleString('pt-br')}*
  ${language.deathsLabel} *${Number(deaths).toLocaleString('pt-br')}*
  ${language.infoProvidedBy} *${language.ministryOfHealthAndWho}*
  
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
      let res = await axios.get(
        `https://brasil.io/api/dataset/covid19/caso/data?is_last=True&${param}`,
      );
      if (isCityOnly) {
        msg.reply(
          sendSingleCityData(res.data.results[0], language, momentLocale),
        );
      } else if (isStateOnly) {
        msg.reply(
          sendSingleStateData(res.data.results[0], language, momentLocale),
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
        msg.reply(
          sendBrazilData(confirmed, deaths, date, language, momentLocale),
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
  if (cooldowns[authorId] > new Date()) {
    msg.reply(language.timeOut);
  } else {
    if (msg.body.startsWith('!')) {
      if (countriesArray) {
        fetchCountryData(lowerCaseMsg.slice(1));
      } else if (lowerCaseMsg.startsWith('!cidade')) {
        const placeOnly = msg.body.slice(8);
        const regExp = /\(([^)]+)\)/;
        const stateOnly =
          regExp.exec(placeOnly) !== null
            ? regExp.exec(placeOnly)[1].toUpperCase()
            : '';
        fetchGeneralData(
          `state=${stateOnly}&city=${capitalize(placeOnly).replace(
            / *\([^)]*\) */g,
            '',
          )}`,
          true,
        );
      } else if (lowerCaseMsg.startsWith('!city')) {
        const placeOnly = msg.body.slice(6);
        const regExp = /\(([^)]+)\)/;
        const stateOnly =
          regExp.exec(placeOnly) !== null
            ? regExp.exec(placeOnly)[1].toUpperCase()
            : '';
        fetchGeneralData(
          `state=${stateOnly}&city=${capitalize(placeOnly).replace(
            / *\([^)]*\) */g,
            '',
          )}`,
          true,
        );
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
    } else if (
      lowerCaseMsg === 'oi' ||
      lowerCaseMsg === 'olá' ||
      lowerCaseMsg === 'ola' ||
      lowerCaseMsg === 'hi' ||
      lowerCaseMsg === '!ola' ||
      lowerCaseMsg === '!olá'
    ) {
      msg.reply(language.welcomeMessage);
    }
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

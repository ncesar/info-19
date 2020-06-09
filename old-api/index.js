const fs = require('fs');
const qrcode = require('qrcode-terminal');
const axios = require('axios');
const moment = require('moment');
const { Client } = require('whatsapp-web.js');

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

const countries = [
  'australia',
  'austria',
  'canada',
  'china',
  'denmark',
  'finland',
  'france',
  'germany',
  'iceland',
  'ireland',
  'italy',
  'netherlands',
  'norway',
  'russia',
  'sweden',
  'switzerland',
  'united kingdom',
  'us',
  'spain',
  'mexico',
  'chile',
  'brazil',
  'peru',
  'colombia',
  'japan',
  'ukraine',
  'afghanistan',
  'albania',
  'algeria',
  'andorra',
  'angola',
  'antigua and barbuda',
  'argentina',
  'armenia',
  'azerbaijan',
  'bahamas',
  'bahrain',
  'bangladesh',
  'barbados',
  'belarus',
  'belgium',
  'belize',
  'benin',
  'bhutan',
  'bolivia',
  'bosnia and herzegovina',
  'botswana',
  'brunei',
  'bulgaria',
  'burkina faso',
  'burma',
  'burundi',
  'cabo verde',
  'cambodia',
  'cameroon',
  'central african republic',
  'chad',
  'comoros',
  'costa rica',
  'croatia',
  'cuba',
  'cyprus',
  'czechia',
  'diamond princess',
  'djibouti',
  'dominica',
  'dominican republic',
  'ecuador',
  'egypt',
  'el salvador',
  'equatorial guinea',
  'eritrea',
  'estonia',
  'eswatini',
  'ethiopia',
  'fiji',
  'gabon',
  'gambia',
  'georgia',
  'ghana',
  'greece',
  'grenada',
  'guatemala',
  'guinea',
  'guinea-bissau',
  'guyana',
  'haiti',
  'holy see',
  'honduras',
  'hungary',
  'india',
  'indonesia',
  'iran',
  'iraq',
  'israel',
  'jamaica',
  'jordan',
  'kazakhstan',
  'kenya',
  'korea, south',
  'kosovo',
  'kuwait',
  'kyrgyzstan',
  'laos',
  'latvia',
  'lebanon',
  'lesotho',
  'liberia',
  'libya',
  'liechtenstein',
  'lithuania',
  'luxembourg',
  'ms zaandam',
  'madagascar',
  'malawi',
  'malaysia',
  'maldives',
  'mali',
  'malta',
  'mauritania',
  'Mauritius',
  'moldova',
  'monaco',
  'mongolia',
  'montenegro',
  'morocco',
  'mozambique',
  'namibia',
  'nepal',
  'new zealand',
  'nicaragua',
  'niger',
  'nigeria',
  'north macedonia',
  'oman',
  'pakistan',
  'panama',
  'papua new guinea',
  'paraguay',
  'philippines',
  'poland',
  'portugal',
  'qatar',
  'romania',
  'rwanda',
  'saudi arabia',
  'senegal',
  'singapore',
  'slovakia',
  'slovenia',
  'somalia',
  'south africa',
  'sri lanka',
  'sudan',
  'suriname',
  'syria',
  'tajikistan',
  'tanzania',
  'thailand',
  'turkey',
  'uganda',
  'uruguay',
  'venezuela',
  'vietnam',
  'zimbabwe',
  'yemen',
];
const states = [
  'ac',
  'al',
  'am',
  'ap',
  'ba',
  'ce',
  'df',
  'es',
  'go',
  'ma',
  'mt',
  'ms',
  'mg',
  'pa',
  'pb',
  'pr',
  'pe',
  'pi',
  'rj',
  'rn',
  'ro',
  'rs',
  'rr',
  'sc',
  'se',
  'sp',
  'to',
];

const messages = [
  {
    english: {
      caseInformations: 'Statistics about',
      updatedAt: 'updated at',
      confirmedLabel: 'Confirmed:',
      activeCases: 'Active:',
      deathsLabel: 'Deaths:',
      suspectedLabel: 'Suspected cases:',
      refusesLabel: 'Refused:',
      recoveredLabel: 'Recovered:',
      infoProvidedBy: 'Data provided by',
      ministryOfHealthAndWho: 'Ministry of Health and WHO',
      useMask: 'TAKE CARE, *WEAR MASK* AND *STAY HOME*!',
      about: 'Type *!about* to know more about the bot.',
      welcomeMessage:
        'Welcome to COVIDZap, a chatbot created to spread statistics about *COVID-19* from various countries and states of Brazil. To start, type a Brazil state and if you need a full report from all Brazilian states, type *all*. If you need info from another country, type its name. Type *about* to know more about the chatbot and *invite* to invite me to a group.',
      errorMessage:
        'Sorry, an error happened or the place you typed is not in our database. We are working to fix.',
      notFound:
        'Sorry, I did not understand what you tried or I was not able to found the country.',
      aboutMessage:
        'This bot was developed by César Nascimento(*ncesar.com*) using the public API *covid19-brazil-api.now.sh*. Do you wanna learn how to code(pt-br)? Watch me on YouTube, *youtube.com/ncesar*. Wanna talk with me? *oi@ncesar.com*',
    },
  },
  {
    portuguese: {
      caseInformations: 'Informações de casos do local',
      updatedAt: 'atualizadas em',
      confirmedLabel: 'Confirmados:',
      activeCases: 'Ativos:',
      deathsLabel: 'Mortes:',
      suspectedLabel: 'Suspeitos:',
      refusesLabel: 'Recusados:',
      recoveredLabel: 'Recuperados:',
      infoProvidedBy: 'Informações fornecidas por',
      ministryOfHealthAndWho: 'Ministério da Saúde e OMS',
      useMask: 'PREVINA-SE, *USE MÁSCARA* E *FIQUE EM CASA*!',
      about: 'Digite *!sobre* para saber mais sobre o bot.',
      welcomeMessage:
        'Bem-vindo ao COVIDZap, um robô com objetivo de divulgar e relacionadas ao *COVID-19* de vários países e estados do Brasil. Para iniciar, digite o nome ou sigla de algum estado brasileiro ou simplesmente digite *Brasil* e  se você quiser um relatório de todos os estados do brasil, digite *todos*. Se você deseja obter informações de um país estrangeiro, digite o nome dele sem acentos e *seguindo o padrão inglês(Uruguay e não Uruguai, US e não Estados Unidos)*. Digite *sobre* para saber mais informações do robô e *convite* para me convidar para algum grupo.',
      errorMessage:
        'Desculpe, algum erro aconteceu ou este local não está no nosso banco de dados. Estamos trabalhando para consertar.',
      notFound:
        'Desculpe, não entendi o que você deseja ou não encontrei o país selecionado.',
      aboutMessage:
        'Esse bot foi desenvolvido por César Nascimento(*ncesar.com*) usando a API pública *covid19-brazil-api.now.sh*. Quer aprender a programar? Me assista no YouTube, *youtube.com/ncesar*. Dúvidas, sugestões ou reclamações? *oi@ncesar.com*',
    },
  },
];

const returnCountryData = (response, language, locale) => {
  moment.locale(locale);
  return `
  *-------- COVID-19 --------*
  ${language.caseInformations} *${response.country}* ${
    language.updatedAt
  } ${moment(response.updated_at).format('LLL')}

  ${language.confirmedLabel} *${response.confirmed}*
  ${language.activeCases} *${response.cases}*
  ${language.deathsLabel} *${response.deaths}*
  ${language.recoveredLabel} *${response.recovered}*
  ${language.infoProvidedBy} *${
    response.country === 'Brazil' ? language.ministryOfHealthAndWho : 'WHO'
  }*

  ${language.useMask}
    
  ${language.about}
  
  `;
};

const sendSingleCountryInfo = (response, language, locale) => {
  return returnCountryData(response, language, locale);
};

const returnBrazilianStateData = (response, language, locale) => {
  moment.locale(locale);
  return `
  *-------- COVID-19 --------*
  ${language.caseInformations} *${response.state}(${response.uf})* ${
    language.updatedAt
  } ${moment(response.datetime).format('LLL')}
  
  ${language.activeCases} *${response.cases}*
  ${language.deathsLabel} *${response.deaths}*
  ${language.suspectedLabel} *${response.suspects}*
  ${language.refusesLabel} *${response.refuses}*
  ${language.infoProvidedBy} *${language.ministryOfHealthAndWho}*
  
  ${language.useMask}
  
  ${language.about}

  `;
};

const sendSingleBrazilianStateInfo = (response, language, locale) => {
  return returnBrazilianStateData(response, language, locale);
};

const sendMultipleBrazilianStateInfo = (response, language, locale) => {
  let result = '';
  response.map((response) => {
    result += returnBrazilianStateData(response, language, locale);
  });
  return result;
};

client.on('message', async (msg) => {
  console.log('MESSAGE RECEIVED', msg);
  let language = messages[0].english;
  let momentLocale = 'en';
  if (msg.from.startsWith(55)) {
    language = messages[1].portuguese;
    momentLocale = 'pt-br';
  }
  // msg.reply(language.welcomeMessage);
  const fetchData = async (param, isCountry, fetchAll) => {
    try {
      let res = await axios.get(
        `https://covid19-brazil-api.now.sh/api/report/v1/${param}`,
      );
      if (isCountry && !fetchAll) {
        msg.reply(sendSingleCountryInfo(res.data.data, language, momentLocale));
      } else if (fetchAll && !isCountry) {
        msg.reply(
          sendMultipleBrazilianStateInfo(res.data.data, language, momentLocale),
        );
      } else {
        msg.reply(
          sendSingleBrazilianStateInfo(res.data, language, momentLocale),
        );
      }
    } catch (error) {
      msg.reply(language.errorMessage);
      console.log(error, 'erro');
    }
  };

  const lowerCaseMsg = msg.body.toLowerCase();
  const stateAcronymsArray = states.includes(lowerCaseMsg);
  const countriesArray = countries.includes(lowerCaseMsg);

  if (countriesArray) {
    fetchData(lowerCaseMsg, true);
  } else if (lowerCaseMsg == 'todos' || lowerCaseMsg === 'all') {
    fetchData('', false, true);
  } else if (stateAcronymsArray) {
    fetchData(`brazil/uf/${lowerCaseMsg}`);
  } else if (lowerCaseMsg === 'brasil') {
    fetchData('brazil', true);
  } else if (lowerCaseMsg === 'acre' || lowerCaseMsg === 'acré') {
    fetchData('brazil/uf/ac');
  } else if (lowerCaseMsg === 'alagoas') {
    fetchData('brazil/uf/al');
  } else if (lowerCaseMsg === 'amapá' || lowerCaseMsg === 'amapa') {
    fetchData('brazil/uf/ap');
  } else if (lowerCaseMsg === 'amazonas') {
    fetchData('brazil/uf/am');
  } else if (lowerCaseMsg === 'bahia') {
    fetchData('brazil/uf/bh');
  } else if (lowerCaseMsg === 'ceará' || lowerCaseMsg === 'ceara') {
    fetchData('brazil/uf/ce');
  } else if (
    lowerCaseMsg === 'brasilia' ||
    lowerCaseMsg === 'brasília' ||
    lowerCaseMsg === 'distrito federal'
  ) {
    fetchData('brazil/uf/df');
  } else if (
    lowerCaseMsg === 'espírito santo' ||
    lowerCaseMsg === 'espirito santo'
  ) {
    fetchData('brazil/uf/es');
  } else if (lowerCaseMsg === 'goiás' || lowerCaseMsg === 'goias') {
    fetchData('brazil/uf/go');
  } else if (lowerCaseMsg === 'maranhão' || lowerCaseMsg === 'maranhao') {
    fetchData('brazil/uf/ma');
  } else if (lowerCaseMsg === 'mato grosso') {
    fetchData('brazil/uf/mt');
  } else if (lowerCaseMsg === 'mato grosso do sul') {
    fetchData('brazil/uf/ms');
  } else if (lowerCaseMsg === 'minas gerais') {
    fetchData('brazil/uf/mg');
  } else if (lowerCaseMsg === 'pará' || lowerCaseMsg === 'para') {
    fetchData('brazil/uf/pa');
  } else if (lowerCaseMsg === 'paraíba' || lowerCaseMsg === 'paraiba') {
    fetchData('brazil/uf/pb');
  } else if (lowerCaseMsg === 'paraná' || lowerCaseMsg === 'parana') {
    fetchData('brazil/uf/pr');
  } else if (lowerCaseMsg === 'pernambuco') {
    fetchData('brazil/uf/pe');
  } else if (lowerCaseMsg === 'piaui' || lowerCaseMsg === 'piauí') {
    fetchData('brazil/uf/pi');
  } else if (lowerCaseMsg === 'rio de janeiro') {
    fetchData('brazil/uf/rj');
  } else if (lowerCaseMsg === 'rio grande do norte') {
    fetchData('brazil/uf/rn');
  } else if (lowerCaseMsg === 'rio grande do sul') {
    fetchData('brazil/uf/rs');
  } else if (lowerCaseMsg === 'rondônia' || lowerCaseMsg === 'rondonia') {
    fetchData('brazil/uf/ro');
  } else if (lowerCaseMsg === 'roraima') {
    fetchData('brazil/uf/rr');
  } else if (lowerCaseMsg === 'santa catarina') {
    fetchData('brazil/uf/sc');
  } else if (lowerCaseMsg === 'são paulo' || lowerCaseMsg === 'sao paulo') {
    fetchData('brazil/uf/sp');
  } else if (lowerCaseMsg === 'sergipe') {
    fetchData('brazil/uf/se');
  } else if (lowerCaseMsg === 'tocantins') {
    fetchData('brazil/uf/to');
  } else if (lowerCaseMsg === 'sobre' || lowerCaseMsg === 'about') {
    msg.reply(language.aboutMessage);
  } else if (msg.body == '!leave') {
    // Leave the group
    let chat = await msg.getChat();
    if (chat.isGroup) {
      chat.leave();
    } else {
      msg.reply('This command can only be used in a group!');
    }
  } else if (msg.body.startsWith('!join ')) {
    // entra em grupo
    const inviteCode = msg.body.split(' ')[1];
    try {
      await client.acceptInvite(inviteCode);
      msg.reply('Joined the group!');
    } catch (e) {
      msg.reply('That invite code seems to be invalid.');
    }
  } else {
    // msg.reply(language.notFound);
  }
});

client.on('change_battery', (batteryInfo) => {
  // Battery percentage for attached device has changed
  const { battery, plugged } = batteryInfo;
  console.log(`Battery: ${battery}% - Charging? ${plugged}`);
});

client.on('disconnected', (reason) => {
  console.log('Client was logged out', reason);
});

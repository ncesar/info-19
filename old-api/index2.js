const qrcode = require('qrcode-terminal');
const fs = require('fs');
const axios = require('axios');
const { Client } = require('whatsapp-web.js');

// Resultados possíveis
const placeOptions = [
  'afghanistan',
  'albania',
  'algeria',
  'andorra',
  'angola',
  'anguilla',
  'argentina',
  'armenia',
  'aruba',
  'australia',
  'austria',
  'azerbaijan',
  'bahamas',
  'bahrain',
  'bangladesh',
  'barbados',
  'belarus',
  'belgium',
  'belize',
  'benin',
  'bermuda',
  'bhutan',
  'bolivia',
  'botswana',
  'brazil',
  'british virgin islands',
  'brunei',
  'bulgaria',
  'burkina faso',
  'burundi',
  'cambodia',
  'cameroon',
  'cape verde',
  'cayman islands',
  'chad',
  'chile',
  'china',
  'colombia',
  'congo',
  'cook islands',
  'costa rica',
  'cote d ivoire',
  'croatia',
  'cruise ship',
  'cuba',
  'cyprus',
  'czech republic',
  'denmark',
  'djibouti',
  'dominica',
  'dominican republic',
  'ecuador',
  'egypt',
  'el salvador',
  'equatorial guinea',
  'estonia',
  'ethiopia',
  'falkland islands',
  'faroe islands',
  'fiji',
  'finland',
  'france',
  'french polynesia',
  'french west indies',
  'gabon',
  'gambia',
  'georgia',
  'germany',
  'ghana',
  'gibraltar',
  'greece',
  'greenland',
  'grenada',
  'guam',
  'guatemala',
  'guernsey',
  'guinea',
  'guinea bissau',
  'guyana',
  'haiti',
  'honduras',
  'hong kong',
  'hungary',
  'iceland',
  'india',
  'indonesia',
  'iran',
  'iraq',
  'ireland',
  'isle of man',
  'israel',
  'italy',
  'jamaica',
  'japan',
  'jersey',
  'jordan',
  'kazakhstan',
  'kenya',
  'kuwait',
  'kyrgyz republic',
  'laos',
  'latvia',
  'lebanon',
  'lesotho',
  'liberia',
  'libya',
  'liechtenstein',
  'lithuania',
  'luxembourg',
  'macau',
  'macedonia',
  'madagascar',
  'malawi',
  'malaysia',
  'maldives',
  'mali',
  'malta',
  'mauritania',
  'mauritius',
  'mexico',
  'moldova',
  'monaco',
  'mongolia',
  'montenegro',
  'montserrat',
  'morocco',
  'mozambique',
  'namibia',
  'nepal',
  'netherlands',
  'netherlands antilles',
  'new caledonia',
  'new zealand',
  'nicaragua',
  'niger',
  'nigeria',
  'norway',
  'oman',
  'pakistan',
  'palestine',
  'panama',
  'papua new guinea',
  'paraguay',
  'peru',
  'philippines',
  'poland',
  'portugal',
  'puerto rico',
  'qatar',
  'reunion',
  'romania',
  'russia',
  'rwanda',
  'samoa',
  'san marino',
  'satellite',
  'saudi arabia',
  'senegal',
  'serbia',
  'seychelles',
  'sierra leone',
  'singapore',
  'slovakia',
  'slovenia',
  'south africa',
  'south korea',
  'spain',
  'sri lanka',
  'st lucia',
  'st vincent',
  'st. lucia',
  'sudan',
  'suriname',
  'swaziland',
  'sweden',
  'switzerland',
  'syria',
  'taiwan',
  'tajikistan',
  'tanzania',
  'thailand',
  "timor l'este",
  'togo',
  'tonga',
  'tunisia',
  'turkey',
  'turkmenistan',
  'uganda',
  'ukraine',
  'united arab emirates',
  'united kingdom',
  'uruguay',
  'uzbekistan',
  'venezuela',
  'vietnam',
  'virgin islands (us)',
  'yemen',
  'zambia',
  'zimbabwe',
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

// Path where the session data will be stored
const SESSION_FILE_PATH = './session.json';
let sessionData;

// Load the session data if it has been previously saved
if (fs.existsSync(SESSION_FILE_PATH)) {
  sessionData = require(SESSION_FILE_PATH);
}

// Use the saved values
const client = new Client({
  session: sessionData,
});

client.on('qr', (qr) => {
  qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
  console.log('Client is ready!');
});

const sendMessageBack = (response) => {
  return `Informações sobre ${response.country || response.uf} atualizadas em ${
    response.datetime || response.updated_at
  }
    Confirmados: ${response.confirmed}
    Mortes: ${response.deaths}
    Recuperados: ${response.recovered}
    Informações fornecidas por: ${
      response.country === 'Brazil' || response.uf
        ? 'Ministério da Saúde e OMS'
        : 'WHO'
    }`;
};

const fetchData = (param) => {
  axios
    .get(`https://covid19-brazil-api.now.sh/api/report/v1/${param}`)
    .then((response) => {
      response += response.data.data;
    })
    .catch((error) => {
      console.log(error);
      response += null;
    });
};

const getPlace = (place) => {
  if (place === 'acre' || place === 'acré') {
  } else if (place === 'alagoas') {
  } else if (place === 'amapá' || place === 'amapa') {
  } else if (place === 'amazonas') {
  } else if (place === 'bahia') {
  } else if (place === 'ceará' || place === 'ceara') {
  } else if (
    place === 'brasilia' ||
    place === 'brasília' ||
    place === 'distrito federal'
  ) {
  } else if (place === 'espírito santo' || place === 'espirito santo') {
  } else if (place === 'goiás' || place === 'goias') {
  } else if (place === 'maranhão' || place === 'maranhao') {
  } else if (place === 'mato grosso') {
  } else if (place === 'mato grosso do sul') {
  } else if (place === 'minas gerais') {
  } else if (place === 'pará' || place === 'para') {
  } else if (place === 'paraíba' || place === 'paraiba') {
  } else if (place === 'paraná' || place === 'parana') {
  } else if (place === 'pernambuco') {
  } else if (place === 'piaui' || place === 'piauí') {
  } else if (place === 'rio de janeiro') {
  } else if (place === 'rio grande do norte') {
  } else if (place === 'rio grande do sul') {
  } else if (place === 'rondônia' || place === 'rondonia') {
  } else if (place === 'roraima') {
  } else if (place === 'santa catarina') {
  } else if (place === 'são paulo' || place === 'sao paulo') {
  } else if (place === 'sergipe') {
  } else if (place === 'tocantins') {
  } else if (place === 'todos' || place === 'all') {
  }
};

client.on('message', async (message) => {
  console.log(message.body.toLowerCase());
  // message.reply(
  //   'Seja bem-vindo ao COVIDZap, um robô responsável em divulgar informações relacionadas ao COVID-19 de vários estados do Brasil e países de fora. Digite o nome de um país ou estado e eu te enviarei os dados. Exemplo: Brasil, PE, SC, Bahia, etc,... Se você quiser um relatório sobre todos os estados, digite *todos*. Digite *sobre* para saber como o robô funciona.',
  // );
  const messageFilter = placeOptions.includes(message.body.toLowerCase());
  if (messageFilter) {
    let res = await axios.get(
      `https://covid19-brazil-api.now.sh/api/report/v1/${message.body.toLowerCase()}`,
    );
    message.reply(sendMessageBack(res.data.data));
    //define a var that will change later
  }
});

client.on('authenticated', (session) => {
  sessionData = session;
  fs.writeFile(SESSION_FILE_PATH, JSON.stringify(session), function (err) {
    if (err) {
      console.error(err);
    }
  });
});

client.initialize();

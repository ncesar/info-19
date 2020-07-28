const fs = require('fs');
const qrcode = require('qrcode-terminal');
const axios = require('axios');
const moment = require('moment');
const { Client } = require('whatsapp-web.js');
const messages = require('./utils/i18n/messages');
const countries = require('./utils/data/countries');
const states = require('./utils/data/data');

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
  if (
    moment(dayBefore).format('L') !== actualDate &&
    typeof dayBeforeResponse !== undefined
  ) {
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
        ? `A quantidade de *casos confirmados* na data *${moment(
            dayBefore,
          ).format('L')}* era de: *${dayBeforeResponse.confirmed.toLocaleString(
            'pt-br',
          )}*. No relatório disponibilizado na data *${actualDate}* a quantidade é de: *${confirmedCases.toLocaleString(
            'pt-br',
          )}(+${(confirmedCases - dayBeforeResponse.confirmed).toLocaleString(
            'pt-br',
          )} novos casos)*. 
  Isso é um crescimento de *${confirmedPercentage}%* comparado ao dia anterior.`
        : `Não houve aumento de *casos confirmados* entre *${moment(
            dayBefore,
          ).format(
            'L',
          )}* e *${actualDate}* ou os dados ainda não foram atualizados.`
    }
 
  ${
    deathsPercentage > 0
      ? `A quantidade de *mortes* na data *${moment(dayBefore).format(
          'L',
        )}* era de: *${dayBeforeResponse.deaths.toLocaleString(
          'pt-br',
        )}*. No relatório disponibilizado na data *${actualDate}* a quantidade é de: *${deaths.toLocaleString(
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
  return '';
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
      const previousData =
        getPreviousData.data.length >= 0 ? getPreviousData.data.results[0] : '';
      if (isCityOnly) {
        msg.reply(
          sendSingleCityData(
            res.data.results[0],
            language,
            momentLocale,
            previousData,
          ),
        );
      } else if (isStateOnly) {
        msg.reply(
          sendSingleStateData(
            res.data.results[0],
            language,
            momentLocale,
            previousData,
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
  if (cooldowns[authorId] > new Date()) {
    msg.reply(language.timeOut);
  } else {
    if (countriesArray) {
      fetchCountryData(lowerCaseMsg.slice(1));
    } else if (
      lowerCaseMsg.startsWith('!cidade') ||
      lowerCaseMsg.startsWith('! cidade')
    ) {
      // remover o uppercase em cada palavra e deixar so na primeira
      let placeOnly;
      if (lowerCaseMsg.startsWith('! cidade')) {
        placeOnly = msg.body.slice(9);
      } else {
        placeOnly = msg.body.slice(8);
      }
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
      // without this, places like Cabo do Santo Agostinho will be capitalized to Cabo Do Santo Agostinho.
      // and it will not work. This will change Do to do and it will fetch the data correctly.
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
      let placeOnly;
      if (lowerCaseMsg.startsWith('! city')) {
        placeOnly = msg.body.slice(7);
      } else {
        placeOnly = msg.body.slice(6);
      }
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
    } else if (lowerCaseMsg === '!são paulo' || lowerCaseMsg === '!sao paulo') {
      fetchGeneralData('state=SP&place_type=state', false, true);
    } else if (lowerCaseMsg === '!sergipe') {
      fetchGeneralData('state=SE&place_type=state', false, true);
    } else if (lowerCaseMsg === '!tocantins') {
      fetchGeneralData('state=TO&place_type=state', false, true);
    } else if (lowerCaseMsg === '!sobre' || lowerCaseMsg === '!about') {
      msg.reply(language.aboutMessage);
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
    } else {
      msg.reply(language.notFound);
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

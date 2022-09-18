/*
В slack api создаем приложение, выбрав необходимую рабочую область.
Создаем incoming webhooks для руководителей, заносим urls в env.
*/

const express = require('express');
const app = express();
require('dotenv').config();
const dateformat = require('dateformat');
app.use(express.json());
const axios = require('axios');

function sendMessage() {
  app.post('http://test.test/?getbd', async (req, res) => {
    const obj = await res.json();

    const date = new Date();
    const convertedDate = dateformat(date, 'DD.MM.YYYY'); // npm i dateformate

    // поиск даты в списке сотрудников:

    function traverse(o, date) {
      let i;
      for (let k in o) {
        i = o[k];
        if (typeof i === 'string' && date === i) {
          return o;
        } else if (typeof i === 'object') {
          return traverse(i, date);
        }
      }
    }

    function takeRukovoditel() {
      for (const key in obj) {
        if (traverse(obj, convertedDate)) {
          return key;
        }
      }
    }

    try {
      if (takeRukovoditel()) {
        // отправляем сообщение в слак
        const name = traverse(obj['rukovoditel1'], '21.11.2021').name;

        axios.post(process.env.takeRukovoditel(), {
          text: `Сегодня День Рождения у  ${name} ! `,
        });
      }
    } catch (err) {
      console.log(err);
    }
  });
}

setInterval(sendMessage, 86400000);

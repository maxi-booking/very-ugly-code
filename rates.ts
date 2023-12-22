/*
 * Необходимо создать сервис, который будет получать курс евро к рублю
 * из различных источников.
 *
 *   1. Источники для получения курса:
 *   https://www.cbr-xml-daily.ru/daily_utf8.xml
 *   https://www.cbr-xml-daily.ru/daily_json.js
 *   предполагается, что список может быть расширен.
 *   2. Должен быть задан порядок опроса источников.
 *   3. В случае, если источник недоступен, необходимо переключиться на
 *      прием данных с другого источника.
 *   4. Список источников может быть расширен в будущем.
 *
 *  Что по вашему мнению плохо в текущей реализации и
 *  как можно было бы это улучшить/отрефакторить.
 *  Новый код писать не нужно, достаточно коротко описать проблемы
 *  текущего кода и способы их решения.
 *  Важно продемонстрировать понимание и возможность применения принципов ООП.
 **/

import { XMLParser } from 'fast-xml-parser';

class Curs_Valut {

    istochniki: string[];

    constructor() {
        this.istochniki = [
            "https://www.cbr-xml-daily.ru/daily_json.js",
            "https://www.cbr-xml-daily.ru/daily_utf8.xml",
        ];
    }

    async get() {
        for (let i of this.istochniki) {
            try {
                const response = await fetch(i);
                if (response.ok) {
                    const text = await response.text();
                    try {
                        const data = JSON.parse(text);
                        if (data.Valute.EUR) {
                            console.log(data.Valute.EUR.Value);
                            break;
                        }
                    } catch (error) {
                        // If it's not JSON, try parsing it as XML
                        const parser = new XMLParser();
                        const xml = parser.parse(text);
                        if (xml.ValCurs) {
                            for (let i of xml.ValCurs.Valute) {
                                if (i.CharCode == "EUR") {
                                    console.log(i.Value);
                                    break;
                                }
                            }
                        }
                    }
                }
            } catch (error) {
                console.error("Error:", error);
            }
        }
    }
}

const curs = new Curs_Valut();
curs.get();
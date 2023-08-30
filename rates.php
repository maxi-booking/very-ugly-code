<?php

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
 *  Новый код писать не нужно, достаточно описать проблемы
 *  текущего кода и способы их решения.
 *  Важно продемонстрировать понимание и возможность применения принципов ООП.
 **/

class Curs_Valut {

    public $istochniki;

    function __construct() {
        $this->istochniki = array(
            "https://www.cbr-xml-daily.ru/daily_json.js",
            "https://www.cbr-xml-daily.ru/daily_utf8.xml",
        );
    }

    function get() {
        foreach ($this->istochniki as $i) {
            $response = @file_get_contents($i);
            if ($response) {
                $xml = @simplexml_load_string($response);
                if ($xml) {
                    // var_dump($xml);
                    foreach ($xml->{'Valute'} as $k => $v) {
                        if ((string) $v->CharCode == "EUR") {
                            echo (string) $v->Value;
                            break;
                        };
                    }
                }
                $Json = @json_decode($response, true);
                if ($Json) {
                    echo $Json["Valute"]['EUR']["Value"];
                    break;
                }
            }
        }
    }
};

$curs = new Curs_Valut();
$curs->get();
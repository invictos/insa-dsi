import { env } from "process";
import dotenv from 'dotenv';

dotenv.config()

export const SECRETS = {
    'username': env.USERNAME,
    'password': env.PASSWORD
}

export const REGEXS: {[key: string]: RegExp} = {
    COMPUTER_LIST : new RegExp('<tr class="danger"><td><a href="(.*?)">(.*?)<\/a><\/td><td>(.*?)<\/td><td>(.*?)<\/td><td>(.*?)<\/td><td>(.*?)<\/td><td>(.*?)<\/td><td><acronym title="demarrer la machine"><a href="(.*?)"><span class="glyphicon glyphicon-play"><\/span><\/a><\/acronym><\/td><\/tr>', 'g'),
    LT: new RegExp('<input type="hidden" name="lt" value="(.*?)" \/>')
}
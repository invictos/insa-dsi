import dotenv from 'dotenv';
import { getRootPath } from './common.js';

dotenv.config({
    path: getRootPath() + '.env'
})

export const SECRETS = {
    'username': process.env.USERNAME,
    'password': process.env.PASSWORD
}

export const REGEXS: { [key: string]: RegExp } = {
    COMPUTER_LIST: new RegExp('<tr class="(.*?)"><td><a href="(.*?)">(.*?)<\/a><\/td><td>(.*?)<\/td><td>(.*?)<\/td><td>(.*?)<\/td><td>(.*?)<\/td><td>(.*?)<\/td><td>(.*?)<\/td><\/tr>', 'g'),
    EXECUTION: new RegExp('<input type="hidden" name="execution" value="(.*?)"\/>')
}
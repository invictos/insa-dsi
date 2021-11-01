import dotenv from 'dotenv';

dotenv.config()

export const SECRETS = {
    'username': process.env.USERNAME,
    'password': process.env.PASSWORD
}

export const REGEXS: { [key: string]: RegExp } = {
    COMPUTER_LIST: new RegExp('<tr class="(.*?)"><td><a href="(.*?)">(.*?)<\/a><\/td><td>(.*?)<\/td><td>(.*?)<\/td><td>(.*?)<\/td><td>(.*?)<\/td><td>(.*?)<\/td><td>(.*?)<\/td><\/tr>', 'g'),
    LT: new RegExp('<input type="hidden" name="lt" value="(.*?)" \/>')
}
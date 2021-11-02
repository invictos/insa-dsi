# insa-reveil-ts

Interface pour le site de la DSI

>https://dsi.insa-rouen.fr/salles/

Permets de démarrer les ordinateurs et d'obtenir leur status

## Setup
Pour fonctionner, le script nécessite des variables d'environnement. L'utilisation d'un fichier .env est possible.

```bash
#Environnement variables // .env file
USERNAME=<DSI Username>
PASSWORD=<DSI Password>
```

## API.js
```typescript
//Available API:
async function connect(logCredentials : boolean = false): Promise<void>
async function startComputer(computer_id: number): Promise<void>
async function updateComputer(computer_id: number): Promise<void>
async function updateAndStartRooms(room_ids: number[], ratio_online: number): Promise<number>
async function updateAndStartRoom(room_id: number, ratio_online: number): Promise<number>
async function updateRooms(room_ids: number[]): Promise<void>
async function updateRoom(room_id: number): Promise<void>
async function getComputersByRooms(room_ids: number[]): Promise<Computer[]>
async function getComputersByRoom(room_id: number): Promise<Computer[]>
```

## Usage

### script
```typescript
//Example
await DSI.connect();
const started = await DSI.updateAndStartRooms([8, 9], 1);
```

```typescript
//Computer object
interface Computer {
    id: number
    id_dsi: string
    online: boolean
    os: string
    os_date: string
    salle: string
    users: number
}
```

### cli.js
```bash
#CLI Usage, with alias insaDSI -> node cli.js
antoine:antoine/apps/insa-reveil-ts/(main)$ insaDSI status 8
💻 🔴 asi-mahr211-01.insa-rouen.fr
💻 🟢 asi-mahr211-02.insa-rouen.fr
💻 🟢 asi-mahr211-03.insa-rouen.fr
💻 🔴 asi-mahr211-04.insa-rouen.fr
💻 🟢 asi-mahr211-05.insa-rouen.fr
💻 🔴 asi-mahr211-06.insa-rouen.fr
💻 🔴 asi-mahr211-07.insa-rouen.fr
💻 🔴 asi-mahr211-08.insa-rouen.fr
💻 🔴 asi-mahr211-09.insa-rouen.fr
💻 🔴 asi-mahr211-10.insa-rouen.fr
💻 🔴 asi-mahr211-11.insa-rouen.fr
💻 🟢 asi-mahr211-12.insa-rouen.fr
💻 🔴 asi-mahr211-13.insa-rouen.fr
💻 🔴 asi-mahr211-14.insa-rouen.fr
```
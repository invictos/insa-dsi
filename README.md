# insa-reveil-ts

Interface pour le site de la DSI

>https://dsi.insa-rouen.fr/salles/

Permets de démarrer les ordinateurs   
Actuellement, le script maintient $ 1/3 $ des ordinateurs allumés de 6 à 23 heures, dans les salles ITI (MAHR211 & MAHR213)

Pour fonctionner, le script nécessite des variables d'environnement. L'utilisation d'un fichier .env est possible.

```bash
#Environnement variables // .env file
USERNAME=<DSI Username>
PASSWORD=<DSI Password>
```

```typescript
//Available API:
async function connect(logCredentials : boolean = false): Promise<void>
async function startComputer(computer_id: number): Promise<void>
async function updateComputer(computer_id: number): Promise<void>
async function updateAndStartRooms(room_ids: number[], ratio_online: number): Promise<number>
async function updateAndStartRoom(room_id: number, ratio_online: number): Promise<number>
async function getComputersByRooms(room_ids: number[]): Promise<Computer[]>
async function getComputersByRoom(room_id: number): Promise<Computer[]>
```


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
/* eslint-disable no-console */

// Helper script to download cover images for all games in the DB

import { existsSync } from 'fs'
import { readFile, writeFile } from 'fs/promises'
import { dirname, join } from 'path'
import sqlJs from 'sql.js'
import { fileURLToPath } from 'url'

const filePath = fileURLToPath(import.meta.url)
const __dirname = dirname(filePath)
const publicDir = join(__dirname, '..', 'public')

async function getTitles() {
  const SQL = await sqlJs()
  const dbData = await readFile(join(publicDir, 'WineGame.db'))
  const uInt8Array = new Uint8Array(dbData)
  const db = new SQL.Database(uInt8Array)
  const queryResult = db.exec('SELECT * FROM games ORDER BY 3')
  const games = queryResult.at(0)?.values ?? []
  return new Set(games.map((game) => game[2] as string))
}

async function downloadImage(url: string, path: string) {
  const res = await fetch(url)
  const buf = await res.arrayBuffer()
  return writeFile(path, Buffer.from(buf))
}

async function fetchImages(gameTitles: Set<string>) {
  const imageWriters: Promise<unknown>[] = []
  for (const title of gameTitles) {
    const imagePath = join(publicDir, 'gameImages', `${title}.png`)
    if (existsSync(imagePath)) continue

    console.log('Fetching URL for', title)
    fetch(`https://steamgrid.usebottles.com/api/search/${title}`)
      .then((res) => res.json())
      .then((url) => imageWriters.push(downloadImage(url as string, imagePath)))
      .catch(console.error)
  }
  await Promise.allSettled(imageWriters)
}

await fetchImages(await getTitles())

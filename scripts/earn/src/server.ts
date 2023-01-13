import timeout from 'connect-timeout'
import express from 'express'

import { execute as incentives } from './incentives.js'
import { execute as pools } from './pools.js'
import { execute as volume } from './volume.js'

const app = express()

app.use(timeout('600s'))

app.get('/', async (req, res) => {
  const target = (req.query.target as string).toLowerCase()
  try {
    switch (target) {
      case 'pools':
        await pools()
        res.sendStatus(200)
        break
      case 'incentives':
        await incentives()
        res.sendStatus(200)
        break
      case 'volume':
        await volume()
        res.sendStatus(200)
        break
      default:
        res.sendStatus(400).send('Not a valid target')
        break;
    }
  } catch (err) {
    res.status(500).send(err)
    process.exit(1)
  }
  finally {
    process.exit(0)
  }
})

app.listen(8080)
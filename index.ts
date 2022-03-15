// #region 'Importing and config stuff'
import express from 'express'
import cors from 'cors'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import 'dotenv/config'

const app = express()
app.use(cors())
app.use(express.json())

const prisma = new PrismaClient({ log: ['query', 'info', 'warn', 'error'] })
// #endregion

// #region 'Helper functions'
function createToken (id: number) {
  // @ts-ignore
  return jwt.sign({ id: id }, process.env.MY_SECRET, { expiresIn: '5h' })
}

async function getUserFromToken (token: string) {
  
  // @ts-ignore
  const decodedData = jwt.verify(token, process.env.MY_SECRET)
  
  // @ts-ignore
  const user = await prisma.user.findUnique({ where: { id: decodedData.id } })
  return user

}
// #endregion

// #region 'Auth End Points'
app.post('/login', async (req, res) => {

  const { email, password } = req.body

  try {

    const user = await prisma.user.findUnique({ where: { email: email } })
    
    // @ts-ignore
    const passwordMatches = bcrypt.compareSync(password, user.password)

    if (user && passwordMatches) {
      res.send({ user, token: createToken(user.id) })
    } 
    
    else {
      throw Error('ERROR')
    }

  } 
  
  catch (err) {
    res.status(400).send({ error: 'User/password invalid.' })
  }

})

app.get('/validate', async (req, res) => {

  const token = req.headers.authorization

  try {
    // @ts-ignore
    const user = await getUserFromToken(token)
    res.send(user)
  } 
  
  catch (err) {
    // @ts-ignore
    res.status(400).send({ error: err.message })
  }

})
// #endregion

// #region 'Tables End Points'

// #region 'users endpoints'
app.get('/users', async (req, res) => {

  try {
    const users = await prisma.user.findMany({ include: { transactions: true, photos: true } })
    res.send(users)
  }

  catch(error) {
    //@ts-ignore
    res.status(400).send(`<pre>${error.message}</pre>`)
  }

})

app.get('/users/:id', async (req, res) => {

  const idParam = Number(req.params.id)

  try {

    const user = await prisma.user.findFirst({
      where: { id: idParam },
      include: { transactions: true, photos: true }
    })

    if (user) {
      res.send(user)
    } 
    
    else {
      res.status(404).send({ error: 'User not found.' })
    }

  }

  catch(error) {
    //@ts-ignore
    res.status(400).send(`<prev>${error.message}</prev>`)
  }

})

app.post('/users', async (req, res) => {
    
  const { firstName, lastName, userName, email, password, amount } = req.body

  try {

    // generate a hash also salts the password with 8 symbols from their password
    const hashedPassword = bcrypt.hashSync(password, 8)

    const newUser = {
      firstName: firstName,
      lastName: lastName,
      userName: userName, 
      email: email,
      password: hashedPassword,
      amount: amount
    }

    const userCheck = await prisma.user.findFirst({ where: { email: newUser.email } })
    
    if (userCheck) {
      res.status(404).send({ error: 'User has an already registered email try different email.' })
    }

    else {

      try {
        const createdUser = await prisma.user.create({data: newUser})
        res.send({ createdUser, token: createToken(createdUser.id) })
      }

      catch(error) {
        //@ts-ignore
        res.status(400).send(`<prev>${error.message}</prev>`)
      }

    }

  }

  catch(error) {
    //@ts-ignore
    res.status(400).send(`<prev>${error.message}</prev>`)
  }

})

app.delete('/users/:id', async (req, res) => {

  const idParam = req.params.id

  try {

    const user = await prisma.user.findFirst({
      where: {
        id: Number(idParam)
      }
    })

    if (user) {

      await prisma.user.delete({ 
        where: { id: Number(idParam) }
      })

      res.send({ message: 'user deleted.' })

    }

    else {
      res.status(404).send({ error: 'user not found.' })
    }

  }

  catch(error) {
    //@ts-ignore
    res.status(400).send(`<prev>${error.message}</prev>`)
  }

})

app.patch('/users/:id', async (req, res) => {

  const idParam = req.params.id;
  const { firstName, lastName, userName, email, password, amount } = req.body

  const userData = {
    firstName: firstName,
    lastName: lastName,
    userName: userName, 
    email: email,
    password: password,
    amount: amount
  }

  try {

    const user = await prisma.user.update({
      where: {
        id: Number(idParam),
      },
      data: userData
    })

    res.send(user)

  } 
  
  catch(error) {
    res.status(404).send({message: error})
  }

})
// #endregion

// #region 'transactions endpoints'
app.get('/transactions', async (req, res) => {

  try {
    const transactions = await prisma.transaction.findMany({ include: { user: true } })
    res.send(transactions)
  }

  catch(error) {
    //@ts-ignore
    res.status(400).send(`<pre>${error.message}</pre>`)
  }

})

app.get('/transactions/:id', async (req, res) => {

  const idParam = Number(req.params.id)

  try {

    const transaction = await prisma.transaction.findFirst({
      where: { id: idParam },
      include: { user: true }
    })

    if (transaction) {
      res.send(transaction)
    } 
    
    else {
      res.status(404).send({ error: 'transaction not found.' })
    }

  }

  catch(error) {
    //@ts-ignore
    res.status(400).send(`<prev>${error.message}</prev>`)
  }

})

app.post('/transactions', async (req, res) => {
    
  const { amountUsed, dateCreated, userId } = req.body
  
  const newTransaction = {
    amountUsed: amountUsed,
    dateCreated: dateCreated, 
    userId: userId
  }

  try {
    const createdTransaction = await prisma.transaction.create({data: newTransaction})
    res.send(createdTransaction)
  }

  catch(error) {
    //@ts-ignore
    res.status(400).send(`<prev>${error.message}</prev>`)
  }

})

app.delete('/transactions/:id', async (req, res) => {

  const idParam = req.params.id

  try {

    const transaction = await prisma.transaction.findFirst({
      where: {
        id: Number(idParam)
      }
    })

    if (transaction) {

      await prisma.transaction.delete({ 
        where: { id: Number(idParam) }
      })

      res.send({ message: 'transaction deleted.' })

    }

    else {
      res.status(404).send({ error: 'transaction not found.' })
    }

  }

  catch(error) {
    //@ts-ignore
    res.status(400).send(`<prev>${error.message}</prev>`)
  }

})

app.patch('/transactions/:id', async (req, res) => {

  const idParam = req.params.id;
  const { amountUsed, dateCreated, userId } = req.body

  const newTransaction = {
    amountUsed: amountUsed,
    dateCreated: dateCreated, 
    userId: userId
  }

  try {

    const transaction = await prisma.transaction.update({
      where: {
        id: Number(idParam),
      },
      data: newTransaction
    })

    res.send(transaction)

  } 
  
  catch(error) {
    res.status(404).send({message: error})
  }

})
// #endregion

// #region 'photos endpoints'
app.get('/photos', async (req, res) => {

  try {
    const photos = await prisma.photo.findMany({ include: { user: true } })
    res.send(photos)
  }

  catch(error) {
    //@ts-ignore
    res.status(400).send(`<pre>${error.message}</pre>`)
  }

})

app.get('/photos/:id', async (req, res) => {

  const token = req.headers.authorization

  try {

    // @ts-ignore
    const user = await getUserFromToken(token)
    // @ts-ignore
    const photos = await prisma.photo.findMany({ where: { userId: user.id }, inlcude: { user: true } })
    res.send(photos)

  } 
  
  catch (err) {
    // @ts-ignore
    res.status(400).send({ error: err.message })
  }

  // signed in ??? if they have a valid token, yes!
  // if the token is valid, we know they are signed in
  // and who they are

})

app.delete('/photos/:id', async (req, res) => {

  const token = req.headers.authorization || ''
  const id = Number(req.params.id)

  try {

    // check that they are signed in
    const user = await getUserFromToken(token)

    // check if the picture belongs to them
    const photo = await prisma.photo.findUnique({ where: { id } })

    if (photo?.userId === user?.id) {
      // if it does: delete it
      await prisma.photo.delete({ where: { id } })
      res.send({ message: 'Photo successfully deleted.' })
    } 
    
    else {
      // if it does not: tell them they are not authorised
      res
        .status(401)
        .send({ error: 'You are not authorised to do delete this photo.' })
    }

  } 
  
  catch (err) {
    // @ts-ignore
    res.status(400).send({ error: err.message })
  }

})

app.post('/photos', async (req, res) => {

  const token = req.headers.authorization || ''
  const { imageUrl, title } = req.body

  try {

    const user = await getUserFromToken(token)

    const photo = await prisma.photo.create({
      data: {
        imageUrl,
        title,
        // @ts-ignore
        userId: user.id
      }
    })

    res.send(photo)

  } 
  
  catch (err) {
    // @ts-ignore
    res.status(400).send({ error: err.message })
  }

})

app.patch('/photos/:id', async (req, res) => {

  const idParam = Number(req.params.id)
  const token = req.headers.authorization || ''
  const { imageUrl, title } = req.body

  try {

    const user = await getUserFromToken(token)

    const photo = await prisma.photo.update({
      where: {
        id: idParam
      },
      data: {
        imageUrl,
        title,
        // @ts-ignore
        userId: user.id
      }
    })

    res.send(photo)

  } 
  
  catch (err) {
    // @ts-ignore
    res.status(400).send({ error: err.message })
  }

})
// #endregion

// #endregion

app.listen(4000, () => {
  console.log(`Server up: http://localhost:4000`)
})
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error']
})

const users = [
  {
    id: 1,
    firstName: "Person",
    lastName: "Number1",
    userName: "personNumber1",
    email: 'person1@email.com',
    password: "12345",
    amount: 55.65
  },
  {
    id: 2,
    firstName: "Person",
    lastName: "Number2",
    userName: "personNumber2",
    email: 'person2@email.com',
    password: "12345",
    amount: 25.65
  },
  {
    id: 3,
    firstName: "Person",
    lastName: "Number3",
    userName: "personNumber3",
    email: 'person3@email.com',
    password: "12345",
    amount: 15.65
  }
]

const transactions = [
  {
    id: 1,
    amountUsed: 16.5,
    dateCreated: "2020-03-19T14:21:00+02:00",
    userId: 1,
  },
  {
    id: 2,
    amountUsed: 27.5,
    dateCreated: "2022-01-12T14:21:00+02:00",
    userId: 1
  },
  {
    id: 3,
    amountUsed: 29.5,
    dateCreated: "2017-01-19T14:21:00+02:00",
    userId: 3
  },
  {
    id: 4,
    amountUsed: 5.35,    
    dateCreated: "2021-03-19T14:21:00+02:00",
    userId: 3  
  }
]

const photos = [
  {
    id: 1,
    imageUrl: "eieiojejioe",
    title: "cat",
    userId: 1,
  },
  {
    id: 2,
    imageUrl: "eieiojejioeee",
    title: "cating",
    userId: 1
  },
  {
    id: 3,
    imageUrl: "eieiojejioeee",
    title: "cat",
    userId: 3
  },
  {
    id: 4,
    imageUrl: "fefefeffefe",
    title: "catoppofjpojff",
    userId: 3  
  }
]

async function createStuff () {

  await prisma.transaction.deleteMany()
  await prisma.user.deleteMany()
  await prisma.photo.deleteMany()

  for (const user of users) {
    await prisma.user.create({ data: user })
  }

  for (const photo of photos) {
    await prisma.photo.create({ data: photo })
  }

  for (const transaction of transactions) {
    await prisma.transaction.create({ data: transaction })
  }

}

createStuff()
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error']
})

const users = [
  {
    id: 1,
    firstName: "Person",
    lastName: "Number1",
    fullName: "personNumber1",
    email: 'person1@email.com',
    password: bcrypt.hashSync("jurgen12345", 8),
    amountInAccount: 55.65
  },
  {
    id: 2,
    firstName: "Person",
    lastName: "Number2",
    fullName: "personNumber2",
    email: 'person2@email.com',
    password: bcrypt.hashSync("bajan12345", 8),
    amountInAccount: 25.65
  },
  {
    id: 3,
    firstName: "Person",
    lastName: "Number3",
    fullName: "personNumber3",
    email: 'person3@email.com',
    password: bcrypt.hashSync("jurgen123456", 8),
    amountInAccount: 15.65
  }
]

const transactions = [
  {
    id: 1,
    amount: 16.5,
    dateCreated: "2020-03-19T14:21:00+02:00",
    currency: "euro",
    receiverOrSender: "eren1",
    completedAt: "may 2021",
    isPositive: true,
    userId: 1
  },
  {
    id: 2,
    amount: 27.5,
    dateCreated: "2022-01-12T14:21:00+02:00",
    currency: "dollar",
    receiverOrSender: "eren2",
    completedAt: "may 2022",
    isPositive: false,
    userId: 3
  },
  {
    id: 3,
    amount: 29.5,
    dateCreated: "2017-01-19T14:21:00+02:00",
    currency: "euro",
    receiverOrSender: "eren3",
    completedAt: "may 2024",
    isPositive: true,
    userId: 1
  },
  {
    id: 4,
    amount: 5.35,    
    dateCreated: "2021-03-19T14:21:00+02:00",
    currency: "euro",
    receiverOrSender: "eren4",
    completedAt: "june 2021",
    isPositive: true,
    userId: 2 
  }
]

const photos = [
  {
    id: 1,
    imageUrl: "https://www.destinationmansfield.com/wp-content/uploads/2021/05/soccer-ball.jpg",
    title: "soccer",
    userId: 1,
  },
  {
    id: 2,
    imageUrl: "https://hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/dog-puppy-on-garden-royalty-free-image-1586966191.jpg?crop=1.00xw:0.669xh;0,0.190xh&resize=980:*",
    title: "dog",
    userId: 1
  },
  {
    id: 3,
    imageUrl: "https://icatcare.org/app/uploads/2018/07/Thinking-of-getting-a-cat.png",
    title: "cat",
    userId: 3
  },
  {
    id: 4,
    imageUrl: "https://m.media-amazon.com/images/I/81bBIDU8BVL._AC_UX522_.jpg",
    title: "baseball hat",
    userId: 3  
  }
]

async function createStuff () {

  await prisma.transaction.deleteMany()
  await prisma.photo.deleteMany()
  await prisma.user.deleteMany()

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
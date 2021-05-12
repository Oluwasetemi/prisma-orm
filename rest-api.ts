import { Prisma, PrismaClient } from '@prisma/client';
import express from 'express';

const app = express();
app.use(express.json());

const prisma = new PrismaClient();

app.post(`/signup`, async (req, res) => {
  const { name, email, posts } = req.body
  console.log(name, email)

  const postData = posts?.map((post: Prisma.PostCreateInput) => {
    return { title: post?.title, content: post?.content }
  })

  const result = await prisma.user.create({
    data: {
      name,
      email,
      posts: {
        create: postData
      }
    },
  })
  res.json(result)
})

app.post(`/post`, async (req, res) => {
  const { title, content, authorEmail } = req.body
  const result = await prisma.post.create({
    data: {
      title,
      content,
      author: { connect: { email: authorEmail } },
    },
  })
  res.json(result)
})

app.put('/post/:id/views', async (req, res) => {
  const { id } = req.params

  try {
    const post = await prisma.post.update({
      where: { id: Number(id) },
      data: {
        viewCount: {
          increment: 1
        }
      }
    })

    res.json(post)
  } catch (error) {
    res.json({ error: `Post with ID ${id} does not exist in the database` })
  }


})

app.put('/publish/:id', async (req, res) => {
  const { id } = req.params

  try {
    const postData = await prisma.post.findUnique({
      where: { id: Number(id) },
      select: {
        published: true
      }
    })

    const updatedPost = await prisma.post.update({
      where: { id: Number(id) || undefined },
      data: { published: !postData?.published },
    })
    res.json(updatedPost)
  } catch (error) {
    res.json({ error: `Post with ID ${id} does not exist in the database` })
  }

})

app.delete(`/post/:id`, async (req, res) => {
  const { id } = req.params
  const post = await prisma.post.delete({
    where: {
      id: Number(id),
    },
  })
  res.json(post)
})

app.get('/users', async (req, res) => {
  const users = await prisma.user.findMany()
  res.json(users)
})

app.get('/posts', async (req, res) => {
  const posts = await prisma.post.findMany()
  res.json(posts)
})

app.get('/profiles', async (req, res) => {
  const profiles = await prisma.profile.findMany()
  res.json(profiles)
})

app.get('/user/:id/drafts', async (req, res) => {
  const { id } = req.params

  const drafts = await prisma.user.findUnique({
    where: {
      id: Number(id),
    }
  }).posts({
    where: { published: false }
  })

  res.json(drafts)
})

app.get(`/post/:id`, async (req, res) => {
  const { id }: { id?: number } = req.params

  const post = await prisma.post.findUnique({
    where: { id: Number(id) },
  })
  res.json(post)
})

app.get('/feed', async (req, res) => {

  const { searchString, skip, take, orderBy } = req.query

  const or: Prisma.PostWhereInput = searchString ? {
    OR: [
      { title: { contains: searchString as string } },
      { content: { contains: searchString as string } },
    ],
  } : {}

  const posts = await prisma.post.findMany({
    where: {
      published: true,
      ...or
    },
    include: { author: true },
    take: Number(take) || undefined,
    skip: Number(skip) || undefined,
    orderBy: {
      updatedAt: orderBy as Prisma.SortOrder
    },
  })

  res.json(posts)
})

app.get('/user/:id/profile', async (req, res) => {
  const { id } = req.params;
  const profile = await prisma.user.findUnique({ where: { id: Number(id) }, include: {profile: true} })
  res.json(profile)
})

app.post('/user/:id/profile', async (req, res) => {
  const { id } = req.params
  const { bio } = req.body

  const profile = await prisma.profile.create({
    data: {
      bio,
      user: {
        connect: {
          id: Number(id)
        }
      }
    }
  })

  res.json(profile)
})

app.listen(3000, () => console.log('listening at http://localhost:3000'));

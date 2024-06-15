import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { Hono } from "hono";
import { verify } from "hono/jwt";
import { createBlogInput, updateBlogInput } from "@juscode/medium-common";

export const blogRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    SECRET_KEY: string;
  };
  Variables: {
    userId: string;
  };
}>();

// extract the userid from it
// pass it from the m/w to actual route handler

blogRouter.use("/*", async (c, next) => {
  const authHeader = c.req.header("authorization") || "";
  
  try {
    const user = await verify(authHeader, c.env.SECRET_KEY);
    if (user) {
      c.set("userId", user.id);
      await next();
    } else {
      c.status(403);
      return c.json({
        message: "You are not logged in",
      });
    }
  } catch (error) {
    c.status(403);
      return c.json({
        message: "You are not logged in",
      });
  }
});



blogRouter.post("/", async (c) => {
  const body = await c.req.json();

  const { success } = createBlogInput.safeParse(body);
  if(!success){
    c.status(411);
    return c.json({
      message: "Inputs are not correct"
    })
  }

  const authorId = c.get("userId");

  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate()); // only after this .$extends(withAccelerate) prisma will be able to talk to the database

  const blog = await prisma.post.create({
    data: {
      title: body.title,
      content: body.content,
      authorId: authorId,
    },
  });

  return c.json({
    id: blog.id,
  });
});




blogRouter.put("/", async (c) => {
  const body = await c.req.json();
  const { success } = updateBlogInput.safeParse(body);
  if(!success){
    c.status(411);
    return c.json({
      message: "Inputs are not correct"
    })
  }


  const authorId = c.get("userId");
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate()); // only after this .$extends(withAccelerate) prisma will be able to talk to the database

  try {
    const blog = await prisma.post.update({
      where: {
        id: body.id,
        authorId: authorId,
      },
      data: {
        title: body.title,
        content: body.content,
      },
    });

    return c.json({
      id: blog.id,
      message: "post/blog updated",
    });
  } catch (e) {
    // console.log(e);
    c.status(403);
    c.text("Error occured while updating post");
  }
});


// Todo : add pagination to this endpoint for return 10 blogs per page or on scrolling down it gets more
blogRouter.get("/bulk", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate()); // only after this .$extends(withAccelerate) prisma will be able to talk to the database

  try {
    const blogs = await prisma.post.findMany({
      select:{
        content: true,
        title: true,
        id: true,
        author: {
          select: {
            name: true
          }
        }
      }
    });
    
    return c.json({ blogs });
  } catch (error) {
    console.error(error);
    c.status(500)
    return c.json({ error: "An error occurred while fetching the blogs" });
  }
});



blogRouter.get("/:id", async (c) => {
  const id = c.req.param("id");
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate()); // only after this .$extends(withAccelerate) prisma will be able to talk to the database

  try {
    const blog = await prisma.post.findFirst({
      where: {
        id: id,
      },
      select: {
        id: true,
        title: true,
        content: true,
        author: {
          select: {
            name: true
          }
        }
      }
    });

    return c.json({
      blog
    });
  } catch (e) {
    c.status(411);
    return c.json({
      message: "Error while fetching blog post",
    });
  }
});



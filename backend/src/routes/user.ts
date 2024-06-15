import { Hono } from "hono";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { decode, sign, verify } from "hono/jwt";
import { signupInput, signinInput } from "@juscode/medium-common";

export const userRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    SECRET_KEY: string;
  };
}>();

userRouter.post("/signup", async (c) => {
  // The body user is sending you must be sanitized
  const body = await c.req.json();
  const { success } = signupInput.safeParse(body);
  if (!success) {
    c.status(411);
    return c.json({
      message: "Inputs not correct",
    });
  }
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate()); // only after this .$extends(withAccelerate) prisma will be able to talk to the database

  try {
    const user = await prisma.user.create({
      data: {
        email: body.email,
        password: body.password,
      },
    });

    const jwt = await sign(
      {
        id: user.id,
      },
      c.env.SECRET_KEY
    );

    return c.text(jwt);
  } catch (e) {
    console.log(e);
    c.status(411);
    return c.text("Email already exist");
  }
});

userRouter.post("signin", async (c) => {
  const body = await c.req.json();

  const { success } = signinInput.safeParse(body);
  if (!success) {
    c.status(411);
    return c.json({
      message: "Inputs are not correct",
    });
  }

  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate()); // only after this .$extends(withAccelerate) prisma will be able to talk to the database

  try {
    const user = await prisma.user.findFirst({
      where: {
        email: body.email,
        password: body.password,
      },
    });

    if (!user) {
      c.status(403);
      return c.text("Invalid User");
    }

    const jwt = await sign(
      {
        id: user.id,
      },
      c.env.SECRET_KEY
    );

    return c.text(jwt);
  } catch (e) {
    console.log(e);
    c.status(411);
    return c.text("Email already exist");
  }
});

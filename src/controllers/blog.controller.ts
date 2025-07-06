import { Request, Response } from 'express';
import { prisma } from '../utils/prisma';

export const createBlog = async (req: Request, res: Response) => {
  try {
    const { title, synopsis, content, featuredImg } = req.body;
    const authorId = (req as any).user;

    const blog = await prisma.blog.create({
      data: {
        title,
        synopsis,
        content,
        featuredImg,
        authorId,
      },
    });

    res.status(201).json(blog);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create blog' });
  }
};

export const getAllBlogs = async (req: Request, res: Response) => {
  try {
    const blogs = await prisma.blog.findMany({
      where: { isDeleted: false },
      include: {
        author: {
          select: { id: true, username: true, profilePic: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json(blogs);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch blogs' });
  }
};

export const getBlogById = async (req: Request, res: Response) => {
  try {
    const blog = await prisma.blog.findUnique({
      where: { id: req.params.id },
      include: {
        author: {
          select: { id: true, username: true, profilePic: true },
        },
      },
    });

    if (!blog || blog.isDeleted) {
      return res.status(404).json({ error: 'Blog not found' });
    }

    res.json(blog);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch blog' });
  }
};

export const updateBlog = async (req: Request, res: Response) => {
  try {
    const blog = await prisma.blog.update({
      where: { id: req.params.id },
      data: req.body,
    });

    res.json(blog);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update blog' });
  }
};

export const deleteBlog = async (req: Request, res: Response) => {
  try {
    await prisma.blog.update({
      where: { id: req.params.id },
      data: { isDeleted: true },
    });

    res.json({ message: 'Blog deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete blog' });
  }
};

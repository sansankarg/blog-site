---
title: "How I Built My Blog with React"
description: "Behind-the-scenes of creating a markdown-powered blog using React."
date: "2024-08-15"
tags: [JavaScript]
---

# How I Built This Blog

Building this blog was a fun experience. I used React, React Router, and some clever configuration.

## Features

- Markdown-based content
- Dynamic routing with `react-router`
- Frontmatter parsing with `gray-matter`
- Syntax highlighting with `rehype-highlight`

## Folder Structure

```bash
/public
  /content
    hello.md
    second-post.md

/src
  /pages
    Home.jsx
    MarkdownPage.jsx
  utils/
    markdownToHtml.js

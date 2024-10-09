<a name="readme-top"></a>

<!-- PROJECT LOGO
<br />
<div align="center">
  <a href="https://github.com/columk1/portfolio">
    <img src="images/logo.png" alt="Logo" width="80" height="80">
  </a>
  -->

<h3 align="center">Blog API</h3>
  <p align="center">
  API back-end for a markdown blog using Express and MongoDB. Hosted on Adaptable.
  </p>
</div>

<!-- ABOUT THE PROJECT -->

## About The Project

<!-- [![Routes Screenshot][routes-screenshot]]() -->

This is an API for my personal blog [columkelly.com](https://columkelly.com). It uses JWTs for authentication. A separate [CMS](https://github.com/columk1/blog-cms) is used for CRUD operations.

**Related Repos**
[Blog CMS](https://github.com/columk1/blog-cms)
[Portfolio](https://github.com/columk1/portfolio)

<!-- GETTING STARTED -->

## Getting Started

To get a local copy up and running follow these simple example steps.

### Prerequisites

1. Install Node (v21 or higher) using [NVM](https://github.com/nvm-sh/nvm)

```sh
nvm install 21
```

2. Install Nodemon globally

```sh
npm install nodemon -g
```

### Installation

1. Clone the repo
   ```sh
   git clone https://github.com/columk1/blog-api.git
   ```
2. Install NPM packages
   ```sh
   npm install
   ```
3. Copy the contents of `.env.sample` to `.env` and update the variables

### Usage

Run `npm devstart` to start the server in development mode

### API Endpoints

| HTTP Verb  | Endpoint          | Action                           |
| ---------- | ----------------- | ---------------------------------|
| POST       | /api/auth/login   | Log in an existing user account  |
| POST       | /api/auth/logout  | Log out a user who is logged in  |
| POST       | /api/auth/refresh | Refresh a users JWT access token |
| GET        | /api/posts/       | Retrieve all blog posts          |
| POST       | /api/posts/       | Create a new blog post           |
| GET        | /api/posts/:id    | Retrieve a single blog post      |
| PUT        | /api/posts/:id    | Update a blog post               |
| PATCH      | /api/posts/:id    | Publish or unpublish a blog post |
| DELETE     | /api/posts/:id    | Delete a blog post               |

<!-- ROADMAP -->

## Roadmap

- [ ] Add more detailed error messages
- [ ] Improve performance

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->

[linkedin-url]: https://linkedin.com/in/linkedin_username
[routes-screenshot]: screenshots/routes.png

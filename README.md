# Songbook

> Share your favorite songs for a future visitor.

## [View Demo](https://songbook.up.railway.app/)

## Requirements

- Node 16.x

- Docker

## Setup

### Backend

1.) Install dependencies

```
$ cd backend

$ yarn install
```

2.) In the `backend` directory, create a `.env` file and add the following:

```
LOCAL_DOMAIN=localhost
ORIGIN=http://localhost:3000
PRIVATE_KEY=<YOUR_RSA_PRIVATE_KEY>
```

#### RSA Key

You must generate an RSA key pair to run `songbook`. Use the resources below if you need any help with this step:

- https://cryptotools.net/rsagen

- https://gist.github.com/ygotthilf/baa58da5c3dd1f69fae9

After you add your RSA private key to the `.env` file, make sure to replace the `public_key` in [the config files](./backend/config/) with your RSA public key.

3.) **(Optional)** If you wish to manage password reset email requests, add the following to your `.env` file:

```
SEND_GRID_API_KEY=<YOUR_API_KEY>
FROM_EMAIL=<YOUR_EMAIL>
```

#### SendGrid API Key

We use SendGrid to deliver password reset emails. See [their video](https://www.youtube.com/watch?v=s2bzUzHeSVw) for how to create an API Key.

#### From Email

Add the email you wish to set as the "From Email" for password reset emails.

### Frontend

1.) Install dependencies

```
$ cd frontend

$ yarn install
```

2.) In the `frontend` directory, create a `.env.local` file and add the following:

```
NEXT_PUBLIC_SERVER_ENDPOINT=http://localhost:1337
```

## Start

### Development

```
$ make dev
```

### Production

```
$ make prod
```

## Built with

- JavaScript / TypeScript

- Next.js

- Mongo

- Express

- React

- Zod

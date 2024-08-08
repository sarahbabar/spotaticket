# SPOTATICKET ⭐

SpotATicket lets Spotify users view upcoming concerts for their top artists.

I often missed concerts for my favourite artists because I found out about them too late or not at all. I wanted a personalized way to see events for the artists I actually listen to without having to filter and search for them on my own.

## Gallery

**Large Screen View**

![tickets large screen view](/static/imgs/tickets_lrgview.jpeg)

**Small Screen View**

![tickets small screen view](/static/imgs/tickets_smview.jpeg)

**Demo**

![demo](/static/imgs/demo.gif)

## More Information

1. [About](#about)
2. [Tech Stack](#tech-stack)
3. [APIs Used](#apis-used)
4. [Database Design](#database-design)
5. [Public API Reference](#public-api-reference)

## About

Implements the Spotify OAuth 2.0 flow to securely login users and access their top artists' data. Web Auth best practices were followed for a secure and seamless login experience.

The artist data is then used to fetch upcoming concert events using a self-vendored events API. This API is built on top of data fetched from the TicketMaster API, streamlining the event discovery process for users while providing them with a uniquely personalized experience.

The data is fetched and filtered daily ensuring users have the most up-to-date information on concerts for their favorite artists.

## Tech Stack

![Svelte](https://img.shields.io/badge/svelte-%23f1413d.svg?style=for-the-badge&logo=svelte&logoColor=white)
![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![SQLite](https://img.shields.io/badge/sqlite-%2307405e.svg?style=for-the-badge&logo=sqlite&logoColor=white)

**Frontend**: Sveltekit with TypeScript, styled with Tailwind CSS.

**Backend**: Express with Node.js

**Database**: SQLite

## APIs Used

- [Spotify Web API](https://developer.spotify.com/documentation/web-api) to access user top artist data
- [TicketMaster Discovery API](https://developer.ticketmaster.com/products-and-docs/apis/discovery-api/v2/) to retrieve event details and allow users to buy tickets

## Database Design

The database structure is divided into two main tables: events and attractions. The database also includes state and oauth tables. The events and attractions tables are doubled up to ensure that data is still available during the daily update process.

The events are fetched and cached from TicketMaster to abide by their API rate limits as well as to reduce the amount of data moving through the server. SQLite was chosen as the database due to it's simplicity attributing to the small footprint of the project.

All tables are normalized to reduce redundancy and improve data integrity (BCNF).

## Public API Reference

#### Search Artist's Events

```http
  GET /api/search?spotifyID=${spotifyID}&artistName=${artistName}
```

| Parameter    | Type     | Description                                                               |
| :----------- | :------- | :------------------------------------------------------------------------ |
| `artistName` | `string` | **Required**. Name of the artist                                          |
| `spotifyID`  | `string` | **Optional**. Spotify ID of the artist (takes precedence over artistName) |

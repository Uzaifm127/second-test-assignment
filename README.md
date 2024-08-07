# The Second Assignment

## Run locally

1. Make an .env file in the root folder and set the environment variables. You can copy the env variables from .env.example and paste into the .env. For your ease I've already set up the database url, now you only have to set the another one.
2. Go to [MongoDB Atlas](https://www.mongodb.com/atlas) and make an account that.
4. After making an account setup the database on that and get your Database connection string or Database URL.
5. Paste that connection string into your .env file in DATABASE_URL.
6. Make sure you have docker install in your computer, then run the following command:
```bash
docker-compose up
```

### Test account to get the live preview of the app

**Username** - testuser
**Password** - password
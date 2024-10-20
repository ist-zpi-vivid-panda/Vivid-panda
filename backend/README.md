# How to run

- Configure environment
- Run 
    ```bash
    pip install -r requirements.txt
    ```
- Add [needed .env vars](#needed-env-vars)


## Needed `.env` vars
Please create a `.env.local` file for your local env vars

- `MONGO_USERNAME`
- `MONGO_PASSWORD`


- `APP_SECRET`
- `JWT_SECRET_KEY`

###### (You can generate above secrets using a website like [this](https://jwtsecret.com/generate))

- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `GOOGLE_DISCOVERY_URL`

###### (Google config is not actually required right now, as it is not configured)


- `MAIL_PASSWORD` - password for the Vivid-panda google account for the app, not the account itself (ask a developer)
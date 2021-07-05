# Discord Bot - Spin Bot

Want a discord bot that helps you pick a game? Look no further!

## Install

Make sure you have the latest version of node/npm

```
npm install
```

Install redis server (ubuntu)
```
sudo apt install redis-server
```
Mac OS
```
brew install redis-server
```
## Create your bot!
You can follow these steps up until "How to Code a Basic Discord Bot" - https://www.freecodecamp.org/news/create-a-discord-bot-with-python/

Make sure to grab the token you made from that guide and create a .env file with the following content. Replace your token over the "123"

```
token=123
```

## Running (Dev Mode with Live Reload)
```
npm run dev
```

## Production Mode (transpiled)
```
npm run start
```

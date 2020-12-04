# ChessOnTheRun

Registration and Login for our Group Assignment

Still uses dotenv for connection to database
    In your mongoDB local or mongoDB Atlas, you will need to create the following database with the following collections:
        ChessOnTheGoDB
            CurrentGame
            HistoricalGame
            Queue
            Users

Copy your .env file to the frontAndBackExample root folder (where the app.js file is)

Download this repo and in the backend directory run:
    npm install 

To run production:
    npm run start

To run development environment that will refress whenever a .js file is modified and saved:
    npm run dev

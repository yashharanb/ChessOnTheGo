set /p uname=Please enter the username: 
set /p pword=Please enter your password (it will show): 
ECHO %uname%
ECHO %pword%

ECHO "DB_CONNECTION = mongodb+srv://"%uname%":"%pword%"@cluster0.86s9z.mongodb.net/ChessOnTheGoDB?retryWrites=true&w=majority" >> makeEnv.txt

copy makeEnv.txt .env
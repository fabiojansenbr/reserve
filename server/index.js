import app from './config/express';

app.listen(app.get('port'), () => {
    console.log(`Server listening on port ${app.get('port')}`);
});
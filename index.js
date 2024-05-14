const express=require('express');
const app=express();
const port=8000;
const db=require('./config/mongoose')
const session=require('express-session');

// setup the url encoded
app.use(express.urlencoded());

// setup the passport
const passport=require('passport');
const passportLocal=require('./config/passport-local-strategy');
const passportJWT=require('./config/passport-jwt-startegy');
const passportGoogle=require('./config/passport-google-auth2-strategy');
const MongoStore = require('connect-mongo'); //To store the session
app.use(session({
    name:'smartConnect',
    // todo change the secret before in production mode
    secret:'Anku Rai',
    saveUninitialized:false,
    resave:false,
    cookie:{
        maxAge:(1000*60*100),
    },
    store:MongoStore.create(    
        {
            mongoUrl:`mongodb://127.0.0.1:27017` //have to read the documentation
        }
    )
}));


app.use(passport.initialize());
app.use(passport.session());
app.use(passport.setAuthenticatedUser);

app.use('/',require('./routes/index'))

app.listen(port,function(err){
    if(err){console.log(`Error in running server : ${port}`)}

    console.log(`Server is running at : ${port}`)
})




const express = require('express')
const nunjucks = require('nunjucks')
const { user } = require('./models/user')
const { createToken } = require('./utils/jwt')
const { auth } = require('./middlewares/auth')
const app = express()

app.set('view engine','html')
nunjucks.configure('views',{
    express:app,
    watch:true, // nodemon 사용하기위해서 npm install chokidar
})

app.use(express.urlencoded({extended:true,})) // http body영역을 해석해주는아이 Content-type : application/x-www-form-urlencoded
app.use(auth)
app.use(express.json()) //Content-type : application/json

app.get('/',(req,res)=>{
    res.send('hello server111')
})

app.get('/user',(req,res)=>{
    res.render('index')
})

app.get('/login',(req,res)=>{
    res.render('login')
})

app.post('/login',(req,res)=>{
    const { userid ,userpw } = req.body
    const [ item ] = user.filter( v => v.userid == userid && v.userpw == userpw )
    try {
        if(item === undefined) throw new Error('item undefined')

        // 로그인 성공적으로 되어야함

        // 1. JWT 토큰을 생성
        //      JWT 토큰을 생성하기위해서 필요한 값이 무엇일까?  payload에 해당되는 값 Object
        //      객체 필요하구나! 
        //      JWT 토큰을 만드는 함수를 만들자! 


        // 이런건 저도 만들때 보고만듬 JWT 만들기 <<
        const payload = {
            userid:item.userid,
            username:item.username,
            level:1
        }
        const token = createToken(payload)
        // JWT 토큰이 잘 만들어졌는지. 확인하는 작업을 할거에요. 표준에 맞춰어져있는지. 
        // https://jwt.io 
        // console.log(token)
        // 2. 생성한 토큰을 쿠키로 생성해서 보내주어야 합니다.
        res.setHeader('Set-cookie',`AccessToken=${token}; HttpOnly; Secure; Path=/;`)
        res.redirect('/')
    } catch (e) {
        // console.log(e)
        res.status(500).send('실패')
    }

    // console.log(item)
    // request message  HTTP
    // response message HTTP  200 OK http/1.1
})

app.get('/admin',(req,res)=>{
    try{
        if( req.user === undefined ) throw new Error('로그인하고 와라')
        // console.log(req.user)
        res.send('하하하하하하하하하하하하하하하하하하')
    } catch( e ) {
        res.send('로그인 하고와라~')
    }
})

//router 2개 ,화면1개
app.get('/join',(req,res)=>{
    res.render('join')
})
app.post('/idcheck',(req,res)=>{
    const {userid} = req.body
    const [ item ] = user.filter( v => v.userid == userid)
    let result = 1
    if(item !== undefined) result = 2
    const response = {
        result //가입가능은1, 불가능은2
    }
    res.send(JSON.stringify(response))
})

app.listen(3000,()=>{
    console.log('서버 시작')
})

// npm install -g nodemon 
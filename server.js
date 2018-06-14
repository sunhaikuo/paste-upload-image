const express = require('express')
const fs = require('fs-extra')
const path = require('path')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const multipart = require('connect-multiparty')
const multipartMiddleware = multipart()
const opn = require('opn')
const uuid = require('uuid/v4')
const app = express()
app.use(cookieParser())
app.use(express.static('.'))
// 允许所有的请求形式 
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*")
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
    next()
})
app.use(bodyParser.urlencoded({
    extended: true
}))

app.post('/upload', multipartMiddleware, function (req, res) {

    console.log(req.hostname)

    const cookie = req.cookies
    let uid = ''
    if (cookie && cookie.uid) {
        uid = cookie.uid
    } else {
        uid = uuid()
        uid = uid.replace('-', '')
        uid.replace
    }
    let data = req.body.image
    let ext = data.substring(11, data.indexOf(';'))

    let realSize = data.length / 1.33
    if (Math.floor(realSize / (1024 * 1024)) > 2) {
        res.send({ success: false, msg: '图片尺寸过大' })
        return
    }
    const base64 = data.substr(data.indexOf(',') + 1)
    var bitmap = new Buffer(base64, 'base64')
    let title = +(new Date())
    let imgPath = path.resolve('./images/' + uid + '/')
    fs.ensureDirSync(imgPath)
    const fileName = imgPath + '/' + title + '.' + ext
    console.log(fileName)
    fs.writeFile(fileName, bitmap)
    res.cookie('uid', uid)
    res.json({ success: true, msg: '', url: 'http://192.168.214.205:5000/images/' + uid + '/' + title + '.' + ext })
})

app.listen(5000, function () {
    console.log('Start Success!')
    // opn('http://localhost:5000/index.html')
})
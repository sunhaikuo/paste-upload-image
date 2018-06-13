const express = require('express')
const fs = require('fs-extra')
const path = require('path')
var bodyParser = require('body-parser')
var multipart = require('connect-multiparty')
var multipartMiddleware = multipart()
const opn = require('opn')
const app = express()
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

app.post('/', multipartMiddleware, function (req, res) {

    let data = req.body.image
    let ext = data.substring(11, data.indexOf(''))
    let realSize = data.length / 1.33
    console.log(realSize)
    if (Math.floor(realSize / (1024 * 1024)) > 2) {
        res.send({ success: false, msg: '图片尺寸过大' })
        return
    }
    const base64 = data.substr(data.indexOf(',') + 1)
    var bitmap = new Buffer(base64, 'base64')
    const fileName = path.resolve('./live/' + Math.random() + '.' + ext)
    fs.writeFileSync(fileName, bitmap)
    res.send({ success: true, msg: '' })
})

app.listen(5000, function () {
    console.log('Start Success!')
    opn('http://localhost:5000/index.html')
})
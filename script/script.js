

var imageUpload = function () {
    this.view = document.getElementById('view')
    this.selectBtn = document.getElementById('select')
    this.loadding = document.getElementById('loadding')
    this.mask = document.getElementById('mask')
    this.domain = 'https://sunhaikuo.cn/'
    this.image = new Image()
    this.init()
}

imageUpload.prototype.init = function () {
    var _this = this
    // 自动获取焦点
    document.body.addEventListener('paste', this.paste.bind(this))
    this.selectBtn.addEventListener('change', this.select.bind(this))
    // 设置复制
    var clipboard = new ClipboardJS('.copy-btn')
    clipboard.on('success', function (e) {
        _this.setMask(false)
    })
}

imageUpload.prototype.select = function (e) {
    var fileData = this.selectBtn.files[0]
    this.readFile.call(this, fileData)
}

imageUpload.prototype.paste = function (e) {
    var _this = this
    var data = e.clipboardData
    var types = e.clipboardData.types
    types.forEach(function (type, index) {
        if (type === 'Files') {
            var fileData = data.items[index].getAsFile()
            if (fileData) {
                _this.readFile.call(_this, fileData)
            }
        }
    })
}

imageUpload.prototype.readFile = function (fileData) {
    var _this = this
    var size = fileData.size
    var fr = new FileReader
    var _this = this
    fr.onload = function (e) {
        var res = e.target.result
        _this.image.src = res
        _this.render()

        if (size > 1024 * 1024 * 1.5) {
            _this.zip.call(_this)
        } else {
            _this.upload(res)
        }

        // 生成图片，然后展示
        _this.loadding.style.display = 'block'
        document.getElementById('preTip').style.display = 'none'
        // _this.upload.call(_this, res)
    }
    fr.readAsDataURL(fileData)
}

imageUpload.prototype.zip = function () {
    let _this = this
    this.image.onload = function () {
        // _this.upload.call(_this, res)
        // 图片原始尺寸
        var originWidth = this.width;
        var originHeight = this.height;
        // 最大尺寸限制
        var maxWidth = 600, maxHeight = 600;
        // 目标尺寸
        var targetWidth = originWidth, targetHeight = originHeight;
        // 图片尺寸超过400x400的限制
        if (originWidth > maxWidth || originHeight > maxHeight) {
            if (originWidth / originHeight > maxWidth / maxHeight) {
                // 更宽，按照宽度限定尺寸
                targetWidth = maxWidth;
                targetHeight = Math.round(maxWidth * (originHeight / originWidth));
            } else {
                targetHeight = maxHeight;
                targetWidth = Math.round(maxHeight * (originWidth / originHeight));
            }
        }
        var canvas = document.createElement('canvas')
        var context = canvas.getContext('2d')
        // canvas对图片进行缩放
        canvas.width = targetWidth;
        canvas.height = targetHeight;
        // 清除画布
        context.clearRect(0, 0, targetWidth, targetHeight);
        // 图片压缩
        context.drawImage(this, 0, 0, targetWidth, targetHeight);
        // canvas转为blob并上传
        canvas.toBlob(function (blob) {
            // console.log(blob)
            // _this.upload(blob)
            var reader = new FileReader();
            reader.onload = function (e) {
                _this.upload(e.target.result)
            }
            reader.readAsDataURL(blob);
        })
    }
}

imageUpload.prototype.render = function () {
    this.view.appendChild(this.image)
}

imageUpload.prototype.upload = function (fileData) {
    var _this = this
    var xhr = new XMLHttpRequest();
    var formData = new FormData();
    formData.append('image', fileData)
    xhr.onloadstart = function () {
    }
    xhr.responseType = 'json'
    xhr.onreadystatechange = function (e) {
        if (xhr.readyState == 4) {
            if (xhr.status == 200) {
                var response = xhr.response
                if (response.success) {
                    _this.uploadSuccess.call(_this, xhr.response)
                } else {
                    _this.uploadError.call(_this, xhr.response)
                }
            } else {
                alert('出错啦~一会再试试')
            }
        }
    }
    xhr.open('POST', _this.domain + 'api/upload', true);
    xhr.send(formData);
}

imageUpload.prototype.uploadError = function (data) {

}

imageUpload.prototype.uploadSuccess = function (data) {
    this.loadding.style.display = 'none'
    document.getElementById('url').value = data.url
    this.setMask(true)
}

imageUpload.prototype.setMask = function (isShow) {
    if (isShow) {
        this.mask.style.left = 0
        this.mask.style.top = 0
        this.mask.style.opacity = 1
    } else {
        this.mask.style.left = '-100%'
        this.mask.style.top = '-100%'
        this.mask.style.opacity = 0
    }
}

var upload = new imageUpload()


function test() {
    var select = document.getElementById('select')
    select.click()
}
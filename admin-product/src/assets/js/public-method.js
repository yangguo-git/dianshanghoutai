const imageConversion = require("image-conversion");

function errorMess(_this, _type, _message, _duration) {
    return _this.$message({
        message: _message,
        type: _type,
        duration: _duration || 1500
    });
}

function handleStatus(_this, _stauts, _message, _duration) {
    if (_stauts === 20002) {
        _this.$message({
            message: '请重新登录！',
            type: 'error',
            duration: _duration || 1500
        });
        return _this.$router.push('/login');
    } else {
        _this.$message({
            message: _message,
            type: 'error',
            duration: _duration || 1500
        });
        return false;
    }

}

//判断图片的宽与高
function isPicSize(_this, _file, _width, _height) {
    return new Promise(function (resolve, reject) {
        let _URL = window.URL || window.webkitURL;
        let img = new Image();
        let isJPG = (_file.type === 'image/png'||_file.type === 'image/jpeg'||_file.type === 'image/jpg');
        let isLt10M = _file.size / 1024 / 1024 < 10;
        if (!isJPG) {
            errorMess(_this,'error','图片只能是jpg或 jpeg或 png格式!');
            return reject(_file);
        }else if(!isLt10M) {
            errorMess(_this,'error','图片的大小不能超过10M!');
            return reject(_file);
        }else {
            img.onload = function () {
                let valid = img.width == _width && img.height == _height;
                if (valid) {
                    imageConversion.compressAccurately(_file, 200).then(res => {
                        return resolve(res);
                    })
                } else {
                    errorMess(_this,'error',`图片尺寸只能为${_width}*${_height}!`);
                    return reject(_file);
                }
            }
            img.src = _URL.createObjectURL(_file);
        }

        //console.log(_file);
    }).catch(() => {
        return Promise.reject();
    });
}

export {handleStatus, errorMess, isPicSize}
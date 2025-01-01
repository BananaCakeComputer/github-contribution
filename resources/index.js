const sleep = ms => new Promise(res => setTimeout(res, ms));
document.getElementById('plus').onclick = function(){
    if(this.innerHTML != '+'){
        return;
    }
    document.getElementById('add').style.cssText = 'width: 282px; height: 45px; border-radius: 14px;';
    document.getElementById('addbtn').style.cssText = 'width: 282px;';
    document.getElementById('plus').style.display = 'none';
    document.getElementById('addbtn').style.display = 'block';
};
var mode = true;
document.getElementById('mode').onclick = function(){
    if(mode){
        this.innerText = '年份';
    }else{
        this.innerText = '倒序';
    }
    mode = !mode;
    document.getElementById('content').innerHTML = '';
    for(var i = 0; i < users.length; i++){
        newUser(users[i]);
    }
}
var tpd = false;
document.getElementById('period').onclick = function(event){
    if(event.target != this){
        return;
    }
    if(this.childNodes.length != 1){
        this.innerHTML = '时间区间：自动';
        tpd = false;
        return;
    }
    this.innerHTML = '时间区间：20<input class="year" type="number"/>年 - 20<input class="year" type="number"/>年';
    document.getElementsByClassName('year')[0].onchange = function(){
        if(this.value.length != 2 || (document.getElementsByClassName('year')[1].value != '' && parseInt(document.getElementsByClassName('year')[1].value) < parseInt(this.value))){
            this.value = '';
        }
        if(this.value != '' && document.getElementsByClassName('year')[1].value != ''){
            tpd = [parseInt(20 + this.value), parseInt(20 + document.getElementsByClassName('year')[1].value)];
            document.getElementById('period').innerHTML = '时间区间：<span>20' + this.value + '</span>年<span>20' + document.getElementsByClassName('year')[1].value + '</span>年';
        }
    }
    document.getElementsByClassName('year')[1].onchange = function(){
        if(this.value.length != 2 || (document.getElementsByClassName('year')[0].value != '' && parseInt(document.getElementsByClassName('year')[0].value) > parseInt(this.value))){
            this.value = '';
        }
        if(this.value != '' && document.getElementsByClassName('year')[0].value != ''){
            tpd = [parseInt(20 + document.getElementsByClassName('year')[0].value), parseInt(20 + this.value)];
            document.getElementById('period').innerHTML = '时间区间：<span>20' + document.getElementsByClassName('year')[0].value + '</span>年 - <span>20' + this.value + '</span>年';
        }
    }
}
document.getElementById('addbtn').onclick = function(event){
    if(event.target != this){
        return;
    }
    document.getElementById('add').style.cssText = '';
    this.style.cssText = '';
    document.getElementById('plus').style.display = 'block';
    document.getElementById('addbtn').style.display = 'none';
};
document.getElementById('fetch').onclick = function(){
    fet();
};
document.getElementById('addipt').addEventListener('keypress', function(event){
    if(event.key == 'Enter'){
        fet();
    }
});
var users = [];
function fet(){
    document.getElementById('add').style.cssText = '';
    document.getElementById('addbtn').style.cssText = '';
    document.getElementById('plus').style.display = 'block';
    document.getElementById('plus').innerHTML = '';
    loadAnimation(document.getElementById('plus'), '25px')
    document.getElementById('addbtn').style.display = 'none';
    fetch('get?username=' + document.getElementById('addipt').value + (tpd ? '&from=' + tpd[0] + '&until=' + tpd[1] : ''))
    .then((response) => {
        document.getElementsByClassName('load')[0].remove();
        document.getElementById('plus').innerHTML = '+';
        document.getElementById('addipt').value = '';
        return response.json();
    })
    .then((data) => {
        newUser(data);
        users.push(data);
    })
    .catch(() => {
        document.getElementsByClassName('load')[0].remove();
        document.getElementById('plus').innerHTML = '+';
        document.getElementById('addipt').value = '';
    })
}
function newUser(data){
    if(mode){
        return newUserA(data);
    }
    return newUserB(data);
}
function newUserA(data){
    const userele = document.createElement('div');
    userele.className = 'list';
    userele.innerHTML = '<a target="_blank" href="https://github.com/' + data[0][1].replaceAll('\n', '').replaceAll(' ', '') + '"><img src="' + data[0][2] + '" style="margin-top: 12px; margin-right: 6px; height: 34.5px; float: left; border: 1px solid #ddd; border-radius: 18.25px;"/><p style="color: #666; font-size: 24px; margin: 16px 0; display: inline-block;"><b style="color: #000;">' + data[0][0].replaceAll('\n', '') + '</b>@' + data[0][1].replaceAll('\n', '').replaceAll(' ', '') + '</p></a>';
    let cachestr = '<p style="font-size: 14px; margin-top: 0; color: #666;">';
    for(var i = 4; i < data[0].length; i++){
        cachestr += data[0][i].replaceAll('\n', '') + ' · ';
    }
    userele.innerHTML += cachestr.substring(0, cachestr.length - 3) + '</p>';
    for(var i = 1; i < data.length; i++){
        userele.appendChild(graphA(data[i], data[0][3] + (data.length - i - 1)));
    }
    document.getElementById('content').appendChild(userele);
    colorGrid();
    document.getElementById('content').style.width = document.getElementById('content').childNodes.length * 769 + 'px';
    document.getElementById('content').style.marginTop = '16px';
}
function newUserB(data){
    const userele = document.createElement('div');
    userele.className = 'listB';
    userele.innerHTML = '<a target="_blank" href="https://github.com/' + data[0][1].replaceAll('\n', '').replaceAll(' ', '') + '"><img src="' + data[0][2] + '" style="margin-top: 12px; margin-right: 6px; height: 34.5px; float: left; border: 1px solid #ddd; border-radius: 18.25px;"/><p style="color: #666; font-size: 24px; margin: 16px 0; display: inline-block;"><b style="color: #000;">' + data[0][0].replaceAll('\n', '') + '</b>@' + data[0][1].replaceAll('\n', '').replaceAll(' ', '') + '</p></a>';
    let cachestr = '<p style="font-size: 14px; margin-top: 0; color: #666;">';
    for(var i = 4; i < data[0].length; i++){
        cachestr += data[0][i].replaceAll('\n', '') + ' · ';
    }
    userele.innerHTML += cachestr.substring(0, cachestr.length - 3) + '</p>';
    userele.appendChild(graphB(data));
    document.getElementById('content').appendChild(userele);
    colorGrid();
    document.getElementById('content').style.marginTop = '16px';
}
const colors = ['#ebedf0', '#9be9a8', '#40c463', '#30a14e', '#216e39'];
function colorGrid(){
    for(var i = 0; i < document.getElementsByClassName('rect').length; i++){
        if(parseInt(document.getElementsByClassName('rect')[i].getAttribute('value')) == 0){
            document.getElementsByClassName('rect')[i].setAttribute('fill', colors[0]);
        }else{
            document.getElementsByClassName('rect')[i].setAttribute('fill', colors[Math.round(parseInt(document.getElementsByClassName('rect')[i].getAttribute('value')) / maxValue * 3) + 1]);
        }
    }
}
const weeks = ['一', '二', '三', '四', '五', '六', '日'];
var maxValue = 0;
function graphA(data, year){
    var tempele = document.createElement('div');
    tempele.style.cssText = 'margin-bottom: 16px;';
    let svg = '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" height="125" width="725" style="border-radius: 6px; border: 1px solid #ddd;">';
    let week = '';
    for(var j = 0; j < data[0].length; j++){
        if(data[0][j] != week){
            svg += '<text x="' + (25 + j * 13) + '" y="22" font-size="12">' + data[0][j] + '</text>';
            week = data[0][j];
        }
    }
    var total = 0;
    for(var i = 0; i < 7; i++){
        svg += '<text x="10" y="' + (i * 13 + 35) + '" font-size="12">' + weeks[i] + '</text>';
        for(var j = 0; j < data[i + 1].length; j++){
            if(data[i + 1][j] != -1){
                maxValue = Math.max(maxValue, data[i + 1][j]);
                total += data[i + 1][j];
                svg += '<rect x="' + (25 + j * 13) + '" y="' + (i * 13 + 26) + '" rx="2" width="10" height="10" fill="#eee" stroke-width="2" stroke="#22222210" class="rect" value="' + data[i + 1][j] + '"/><rect x="' + (24.5 + j * 13) + '" y="' + (i * 13 + 25.5) + '" rx="2" width="11" height="11" fill="transparent" stroke-width="1" stroke="#fff"/>';
            }
        }
    }
    svg += '</svg>';
    tempele.innerHTML = '<p><b>' + year + '</b> - ' + total + ' 贡献</p>' + svg;
    return tempele;
}
function graphB(data){
    var tempele = document.createElement('div');
    tempele.style.cssText = 'margin-bottom: 16px;';
    let svg = '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" height="125" style="border-radius: 6px; border: 1px solid #ddd;">';
    let week = '';
    var total = 0;
    for(var i = 0; i < 7; i++){
        svg += '<text x="10" y="' + (i * 13 + 35) + '" font-size="12">' + weeks[i] + '</text>';
    }
    for(var h = 1; h < data.length; h++){
        svg += '<text x="' + (25 + (h - 1) * 676) + '" y="10" font-size="8">' + (data[0][3] + (data.length - h - 1)) + '年</text>';
        for(var j = data[h][0].length - 1, k = 0; j >= 0; j--, k++){
            if(data[h][0][j] != week){
                svg += '<text x="' + (25 + k * 13 + (h - 1) * 676) + '" y="22" font-size="12">' + data[h][0][j] + '</text>';
                week = data[h][0][j];
            }
        }
        for(var i = 0; i < 7; i++){
            for(var k = data[h][i + 1].length - 1, j = 0; j < data[h][i + 1].length; k--, j++){
                if(data[h][i + 1][j] != -1){
                    maxValue = Math.max(maxValue, data[h][i + 1][j]);
                    total += data[h][i + 1][j];
                    svg += '<rect x="' + (25 + k * 13 + (h - 1) * 676) + '" y="' + (i * 13 + 26) + '" rx="2" width="10" height="10" fill="#eee" stroke-width="2" stroke="#22222210" class="rect" value="' + data[h][i + 1][j] + '"/><rect x="' + (24.5 + k * 13 + (h - 1) * 676) + '" y="' + (i * 13 + 25.5) + '" rx="2" width="11" height="11" fill="transparent" stroke-width="1" stroke="#fff"/>';
                }
            }
        }
    }
    svg += '</svg>';
    tempele.innerHTML = '<p><b>' + (data[0][3] + (data.length - 2)) + ' -> ' + data[0][3] + '</b> - ' + total + ' 贡献</p>' + svg;
    tempele.childNodes[1].setAttribute('width', 46 + (data.length - 1) * 676);
    tempele.style.width = 'fit-content';
    return tempele;
}
async function loadAnimation(parent, d){
    while (true){
        parent.innerHTML += '<div class="load" style="position: relative; left: 38.5px; top: 2px; width: ' + d + '; height: ' + d + ';"></div>';
        document.getElementsByClassName('load')[0].innerHTML += '<div class="loadingDot" style="transform: rotate(70deg);" prog="70" speed="90"><svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><circle cx="calc(100% - 3px)" cy="50%" r="1.5" fill="#606060"></circle></svg></div>';
        while(document.getElementsByClassName('loadingDot').length > 0){
            if(document.getElementsByClassName('loadingDot').length < 5 && document.getElementsByClassName('loadingDot')[document.getElementsByClassName('loadingDot').length - 1].getAttribute('prog') > 150 && document.getElementsByClassName('loadingDot')[document.getElementsByClassName('loadingDot').length - 1].getAttribute('prog') < 200){
                document.getElementsByClassName('load')[0].innerHTML += '<div class="loadingDot" style="transform: rotate(70deg);" prog="70" speed="90"><svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><circle cx="calc(100% - 3px)" cy="50%" r="1.5" fill="#606060"></circle></svg></div>';
            }
            for(var i = 0; i < document.getElementsByClassName('loadingDot').length; i++){
                if(document.getElementsByClassName('loadingDot')[i].getAttribute('prog') % 360 > 290 && document.getElementsByClassName('loadingDot')[i].getAttribute('speed') < 140){
                    document.getElementsByClassName('loadingDot')[i].setAttribute('speed', Math.floor(document.getElementsByClassName('loadingDot')[i].getAttribute('speed')) + 6);
                }else if(document.getElementsByClassName('loadingDot')[i].getAttribute('prog') % 360 > 110 && document.getElementsByClassName('loadingDot')[i].getAttribute('speed') > 30){
                    document.getElementsByClassName('loadingDot')[i].setAttribute('speed', Math.floor(document.getElementsByClassName('loadingDot')[i].getAttribute('speed')) - 3);
                }
                document.getElementsByClassName('loadingDot')[i].setAttribute('prog', Math.floor(document.getElementsByClassName('loadingDot')[i].getAttribute('prog')) + Math.floor(document.getElementsByClassName('loadingDot')[i].getAttribute('speed')/10));
                document.getElementsByClassName('loadingDot')[i].style.cssText = 'transform: rotate(' + document.getElementsByClassName('loadingDot')[i].getAttribute('prog') + 'deg);';
                if(document.getElementsByClassName('loadingDot')[i].getAttribute('prog') >= 790){
                    document.getElementsByClassName('loadingDot')[i].remove();
                }
            }
            await sleep(20);
        }
        document.getElementsByClassName('load')[0].remove();
    }
}
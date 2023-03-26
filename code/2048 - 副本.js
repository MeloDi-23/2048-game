// JavaScript source code
const COLUMN = 4;
const ROW = 4;

var map = {
    content: new Array(ROW),
    init: function() {
        for(var i = 0; i < this.content.length; ++i) {
            this.content[i] = new Array(COLUMN);
            let con = this.content[i];
            for(var j = 0; j < COLUMN; ++j) {
                con[j] = 0;
            }
        }
    },
    hasPosition: function() {
        for (var i = 0; i < 4; ++i) {
            for (var j = 0; j < 4; ++j) {
                if (this.content[i][j] == 0) {
                    return true;
                }
            }
        }
        return false;
    },
    randPosition: function (times = 1, num = 2) {
        for(let _ = 0; _ < times; ++_) {
            let start = Math.floor(Math.random()*(COLUMN*ROW));
            for(let i = start; ;i = (i+1)%(COLUMN*ROW)) {
                let row = i % ROW;
                let col = parseInt(i / ROW);
                if(this.content[row][col] == 0) {
                    this.content[row][col] = num;
                    break;
                }
            }
        }
        return true;
    },
    show: function () {
        let s = ''
        for(var i = 0; i != ROW; ++i) {
            for(var j = 0; j != COLUMN; ++j) {
                s += this.content[i][j] + ' ';
            }
            s += '\n';
        }
        console.log(s);
    },
    moveBlock: function(from, to) {
        // 移动方块
        this.content[to[0]][to[1]] = this.content[from[0]][from[1]];
        if(from[0] != to[0] || from[1] != to[1]) {
            this.content[from[0]][from[1]] = 0;
            actionList.push(
                [from, to]
            );
            return true;
        }
        return false;
    },
    doubleBlock: function(from, to) {
        // 合并方块
        if(from[0] != to[0] || from[1] != to[1]) {
            if(this.content[to[0]][to[1]] != this.content[from[0]][from[1]]) {
                return false;
            }
            this.content[to[0]][to[1]] *= 2;
            score += this.content[to[0]][to[1]];
            this.content[from[0]][from[1]] = 0;
            actionList.push(
                [from, to]
            );
            createList.push(
                to
            );
            return true;
        }
        return false;
    },
    over: function() {
        if(this.hasPosition()) {
            return false;
        }
        let getXY = function(x, y) {
            if(x >= 0 && x < ROW && y >= 0 && y < COLUMN) {
                return map.content[x][y];
            }
            return undefined;
        }
        for(let i = 0; i != ROW; ++i) {
            for(let j = 0; j != COLUMN; ++j) {
                let val = this.content[i][j];
                if(
                    getXY(i - 1, j) === val || 
                    getXY(i + 1, j) == val || 
                    getXY(i, j - 1) === val || 
                    getXY(i, j + 1) === val
                )
                    return false;
            }
        }
        return true;
    }
}
map.move = function(direction) {
    // TODO move的调用，有问题
    let con = this.content;
    var changed = false;
    switch(direction) {
        case 'up':
            for(var col = 0; col < COLUMN; col++) {
                var limit = 0;
                for(var row = 1; row < ROW; row++) {
                    if(con[row][col] == 0)
                        continue;
                    if(con[row][col] == con[limit][col]) {
                        
                        this.doubleBlock([row, col], [limit, col]);
                        
                        changed = true;
                        limit++;
                    } else if(con[limit][col] == 0) {
                        // 判定方块移动
                        changed |= this.moveBlock([row, col], [limit, col]);
                    } else {
                        limit++;
                        changed |= this.moveBlock([row, col], [limit, col]);

                    }
                }
            }
            break;
        case 'down':
            for(var col = 0; col < COLUMN; col++) {
                var limit = ROW - 1;
                for(var row = ROW - 2; row >= 0; row--) {
                    if(con[row][col] == 0)
                        continue;
                    if(con[row][col] == con[limit][col]) {
                        this.doubleBlock([row, col], [limit, col]);
                        limit--;
                        changed = true;
                        // 判定方块合并
                    } else if(con[limit][col] == 0) {
                        // 判定方块移动
                        changed |= this.moveBlock([row, col], [limit, col]);
                    } else {
                        limit--;
                        changed |= this.moveBlock([row, col], [limit, col]);
                    }
                }
            }
            break;
        case 'left':
            for(var row = 0; row < ROW; row++) {
                var limit = 0;
                for(var col = 1; col < COLUMN; col++) {
                    if(con[row][col] == 0)
                        continue;
                    if(con[row][col] == con[row][limit]) {
                        this.doubleBlock([row, col], [row, limit]);
                        limit++;
                        changed = true;
                        // 判定方块合并
                    } else if(con[row][limit] == 0) {
                        changed |= this.moveBlock([row, col], [row, limit]);
                    } else {
                        limit++;
                        changed |= this.moveBlock([row, col], [row, limit]);
                    }
                }
            }
            break;
        case 'right':
            for(var row = 0; row < ROW; row++) {
                var limit = COLUMN - 1;
                for(var col = COLUMN - 2; col >= 0; col--) {
                    if(con[row][col] == 0)
                        continue;
                    if(con[row][col] == con[row][limit]) {
                        this.doubleBlock([row, col], [row, limit]);
                        // con[row][limit] *= 2;
                        // con[row][col] = 0;
                        limit--;
                        changed = true;
                        // 判定方块合并
                    } else if(con[row][limit] == 0) {
                        changed |= this.moveBlock([row, col], [row, limit]);
                    } else {
                        limit--;
                        changed |= this.moveBlock([row, col], [row, limit]);
                    }
                }
            }
            break;
    }
    return changed;
}

function setDivNumber(div, num) {
    // TODO: 更改div的class 删除有关常量
    if(num != 0)
        div.innerHTML = ''+num;
    else
        div.innerHTML = ''
    div.classList.forEach(
        ele => {
            if(/^s[0-9]+$/.test(ele)) {
                div.classList.remove(ele);
            }
        }
    );
    if(num <= 2048)
        div.classList.add('s'+num);
    else
        div.classList.add('s2048');
}

function init() {
    backgroundDiv = document.getElementById('background');
    
    actionList = new Array();
    createList = new Array();
    ready = true;
    divArray = new Array();
    moveCount = 0;
    score = 0;
    
    for(var i = 0; i != ROW; ++i) {
        divArray[i] = new Array();
        for(var j = 0; j != COLUMN; ++j) {
            new_div = document.createElement('div');
            new_div.classList.add('cell');
            divArray[i][j] = new_div;
            backgroundDiv.appendChild(new_div);
        }
    }
    document.addEventListener("keypress", readKey);
    map.init();
    map.randPosition(2, 2);
    // map.content = [
    //     [2, 4, 8, 16],
    //     [32, 64, 128, 512],
    //     [1024, 2048, 0, 0],
    //     [0, 0, 0, 0]
    // ];
    updateMap();
}

function restart() {
    actionList = new Array();
    createList = new Array();
    ready = true;
    map.init();
    map.randPosition(2, 2);
    updateMap();
    score = 0;
    moveCount = 0;
}

function readKey(event) {
    if(!ready) {
        return;
    }
    var changed = false;
    
    switch (String.fromCharCode(event.keyCode).toLowerCase()) {
        case 'w':
            changed = map.move("up");
            break;
        case 's':
            changed = map.move("down");
            break;
        case 'a':
            changed = map.move("left");
            break;
        case 'd':
            changed = map.move("right");
            break;
    }
    if(changed)
        generate();
}

function generate() {
    moveCount += 1;
    gameOver = false;
    let num = Math.random() > 0.25 ? 2 : 4;
    if(map.hasPosition()) {
        map.randPosition(1, num);
        if(map.over()) {
            gameOver = true;
        }
    } else
        gameOver = true;
    ready = false;

    // drawAnimation(() => {
    //     actionList = new Array();
    //     createList = new Array();
    //     updateMap();
    //     ready = true;
    //     requestAnimationFrame(
    //         // 这是为了防止在CSS更新页面前就弹出alert导致影响效果
    //         function(t) {
    //             if(gameOver) {
    //                 alert('game over');
    //             }
    //         }
    //     )
    // });
    drawAnimationByCSS(function() {
        actionList = new Array();
        createList = new Array();
        updateMap();
        ready = true;
        if(gameOver) {
            alert('game over');
        }
    });
}

function updateMap() {
    for(var i = 0; i < ROW; ++i) {
        for(var j = 0; j < COLUMN; ++j) {
            setDivNumber(divArray[i][j], map.content[i][j]);
        }
    }
    document.getElementById('score').innerHTML = 'score<br>' + score;
    document.getElementById('move').innerHTML = 'move<br>' + moveCount;
}

function drawAnimation(callBack=null) {
    /**
     * 1. actionList => mem, startPoint, endPoint, step
     * 2. createList => mem
     * 3. 
     */
    let totalTime = 150, totalTime_2 = 100;

    let parent = divArray[0][0].offsetParent;
    let divList = new Array();
    for(let element of actionList) {
        // console.log(element);
        let from = element[0], to = element[1];
        let start = divArray[from[0]][from[1]];
        let end = divArray[to[0]][to[1]];
        let mem = document.createElement('div');
        mem.classList.add('cell');
        mem.style = start.style;
        mem.style.height = start.offsetHeight + 'px';
        mem.style.width = start.offsetWidth + 'px';
        mem.style.top = start.offsetTop + 'px';
        mem.style.left = start.offsetLeft + 'px';
        mem.style.position = 'absolute';

        let value = parseInt(start.innerHTML);
        setDivNumber(mem, value);
        setDivNumber(start, 0);
        parent.appendChild(mem);
        divList.push(
            {
                div: mem,
                startPoint: start,
                endPoint: end,
                value: value
            }
        )
    }
    
    let scale = 1.4;
    let getScale = function(rate) {
        return (scale - 1)*rate*(1 - rate) + 1;
    };
    let divList_2 = new Array();
    for(let element of createList) {
        start = divArray[element[0]][element[1]];
        let mem = document.createElement('div');
        mem.classList.add('cell');
        mem.style = start.style;
        mem.style.height = start.offsetHeight + 'px';
        mem.style.width = start.offsetWidth + 'px';
        mem.style.top = start.offsetTop + 'px';
        mem.style.left = start.offsetLeft + 'px';
        mem.style.position = 'absolute';
        let value = map.content[element[0]][element[1]];
        setDivNumber(mem, value);
        
        divList_2.push(
            {
                div: mem,
                target: start,
                value: value
            }
        );
    }
    let i = 0;
    let state = 0;
    let beginTime = performance.now();

    requestAnimationFrame(function draw(t) {
        
        let progress = (t - beginTime)/(totalTime + totalTime_2);
        if(progress < totalTime / (totalTime + totalTime_2)) {
            frac = (t - beginTime)/totalTime;
            divList.forEach(element=>{
                element.div.style.top = (element.endPoint.offsetTop - element.startPoint.offsetTop)*frac + element.startPoint.offsetTop + 'px';
                element.div.style.left = (element.endPoint.offsetLeft - element.startPoint.offsetLeft)*frac + element.startPoint.offsetLeft + 'px';
            });
            requestAnimationFrame(draw);
        } else if(progress <= 1) {
            frac = (t - beginTime - totalTime) / totalTime_2;
            if(state == 0) {
                state = 1;
                divList.forEach(element=>{
                    setDivNumber(element.endPoint, element.value);
                    parent.removeChild(element.div);
                });
                divList_2.forEach(element=>{
                    parent.appendChild(element.div);
                    setDivNumber(element.target, element.value);
                });
            }
            divList_2.forEach(element=>{
                element.div.style.transform = 'scale('+getScale(frac)+')';
            });
            requestAnimationFrame(draw);
        } else {
            divList_2.forEach(element=>{
                parent.removeChild(element.div);
            });
            if(callBack) {
                callBack();
            }
        }
    });
}

function drawAnimationByCSS(callBack=null) {

    let totalTime = 150, totalTime_2 = 150;
    let parent = divArray[0][0].offsetParent;
    let divList = new Array();

    let count = 0, _count = 0;
    let scale = 1.2;

    let keyFrames = '';

    for(let element of actionList) {
        let from = element[0], to = element[1];
        let start = divArray[from[0]][from[1]];
        let end = divArray[to[0]][to[1]];
        let mem = document.createElement('div');
        mem.classList.add('cell');
        mem.style = start.style;
        mem.style.height = start.offsetHeight + 'px';
        mem.style.width = start.offsetWidth + 'px';
        mem.style.position = 'absolute';

        mem.style.animationName = 'move'+count;
        mem.style.animationDuration = totalTime + 'ms';//TODO: 看看能不能改成ms单位
        mem.onanimationend = moveCallBackFunc;
        
        let value = parseInt(start.innerHTML);
        setDivNumber(mem, value);
        setDivNumber(start, 0);
        parent.appendChild(mem);
        keyFrames += 
        `@keyframes move${count} {
            from {
                top: ${start.offsetTop}px;
                left: ${start.offsetLeft}px;
            }
            to {
                top: ${end.offsetTop}px;
                left: ${end.offsetLeft}px;
            }
        }\n`;
        count++;
        divList.push(
            {
                endPoint: end,
                div: mem,
                value: value,
            }
        );
    }
    document.getElementById('animation').innerHTML = keyFrames;
    
    function moveCallBackFunc(){
        // 移动动画结束之后的回调函数，收回动画中的元素，并准备下一个动画
        _count++;
        if(_count == count) {
            count = 0;
            _count = 0;
            divList.forEach(element=>{
                setDivNumber(element.endPoint, element.value);
                parent.removeChild(element.div);
            });
            if(createList.length == 0) {
                if(callBack) {
                    callBack();
                }
                return;
            }
            for(let element of createList) {
                start = divArray[element[0]][element[1]];
                start.style.animationName = 'create';
                start.style.animationDuration = totalTime_2 + 'ms';
                start.onanimationend = scaleCallBackFunc;
                let value = map.content[element[0]][element[1]];
                setDivNumber(start, value);
                // let mem = document.createElement('div');
                // mem.classList.add('cell');
                // mem.style = start.style;
                // mem.style.height = start.offsetHeight + 'px';
                // mem.style.width = start.offsetWidth + 'px';
                // mem.style.top = start.offsetTop + 'px';
                // mem.style.left = start.offsetLeft + 'px';
                // mem.style.position = 'absolute';

                // mem.style.animationName = 'create';
                // mem.style.animationDuration = totalTime_2 + 'ms';
                // mem.onanimationend = scaleCallBackFunc;
                
                // setDivNumber(start, value);
                // setDivNumber(mem, value);
                // parent.appendChild(mem);
                // divList_2.push(mem);
                count++;
            }
            document.getElementById('animation').innerHTML = 
            `@keyframes create {
                from {
                    transform: none;
                }
                50% {
                    transform: scale(${scale});
                }
                to {
                    transform: none;
                }
            }`;
        }
    }
    
    function scaleCallBackFunc() {
        // 缩放动画之后的回调函数，销毁动画元素
        _count++;
        if(_count == count) {
            createList.forEach(
                ele=>{
                    divArray[ele[0]][ele[1]].style.animationName = '';
                }
            )
            // divList_2.forEach(element=>{
            //     parent.removeChild(element);
            // });
            if(callBack) {
                callBack();
            }
        }
    }
}

window.onload = init;

/*
    匀速版本:
    
    1.requestAnimationFrame兼容写法
    2.运动函数
        参数:obj对象,attr属性,target目标值,time时间
        1)获取初始属性值
        2)获取初始时间,属性变化值
        3)变化函数(匀速直线)
            知道起始属性值,知道目标值,知道起始时间,知道终点时间
            s = vt
            获取变化值的差值,获取时间差值
*/
(function(){
    //requestAnimationFrame兼容写法
    var requestAnimationFrame = window.requestAnimationFrame || function(unSpeed){return setTimeout(unSpeed,1000/60);}
    function Move(obj,json,time,callback){//json包括了属性名,和值
        //获取初始值
        var objCss = obj.currentStyle || getComputedStyle(obj);//获取属性
        var startAttr = {};//存储各个属性值
        var S = {}; //各个变化值parseFloat能获取小数,去除单位值
        for(var key in json){
            startAttr[key] = parseFloat(objCss[key]) || 0;//存储对应属性的初始值
            S[key] = json[key] - startAttr[key];//计算各个属性需要的变化量
            if(!S[key]){//S[key]为0的时候,是假,取反为真
                delete S[key];
                delete json[key];
            }
        }
        //获取初始时间
        var startTime = new Date();
        //动画函数
        function unSpeed(){
            //var nowTime = new Date();//获取每时每刻的时间
            //var diifTime = nowTime - startTime;//时间差
            //比例值
            var proTime =  (new Date() - startTime) / time;
            //每时每刻运动的位置
            // if(proTime>=1){
            //     proTime = 1;//比例值为1
            // } else {
            //     requestAnimationFrame(unSpeed);
            // }
            proTime >= 1 ? proTime = 1 :  requestAnimationFrame(unSpeed);
            for(var key in json){
                if(key.toLowerCase()==="opacity"){//判断有没有opacity属性
                    var val = S[key]*proTime + startAttr[key];
                    obj.style[key] = val;
                    obj.style.filter = "alpha(opacity="+val*100+")";//IE兼容opacity的写法
                } else {
                    obj.style[key] = S[key]*proTime + startAttr[key] + 'px';
                }
            }
            if(proTime===1){
                callback && callback.call(obj);
            }
        }
        requestAnimationFrame(unSpeed);
    }
    window.Move = Move;
})();
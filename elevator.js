//电梯也用三个map，一个商业、一个办公、一个酒店，酒店电梯闲置的时候进入办公map队列工作
//刚刚电梯载客量好像超了，
"use strict";
//----------------------//乘客随机生成器----------
var maxPaersonId = 0;
class passengerCreateMachine{//乘客随机生成器
    constructor(){
        this.tag = 0;
        this.commerceAim = 0;
        this.officeAim = 0;
        this.hotelAim = 0;
        this.minCommerce = 1;
        this.maxCommerce = 0;
        this.minOffice = 0;
        this.macOffice = 0;
        this.minHotel = 0;
        this.maxHotel = 0;
    }
    mass(a,b,c){
        if(this.tag == 0){
            let massGapTime = Math.floor(Math.random()*(4000-500+1))+500;//生成500-4000随机数，作为间隔时间
            setTimeout(function(){
                    let rNum = Math.floor(Math.random()*(100-1+1))+1;//生成1-100随机数
                    if(rNum <= (a*10) ){//商业层比例
                        PCM.commerceAim++;
                        let temptAimfloor = Math.floor(Math.random()*(PCM.maxCommerce-1))+1;//生成（1-商业区顶层）随机数
                        var p1 = createPerson();
                        building.floor.get(1).stayList.set(p1.id,0);
                        $('#infoWindow tr[data-uid = '+ 1 +'] td:nth-child(3)').text(building.floor.get(1).stayList.size);
                        maxPaersonId = p1.id;
                        personMap.set(p1.id,p1);
                        p1.callElevator(temptAimfloor);
                    }else if(rNum > ((a+b)*10)){//酒店层比例
                        PCM.hotelAim++;
                        let temptAimfloor = Math.floor(Math.random()*(PCM.maxHotel-PCM.minHotel+1))+PCM.minHotel;
                        var p1 = createPerson();
                        building.floor.get(1).stayList.set(p1.id,0);
                        $('#infoWindow tr[data-uid = '+ 1 +'] td:nth-child(3)').text(building.floor.get(1).stayList.size);
                        maxPaersonId = p1.id;
                        personMap.set(p1.id,p1);   
                        p1.callElevator(temptAimfloor);
                    }else if(rNum > (a*10) && rNum <= ((a+b)*10)){//办公层比例
                        PCM.officeAim++;
                        let temptAimfloor = Math.floor(Math.random()*(PCM.maxOffice-PCM.minOffice+1))+PCM.minOffice;
                        var p1 = createPerson();
                        building.floor.get(1).stayList.set(p1.id,0);
                        $('#infoWindow tr[data-uid = '+ 1 +'] td:nth-child(3)').text(building.floor.get(1).stayList.size);
                        maxPaersonId = p1.id;
                        personMap.set(p1.id,p1);  
                        p1.callElevator(temptAimfloor);
                    }
                    PCM.mass(a,b,c);
            },massGapTime);            
        }
    }
    startMass(a,b,c){//参数为各个楼层客流量比例
        this.tag = 0;
        this.mass(a,b,c);
        setTimeout(function(){PCM.massAlready(a,b,c)},10000);
    }
    stopMass(){
        this.tag = 1;
    }
    massAlready(a,b,c){//操作已经生成的person对象
        if(this.tag == 0){
                let massAlreadyGapTime = Math.floor(Math.random()*(5000-1500+1))+1500;//生成500-4000随机数，作为间隔时间
                let newMaxId = maxPaersonId;
                let selectId = Math.floor(Math.random()*(newMaxId-2021))+2021;//随机操作一个人（person的id在2020-当前最大id之间）
                setTimeout(function(){
                            let rNum = Math.floor(Math.random()*(100-1+1))+1;//生成1-100随机数
                            if(rNum <= (a*10) ){//商业层比例
                                let temptAimfloor = Math.floor(Math.random()*(PCM.maxCommerce-1))+1;//生成（1-商业区顶层）随机数
//                                //('我准备随机调用：'+selectId+'这个人');
                                personMap.get(selectId).callElevator(temptAimfloor);
                            }else if(rNum > ((a+b)*10)){//酒店层比例 
                                let temptAimfloor = Math.floor(Math.random()*(PCM.maxHotel-PCM.minHotel+1))+PCM.minHotel;
//                                //('我准备随机调用：'+selectId+'这个人');
                                personMap.get(selectId).callElevator(temptAimfloor);
                            }else if(rNum > (a*10) && rNum <= ((a+b)*10)){//办公层比例
                                let temptAimfloor = Math.floor(Math.random()*(PCM.maxOffice-PCM.minOffice+1))+PCM.minOffice;
//                                //('我准备随机调用：'+selectId+'这个人');
                                personMap.get(selectId).callElevator(temptAimfloor);
                            }
                    PCM.massAlready(a,b,c);
                },massAlreadyGapTime);
            }
    }
}
var PCM = new passengerCreateMachine();
//----------------------乘客随机生成器----------

//----------------------随机计时器----------
//var tag=0;
//var stopTag = 9999;
//var rnum=0;
//   function createRandom(){
//     rnum =  Math.floor((Math.random()*10000)+1);
//}
//function mass(){
//    createRandom();
//    if(tag<stopTag){
//        setTimeout(function(){ //('我的妈呀'+tag); tag++; mass();},rnum);
//    }   
//}
//function startMass(){
//    createRandom();
//    stopTag = 9999;
//    tag = 0;
//    mass();
//}
//function stopMass(){
//    stopTag = 0;
//    tag = -100;
//}
//----------------------随机计时器end----------

////-----运行数据时间--------------------------------------------------------------------------------

var meanWaitTime = 0;//平均等待时间=总等待时间/电梯调用次数
var grossWaitTime = 0;//总等待时间
var useEleTime = 0;//电梯调用次数
var longestWaitTime = 0//最长等候时间
function calMeanWaitTime(){
    let temptMeanWaitTime = (grossWaitTime/useEleTime).toFixed(2);
    let temptGrossWaitTime = grossWaitTime.toFixed(2);
    let temptLongestWaitTime = longestWaitTime.toFixed(2);
    $('#grossPassenger').text(useEleTime+'人次');
    $('#grossWaitTime').text(temptGrossWaitTime+'s');
    $('#aveWaitTime').text(temptMeanWaitTime+'s');
    $('#longestWaitTime').text(temptLongestWaitTime+'s');
}
////-----运行数据时间--------------------------------------------------------------------------------



////-----大厦--------------------------------------------------------------------------------
class mansion{
    constructor(){
        this.floor = new Map();
    }
}
function createMansion(){
    return new mansion();
}
var building = createMansion();
////-----标准层------------------------------------------------------------------------------
var commerceTurn = 0;//商业换乘层
var officeTurn = 0;//办公换乘层
var hotelTurn = 0;//酒店换乘层
var manisonHeight = 0;//总层数

class typicalFloor{
    constructor(floorNumber,floorType){
        this.floorType = floorType; //楼层类型（1：商业、2：办公、3：酒店）
        this.stayList = new Map();//当前楼层内人数
        this.floorNumber = floorNumber; //层数
        this.waitList = new Map();  //等待队列
    }  

   loadIn(value,id,aimFloor){//上客
            this.stayList.delete(id,0);
            $('#infoWindow tr[data-uid = '+ this.floorNumber +'] td:nth-child(3)').text(building.floor.get(this.floorNumber).stayList.size);
            //层内人数显示在html界面
            this.waitList.delete(id);//将乘客从等待队列中删除
            $('#infoWindow tr[data-uid = '+ this.floorNumber +'] td:nth-child(4)').text(building.floor.get(this.floorNumber).waitList.size);
            value.passenger.set(id,aimFloor);
            value.aimFloorList.set(aimFloor,0);
            value.aimFloorList.delete(this.floorNumber);
            value.load ++;
            value.planLoad--;
            personMap.get(id).status = 2;  //乘客状态改为2，乘坐电梯
            personMap.get(id).endTime();//结束等待计时        
        }
    
    startFirstScan(id,scanTag,direction,aimFloor){
        this.firstScan(id,scanTag,direction,aimFloor);
    }
    
    firstScan(id,scanTag,direction,aimFloor){ //(乘客id，扫描控制标签，方向，目标楼层) 
 
        let tempt =building.floor.get(aimFloor).floorType;//楼层类型（1：商业、2：办公、3：酒店）,==400时候需要换乘
        let floorNumber = this.floorNumber;    
        let finishCheck = 0;
        //请求状态（0：未完成任何请求1：乘客已经乘坐上电梯；2：乘客已经呼叫到电梯但还未乘坐；3：乘客需要计算离自己最近距离的电梯并呼叫;200:存在可以请求的电梯）
        let temptCheck = 0;//用来辨别方向1上2下
        let distance = new Map();//存入电梯与当前楼层的距离map(电梯id,距离)
        
        
//·····························如果乘客要去自己当前功能区以外的区域(换乘方法)································· 
            if(this.floorType != building.floor.get(aimFloor).floorType && direction == 1){//（上）目标楼层不在当前区域
                if(aimFloor==commerceTurn||aimFloor==commerceTurn||aimFloor==commerceTurn){//目标楼层也是换乘楼层
                    if(this.floorNumber==commerceTurn||this.floorNumber==officeTurn||this.floorNumber==hotelTurn){//乘客正好在换乘楼层
                        tempt = 400;//400换乘判断
                    }else{//先到当前区域换乘楼层换乘
                        if(this.floorType == 1){//乘客在商业区域
                            personMap.get(id).turnEleTag = aimFloor;//需要转电梯，实际目标楼层暂存如turnEleTag里
                            personMap.get(id).aimFloor = commerceTurn;//目标楼层暂时设置为商业换乘层
                            aimFloor = commerceTurn;//目标楼层暂时设置为商业换乘层
                            direction = 2;//转换层始终是当前区域最下面一层
                            tempt = 1;
                        }else if(this.floorType == 2){//乘客在办公区域
                            personMap.get(id).turnEleTag = aimFloor;//需要转电梯，实际目标楼层暂存如turnEleTag里
                            personMap.get(id).aimFloor = officeTurn;//目标楼层暂时设置为办公换乘层
                            aimFloor = officeTurn;//目标楼层暂时设置为办公换乘层
                            direction = 2;
                            tempt = 2;
                        }//酒店区域已经是最顶部的区域，不存在上楼时目标楼层为其他区域
                    }
                }else{//目标楼层不是换乘楼层
                    if(this.floorNumber==commerceTurn||this.floorNumber==officeTurn||this.floorNumber==hotelTurn){//乘客正好在换乘楼层
                           if(building.floor.get(aimFloor).floorType == 1){//目标楼层为商业层
                            personMap.get(id).turnEleTag = aimFloor;//需要转电梯，实际目标楼层暂存如turnEleTag里
                            personMap.get(id).aimFloor = commerceTurn;//目标楼层暂时设置为商业换乘层
                            aimFloor = commerceTurn;//目标楼层暂时设置为商业换乘层
                        }else if(building.floor.get(aimFloor).floorType == 2){//目标楼层为办公层
                            personMap.get(id).turnEleTag = aimFloor;//需要转电梯，实际目标楼层暂存如turnEleTag里
                            personMap.get(id).aimFloor = officeTurn;//目标楼层暂时设置为办公换乘层
                            aimFloor = officeTurn;//目标楼层暂时设置为办公换乘层
                        }else if(building.floor.get(aimFloor).floorType == 3){//目标楼层为酒店层
                            personMap.get(id).turnEleTag = aimFloor;//需要转电梯，实际目标楼层暂存如turnEleTag里
                            personMap.get(id).aimFloor = hotelTurn;//目标楼层暂时设置为酒店缓冲池层
                            aimFloor = hotelTurn;//目标楼层暂时设置为酒店缓冲池层
                        } 
                        tempt = 400;//400换乘判断
                    }else{//先到当前区域换乘楼层换乘
                         if(this.floorType == 1){//乘客在商业区域
                            personMap.get(id).turnEleTag = aimFloor;//需要转电梯，实际目标楼层暂存如turnEleTag里
                            personMap.get(id).aimFloor = commerceTurn;//目标楼层暂时设置为商业换乘层
                            aimFloor = commerceTurn;//目标楼层暂时设置为商业换乘层
                            direction = 2;
                            tempt = 1;
                        }else if(this.floorType == 2){//乘客在办公区域
                            personMap.get(id).turnEleTag = aimFloor;//需要转电梯，实际目标楼层暂存如turnEleTag里
                            personMap.get(id).aimFloor = officeTurn;//目标楼层暂时设置为办公换乘层
                            aimFloor = officeTurn;//目标楼层暂时设置为办公换乘层
                            direction = 2;
                            tempt = 2;
                        } 
                    }                     
                }
                
            }else if(this.floorType != building.floor.get(aimFloor).floorType && direction == 2){//（下）目标楼层不在当前区域
                if(aimFloor==commerceTurn||aimFloor==commerceTurn||aimFloor==commerceTurn){//目标楼层也是换乘楼层
                    if(this.floorNumber==commerceTurn||this.floorNumber==officeTurn||this.floorNumber==hotelTurn){//乘客正好在换乘楼层
                        tempt = 400;//400换乘判断
                    }else{//先到当前区域换乘楼层换乘，商业区域已经是最下面的一个分区，不存在下楼时目标还是其他区域
                        if(this.floorType == 2){//乘客在办公区域
                            personMap.get(id).turnEleTag = aimFloor;//需要转电梯，实际目标楼层暂存如turnEleTag里
                            personMap.get(id).aimFloor = officeTurn;//目标楼层暂时设置为办公换乘层
                            aimFloor = officeTurn;//目标楼层暂时设置为办公换乘层
                            tempt = 2;
                        }else if(this.floorType == 3){//乘客在酒店区域
                            personMap.get(id).turnEleTag = aimFloor;//需要转电梯，实际目标楼层暂存如turnEleTag里
                            personMap.get(id).aimFloor = hotelTurn;//目标楼层暂时设置为酒店缓冲池层
                            aimFloor = hotelTurn;//目标楼层暂时设置为酒店缓冲池层
                            tempt = 3;
                        }
                    }
                }else{//目标楼层不是换乘楼层
                    if(this.floorNumber==commerceTurn||this.floorNumber==officeTurn||this.floorNumber==hotelTurn){//乘客正好在换乘楼层
                           if(building.floor.get(aimFloor).floorType == 1){//目标楼层为商业层
                            personMap.get(id).turnEleTag = aimFloor;//需要转电梯，实际目标楼层暂存如turnEleTag里
                            personMap.get(id).aimFloor = commerceTurn;//目标楼层暂时设置为商业换乘层
                            aimFloor = commerceTurn;//目标楼层暂时设置为商业换乘层
                        }else if(building.floor.get(aimFloor).floorType == 2){//目标楼层为办公层
                            personMap.get(id).turnEleTag = aimFloor;//需要转电梯，实际目标楼层暂存如turnEleTag里
                            personMap.get(id).aimFloor = officeTurn;//目标楼层暂时设置为办公换乘层
                            aimFloor = officeTurn;//目标楼层暂时设置为办公换乘层
                        }
                        tempt = 400;//400换乘判断
                    }else{//先到当前区域换乘楼层换乘
                         if(this.floorType == 2){//乘客在办公区域
                            personMap.get(id).turnEleTag = aimFloor;//需要转电梯，实际目标楼层暂存如turnEleTag里
                            personMap.get(id).aimFloor = officeTurn;//目标楼层暂时设置为办公换乘层
                            aimFloor = officeTurn;//目标楼层暂时设置为办公换乘层
                            tempt = 2;
                        }else if(this.floorType == 3){//乘客在酒店区域
                            personMap.get(id).turnEleTag = aimFloor;//需要转电梯，实际目标楼层暂存如turnEleTag里
                            personMap.get(id).aimFloor = hotelTurn;//目标楼层暂时设置为酒店缓冲池层
                            aimFloor = hotelTurn;//目标楼层暂时设置为酒店缓冲池层 
                            tempt = 3;
                        }   
                    }                     
                }
            }
//·····························································································  
        function checkEle(value){//判断运行方向相同，且载客未满的电梯或者空闲电梯存在
            
            if(((value.direction == direction && direction == 1) && (value.floorNumber-floorNumber<=0)&&(value.planLoad + value.load < 10))||(value.direction == 0 && direction == 1)){//运行方向相同（向上）且载客没满、且在当前楼层下面的电梯或者空闲电梯存在 
                temptCheck = 1;
            }else if((((value.direction == direction && direction == 2) && (value.floorNumber-floorNumber>=0))&&(value.planLoad + value.load < 10))||(value.direction == 0 && direction == 2)){//运行方向相同（向下）且载客没满的电梯或者空闲电梯存在
                temptCheck = 2;
            }
        }
//·······························································································
        
        //乘坐高速直达电梯
        if(tempt == 400){//需要换乘
                 //direction运行方向：0没有任务、1上、2下
                 shaft.highSpeedEleShaft.forEach(function(value, key, map){
                     checkEle(value);//判断运行方向相同，且载客未满的电梯或者空闲电梯存在
                 });               
                
                 if(temptCheck==1){//运行方向相同（向上）且载客没满的电梯或者空闲电梯存在   
                     //···············1···············
                     try{
                        shaft.highSpeedEleShaft.forEach(function(value, key, map){//1、检测刚好在本楼层的向上电梯或空闲电梯
                            if(value.floorNumber == floorNumber){//把人塞进电梯，本次扫描结束，人的目标楼层存入电梯
                                if(value.direction == 0){
                                    value.direction = 1;
                                    value.startMove();
                                    }
                                building.floor.get(floorNumber).loadIn(value,id,aimFloor);
                                finishCheck = 1;//乘客已经坐上电梯
                                throw 'ooops-1';
                                }
                     });
                        }catch(e){
                     //(e);
                     }
                     //···············2···············
                     if(finishCheck == 0){
                     try{
                         shaft.highSpeedEleShaft.forEach(function(value, key, map){//2、检测不在本楼层的空闲电梯
                             if(value.direction == 0 ){//存在不在当前楼层的空闲电梯
                                 value.addRequest(floorNumber,temptCheck);//调度请求；参数：（乘客所在楼层,乘客目标运行方向）等电梯到达当前楼层上客人
                                 building.floor.get(floorNumber).statrContinueScan(id,scanTag,direction,aimFloor,value.id,tempt);
                                 //启动持续扫描器（这个时候需要绑定一台电梯，乘客只能乘坐这台电梯，即时其他电梯先到也不能坐）
                                 finishCheck = 2;//乘客以及呼叫了一台空闲电梯，不用再计算离自己最近电梯
                                 throw 'ooops-2';
                             }
                         })
                     }catch(e){
                         //(e);
                     }
                     }
                     //···············3···············
                     if(finishCheck == 0){//3、代表没有检测到不在本楼层空闲电梯，需要计算离自己最近的电梯
                         finishCheck = 3;
                         shaft.highSpeedEleShaft.forEach(function(value, key, map){//需要计算离自己最近的电梯
                             distance.set(value.id,floorNumber-value.floorNumber);
                         })
                     }
                 }else if(temptCheck==2){//运行方向相同（向下）且载客没满的电梯或者空闲电梯存在 
                     //···············1···············
                     try{
                        shaft.highSpeedEleShaft.forEach(function(value, key, map){//1、检测刚好在本楼层的向下电梯或空闲电梯
                            if(value.floorNumber == floorNumber){//把人塞进电梯，本次扫描结束，人的目标楼层存入电梯
                                if(value.direction == 0){
                                    value.direction = 2;
                                    value.startMove();
                                    }
                                building.floor.get(floorNumber).loadIn(value,id,aimFloor);
                                finishCheck = 1;//乘客已经坐上电梯
                                throw 'ooops-1';
                                }
                     });
                        }catch(e){
                     //(e);
                     }
                     //···············2···············
                     if(finishCheck == 0){
                     try{
                         shaft.highSpeedEleShaft.forEach(function(value, key, map){//2、检测不在本楼层的空闲电梯
                             if(value.direction == 0 ){//存在不在当前楼层的空闲电梯
                                 value.addRequest(floorNumber,temptCheck);//调度请求；参数：（乘客所在楼层,乘客目标运行方向）等电梯到达当前楼层上客人
                                  building.floor.get(floorNumber).statrContinueScan(id,scanTag,direction,aimFloor,value.id,tempt);
                                 //最后value.id相当于乘客和电梯绑定，只能坐请求了的这部电梯
                                 //启动持续扫描器（这个时候乘客与呼叫的电梯绑定，乘客只能乘坐这台电梯，即时其他电梯先到也不能坐）
                                 finishCheck = 2;//乘客以及呼叫了一台空闲电梯，不用再计算离自己最近电梯
                                 throw 'ooops-2';
                             }
                         })
                     }catch(e){
                         //(e);
                     }
                     }
                     //···············3···············
                     if(finishCheck == 0){//3、代表没有检测到不在本楼层空闲电梯，需要计算离自己最近的电梯
                         finishCheck = 3;
                         shaft.highSpeedEleShaft.forEach(function(value, key, map){//需要计算离自己最近的电梯
                             distance.set(value.id,value.floorNumber-floorNumber);
                         })
                     }
                     
                 }         
            
        }else if(tempt == 1){
            //('aim:'+aimFloor);
                 //direction运行方向：0没有任务、1上、2下
                 shaft.commerceShaft.forEach(function(value, key, map){
                     checkEle(value);//判断运行方向相同，且载客未满的电梯或者空闲电梯存在
                 });               
                 
                 if(temptCheck==1){//运行方向相同（向上）且载客没满的电梯或者空闲电梯存在   
                     //···············1···············
                     try{
                        shaft.commerceShaft.forEach(function(value, key, map){//1、检测刚好在本楼层的向上电梯或空闲电梯
                            if(value.floorNumber == floorNumber){//把人塞进电梯，本次扫描结束，人的目标楼层存入电梯
                                if(value.direction == 0){
                                    value.direction = 1;
                                    value.startMove();
                                    }
                                building.floor.get(floorNumber).loadIn(value,id,aimFloor);
                                finishCheck = 1;//乘客已经坐上电梯
                                throw 'ooops-1';
                                }
                     });
                        }catch(e){
                     //(e);
                     }
                     //···············2···············
                     if(finishCheck == 0){
                     try{
                         shaft.commerceShaft.forEach(function(value, key, map){//2、检测不在本楼层的空闲电梯
                             if(value.direction == 0 ){//存在不在当前楼层的空闲电梯
                                 value.addRequest(floorNumber,temptCheck);//调度请求；参数：（乘客所在楼层,乘客目标运行方向）等电梯到达当前楼层上客人
                                 building.floor.get(floorNumber).statrContinueScan(id,scanTag,direction,aimFloor,value.id,tempt);
                                 //启动持续扫描器（这个时候需要绑定一台电梯，乘客只能乘坐这台电梯，即时其他电梯先到也不能坐）
                                 finishCheck = 2;//乘客以及呼叫了一台空闲电梯，不用再计算离自己最近电梯
                                 throw 'ooops-2';
                             }
                         })
                     }catch(e){
                         //(e);
                     }
                     }
                     //···············3···············
                     if(finishCheck == 0){//3、代表没有检测到不在本楼层空闲电梯，需要计算离自己最近的电梯
                         finishCheck = 3;
                         shaft.commerceShaft.forEach(function(value, key, map){//需要计算离自己最近的电梯
                             distance.set(value.id,floorNumber-value.floorNumber);
                         })
                     }
                 }else if(temptCheck==2){//运行方向相同（向下）且载客没满的电梯或者空闲电梯存在 
                     //···············1···············
                     try{
                        shaft.commerceShaft.forEach(function(value, key, map){//1、检测刚好在本楼层的向下电梯或空闲电梯
                            if(value.floorNumber == floorNumber){//把人塞进电梯，本次扫描结束，人的目标楼层存入电梯
                                if(value.direction == 0){
                                    value.direction = 2;
                                    value.startMove();
                                    }
                                building.floor.get(floorNumber).loadIn(value,id,aimFloor);
                                finishCheck = 1;//乘客已经坐上电梯
                                throw 'ooops-1';
                                }
                     });
                        }catch(e){
                     //(e);
                     }
                     //···············2···············
                     if(finishCheck == 0){
                     try{
                         shaft.commerceShaft.forEach(function(value, key, map){//2、检测不在本楼层的空闲电梯
                             if(value.direction == 0 ){//存在不在当前楼层的空闲电梯
                                 value.addRequest(floorNumber,temptCheck);//调度请求；参数：（乘客所在楼层,乘客目标运行方向）等电梯到达当前楼层上客人
                                  building.floor.get(floorNumber).statrContinueScan(id,scanTag,direction,aimFloor,value.id,tempt);
                                 //最后value.id相当于乘客和电梯绑定，只能坐请求了的这部电梯
                                 //启动持续扫描器（这个时候乘客与呼叫的电梯绑定，乘客只能乘坐这台电梯，即时其他电梯先到也不能坐）
                                 finishCheck = 2;//乘客以及呼叫了一台空闲电梯，不用再计算离自己最近电梯
                                 throw 'ooops-2';
                             }
                         })
                     }catch(e){
                         //(e);
                     }
                     }
                     //···············3···············
                     if(finishCheck == 0){//3、代表没有检测到不在本楼层空闲电梯，需要计算离自己最近的电梯
                         finishCheck = 3;
                         shaft.commerceShaft.forEach(function(value, key, map){//需要计算离自己最近的电梯
                             distance.set(value.id,value.floorNumber-floorNumber);
                         })
                     }
                     
                 }  
        //目标楼层为办公层    
             }else if(tempt == 2){
                 //direction运行方向：0没有任务、1上、2下
                 shaft.officeShaft.forEach(function(value, key, map){
                     checkEle(value);//判断运行方向相同，且载客未满的电梯或者空闲电梯存在
                 });               
                 
                 if(temptCheck==1){//运行方向相同（向上）且载客没满的电梯或者空闲电梯存在   
                     //···············1···············
                     try{
                        shaft.officeShaft.forEach(function(value, key, map){//1、检测刚好在本楼层的向上电梯或空闲电梯
                            if(value.floorNumber == floorNumber){//把人塞进电梯，本次扫描结束，人的目标楼层存入电梯
                                if(value.direction == 0){
                                    value.direction = 1;
                                    value.startMove();
                                    }
                                building.floor.get(floorNumber).loadIn(value,id,aimFloor);
                                finishCheck = 1;//乘客已经坐上电梯
                                throw 'ooops-1';
                                }
                     });
                        }catch(e){
                     //(e);
                     }
                     //···············2···············
                     if(finishCheck == 0){
                     try{
                         shaft.officeShaft.forEach(function(value, key, map){//2、检测不在本楼层的空闲电梯
                             if(value.direction == 0 ){//存在不在当前楼层的空闲电梯
                                 value.addRequest(floorNumber,temptCheck);//调度请求；参数：（乘客所在楼层,乘客目标运行方向）等电梯到达当前楼层上客人
                                 building.floor.get(floorNumber).statrContinueScan(id,scanTag,direction,aimFloor,value.id,tempt);
                                 //启动持续扫描器（这个时候需要绑定一台电梯，乘客只能乘坐这台电梯，即时其他电梯先到也不能坐）
                                 finishCheck = 2;//乘客以及呼叫了一台空闲电梯，不用再计算离自己最近电梯
                                 throw 'ooops-2';
                             }
                         })
                     }catch(e){
                         //(e);
                     }
                     }
                     //···············3···············
                     if(finishCheck == 0){//3、代表没有检测到不在本楼层空闲电梯，需要计算离自己最近的电梯
                         finishCheck = 3;
                         shaft.officeShaft.forEach(function(value, key, map){//需要计算离自己最近的电梯
                             distance.set(value.id,floorNumber-value.floorNumber);
                         })
                     }
                 }else if(temptCheck==2){//运行方向相同（向下）且载客没满的电梯或者空闲电梯存在 
                     //···············1···············
                     try{
                        shaft.officeShaft.forEach(function(value, key, map){//1、检测刚好在本楼层的向下电梯或空闲电梯
                            if(value.floorNumber == floorNumber){//把人塞进电梯，本次扫描结束，人的目标楼层存入电梯
                                if(value.direction == 0){
                                    value.direction = 2;
                                    value.startMove();
                                    }
                                building.floor.get(floorNumber).loadIn(value,id,aimFloor);
                                finishCheck = 1;//乘客已经坐上电梯
                                throw 'ooops-1';
                                }
                     });
                        }catch(e){
                     //(e);
                     }
                     //···············2···············
                     if(finishCheck == 0){
                     try{
                         shaft.officeShaft.forEach(function(value, key, map){//2、检测不在本楼层的空闲电梯
                             if(value.direction == 0 ){//存在不在当前楼层的空闲电梯
                                 value.addRequest(floorNumber,temptCheck);//调度请求；参数：（乘客所在楼层,乘客目标运行方向）等电梯到达当前楼层上客人
                                  building.floor.get(floorNumber).statrContinueScan(id,scanTag,direction,aimFloor,value.id,tempt);
                                 //最后value.id相当于乘客和电梯绑定，只能坐请求了的这部电梯
                                 //启动持续扫描器（这个时候乘客与呼叫的电梯绑定，乘客只能乘坐这台电梯，即时其他电梯先到也不能坐）
                                 finishCheck = 2;//乘客以及呼叫了一台空闲电梯，不用再计算离自己最近电梯
                                 throw 'ooops-2';
                             }
                         })
                     }catch(e){
                         //(e);
                     }
                     }
                     //···············3···············
                     if(finishCheck == 0){//3、代表没有检测到不在本楼层空闲电梯，需要计算离自己最近的电梯
                         finishCheck = 3;
                         shaft.officeShaft.forEach(function(value, key, map){//需要计算离自己最近的电梯
                             distance.set(value.id,value.floorNumber-floorNumber);
                         })
                     }
                     
                 }
        //目标楼层为酒店层
             }else if(tempt == 3){
                 //direction运行方向：0没有任务、1上、2下
                 shaft.hotelShaft.forEach(function(value, key, map){
                     checkEle(value);//判断运行方向相同，且载客未满的电梯或者空闲电梯存在
                 });               
                 
                 if(temptCheck==1){//运行方向相同（向上）且载客没满的电梯或者空闲电梯存在   
                     //···············1···············
                     try{
                        shaft.hotelShaft.forEach(function(value, key, map){//1、检测刚好在本楼层的向上电梯或空闲电梯
                            if(value.floorNumber == floorNumber){//把人塞进电梯，本次扫描结束，人的目标楼层存入电梯
                                if(value.direction == 0){
                                    value.direction = 1;
                                    value.startMove();
                                    }
                                building.floor.get(floorNumber).loadIn(value,id,aimFloor);
                                finishCheck = 1;//乘客已经坐上电梯
                                throw 'ooops-1';
                                }
                     });
                        }catch(e){
                     //(e);
                     }
                     //···············2···············
                     if(finishCheck == 0){
                     try{
                         shaft.hotelShaft.forEach(function(value, key, map){//2、检测不在本楼层的空闲电梯
                             if(value.direction == 0 ){//存在不在当前楼层的空闲电梯
                                 value.addRequest(floorNumber,temptCheck);//调度请求；参数：（乘客所在楼层,乘客目标运行方向）等电梯到达当前楼层上客人
                                 building.floor.get(floorNumber).statrContinueScan(id,scanTag,direction,aimFloor,value.id,tempt);
                                 //启动持续扫描器（这个时候需要绑定一台电梯，乘客只能乘坐这台电梯，即时其他电梯先到也不能坐）
                                 finishCheck = 2;//乘客以及呼叫了一台空闲电梯，不用再计算离自己最近电梯
                                 throw 'ooops-2';
                             }
                         })
                     }catch(e){
                         //(e);
                     }
                     }
                     //···············3···············
                     if(finishCheck == 0){//3、代表没有检测到不在本楼层空闲电梯，需要计算离自己最近的电梯
                         finishCheck = 3;
                         shaft.hotelShaft.forEach(function(value, key, map){//需要计算离自己最近的电梯
                             distance.set(value.id,floorNumber-value.floorNumber);
                         })
                     }
                 }else if(temptCheck==2){//运行方向相同（向下）且载客没满的电梯或者空闲电梯存在 
                     //···············1···············
                     try{
                        shaft.hotelShaft.forEach(function(value, key, map){//1、检测刚好在本楼层的向下电梯或空闲电梯
                            if(value.floorNumber == floorNumber){//把人塞进电梯，本次扫描结束，人的目标楼层存入电梯
                                if(value.direction == 0){
                                    value.direction = 2;
                                    value.startMove();
                                    }
                                building.floor.get(floorNumber).loadIn(value,id,aimFloor);
                                finishCheck = 1;//乘客已经坐上电梯
                                throw 'ooops-1';
                                }
                     });
                        }catch(e){
                     //(e);
                     }
                     //···············2···············
                     if(finishCheck == 0){
                     try{
                         shaft.hotelShaft.forEach(function(value, key, map){//2、检测不在本楼层的空闲电梯
                             if(value.direction == 0 ){//存在不在当前楼层的空闲电梯
                                 value.addRequest(floorNumber,temptCheck);//调度请求；参数：（乘客所在楼层,乘客目标运行方向）等电梯到达当前楼层上客人
                                  building.floor.get(floorNumber).statrContinueScan(id,scanTag,direction,aimFloor,value.id,tempt);
                                 //最后value.id相当于乘客和电梯绑定，只能坐请求了的这部电梯
                                 //启动持续扫描器（这个时候乘客与呼叫的电梯绑定，乘客只能乘坐这台电梯，即时其他电梯先到也不能坐）
                                 finishCheck = 2;//乘客以及呼叫了一台空闲电梯，不用再计算离自己最近电梯
                                 throw 'ooops-2';
                             }
                         })
                     }catch(e){
                         //(e);
                     }
                     }
                     //···············3···············
                     if(finishCheck == 0){//3、代表没有检测到不在本楼层空闲电梯，需要计算离自己最近的电梯
                         finishCheck = 3;
                         shaft.hotelShaft.forEach(function(value, key, map){//需要计算离自己最近的电梯
                             distance.set(value.id,value.floorNumber-floorNumber);
                         })
                     }
                     
                 }
             }

                    
            if(finishCheck == 3){//乘客没有坐上电梯或者呼叫到空闲电梯，那就计算离自己最近的电梯
                //算出距离自己最近且运行方向一致的电梯
                let minDistance = 100;
                let temptID = 0;
                distance.forEach(function(value, key, map){//遍历离自己最近的电梯             
                    if(value < minDistance){
                        minDistance = value;
                        temptID = key;
                        }
                    //('算出距离自己最近且运行方向一致的电梯.离我最近的电梯距离是：'+minDistance+',这部电梯的id是：'+temptID);
                });
                
                //呼叫电梯
                if(tempt == 1){
                    shaft.commerceShaft.get(temptID).addRequest(floorNumber,temptCheck);//呼叫这部电梯
                     //添加调度请求；参数：（乘客所在楼层,乘客目标运行方向）目标楼层等电梯到了在放入
                    this.statrContinueScan(id,scanTag,direction,aimFloor,temptID,tempt);//开始扫描 
                }else if(tempt == 2){
                    shaft.officeShaft.get(temptID).addRequest(floorNumber,temptCheck);//呼叫这部电梯
                    this.statrContinueScan(id,scanTag,direction,aimFloor,temptID,tempt);//开始扫描
                }else if(tempt == 3){
                    shaft.hotelShaft.get(temptID).addRequest(floorNumber,temptCheck);//呼叫这部电梯
                    this.statrContinueScan(id,scanTag,direction,aimFloor,temptID,tempt);//开始扫描
                }else{
                    shaft.highSpeedEleShaft.get(temptID).addRequest(floorNumber,temptCheck);//呼叫这部电梯
                    this.statrContinueScan(id,scanTag,direction,aimFloor,temptID,tempt);//开始扫描    
                }
                personMap.get(id).status = 1; //乘客status改为1，等电梯
              
            }else if(finishCheck == 0 && temptCheck == 0){//暂时没有电梯能响应请求，过一秒后继续扫描
                if(tempt == 400){//没有换乘电梯响应
                    if(personMap.get(id).turnEleTag!=0){ 
                        personMap.get(id).aimFloor = personMap.get(id).turnEleTag;
                        personMap.get(id).turnEleTag = 0;
                    }
                }
                let newAim = personMap.get(id).aimFloor;
                //('我是：'+id+'电梯都在忙,一秒后继续呼叫,目标楼层：'+newAim);
                personMap.get(id).status = 1;//状态改为等电梯
                setTimeout(function(){building.floor.get(personMap.get(id).location).startFirstScan(id,scanTag,direction,newAim)},1000);//一秒后再次扫描
                     }               
    }
    

    
    statrContinueScan(id,scanTag,direction,aimFloor,eleID,tempt){
                    //方法绑定到对应person对象的scanTag上，这样就可以几个人同时调用电梯而不会冲突
        let temptFloorNumber=this.floorNumber;
        personMap.get(id).scanTag =setInterval(function(){building.floor.get(temptFloorNumber).continueScan(id,scanTag,direction,aimFloor,eleID,tempt)},500);
        //注意！！！！！！！！！！！
        //注意！！！！！！！！！！！
        //注意！！！！！！！！！！！
        //注意！！！！！！！！！！！
        //注意！！！！！！！！！！！
        //注意！！！continueScan的频率如果比电梯速度慢就有可能错过电梯导致无法上客人！！！

    }
    continueScan(id,scanTag,direction,aimFloor,eleID,tempt){//人id,人scanTag,人direction,人aimFloor,电梯value.id,tempt
        //('调用到continueScan');
        //('this.floorType：'+this.floorType);  
                if(tempt == 400){
                    if(shaft.highSpeedEleShaft.get(eleID).floorNumber == this.floorNumber){
                                 //把人塞进电梯，本次扫描结束，人的目标楼层存入电梯
                        this.loadIn(shaft.highSpeedEleShaft.get(eleID),id,aimFloor);
                        shaft.highSpeedEleShaft.get(eleID).direction = direction;//确定方向，防止（电梯空闲在乘客楼层上面，乘客实际上上楼，那么电梯到了这个楼层就要转向）电梯在接第一个乘客期间不接其他客人。
                        clearInterval(personMap.get(id).scanTag);//关闭持续扫描器
                        shaft.highSpeedEleShaft.get(eleID).stopMove();
                        shaft.highSpeedEleShaft.get(eleID).startMove();//这里需要先stopmove再打开，不然会出现电梯一秒上升两层的问题（速度翻倍）
                     }                    
                }else if(tempt == 1){
                    if(shaft.commerceShaft.get(eleID).floorNumber == this.floorNumber){
                                 //把人塞进电梯，本次扫描结束，人的目标楼层存入电梯
                        this.loadIn(shaft.commerceShaft.get(eleID),id,aimFloor);
                        shaft.commerceShaft.get(eleID).direction = direction;//确定方向，防止（电梯空闲在乘客楼层上面，乘客实际上上楼，那么电梯到了这个楼层就要转向）电梯在接第一个乘客期间不接其他客人。
                        clearInterval(personMap.get(id).scanTag);//关闭持续扫描器
                        shaft.commerceShaft.get(eleID).stopMove();
                        shaft.commerceShaft.get(eleID).startMove();//这里需要先stopmove再打开，不然会出现电梯一秒上升两层的问题（速度翻倍）
                     }
                 }else if(tempt == 2){
                    if(shaft.officeShaft.get(eleID).floorNumber == this.floorNumber){
                                 //把人塞进电梯，本次扫描结束，人的目标楼层存入电梯
                        this.loadIn(shaft.officeShaft.get(eleID),id,aimFloor);
                        shaft.officeShaft.get(eleID).direction = direction;//确定方向，防止（电梯空闲在乘客楼层上面，乘客实际上上楼，那么电梯到了这个楼层就要转向）电梯在接第一个乘客期间不接其他客人。
                        clearInterval(personMap.get(id).scanTag);//关闭持续扫描器
                        shaft.officeShaft.get(eleID).stopMove();
                        shaft.officeShaft.get(eleID).startMove();//这里需要先stopmove再打开，不然会出现电梯一秒上升两层的问题（速度翻倍）
                     }
                 }else if(tempt == 3){
                    if(shaft.hotelShaft.get(eleID).floorNumber==this.floorNumber){
                                 //把人塞进电梯，本次扫描结束，人的目标楼层存入电梯
                        this.loadIn(shaft.hotelShaft.get(eleID),id,aimFloor);
                        shaft.hotelShaft.get(eleID).direction = direction;//确定方向，防止（电梯空闲在乘客楼层上面，乘客实际上上楼，那么电梯到了这个楼层就要转向）电梯在接第一个乘客期间不接其他客人。
                        clearInterval(personMap.get(id).scanTag);//关闭持续扫描器
                        shaft.hotelShaft.get(eleID).stopMove();
                        shaft.hotelShaft.get(eleID).startMove();//这里需要先stopmove再打开，不然会出现电梯一秒上升两层的问题（速度翻倍）  
                     }
                 } 

            };
             
//    清除扫描
//    clearInterval(building.floor.get(i).scanTag);

//    Math.floor((Math.random()*10)+1);   //floor()向下取整

    callApply(id,scanTag,direction,aimFloor){
        this.startFirstScan(id,scanTag,direction,aimFloor);
    }
}

function createFloor(floorNumber,floorType) {
    return new typicalFloor(floorNumber,floorType)
}

//var m = new Map();
    //构建大厦方法（商业层数，办公层数，酒店层数）
function createBuilding(commerceNum,officeNum,hotelNum){
    PCM.maxCommerce = commerceNum;
    PCM.minOffice = commerceNum+1;
    PCM.maxOffice = commerceNum+officeNum;
    PCM.minHotel = commerceNum+officeNum+1;
    PCM.maxHotel = commerceNum+officeNum+hotelNum;
    for(let i =1;i<=commerceNum;i++){
        if(i == 1){//商业层第一层
            //记录为换乘楼层
            commerceTurn = i;
            $('#infoWindow').prepend(   '<tr data-uid= '+i+'> ' +
            '<td>' + i + '</td>' + 
            '<td>' + '商业（换乘）' + '</td>' +
            '<td>' +'0'+ '</td>' +
            '<td>' +'0'+ '</td>' +
            '<td>' +'0'+ '</td>' +
            '</tr>');
        }else{
            $('#infoWindow').prepend(   '<tr data-uid= '+i+'> ' +
            '<td>' + i + '</td>' + 
            '<td>' + '商业' + '</td>' +
            '<td>' +'0'+ '</td>' +
            '<td>' +'0'+ '</td>' +
            '<td>' +'0'+ '</td>' +
            '</tr>');
        }
        var floors = createFloor(i,1);
        building.floor.set(i,floors);
    }
    for(let i =commerceNum+1;i<=commerceNum+officeNum;i++){
        if(i ==commerceNum+1){//办公层第一层
            //记录为换乘楼层
            officeTurn = i;
            $('#infoWindow').prepend(   '<tr data-uid= '+i+'> ' +
            '<td>' + i + '</td>' + 
            '<td>' + '办公（换乘）' + '</td>' +
            '<td>' +'0'+ '</td>' +
            '<td>' +'0'+ '</td>' +
            '<td>' +'0'+ '</td>' +
            '</tr>');
        }else{
            $('#infoWindow').prepend(   '<tr data-uid= '+i+'> ' +
            '<td>' + i + '</td>' + 
            '<td>' + '办公' + '</td>' +
            '<td>' +'0'+ '</td>' +
            '<td>' +'0'+ '</td>' +
            '<td>' +'0'+ '</td>' +
            '</tr>');
        }
        var floors = createFloor(i,2);
        building.floor.set(i,floors);
    }
    for(let i =commerceNum+officeNum+1;i<=commerceNum+officeNum+hotelNum;i++){
        if(i ==commerceNum+officeNum+1){//酒店层第一层
            //记录为换乘楼层
            hotelTurn = i;
            $('#infoWindow').prepend(   '<tr data-uid= '+i+'> ' +
            '<td>' + i + '</td>' + 
            '<td>' + '酒店（换乘）' + '</td>' +
            '<td>' +'0'+ '</td>' +
            '<td>' +'0'+ '</td>' +
            '<td>' +'0'+ '</td>' +
            '</tr>');
        }else{
            $('#infoWindow').prepend(   '<tr data-uid= '+i+'> ' +
            '<td>' + i + '</td>' + 
            '<td>' + '酒店' + '</td>' +
            '<td>' +'0'+ '</td>' +
            '<td>' +'0'+ '</td>' +
            '<td>' +'0'+ '</td>' +
            '</tr>');
        }
        var floors = createFloor(i,3);
        building.floor.set(i,floors);
    }
}
$('#createBuilding').click(function(){
    let a = Number($('#cb-input-commerce').val());
    let b = Number($('#cb-input-office').val());
    let c = Number($('#cb-input-hotel').val());
    if(a>=100||b>=100||c>=100||a<=0||b<=0||c<=0){
        alert('请输入正确的层数！');
    }else{
        createBuilding(a,b,c);  
        manisonHeight = a+b+c;
        $(this).attr({"disabled":"disabled"});
        $(this).addClass("btn_disable");
        $('#cb-input-heading').text('Create Building  (创建成功)');
    }

});


//$('#infoWindow tr:nth-child(2) td:nth-child(2)').text()

//$("#id").removeAttr("disabled");
//使按钮可用，然后使用代码
//
//$("#id").removeClass("btn_disable");


//-----电梯井--------------------------------------------------------------------------------

class elevatorShaft{
    constructor(){
        this.commerceShaft = new Map();     //商业电梯井
        this.officeShaft = new Map();       //办公电梯井
        this.hotelShaft = new Map();        //酒店电梯井
        this.highSpeedEleShaft = new Map(); //高速电梯井
    }
}

function createShaft(){
    return new elevatorShaft()
}
//var shaft = createShaft();

//-----电梯--------------------------------------------------------------------------------
var elevatorOnlyId = 2020;
class elevator{
    constructor(floorNumber){
        this.id = elevatorOnlyId;
        this.type = 0;//1:商业、2:办公、3:酒店、4:换乘
        this.maxLoad = 10;  //最大载客量
        this.load = 0;  //当前载客量
        this.speed = 1000; //速度(【普速电梯】1000：代表1秒一层，实际约为3米/秒，【高速电梯】500：代表0.5秒一层，实际约为6米/秒)
        this.floorNumber = 1;//当前楼层q
        this.direction = 0 //运行方向：0没有任务、1上、2下
        this.passenger = new Map();
        this.planLoad = 0;      //收到调用请求就加相应人数，防止比如下楼时候，3楼先请求后四楼才请求，但最多值装得下一个人的时候，拒绝四楼的请求，先请求先服务原则。或者不考虑人数满的情况，只是人数满就不接受请求
        this.moveTag = 0;
        this.aimFloorList = new Map();//(目标楼层列表)
        
    }
    
    addRequest(passengerLocation,direction){//怎么把这个乘客绑定到这个电梯上？continuescan传入这个电梯id？那谁来调用continuescan？
//        (id,scanTag,direction,aimFloor){//(乘客id，扫描控制标签，方向，目标楼层)
        //由楼层扫描方法调用
        this.planLoad++;
        this.aimFloorList.set(passengerLocation,0);//放入目标楼层
        if(this.direction == 0){
             if(passengerLocation>this.floorNumber){//请求楼层在电梯当前楼层上面
                 this.direction = 1
             }else{
                 this.direction = 2
             }
            this.startMove();
        }else if(this.direction != 0){
        }
       
    }
    
    
    move(){
        if(this.type==1){
            if(this.floorNumber>=officeTurn){this.stopMove();this.direction = 2;this.startMove();
            }else if(this.floorNumber<1){this.stopMove();this.direction = 1;this.startMove()}
        }else if(this.type==2){
            if(this.floorNumber>=hotelTurn){this.stopMove();this.direction = 2;this.startMove();
            }else if(this.floorNumber<officeTurn){this.stopMove();this.direction = 1;this.startMove()}            
        }else if(this.type==3){
            if(this.floorNumber>manisonHeight){this.stopMove();this.direction = 2;this.startMove();
            }else if(this.floorNumber<hotelTurn){this.stopMove();this.direction = 1;this.startMove()}            
        }else if(this.type==4){
            if(this.floorNumber>manisonHeight){this.stopMove();this.direction = 2;this.startMove();
            }else if(this.floorNumber<1){this.stopMove();this.direction = 1;this.startMove()}            
        }
        let temptNumber = this.floorNumber;
        let temptPassenger = this.passenger;
        this.aimFloorList.delete(this.floorNumber);//测试行不行
        let temptAimFloorList = this.aimFloorList;
        let temptLoad = this.load;
     //·······························································
                function checkPassenger(floorNumber){
                    temptPassenger.forEach(function(value, key, map){
                        if(value == temptNumber){//乘客到达了要来的楼层
                            xiake(value, key, map);
                        }
                    })
                }
                function xiake(value, key, map){//下客方法
                        //('下客');
                        personMap.get(key).location = temptNumber;
                        personMap.get(key).status = 0;
                        temptPassenger.delete(key);
                        building.floor.get(temptNumber).stayList.set(key,0);
                        $('#infoWindow tr[data-uid = '+ temptNumber +'] td:nth-child(3)').text(building.floor.get(temptNumber).stayList.size);
                        temptLoad--;
                        temptAimFloorList.delete(temptNumber);//这个楼层的下课任务完成，从aimflooelist里面删除
                        if(personMap.get(key).turnEleTag != 0){//这个乘客需要转成电梯
                            let newAim = personMap.get(key).turnEleTag;
                            personMap.get(key).turnEleTag = 0;
                            //('我呼叫了换乘电梯，我的目标楼层是：'+newAim);
                            personMap.get(key).callElevator(newAim);//继续呼叫转乘的电梯      
                    }  
                }
        //······························································· 
        
        //('start开始了，现在的运行方向是'+this.direction);
        if(this.aimFloorList.size == 0 && this.passenger.size == 0 ){//代表没有请求和需要执行的任务了
            this.direction = 0;//运行方向：0没有任务、1上、2下
            this.stopMove();//电梯停止移动
        }else{         
            if(this.direction == 1){//上楼
                //('我在上楼');
                checkPassenger(temptNumber);//检车是否有乘客在这一层下
             
                this.passenger = temptPassenger;//临时乘客表还原
                this.load = temptLoad;//临时载客量还原
                 this.aimFloorList = temptAimFloorList;//目标楼层还原
                
                //还要判断电梯当前有没有请求
                if(this.aimFloorList.size == 0 && this.passenger.size == 0 ){//再次判断，避免多上一层楼
                    this.direction = 0;//运行方向：0没有任务、1上、2下
                    this.stopMove();//电梯停止移动
                }else{
                    let tempt = Number($('#infoWindow tr[data-uid = '+ this.floorNumber +'] td:nth-child(5)').text())-1;
                    $('#infoWindow tr[data-uid = '+ this.floorNumber +'] td:nth-child(5)').text(tempt);
                    ++this.floorNumber;
                    tempt = Number($('#infoWindow tr[data-uid = '+ this.floorNumber +'] td:nth-child(5)').text())+1;
                    $('#infoWindow tr[data-uid = '+ this.floorNumber +'] td:nth-child(5)').text(tempt);
                    //('我是'+this.id+'现在在'+this.floorNumber+'楼'+'passenger.size='+this.passenger.size+'  aimFloorList='+this.aimFloorList.size);                     
                }

            }else if(this.direction == 2){//下楼
                
                //('我在下楼');
                checkPassenger(temptNumber);//检车是否有乘客在这一层下
                
                this.passenger = temptPassenger;//临时乘客表还原
                this.load = temptLoad;//临时载客量还原
                this.aimFloorList = temptAimFloorList;//目标楼层还原

                
                if(this.aimFloorList.size == 0 && this.passenger.size == 0 ){//再次判断，避免多上一层楼
                    this.direction = 0;//运行方向：0没有任务、1上、2下
                    this.stopMove();//电梯停止移动
                }else{
                    let tempt = Number($('#infoWindow tr[data-uid = '+ this.floorNumber +'] td:nth-child(5)').text())-1;
                    $('#infoWindow tr[data-uid = '+ this.floorNumber +'] td:nth-child(5)').text(tempt);
                    --this.floorNumber;
                    tempt = Number($('#infoWindow tr[data-uid = '+ this.floorNumber +'] td:nth-child(5)').text())+1;
                    $('#infoWindow tr[data-uid = '+ this.floorNumber +'] td:nth-child(5)').text(tempt);
                    //('我是'+this.id+'现在在'+this.floorNumber+'楼'+'passenger.size='+this.passenger.size+'  aimFloorList='+this.aimFloorList.size);                   
                }
            }
        }
    }
                
    startMove(){
            this.moveTag = setInterval(this.move.bind(this),this.speed)//每秒移动一层
    }
    stopMove(){
        clearInterval(this.moveTag);//关闭移动方法，以后如果收到request，右楼层调用move方法
    }

    
    
    }


function createElevator() {
    elevatorOnlyId++;
    return new elevator()
}

var shaft = createShaft();
function createElevatorSystem(commerceNum,officeNum,hotelNum,hingSpeedEleNum){
    for(let i = 1 ; i<= commerceNum ; i++){
        var ele = createElevator();
        ele.type = 1;
        ele.floorNumber = commerceTurn;
        let tempt =  Number($('#infoWindow tr[data-uid = '+ commerceTurn +'] td:nth-child(5)').text())+1;
        $('#infoWindow tr[data-uid = '+ commerceTurn +'] td:nth-child(5)').text(tempt);
        shaft.commerceShaft.set(ele.id,ele);
    }
    for(let i = 1 ; i<= officeNum ; i++){
        var ele = createElevator();
        ele.type = 2;
        ele.floorNumber = officeTurn;
        let tempt =  Number($('#infoWindow tr[data-uid = '+ officeTurn +'] td:nth-child(5)').text())+1;
        $('#infoWindow tr[data-uid = '+ officeTurn +'] td:nth-child(5)').text(tempt);
        shaft.officeShaft.set(ele.id,ele);
    }
    for(let i = 1 ; i<= hotelNum ; i++){
        var ele = createElevator();
        ele.type = 3;
        ele.floorNumber = hotelTurn;
        let tempt =  Number($('#infoWindow tr[data-uid = '+ hotelTurn +'] td:nth-child(5)').text())+1;
        $('#infoWindow tr[data-uid = '+ hotelTurn +'] td:nth-child(5)').text(tempt);
        shaft.hotelShaft.set(ele.id,ele);//(key,value)
    }
    for(let i = 1;i<=hingSpeedEleNum;i++){
        var ele = createElevator();
        ele.type = 4;
        ele.speed = 500;//[高速电梯]
        let tempt =  Number($('#infoWindow tr[data-uid = '+ 1 +'] td:nth-child(5)').text())+1;
        $('#infoWindow tr[data-uid = '+ 1 +'] td:nth-child(5)').text(tempt);
        shaft.highSpeedEleShaft.set(ele.id,ele);//(key,value)
    }
}
$('#createElevator').click(function(){
    let a = Number($('#ce-input-commerce').val());
    let b = Number($('#ce-input-office').val());
    let c = Number($('#ce-input-hotel').val());
    let d = Number($('#ce-input-highSpeedEle').val());//高速直达电梯
        if((a>=1)&&(b>=1)&&(c>=1)&&(d>=1)){
        createElevatorSystem(a,b,c,d);  
        $(this).attr({"disabled":"disabled"});
        $(this).addClass("btn_disable");
        $('#ce-input-heading').text('Create Elevator  (创建成功)');  
    }else{
        alert('请输入正确的电梯数量！')
    }

});



//-----人--------------------------------------------------------------------------------
var onlyId = 2020;
class person{
    constructor(){
        this.id = onlyId; //id不会重复
        this.location = 1;   //当前位置
        this.status = 0;    //当前状态（0：其他；1：等电梯；2：正在坐电梯）
        this.scanTag = 0;   //扫描标签，用于开关扫描器
        this.aimFloor = 0;
        this.turnEleTag = 0;    //是否需要转乘电梯；0：不需要，其他值：需要
        this.waitTime = 0;
}
    //呼叫电梯上楼
    callElevator(aimFloor){
        if(1<=aimFloor<=manisonHeight){
            this.aimFloor = aimFloor;
            if(this.status == 0 && aimFloor != this.location){
                building.floor.get(this.location).waitList.set(this.id,this.aimFloor);
                $('#infoWindow tr[data-uid = '+ this.location +'] td:nth-child(4)').text(building.floor.get(this.location).waitList.size);
                this.startTime();//开始计算等待时间
                this.status = 1;//避免同一个人同时调用两次叫电梯方法
                if(aimFloor>this.location){ 
                    building.floor.get(this.location).callApply(this.id,this.scanTag,1,aimFloor);  //调用后状态变为1：等电梯 
                }else{
                    building.floor.get(this.location).callApply(this.id,this.scanTag,2,aimFloor);  //调用后状态变为1：等电梯 
                } 
            }else{
                //('这个人正在坐电梯！');
            }
        }else{
            //('目标楼层超过总楼层！');
        }      
    }
    
    startTime(){//开始计时
        if(this.waitTime==0){
            this.waitTime = new Date().getTime();
        }
    }
    endTime(){//结束计时
        let temptTime = new Date().getTime();
        this.waitTime = (temptTime-this.waitTime)/1000;
        if(this.waitTime>1000){
            alert('我是'+this.id+',我的waitTime是：'+this.waitTime+'我的temptTime是：'+temptTime);
        }
        if(this.waitTime>longestWaitTime){
            longestWaitTime = this.waitTime;
        }
        grossWaitTime = grossWaitTime+this.waitTime;
        useEleTime++;
        this.waitTime = 0;
    }
}

var personMap = new Map();

function createPerson(){
    onlyId++;
    return new person();
}
function createManyPerson(num){
   for(let i =1;i<=num;i++){
        var p1 = createPerson();
        building.floor.get(1).stayList.set(p1.id,0);
        $('#infoWindow tr[data-uid = '+ 1 +'] td:nth-child(3)').text(building.floor.get(1).stayList.size);
        personMap.set(p1.id,p1);    //将人存入personMap
   } 
}

$('#createPerson').click(function(){
    
    let a = Number($('#cp-input-onceCreate').val());
    if(a<=0){
        //('请输入正确的人数！');
    }else{
        createManyPerson(a);
        $(this).attr({"disabled":"disabled"});
        $(this).addClass("btn_disable");
        $('#cp-input-heading').text('Create Person  (创建成功)');       
    }

});


//-----使用手册--------------------------------------------------------------------------------
$('#infoBoxButton').click(function(){
    $('#fatherBox').css("filter","blur(4px)");
    $('#infoBoxBg').fadeIn(150);
    $('#infoBox').fadeIn(180);
});
$('#infoBoxOutBtn').click(function(){
    $('#fatherBox').css("filter","blur(0px)");
    $('#infoBoxBg').fadeOut(190);
    $('#infoBox').fadeOut(170);
});
//-----自动乘客生成器--------------------------------------------------------------------------------
$('#pcm-start').click(function(){//开始
    let a = Number($('#pcm-input-commerce').val());
    let b = Number($('#pcm-input-office').val());
    let c = Number($('#pcm-input-hotel').val());
    if(((a+b+c)==10)&&((0<=a<=10)&&(0<=b<=10)&&(0<=c<=10))){
        PCM.startMass(a,b,c);
        $(this).attr({"disabled":true});
        $(this).addClass("btn_disable");
    }else{
        //('请输入正确的比例！');
    }
})
$('#pcm-stop').click(function(){//停止
    PCM.stopMass();
    $('#pcm-start').attr({"disabled":false});
    $('#pcm-start').removeClass("btn_disable");
})
//-----运行数据--------------------------------------------------------------------------------
$('#getEffect').click(function(){
//    .html()和.text()方法不能使用在表单元素上,而.val()只能使用在表单元素上；
    calMeanWaitTime();
});
// Learn cc.Class:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/class/index.html
// Learn Attribute:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/reference/attributes/index.html
// Learn life-cycle callbacks:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/life-cycle-callbacks/index.html

cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //     // ATTRIBUTES:
        //     default: null,        // The default value will be used only when the component attaching
        //                           // to a node for the first time
        //     type: cc.SpriteFrame, // optional, default is typeof default
        //     serializable: true,   // optional, default is true
        // },
        // bar: {
        //     get () {
        //         return this._bar;
        //     },
        //     set (value) {
        //         this._bar = value;
        //     }
        // },
        touchRigid: {
            type: cc.Node,
            default: null
        },
        progressMgr: {
            type: cc.Node,
            default: null
        },
        maxMoveSpeed: 5000
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        this.node.on("touchstart", function(event){
            var cpProgress = this.progressMgr.getComponent("updateProgress");
            if(cpProgress.isGaming == false){
                globalEvent.emit("gamerestart");
            }
        }, this);

        this.node.on("touchmove", function(event){
            var deltaTime = cc.director.getDeltaTime();
            var dtMove = event.getDelta();
            var dtDis = Math.sqrt(Math.pow(dtMove.x, 2) + Math.pow(dtMove.y, 2)) / deltaTime;
            if (dtDis < this.maxMoveSpeed){
                this.touchRigid.x = this.touchRigid.x + dtMove.x;
                this.touchRigid.y = this.touchRigid.y + dtMove.y;
            }else{
                this.touchRigid.x = this.touchRigid.x + (dtMove.x * this.maxMoveSpeed / dtDis);
                this.touchRigid.y = this.touchRigid.y + (dtMove.y * this.maxMoveSpeed / dtDis);
            }
        }, this);

    },

    // update (dt) {},
});

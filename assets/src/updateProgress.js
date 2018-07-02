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
        canvas: {
            type: cc.Node,
            default: null
        },

        dropNodePrefab:{
            type: cc.Prefab,
            default: null
        },

        firstChapter:{
            type: cc.Prefab,
            default: null
        },

        goalSpeed: 3
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.lbl_gameOver = this.canvas.getChildByName("lbl_gameOver");
        this.lbl_finalGoal = this.canvas.getChildByName("lbl_finalGoal");
        this.lbl_curGoal = this.canvas.getChildByName("lbl_curGoal");
        this.protectedBall = this.canvas.getChildByName("ProtectedBall");
        this.controlledBall = this.canvas.getChildByName("ControlledBall");
        this.controlledBallMotor = this.canvas.getChildByName("ControlledBallMotor");
        this.chaptersPnl = this.canvas.getChildByName("chaptersPnl");
    },

    start () {

        this.restart();

        globalEvent.on("gameover", this.gameOver, this);
        globalEvent.on("gamerestart", this.restart, this);
    },

    restart: function(){
        this.isGaming = true;
        this.curGoal = 0;
        this._curChapter = null;

        this.resetScene();
        //this.createNewChapter();
        this.createFirstChapter();
    },

    gameOver: function(){
        this.isGaming = false;
        this.clearScene();

        this.lbl_gameOver.active = true;
        this.lbl_finalGoal.active = true;
        this.lbl_finalGoal.getComponent(cc.Label).string = 
            "得分：" + Math.floor(this.curGoal);
    },

    clearScene: function(){
        this.chaptersPnl.removeAllChildren();
    },

    resetScene: function(){ 
        this.lbl_gameOver.active = false;
        this.lbl_finalGoal.active = false;
        this.lbl_curGoal.getComponent(cc.Label).string = this.curGoal;

        this.protectedBall.active = true;
        this.protectedBall.x = 0;
        this.protectedBall.y = -415;

        this.controlledBall.active = true;
        this.controlledBall.x = 0;
        this.controlledBall.y = -155;

        this.controlledBallMotor.active = true;
        this.controlledBallMotor.x = 0;
        this.controlledBallMotor.y = -155;
    },

    checkChapter: function(dt){
        //chapter层生成
        if (this._curChapter && this._curChapter._loaded == false && 
                this._curChapter.y < 1136 - this._curChapter.height){ //加载下个chapter
            this._curChapter._loaded = true;
            this.createNewChapter();
        }
    },

    updateGoal: function(dt){
        this.curGoal = this.curGoal + dt * this.goalSpeed;
        this.lbl_curGoal.getComponent(cc.Label).string = Math.floor(this.curGoal);
    },

    createFirstChapter: function(){
        this._curChapter = cc.instantiate(this.firstChapter);
        this._curChapter.x = 0;
        this._curChapter.y = 0;
        this._curChapter.parent = this.chaptersPnl;
        this._curChapter._loaded = false;
    },

    createNewChapter: function(){
    	var self = this;
        var randIndex = Math.floor((Math.random() * 3) % 3) + 1
    	cc.loader.loadRes('chapter_'+randIndex, function(err, chapterPrefab){
    		var newChapter = cc.instantiate(chapterPrefab);
	        newChapter.x = 0;
            if(self._curChapter){
	           newChapter.y = self._curChapter.y + self._curChapter.height;
            }else
            {
                newChapter.y = 0;
            }
	        newChapter.parent = self.chaptersPnl;
	        self._curChapter = newChapter;
	        self._curChapter._loaded = false;
    	});
    },

    update (dt) {
        if(this.isGaming){
            this.checkChapter(dt);
            this.updateGoal(dt);
        }
    },
});

var PlayLayer = cc.Layer.extend({
    bgSprite:null,
    SushiSprites:null,
    score: 0,
    timeout: 60,
    ctor:function () {
        this._super();

        var size = cc.winSize;
        this.SushiSprites = [];

        // add bg
        this.bgSprite = new cc.Sprite(res.BackGround_png);
        this.bgSprite.attr({
            x: size.width / 2,
            y: size.height / 2,
            //scale: 0.5,
            rotation: 180
        });
        this.addChild(this.bgSprite, 0);

        this.schedule(this.update,0.5,16*100,0);
        
        this.scoreLabel = new cc.LabelTTF("score:0", "Arial", 20);
        this.scoreLabel.attr({
            x:size.width / 2 + 100,
            y:size.height - 20
        });
        this.addChild(this.scoreLabel, 5);

        // timeout 60
        this.timeoutLabel = cc.LabelTTF.create("" + this.timeout, "Arial", 30);
        this.timeoutLabel.x = 20;
        this.timeoutLabel.y = size.height - 20;
        this.addChild(this.timeoutLabel, 5);

        //timer倒计时60
        this.schedule(this.timer,1,this.timeout,1);

        return true;
    },
    update : function() {
        this.addSushi();
        this.removeSushi();
    },
    addSushi : function() {
        var isBoom = cc.random0To1()>0.8;
        var img_sushi_png = isBoom ? res.Sushi2_png : res.Sushi_png;
        var sushi = new SushiSprite(img_sushi_png);
        sushi.isBoom = isBoom;
        var size = cc.winSize;

        var x = sushi.width/2+size.width/2*cc.random0To1();
        sushi.attr({
            x: x,
            y:size.height - 30
        });

        var dorpAction = cc.MoveTo.create(2, cc.p(sushi.x,-30));
        sushi.runAction(dorpAction);

        this.addChild(sushi,5);
        this.SushiSprites.push(sushi);
    },
	removeSushiByindex : function(dx) {

		if(isNaN(dx)||dx>this.SushiSprites.length){return false;}  
		for(var i=0,n=0;i<this.length;i++)  
		{  
			if(this.SushiSprites[i]!=this[dx])  
			{  
				this.SushiSprites[n++]=this.SushiSprites[i]  
			}  
		}  
		this.SushiSprites.length-=1 
	},
    removeSushi : function() {
        //移除到屏幕底部的sushi
        for (var i = 0; i < this.SushiSprites.length; i++) {
            if(0 >= this.SushiSprites[i].y) {
                this.SushiSprites[i].removeFromParent();
                this.SushiSprites[i] = undefined;
                this.SushiSprites.splice(i,1);
                i= i-1;
            }
        }
    },
    addScore:function(s){
        this.score +=s;
        this.scoreLabel.setString("score:" + this.score);
    },
    timer : function() {

        if (this.timeout == 0) {
            //cc.log('游戏结束');
            var gameOver = new cc.LayerColor(cc.color(225,225,225,100));
            var size = cc.winSize;
            var titleLabel = new cc.LabelTTF("Game Over", "Arial", 38);
            titleLabel.attr({
                x:size.width / 2 ,
                y:size.height / 2
            });
            gameOver.addChild(titleLabel, 5);
            var TryAgainItem = new cc.MenuItemFont(
                    "Try Again",
                    function () {
                        cc.log("Menu is clicked!");
                        // var transition= cc.TransitionFade(1, new PlayScene(),cc.color(255,255,255,255));
                        cc.director.runScene(new PlayScene());
                    }, this);
            TryAgainItem.attr({
                x: size.width/2,
                y: size.height / 2 - 60,
                anchorX: 0.5,
                anchorY: 0.5
            });

            var menu = new cc.Menu(TryAgainItem);
            menu.x = 0;
            menu.y = 0;
            gameOver.addChild(menu, 1);
            this.getParent().addChild(gameOver);

            this.unschedule(this.update);
            this.unschedule(this.timer);
            return;
        }

        this.timeout -=1;
        this.timeoutLabel.setString("" + this.timeout);

    }
});

var PlayScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new PlayLayer();
        this.addChild(layer);
    }
});
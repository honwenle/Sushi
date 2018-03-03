var SushiSprite = cc.Sprite.extend({
    isBoom: false,
    onEnter:function () {
        this._super();
        this.addTouchEventListenser();
    },

    onExit:function () {
    },
    addTouchEventListenser:function(){
        this.touchListener = cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            // When "swallow touches" is true, then returning 'true' from the onTouchBegan method will "swallow" the touch event, preventing other listeners from using it.
            swallowTouches: true,
            //onTouchBegan event callback function                      
            onTouchBegan: function (touch, event) {
                var pos = touch.getLocation();
                var target = event.getCurrentTarget();  
                if ( cc.rectContainsPoint(target.getBoundingBox(),pos)) {
                    cc.log("touched");
					target.removeTouchEventListenser();
					target.stopAllActions();
                    
                    var disPlayAction = cc.FadeOut.create(0.5);
					var seqAc = cc.Sequence.create( disPlayAction, cc.CallFunc.create(function () {
						target.getParent().addScore(this.isBoom?-5:1);
						target.getParent().removeSushiByindex(target.index - 1);
						target.removeFromParent();
					},target) );
					target.runAction(seqAc);
                    
                    return true;
                }
                return false;
            }
        });
        cc.eventManager.addListener(this.touchListener,this);
    },
	removeTouchEventListenser:function(){
		cc.eventManager.removeListener(this.touchListener);
	}

});
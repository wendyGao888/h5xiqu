$("body").css("height",document.body.clientHeight+"px");			
			var timer1=null,timer2=null,timer3=null,timer4 = null,play=false,
				Audio = document.getElementById('audio');
				init();
			    function init() {
			        document.addEventListener("WeixinJSBridgeReady", function () {
			            Audio.play();
			        }, false);
			    }
			$(function(){var mySwiper = new Swiper('.swiper-container', {
				direction: 'vertical',
				initialSlide :0,
				autoplay:false,
				allowTouchMove: false,
				watchSlidesProgress:true,
				watchSlidesVisibility:true,
				speed:1500,
				fadeEffect:{
					crossFade:true,
				},
				on: {
					init: function() {											
						var that=this;
						swiperAnimateCache(this);
						this.emit('slideChangeTransitionEnd'); 
						var name=$("#nickname").val();
						if(name){
							$(".vertical-text").text(name+"的戏装扮相");
						}
					},
					reachBeginning: function(){
		      			swiperAnimate(this);
						timer1=setTimeout(function(){
						mySwiper.slideNext();
						},3000);
			    	},
					slideChangeTransitionEnd: function() {
						clearTimeout(timer1);
						clearTimeout(timer2);
						var that=this;
						 //每个slide切换结束时运行当前slide动画
						if(this.activeIndex==0){
							$("#mosicBtn").click();	
							swiperAnimate(that);
							timer1=setTimeout(function(){
							mySwiper.slideNext();
							},3000);
						};
						if(this.activeIndex==1){
							guideText(".guide-text")
							timer2=setTimeout(function(){
							mySwiper.slideNext();
							},6500);
						}
					},
					//切换slide
					slideChange:function(){
						var  that = this;
						//性别选择
						if(this.activeIndex === 3){
							$(".sex > div").on("click",function(e){
								$('.sex-text').fadeOut();

								if($(this).hasClass("boy")){
									$("#perSex").val(1);
								}else{
									$("#perSex").val(0);
								}
								//加闪动效果
								$(this).addClass("on");
								$(this).addClass("ani");
								setTimeout(function(){
									swiperAnimate(that);
								},1000)
								timer4 = setTimeout(function(){
									mySwiper.slideNext();
								},3000);
							})

						}

						//diy
						if(this.activeIndex === 4){
							var perSex = +$("#perSex").val();
							//尝试手动改变slide切换方式
							//设置角色
							setRole(0,"clothe");
							setRole(0,"mouse");
							setRole(0,"eyes");		
							/*默认服饰*/
							$("#clothe").attr("src",'imgs/'+(perSex?'boy':'girl')+'/clothe-1.png');
							$("#eyes").attr("src",'imgs/'+(perSex?'boy':'girl')+'/eyes-1.png');
							$("#mouse").attr("src",'imgs/'+(perSex?'boy':'girl')+'/mouse-1.png');

							$('.btns a').on("click",function(e){
								var _this = $(this);
								var index = _this.index(),type = _this.parent().attr('type');
								if(type=="clothe"){$("#perClothe").val(index)};
								_this.addClass("check").siblings().removeClass("check");
								setRole(index,type);

							});

							$('.ensure-btn').on("click",Diy);							
						};

						if(this.activeIndex === 5){
							var perSex = +$("#perSex").val(),index=+$("#perClothe").val();
							
							//设置图片
							$("#figure").attr("src",'imgs/'+(perSex?'boy':'girl')+'/p' +(index+1) +'.jpg');
							$("#intro").attr("src",'imgs/'+(perSex?'boy':'girl')+'/intro' +(index+1) +'.png');

						}


					}

				}
			});});

			/*diy换装*/
			function  setRole(index,type){				
				var perSex=+$("#perSex").val();
				$("#" + type).attr("src",'imgs/'+(perSex?'boy':'girl')+'/'+ type +'-'+(index+1) +'.png');
			};
			/*diy确认转场*/
			function Diy(){
				$('.ensure-btn').unbind("click");				
				transform();
			}
			//点击start按钮
			$(".start-btn a").click(function(){
				mySwiper.slideNext();
			});

			//音乐淡入
			function playAudio(){
				play=true;
				$("#music").show();				
				var v = 0;
				Audio.volume = v;
				Audio.play();
				var t = setInterval(function(){
              	  v += 0.1;
                  if(v<=1){
                    Audio.volume = v;
                  }else{
                    clearInterval(t);
                  }
            },300);

			};
			
			/*切换音乐*/
			$("#music").click(function(){
				if(play==true){
					play=false;
					$(this).removeClass("music");
					Audio.pause();
				}else{
					play=true;
					$(this).addClass("music");
					Audio.play();
				}
					
			})

			//分享底部按钮
			$(".share_btns").on("click",".share_menu",function(e){
				var target = $(this).attr("target");
				if(target === "intro"){
					$(".pop").hide().siblings(".pop-intro").fadeIn();

				}else if(target === "more"){
					$(".pop").hide().siblings(".pop-more").fadeIn();
				}else if(target === "post"){
					$(".pop").hide();
					makePost();
				}

			});

				//关闭
				$("#share .close").on("click",function(e){
					$(".pop").hide()
				})

				$("#post .close").on("click",function(e){
					$("#post").hide();
				})
				$("#post-img").click(function(){
					$(this).parent().hide();
				})
			//end分享按钮


			//生成海报
			function makePost() {
				$(".share_btns").hide(0).siblings(".share_info").show(0);				
			  	var  scale = 2 ;
			   	var canvas = document.createElement("canvas"),
                            w=$(window).width(),
                            h=$(window).height();
                        canvas.width = w * 2;
                        canvas.height = h * 2;
                        canvas.style.width = w + "px";
                        canvas.style.height = h + "px";
                        var context = canvas.getContext("2d");
					//然后将画布缩放，将图像放大两倍画到画布上
                     context.scale(2,2);
			  
				html2canvas($("#share")[0],{
					  allowTaint: false,
                            taintTest: true,
					dpi:window.devicePixelRatio * 2,
					scale: scale,
					canvas:canvas,					
				}).then(canvas => {
					const context = canvas.getContext('2d');
				  context.mozImageSmoothingEnabled = false;
				  context.webkitImageSmoothingEnabled = false;
				  context.msImageSmoothingEnabled = false;
				  context.imageSmoothingEnabled = false;
					$("#post #post-img").attr("crossOrigin",'Anonymous').attr("src", canvas.toDataURL("img/png",2.0)).parent().show(0);
					
					$(".share_info").hide(0).siblings(".share_btns").show(0);
				});
			};



			//幕布
			function transform(){
				$(".screen").fadeIn().delay(2800).fadeOut();
				$(".screen .right").animate({right:'0'},1000).delay(1000).animate({right:'-100%'},1000);
				$(".screen .bg").delay(800).show(50).delay(1100).hide(50);
				$(".screen .left").animate({left:'0'},1000).delay(1000).animate({left:'-100%'},1000)
				setTimeout(function(){
					mySwiper.slideNext(0);
				},850);
			};



			//文字逐个出现
			function guideText(faName){
				var index=0,timers=null,
				str="2019年戏曲百戏︵昆山︶盛典隆重开幕。戏曲名角纷纷聚集于此，邀你共享戏曲盛典，客串体验你的戏曲扮相吧！";
				$(faName).find("p").text("");
				if(timer3){clearInterval(timer3);};
				function type(){
					if(index>str.length){return;}
				    $(faName).find("p").text(str.substring(0,index++));
				}
				timer3=setInterval(type, 100);
			}
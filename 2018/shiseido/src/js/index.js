require(["config"], function(){
	require(["jquery","template","fly", "header", "footer","carousel","cookie"], function($,template,fly){
		$.getJSON("http://rap2api.taobao.org/app/mock/26085/api/list",function(data){
			console.log(data);
			const html = template("present_temp", {present:data.res_body.data});
			$(".present").html(html);
			const html2 = template("list_temp", {list:data.res_body.data});
			$(".d_content").html(html2);
		}).then(function(){
			$.cookie.json = true;
			//加入购物车
			$(".d_content,.present").on("click", ".add_cart", function(e){
				//获取加购的商品的信息
				const dl = $(this).parents("dl");
				const currProd = {
					id:$(dl).data("id"),
					img:$(dl).find(".curr_img").attr("src"),
					title:$(dl).find(".curr_title").text(),
					price:$(dl).children(".curr_price").text().slice(1),
					amount:1
				};
				console.log(currProd);
				//将当前选购商品保存到cookie
				//判断当前选购商品是否已购买
				const products = $.cookie("products") || [];
				const has = products.some(function(curr){
					if(curr.id == currProd.id){
						curr.amount++;//已购买，数量+1
						return true;
					}
				});
				
				//没有买过
				if(!has){
					products.push(currProd);
				}
				
				//保存到cookie
				$.cookie("products",products,{expires:10,path:"/"});
				
				//添加购物车抛物线效果
				console.log($(".header_cart"));
				const end = $(".header_cart").offset();//抛物线终点
				const start = {left:e.pageX, top:e.pageY};//抛物线七点
				const flyer = $(`<img src="${currProd.img}" style="width:50px;z-index=999;">`);
				console.log(start)
				flyer.fly({
					start:{
						left:start.left-$(window).scrollLeft(),
						top:start.top-$(window).scrollTop()
					},
					end:{
						left:end.left-$(window).scrollLeft(),
						top:end.top-$(window).scrollTop()
					},
					onEnd:function(){
						this.destroy();
					}
				});
				//头部商品数量加载
				const totalAmount = products.reduce(function(sum,curr){
					return sum += curr.amount;
				},0);
				$(".header_cart span").text(totalAmount);
			});
		});	
		$(".banner").carousel({
			imgs:[
				{src: "/images/banner1.jpg", href:"/html/detail.html?id=0"},
				{src: "/images/banner2.jpg", href:"/html/detail.html?id=1"},
				{src: "/images/banner3.jpg", href:"/html/detail.html?id=2"},
				{src: "/images/banner4.jpg", href:"/html/detail.html?id=4"},
			],
			width:"100%",
			height: 480,
			isButton:true,
			isCircle:false,
		});
	});
});
function addTab(title, url){
	if(title == 'Todays Bookings')
		{
			var content = '<iframe  scrolling="auto" frameborder="0"  src="'+url+'" style="width:100%;height:3500px;"></iframe>';
		}
	else
		{
			var content = '<iframe  scrolling="auto" frameborder="0"  src="'+url+'" style="width:100%;height:1200px;"></iframe>';
		}
	$('#tt').tabs('add',{
		title: title,
		content: content,
		closable: true
	});
	
}
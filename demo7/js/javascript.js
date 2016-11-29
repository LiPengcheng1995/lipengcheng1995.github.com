$(document).ready(function() {
	var new_position = 0; //此变量用于记录
	var underContent = $('.underContent');
	$('#new_left').click(function() {
	
		if(new_position == 0) {
			//已经在最左侧，不作为		
		} else if(new_position == 1) {
			//在中间位置
			underContent.eq(0).animate({'left':'0','opacity':'1'});
			underContent.eq(1).animate({'left':'300px','opacity':'1'});
			underContent.eq(2).animate({'left':'600px','opacity':'1'});
			underContent.eq(3).animate({'left':'900px','opacity':'1'});
			underContent.eq(4).animate({'left':'1500px','opacity':'0'});
			underContent.eq(5).animate({'left':'1500px','opacity':'0'});
			underContent.eq(6).animate({'left':'1500px','opacity':'0'});
			underContent.eq(7).animate({'left':'1500px','opacity':'0'});
			new_position--;

		} else if(new_position == 2) {
			//在最右边
			underContent.eq(4).animate({'left':'0','opacity':'1'});
			underContent.eq(5).animate({'left':'300px','opacity':'1'});
			underContent.eq(6).animate({'left':'600px','opacity':'1'});
			underContent.eq(7).animate({'left':'900px','opacity':'1'});
			underContent.eq(8).animate({'left':'1500px','opacity':'0'});
			underContent.eq(9).animate({'left':'1500px','opacity':'0'});
			underContent.eq(10).animate({'left':'1500px','opacity':'0'});
			underContent.eq(11).animate({'left':'1500px','opacity':'0'});
			new_position--;
		}

	})
	$('#new_right').click(function() {
		if(new_position == 0) {
			//在最左侧		
			underContent.eq(0).animate({'left':'-600px','opacity':'0'});
			underContent.eq(1).animate({'left':'-600px','opacity':'0'});
			underContent.eq(2).animate({'left':'-600px','opacity':'0'});
			underContent.eq(3).animate({'left':'-600px','opacity':'0'});
			underContent.eq(4).animate({'left':'0','opacity':'1'});
			underContent.eq(5).animate({'left':'300px','opacity':'1'});
			underContent.eq(6).animate({'left':'600px','opacity':'1'});
			underContent.eq(7).animate({'left':'900px','opacity':'1'});
			new_position++;

		} else if(new_position == 1) {
			//在中间位置
			underContent.eq(4).animate({'left':'-600px','opacity':'0'});
			underContent.eq(5).animate({'left':'-600px','opacity':'0'});
			underContent.eq(6).animate({'left':'-600px','opacity':'0'});
			underContent.eq(7).animate({'left':'-600px','opacity':'0'});
			underContent.eq(8).animate({'left':'0','opacity':'1'});
			underContent.eq(9).animate({'left':'300px','opacity':'1'});
			underContent.eq(10).animate({'left':'600px','opacity':'1'});
			underContent.eq(11).animate({'left':'900px','opacity':'1'});
			new_position++;

		} else if(new_position == 2) {
			//在最右边，不作为

		}
	})
})
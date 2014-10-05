function changeLabel(label)
{
	var labelUrl = "https://api.github.com/repos/" + $("#owner").val() + "/"
			+ $("#repo").val() + "/issues/" + $("#issues_number").val()
			+ "/labels?access_token=" + $("#github_access_token").val();

	// 進捗に関係するすべてのラベルを外す
	var deleteLabels = [ 'doing', 'accepting', 'reopen', 'done' ];
	$.ajax({
		type : "delete",
		url : deleteLabels,
		data : JSON.stringify(labels),
		dataType : 'JSON',
		success : function(data) {
			console.log("delete is success");
		},
		error : function(data) {
			console.log("delete is not success");
		}
	});

	// ラベルを交換する ここから
	var labels = [ label ];
	$.ajax({
		type : "post",
		url : labelUrl,
		data : JSON.stringify(labels),
		dataType : 'JSON',
		success : function(data) {
			console.log("post is success");
		},
		error : function(data) {
			console.log("post is not success");
		}
	});

	if (isSuccess) {
		alert("success");
	} else {
		alert("error");
	}

}

$(document).ready(function() {
	$("input:radio").click(function() {
		changeLabel($("input:radio[name='radio_group']:checked").val());
	});
});